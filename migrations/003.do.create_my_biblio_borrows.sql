CREATE TABLE borrows (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE DEFAULT now(),
  returned BOOLEAN NOT NULL DEFAULT false
);