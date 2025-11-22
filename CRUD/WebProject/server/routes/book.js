var express = require('express');
var router = express.Router();
var Book = require('../model/book');

// Check if only logged-in users can modify books
function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

// GET to show all books, public
router.get('/', async function (req, res, next) {
  try {
    var books = await Book.find().sort({ name: 1 });

    res.render('Books/list', {
      title: 'Book Directory',
      BookList: books,
      displayName: req.user ? req.user.displayName : ''
    });
  } catch (err) {
    console.log(err);

    res.render('Books/list', {
      title: 'Book Directory',
      BookList: [],
      error: 'Error loading books',
      displayName: req.user ? req.user.displayName : ''
    });
  }
});

// GET to show add form
router.get('/add', requireAuth, function (req, res, next) {
  res.render('Books/add', {
    title: 'Add Book',
    displayName: req.user ? req.user.displayName : ''
  });
});

// POST /books/add - create a new book
router.post('/add', requireAuth, async function (req, res, next) {
  try {
    var newBook = new Book({
      name: req.body.name,
      author: req.body.author,
      published: req.body.published,
      description: req.body.description,
      price: req.body.price
    });

    await newBook.save();
    res.redirect('/books');
  } catch (err) {
    console.log(err);

    res.render('Books/add', {
      title: 'Add Book',
      error: 'Error creating book',
      displayName: req.user ? req.user.displayName : ''
    });
  }
});

// GET to show edit form
router.get('/edit/:id', requireAuth, async function (req, res, next) {
  var id = req.params.id;

  try {
    var book = await Book.findById(id);

    if (!book) {
      return res.redirect('/books');
    }

    res.render('Books/edit', {
      title: 'Edit Book',
      Book: book,
      displayName: req.user ? req.user.displayName : ''
    });
  } catch (err) {
    console.log(err);
    res.redirect('/books');
  }
});

// POST to update existing book
router.post('/edit/:id', requireAuth, async function (req, res, next) {
  var id = req.params.id;
  var updated = {
    name: req.body.name,
    author: req.body.author,
    published: req.body.published,
    description: req.body.description,
    price: req.body.price
  };

  try {
    await Book.findByIdAndUpdate(id, updated);
    res.redirect('/books');
  } catch (err) {
    console.log(err);
    res.redirect('/books');
  }
});

// GET to delete book
router.get('/delete/:id', requireAuth, async function (req, res, next) {
  var id = req.params.id;

  try {
    await Book.deleteOne({ _id: id });
  } catch (err) {
    console.log(err);
  }

  res.redirect('/books');
});

module.exports = router;