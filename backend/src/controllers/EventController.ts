import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';
import { prisma } from '../services/prisma.js';
import { imageService } from '../services/ImageService.js';
import { inertia, inertiaRedirect, flash, flashErrors } from '../middleware/inertia.js';
import type { AgendaItem } from '../types/index.js';

export class EventController {
    /**
     * Display a listing of all events (admin).
     */
    async index(req: Request, res: Response) {
        const events = await prisma.event.findMany({
            orderBy: { eventDate: 'desc' },
        });

        const formattedEvents = events.map(event => ({
            ...event,
            event_date: event.eventDate,
            event_time: event.eventTime,
            is_active: event.isActive,
            is_todays_event: event.isTodaysEvent,
            has_agenda: event.hasAgenda,
            formatted_date: dayjs(event.eventDate).format('MMM DD, YYYY'),
            formatted_time: event.eventTime ? dayjs(`2000-01-01 ${event.eventTime}`).format('h:mm A') : null,
        }));

        return inertia(req, res, 'Events/Index', {
            events: formattedEvents,
        });
    }

    /**
     * Show the form for creating a new event.
     */
    async create(req: Request, res: Response) {
        return inertia(req, res, 'Events/Form');
    }

    /**
     * Store a newly created event.
     */
    async store(req: Request, res: Response) {
        const { title, description, event_date, event_time, venue, is_active, has_agenda, agenda } = req.body;
        const files = req.files as Express.Multer.File[] | undefined;

        // Validate
        const errors: Record<string, string[]> = {};

        if (!title?.trim()) errors.title = ['Title is required.'];
        if (!description?.trim()) errors.description = ['Description is required.'];
        if (!event_date) errors.event_date = ['Event date is required.'];

        // Validate agenda
        const isActiveFlag = String(is_active).toLowerCase() === 'true' || is_active === true || String(is_active).toLowerCase() === 'on' || is_active === '1' || is_active === 1;
        const hasAgendaFlag = String(has_agenda).toLowerCase() === 'true' || has_agenda === true || String(has_agenda).toLowerCase() === 'on' || has_agenda === '1' || has_agenda === 1;
        let parsedAgenda: AgendaItem[] = [];

        if (hasAgendaFlag) {
            try {
                parsedAgenda = typeof agenda === 'string' ? JSON.parse(agenda) : (agenda || []);
                if (!Array.isArray(parsedAgenda) || parsedAgenda.length === 0) {
                    errors.agenda = ['At least one agenda item is required when agenda is enabled.'];
                }
            } catch {
                errors.agenda = ['Invalid agenda format.'];
            }
        }

        if (Object.keys(errors).length > 0) {
            flashErrors(req, errors);
            return inertiaRedirect(req, res, '/admin/events/create');
        }

        // Process images
        const imagePaths: string[] = [];
        if (files && files.length > 0) {
            if (files.length > 20) {
                flashErrors(req, { images: ['Maximum 20 images allowed per event.'] });
                return inertiaRedirect(req, res, '/admin/events/create');
            }

            try {
                console.log(`Processing ${files.length} images for new event...`);
                const result = await imageService.processMultiple(files, 'events');

                // Add successful images
                for (const img of result.successful) {
                    imagePaths.push(img.path);
                }

                // Report any failed images
                if (result.failed.length > 0) {
                    const failedNames = result.failed.map(f => f.filename).join(', ');
                    console.warn(`Failed to process images: ${failedNames}`);
                    // Still continue with successful images, but warn the user
                    if (result.successful.length === 0) {
                        flashErrors(req, {
                            images: [`Failed to process all images. Please try again with smaller or different images. Error: ${result.failed[0].error}`]
                        });
                        return inertiaRedirect(req, res, '/admin/events/create');
                    }
                }

                console.log(`Successfully processed ${result.successful.length} images`);
            } catch (error) {
                console.error('Image processing error:', error);
                flashErrors(req, {
                    images: [`Failed to process images: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`]
                });
                return inertiaRedirect(req, res, '/admin/events/create');
            }
        }

        // Create event
        await prisma.event.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                eventDate: new Date(event_date),
                eventTime: event_time || null,
                venue: venue?.trim() || null,
                images: imagePaths,
                isActive: isActiveFlag,
                hasAgenda: hasAgendaFlag,
                agenda: hasAgendaFlag ? (parsedAgenda as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
            },
        });

        flash(req, 'success', 'Event created successfully.');
        return inertiaRedirect(req, res, '/admin/events');
    }

    /**
     * Show the form for editing an event.
     */
    async edit(req: Request, res: Response) {
        const eventId = parseInt(req.params.id, 10);
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            flash(req, 'error', 'Event not found.');
            return inertiaRedirect(req, res, '/admin/events');
        }

        return inertia(req, res, 'Events/Form', {
            event: {
                ...event,
                event_date: event.eventDate,
                event_time: event.eventTime,
                is_active: event.isActive,
                is_todays_event: event.isTodaysEvent,
                has_agenda: event.hasAgenda,
            },
        });
    }

    /**
     * Update the specified event.
     */
    async update(req: Request, res: Response) {
        const eventId = parseInt(req.params.id, 10);
        const { title, description, event_date, event_time, venue, is_active, has_agenda, agenda, existing_images } = req.body;
        const files = req.files as Express.Multer.File[] | undefined;

        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            flash(req, 'error', 'Event not found.');
            return inertiaRedirect(req, res, '/admin/events');
        }

        // Validate
        const errors: Record<string, string[]> = {};

        if (!title?.trim()) errors.title = ['Title is required.'];
        if (!description?.trim()) errors.description = ['Description is required.'];
        if (!event_date) errors.event_date = ['Event date is required.'];

        // Validate agenda
        const isActiveFlag = String(is_active).toLowerCase() === 'true' || is_active === true || String(is_active).toLowerCase() === 'on' || is_active === '1' || is_active === 1;
        const hasAgendaFlag = String(has_agenda).toLowerCase() === 'true' || has_agenda === true || String(has_agenda).toLowerCase() === 'on' || has_agenda === '1' || has_agenda === 1;
        let parsedAgenda: AgendaItem[] = [];

        if (hasAgendaFlag) {
            try {
                parsedAgenda = typeof agenda === 'string' ? JSON.parse(agenda) : (agenda || []);
                if (!Array.isArray(parsedAgenda) || parsedAgenda.length === 0) {
                    errors.agenda = ['At least one agenda item is required when agenda is enabled.'];
                }
            } catch {
                errors.agenda = ['Invalid agenda format.'];
            }
        }

        if (Object.keys(errors).length > 0) {
            flashErrors(req, errors);
            return inertiaRedirect(req, res, `/admin/events/${eventId}/edit`);
        }

        // Handle existing images
        let existingImagePaths: string[] = [];
        try {
            existingImagePaths = typeof existing_images === 'string' ? JSON.parse(existing_images) : (existing_images || []);
        } catch {
            existingImagePaths = [];
        }

        // Process new images
        const newImagePaths: string[] = [];
        if (files && files.length > 0) {
            const totalImages = existingImagePaths.length + files.length;
            if (totalImages > 20) {
                flashErrors(req, { images: ['Maximum 20 images allowed per event.'] });
                return inertiaRedirect(req, res, `/admin/events/${eventId}/edit`);
            }

            try {
                console.log(`Processing ${files.length} new images for event ${eventId}...`);
                const result = await imageService.processMultiple(files, 'events');

                // Add successful images
                for (const img of result.successful) {
                    newImagePaths.push(img.path);
                }

                // Report any failed images
                if (result.failed.length > 0) {
                    const failedNames = result.failed.map(f => f.filename).join(', ');
                    console.warn(`Failed to process images: ${failedNames}`);
                    // Still continue with successful images
                    if (result.successful.length === 0 && existingImagePaths.length === 0) {
                        flashErrors(req, {
                            images: [`Failed to process images. Please try again with smaller or different images. Error: ${result.failed[0].error}`]
                        });
                        return inertiaRedirect(req, res, `/admin/events/${eventId}/edit`);
                    }
                }

                console.log(`Successfully processed ${result.successful.length} new images`);
            } catch (error) {
                console.error('Image processing error:', error);
                flashErrors(req, {
                    images: [`Failed to process images: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`]
                });
                return inertiaRedirect(req, res, `/admin/events/${eventId}/edit`);
            }
        }

        // Combine images
        const allImages = [...existingImagePaths, ...newImagePaths];

        // Delete removed images
        const oldImages = (event.images as string[]) || [];
        const removedImages = oldImages.filter(img => !existingImagePaths.includes(img));
        for (const imagePath of removedImages) {
            await imageService.delete(imagePath);
        }

        // Update event
        await prisma.event.update({
            where: { id: eventId },
            data: {
                title: title.trim(),
                description: description.trim(),
                eventDate: new Date(event_date),
                eventTime: event_time || null,
                venue: venue?.trim() || null,
                images: allImages,
                isActive: isActiveFlag,
                hasAgenda: hasAgendaFlag,
                agenda: hasAgendaFlag ? (parsedAgenda as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
            },
        });

        flash(req, 'success', 'Event updated successfully.');
        return inertiaRedirect(req, res, '/admin/events');
    }

    /**
     * Remove the specified event.
     */
    async destroy(req: Request, res: Response) {
        const eventId = parseInt(req.params.id, 10);
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            flash(req, 'error', 'Event not found.');
            return inertiaRedirect(req, res, '/admin/events');
        }

        // Delete all images
        const images = (event.images as string[]) || [];
        for (const imagePath of images) {
            await imageService.delete(imagePath);
        }

        await prisma.event.delete({
            where: { id: eventId },
        });

        flash(req, 'success', 'Event deleted successfully.');
        return inertiaRedirect(req, res, '/admin/events');
    }

    /**
     * Toggle event active status.
     */
    async toggleActive(req: Request, res: Response) {
        const eventId = parseInt(req.params.id, 10);
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            flash(req, 'error', 'Event not found.');
            return inertiaRedirect(req, res, '/admin/events');
        }

        await prisma.event.update({
            where: { id: eventId },
            data: { isActive: !event.isActive },
        });

        const status = !event.isActive ? 'activated' : 'deactivated';
        flash(req, 'success', `Event ${status} successfully.`);
        return inertiaRedirect(req, res, '/admin/events');
    }

    /**
     * Set event as Today's Event.
     */
    async setTodaysEvent(req: Request, res: Response) {
        const eventId = parseInt(req.params.id, 10);
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            flash(req, 'error', 'Event not found.');
            return inertiaRedirect(req, res, '/admin/events');
        }

        // Unmark all other events
        await prisma.event.updateMany({
            where: { isTodaysEvent: true },
            data: { isTodaysEvent: false },
        });

        // Mark this event
        await prisma.event.update({
            where: { id: eventId },
            data: { isTodaysEvent: true },
        });

        flash(req, 'success', `'${event.title}' is now set as Today's Event.`);
        return inertiaRedirect(req, res, '/admin/events');
    }

    /**
     * Unset Today's Event.
     */
    async unsetTodaysEvent(req: Request, res: Response) {
        const eventId = parseInt(req.params.id, 10);
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            flash(req, 'error', 'Event not found.');
            return inertiaRedirect(req, res, '/admin/events');
        }

        await prisma.event.update({
            where: { id: eventId },
            data: { isTodaysEvent: false },
        });

        flash(req, 'success', `'${event.title}' is no longer Today's Event.`);
        return inertiaRedirect(req, res, '/admin/events');
    }

    /**
     * Delete a single image from an event.
     */
    async deleteImage(req: Request, res: Response) {
        const eventId = parseInt(req.params.id, 10);
        const { image_path } = req.body;

        if (!image_path) {
            flashErrors(req, { image: ['Image path is required.'] });
            return inertiaRedirect(req, res, `/admin/events/${eventId}/edit`);
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            flash(req, 'error', 'Event not found.');
            return inertiaRedirect(req, res, '/admin/events');
        }

        const images = (event.images as string[]) || [];
        if (images.includes(image_path)) {
            await imageService.delete(image_path);
            const updatedImages = images.filter(img => img !== image_path);
            await prisma.event.update({
                where: { id: eventId },
                data: { images: updatedImages },
            });
        }

        flash(req, 'success', 'Image deleted successfully.');
        return inertiaRedirect(req, res, `/admin/events/${eventId}/edit`);
    }

    /**
     * Display the public "Today's Event" page.
     */
    async today(req: Request, res: Response) {
        const today = dayjs().startOf('day').toDate();

        // First, look for the event marked as "Today's Event"
        let mainEvent = await prisma.event.findFirst({
            where: {
                isActive: true,
                isTodaysEvent: true,
            },
        });

        // If no marked event, find any event for today
        if (!mainEvent) {
            mainEvent = await prisma.event.findFirst({
                where: {
                    isActive: true,
                    eventDate: today,
                },
                orderBy: { eventTime: 'asc' },
            });
        }

        // If still none, get the next upcoming active event
        if (!mainEvent) {
            mainEvent = await prisma.event.findFirst({
                where: {
                    isActive: true,
                    eventDate: { gte: today },
                },
                orderBy: [{ eventDate: 'asc' }, { eventTime: 'asc' }],
            });
        }

        // If no upcoming, show most recent past event
        if (!mainEvent) {
            mainEvent = await prisma.event.findFirst({
                where: { isActive: true },
                orderBy: { eventDate: 'desc' },
            });
        }

        const formattedMainEvent = mainEvent ? {
            ...mainEvent,
            event_date: mainEvent.eventDate,
            event_time: mainEvent.eventTime,
            is_active: mainEvent.isActive,
            is_todays_event: mainEvent.isTodaysEvent,
            has_agenda: mainEvent.hasAgenda,
            formatted_date: dayjs(mainEvent.eventDate).format('YYYY-MM-DD'),
            formatted_time: mainEvent.eventTime ? dayjs(`2000-01-01 ${mainEvent.eventTime}`).format('h:mm A') : null,
        } : null;

        // Get future events
        const futureEvents = await prisma.event.findMany({
            where: {
                isActive: true,
                eventDate: { gt: today },
                id: { not: mainEvent?.id },
            },
            orderBy: { eventDate: 'asc' },
            take: 5,
            select: { id: true, title: true, eventDate: true, eventTime: true },
        });

        const formattedFuture = futureEvents.map(e => ({
            id: e.id,
            title: e.title,
            event_date: e.eventDate,
            event_time: e.eventTime,
            formatted_date: dayjs(e.eventDate).format('YYYY-MM-DD'),
            formatted_time: e.eventTime ? dayjs(`2000-01-01 ${e.eventTime}`).format('h:mm A') : null,
        }));

        // Get past events
        const pastEvents = await prisma.event.findMany({
            where: {
                isActive: true,
                eventDate: { lt: today },
                id: { not: mainEvent?.id },
            },
            orderBy: { eventDate: 'desc' },
            take: 5,
            select: { id: true, title: true, eventDate: true, eventTime: true },
        });

        const formattedPast = pastEvents.map(e => ({
            id: e.id,
            title: e.title,
            event_date: e.eventDate,
            event_time: e.eventTime,
            formatted_date: dayjs(e.eventDate).format('YYYY-MM-DD'),
            formatted_time: e.eventTime ? dayjs(`2000-01-01 ${e.eventTime}`).format('h:mm A') : null,
        }));

        return inertia(req, res, 'Events/PublicShow', {
            mainEvent: formattedMainEvent,
            futureEvents: formattedFuture,
            pastEvents: formattedPast,
            pageTitle: "Today's Event",
        });
    }

    /**
     * Display a listing of all events for the public.
     */
    async list(req: Request, res: Response) {
        const today = dayjs().startOf('day');

        const events = await prisma.event.findMany({
            where: { isActive: true },
            orderBy: [{ eventDate: 'desc' }, { eventTime: 'asc' }],
        });

        const formattedEvents = events.map(event => {
            const eventDate = dayjs(event.eventDate);
            let status: string;
            let statusColor: string;

            if (eventDate.isAfter(today)) {
                status = 'Upcoming';
                statusColor = 'bg-green-100 text-green-800';
            } else if (eventDate.isSame(today, 'day')) {
                status = 'Today';
                statusColor = 'bg-visakha-gold text-visakha-navy';
            } else {
                status = 'Past';
                statusColor = 'bg-gray-100 text-gray-800';
            }

            return {
                ...event,
                event_date: dayjs(event.eventDate).format('YYYY-MM-DD'),
                event_time: event.eventTime ? dayjs(`2000-01-01 ${event.eventTime}`).format('h:mm A') : null,
                is_active: event.isActive,
                is_todays_event: event.isTodaysEvent,
                has_agenda: event.hasAgenda,
                status,
                status_color: statusColor,
            };
        });

        return inertia(req, res, 'Events/PublicList', {
            events: formattedEvents,
        });
    }

    /**
     * Display the specified event for the public.
     */
    async showPublic(req: Request, res: Response) {
        const eventId = parseInt(req.params.id, 10);
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event || !event.isActive) {
            return res.status(404).send('Event not found');
        }

        const today = dayjs().startOf('day').toDate();

        const formattedMainEvent = {
            ...event,
            event_date: event.eventDate,
            event_time: event.eventTime,
            is_active: event.isActive,
            is_todays_event: event.isTodaysEvent,
            has_agenda: event.hasAgenda,
            formatted_date: dayjs(event.eventDate).format('YYYY-MM-DD'),
            formatted_time: event.eventTime ? dayjs(`2000-01-01 ${event.eventTime}`).format('h:mm A') : null,
        };

        // Get future events
        const futureEvents = await prisma.event.findMany({
            where: {
                isActive: true,
                eventDate: { gt: today },
                id: { not: event.id },
            },
            orderBy: { eventDate: 'asc' },
            take: 5,
            select: { id: true, title: true, eventDate: true, eventTime: true },
        });

        const formattedFuture = futureEvents.map(e => ({
            id: e.id,
            title: e.title,
            event_date: e.eventDate,
            event_time: e.eventTime,
            formatted_date: dayjs(e.eventDate).format('YYYY-MM-DD'),
            formatted_time: e.eventTime ? dayjs(`2000-01-01 ${e.eventTime}`).format('h:mm A') : null,
        }));

        // Get past events
        const pastEvents = await prisma.event.findMany({
            where: {
                isActive: true,
                eventDate: { lt: today },
                id: { not: event.id },
            },
            orderBy: { eventDate: 'desc' },
            take: 5,
            select: { id: true, title: true, eventDate: true, eventTime: true },
        });

        const formattedPast = pastEvents.map(e => ({
            id: e.id,
            title: e.title,
            event_date: e.eventDate,
            event_time: e.eventTime,
            formatted_date: dayjs(e.eventDate).format('YYYY-MM-DD'),
            formatted_time: e.eventTime ? dayjs(`2000-01-01 ${e.eventTime}`).format('h:mm A') : null,
        }));

        return inertia(req, res, 'Events/PublicShow', {
            mainEvent: formattedMainEvent,
            futureEvents: formattedFuture,
            pastEvents: formattedPast,
            pageTitle: 'School Event',
        });
    }
}

export const eventController = new EventController();
