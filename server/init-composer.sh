#!/bin/sh

# After setup-composer.sh is ran, it sets up composer.phar in the composer directory
# This script just runs the composer init command from this directory

php composer/composer.phar init
