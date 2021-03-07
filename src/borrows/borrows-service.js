const BorrowsService = {
  getBorrows(db, user_id) {
    return db('borrows')
      .select('*')
      .where({ user_id })
      .andWhere('returned', false);
  },
  insertBorrow(db, newBorrow) {
    return db
      .insert(newBorrow)
      .into('borrows')
      .returning('*')
      .then(([row]) => row);
  }
};

module.exports = BorrowsService;