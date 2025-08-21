# Create the database and user if they don't exist
CREATE DATABASE express_starter;
CREATE USER express_user WITH ENCRYPTED PASSWORD 'express_password';
GRANT ALL PRIVILEGES ON DATABASE express_starter TO express_user;
