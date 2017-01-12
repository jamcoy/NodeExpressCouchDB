var express = require('express');
var router = express.Router();
var ctrlItems = require('../controllers/items');

// items (db documents)
router.get('/', ctrlItems.itemsList);
router.get('/item/:itemid', ctrlItems.itemInfo);
router.get('/add-item', ctrlItems.addItem);
router.get('/delete-item/:itemid', ctrlItems.deleteItem);
router.get('/update-item/:itemid', ctrlItems.updateItem);
router.post('/add-item', ctrlItems.doAddItem);

module.exports = router;
