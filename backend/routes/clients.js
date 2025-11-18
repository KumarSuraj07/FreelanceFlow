const express = require('express');
const { getClients, getClient, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', getClients);
router.get('/:id', getClient);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;