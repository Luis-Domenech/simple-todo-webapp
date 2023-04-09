#!/bin/sh

# Script that downloads composer, a php dependency manager, in the composer directory
# and sets it up. Taken and modified from here: https://getcomposer.org/doc/faqs/how-to-install-composer-programmatically.md

# PHP must be installed beforehand
# Instruction on how to do that here: https://kinsta.com/blog/install-php/#how-to-install-php-on-linux

# If no output is echoed, then composer was setup

# Check if composer directory exists
directory=composer
if [ ! -d $directory ]; then
    echo "Composer directory doesn't exist, so it was created"
    mkdir -p $directory
fi

EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')"
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', 'composer-setup.php');")"

mv composer-setup.php "$directory/composer-setup.php"

cd "$directory"

if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]; then
    >&2 echo 'ERROR: Invalid installer checksum'
    rm composer-setup.php
    exit 1
fi

php composer-setup.php --quiet
RESULT=$?
rm composer-setup.php
exit $RESULT