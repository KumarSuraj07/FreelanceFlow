const express = require('express');
const { getNotes, getNotesByClient, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getNotes);
router.get('/client/:clientId', getNotesByClient);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;