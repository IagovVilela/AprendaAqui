#!/bin/bash

# Exit the script if any command fails
set -e

echo "Starting app initialization..."

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Create storage link
echo "Creating storage link..."
php artisan storage:link

# Clear cache
echo "Clearing cache..."
php artisan optimize:clear

# Cache the various components of the Laravel application
echo "Caching config..."
php artisan config:cache
echo "Caching events..."
php artisan event:cache
echo "Caching routes..."
php artisan route:cache
echo "Caching views..."
php artisan view:cache

echo "App initialization completed successfully."