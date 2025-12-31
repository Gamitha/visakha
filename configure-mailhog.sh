#!/bin/bash

# Update .env with MailHog configuration
sed -i '' 's/MAIL_MAILER=.*/MAIL_MAILER=smtp/' .env
sed -i '' 's/MAIL_HOST=.*/MAIL_HOST=mailhog/' .env
sed -i '' 's/MAIL_PORT=.*/MAIL_PORT=1025/' .env

# Add missing mail config if not exists
grep -q "MAIL_FROM_ADDRESS" .env || echo "MAIL_FROM_ADDRESS=noreply@visakha.lk" >> .env
grep -q "MAIL_FROM_NAME" .env || echo 'MAIL_FROM_NAME="Visakha Vidyalaya"' >> .env

# Clear config cache
docker-compose exec -T app php artisan config:clear

echo "✓ MailHog configured successfully!"
echo "✓ View emails at: http://localhost:8025"
