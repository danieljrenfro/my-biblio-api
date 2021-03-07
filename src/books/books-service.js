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
  findBookById(db, id, user_id) {
    return db('books')
      .select('*')
      .where({ id })
      .first();
  }
};

module.exports = BooksService;