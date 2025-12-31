import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage paths - use absolute path for Docker compatibility
const STORAGE_PATH = process.env.STORAGE_PATH || path.join(__dirname, '../../../storage/app/public');

interface ImageProcessResult {
    path: string;
    thumbnail: string;
}

interface ProcessingOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'webp' | 'png';
}

export class ImageService {
    // Default settings optimized for web
    private defaultMaxWidth = 1920;
    private defaultMaxHeight = 1080;
    private defaultQuality = 85;
    private thumbnailWidth = 400;
    private thumbnailHeight = 300;

    // Size thresholds for adaptive compression
    private readonly LARGE_FILE_THRESHOLD = 5 * 1024 * 1024; // 5MB
    private readonly VERY_LARGE_FILE_THRESHOLD = 15 * 1024 * 1024; // 15MB

    constructor() {
        // Configure sharp for large images
        sharp.cache({ files: 0 }); // Disable file caching to reduce memory usage
        sharp.concurrency(1); // Process one image at a time to prevent memory issues
    }

    /**
     * Get adaptive compression settings based on file size.
     */
    private getAdaptiveSettings(fileSize: number): ProcessingOptions {
        if (fileSize > this.VERY_LARGE_FILE_THRESHOLD) {
            // Very large files (>15MB): aggressive compression
            return {
                maxWidth: 1600,
                maxHeight: 900,
                quality: 75,
                format: 'jpeg',
            };
        } else if (fileSize > this.LARGE_FILE_THRESHOLD) {
            // Large files (>5MB): moderate compression
            return {
                maxWidth: 1920,
                maxHeight: 1080,
                quality: 80,
                format: 'jpeg',
            };
        }
        // Normal files: standard settings
        return {
            maxWidth: this.defaultMaxWidth,
            maxHeight: this.defaultMaxHeight,
            quality: this.defaultQuality,
            format: 'jpeg',
        };
    }

    /**
     * Process and store an uploaded image with compression.
     * Supports large images with adaptive compression.
     */
    async processAndStore(
        file: Express.Multer.File,
        directory: string = 'events'
    ): Promise<ImageProcessResult> {
        const filename = `${uuidv4()}.jpg`;
        const relativePath = `${directory}/${filename}`;
        const thumbnailRelativePath = `${directory}/thumbnails/${filename}`;

        const fullPath = path.join(STORAGE_PATH, relativePath);
        const thumbnailPath = path.join(STORAGE_PATH, thumbnailRelativePath);

        try {
            // Ensure directories exist
            await fs.mkdir(path.dirname(fullPath), { recursive: true });
            await fs.mkdir(path.dirname(thumbnailPath), { recursive: true });

            // Get adaptive settings based on file size
            const settings = this.getAdaptiveSettings(file.size);

            console.log(`Processing image: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
            console.log(`Using settings: maxWidth=${settings.maxWidth}, quality=${settings.quality}`);

            // Process main image with pipeline for memory efficiency
            const mainImagePipeline = sharp(file.buffer, {
                failOnError: false, // Don't fail on slightly corrupted images
                limitInputPixels: 268402689, // Allow up to ~16000x16000 pixels
            })
                .rotate() // Auto-rotate based on EXIF orientation
                .resize(settings.maxWidth, settings.maxHeight, {
                    withoutEnlargement: true,
                    fit: 'inside',
                })
                .jpeg({
                    quality: settings.quality,
                    progressive: true, // Progressive loading for better UX
                    mozjpeg: true, // Use mozjpeg for better compression
                });

            await mainImagePipeline.toFile(fullPath);

            // Create thumbnail with separate pipeline
            const thumbnailPipeline = sharp(file.buffer, {
                failOnError: false,
            })
                .rotate()
                .resize(this.thumbnailWidth, this.thumbnailHeight, {
                    fit: 'cover',
                    position: 'center',
                })
                .jpeg({
                    quality: 80,
                    progressive: true,
                });

            await thumbnailPipeline.toFile(thumbnailPath);

            // Get final file size for logging
            const stats = await fs.stat(fullPath);
            console.log(`Compressed to: ${(stats.size / 1024).toFixed(2)}KB`);

            return {
                path: `/storage/${relativePath}`,
                thumbnail: `/storage/${thumbnailRelativePath}`,
            };
        } catch (error) {
            console.error(`Error processing image ${file.originalname}:`, error);

            // Clean up any partial files
            try {
                await fs.unlink(fullPath).catch(() => {});
                await fs.unlink(thumbnailPath).catch(() => {});
            } catch {
                // Ignore cleanup errors
            }

            throw new Error(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Process multiple images in sequence to avoid memory issues.
     */
    async processMultiple(
        files: Express.Multer.File[],
        directory: string = 'events'
    ): Promise<{ successful: ImageProcessResult[]; failed: { filename: string; error: string }[] }> {
        const successful: ImageProcessResult[] = [];
        const failed: { filename: string; error: string }[] = [];

        for (const file of files) {
            try {
                if (!this.isValidImage(file.mimetype)) {
                    failed.push({
                        filename: file.originalname,
                        error: `Invalid file type: ${file.mimetype}. Allowed types: JPEG, PNG, WebP, GIF`,
                    });
                    continue;
                }

                const result = await this.processAndStore(file, directory);
                successful.push(result);

                // Force garbage collection hint between large files
                if (file.size > this.LARGE_FILE_THRESHOLD && global.gc) {
                    global.gc();
                }
            } catch (error) {
                failed.push({
                    filename: file.originalname,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }

        return { successful, failed };
    }

    /**
     * Delete an image and its thumbnail from storage.
     */
    async delete(imagePath: string): Promise<boolean> {
        try {
            // Remove /storage/ prefix to get the relative path
            const relativePath = imagePath.replace('/storage/', '');
            const fullPath = path.join(STORAGE_PATH, relativePath);

            // Delete main image
            try {
                await fs.unlink(fullPath);
            } catch (error) {
                // File might not exist, that's okay
            }

            // Delete thumbnail
            const pathInfo = path.parse(relativePath);
            const thumbnailPath = path.join(
                STORAGE_PATH,
                pathInfo.dir,
                'thumbnails',
                pathInfo.base
            );
            try {
                await fs.unlink(thumbnailPath);
            } catch (error) {
                // Thumbnail might not exist, that's okay
            }

            return true;
        } catch (error) {
            console.error('Error deleting image:', error);
            return false;
        }
    }

    /**
     * Validate image file.
     */
    isValidImage(mimetype: string): boolean {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        return allowedMimes.includes(mimetype);
    }
}

export const imageService = new ImageService();
