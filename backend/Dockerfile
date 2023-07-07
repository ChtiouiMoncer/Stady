# Use the official PHP image as the base image
FROM php:8.1-cli

# Set the working directory in the container
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip

# Install PHP extensions required by Symfony
RUN docker-php-ext-install ctype iconv

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy the composer.json and composer.lock files and install dependencies
COPY composer.json composer.lock ./
RUN composer install --prefer-dist --no-scripts --no-autoloader

# Copy the rest of the application code
COPY . .

# Generate the optimized autoloader
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# Expose port 8000 for the Symfony web server
EXPOSE 8001

# Start the Symfony web server
CMD ["php", "bin/console", "server:run", "0.0.0.0:8001"]
