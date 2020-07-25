

CREATE DATABASE users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(40),
    email TEXT
);

insert into users (name, email) VALUES
('joe', 'joe@lalso.com'),
('lalo','lalo@lalo.com');