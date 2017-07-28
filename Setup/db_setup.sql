CREATE USER ticketmaster WITH NOSUPERUSER NOCREATEDB NOCREATEROLE NOCREATEUSER LOGIN PASSWORD '$TicketMaster2017!';
CREATE DATABASE ticket_tracker WITH OWNER ticketmaster;
\connect ticket_tracker
CREATE TABLE customers(customer_id INT UNIQUE, name VARCHAR(255), address VARCHAR(255), postal_code VARCHAR(6), phone VARCHAR(12));
CREATE TABLE activities(date date, description text, priority VARCHAR(10), customer_id INT);

