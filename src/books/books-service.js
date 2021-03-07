const BooksService = {
  getUserBooks(db, user_id) {
    return db('books')
      .select('*')
      .where({ user_id });
  }, 
  insertBook(db, newBook) {
    return db
      .insert(newBook)
      .into('books')
      .returning('*')
      .then(([row]) => row);
  },
  findBookById(db, id) {
    return db('books')
      .select('*')
      .where({ id })
      .first();
  },
  updateBook(db, id, updatedBook) {
    return db('books')
      .where({ id })
      .update(updatedBook);
  }
};

module.exports = BooksService;