const express = require('express');
const auth = require('../middleware/auth');
const productsController = require('../controllers/productController');
const router = express.Router();

router.use(auth);
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.patch('/:id/stock', productsController.updateStock);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
