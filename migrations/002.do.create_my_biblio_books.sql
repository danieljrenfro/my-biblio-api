BEGIN;

CREATE TYPE status AS ENUM ('Read', 'Unread', 'Reading');

CREATE TYPE format AS ENUM ('Hardback', 'Paperback', 'E-Book', 'Audio');

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  genre TEXT,
  format format NOT NULL,
  status status NOT NULL,
  borrowed BOOLEAN NOT NULL
);

COMMIT;