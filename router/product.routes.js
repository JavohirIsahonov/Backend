const {Router} = require('express')
const { createProduct, getProducts } = require('../controller/products.controller')
const router = Router()
const upload = require('../utils/upload')

// @desc    Create new product
// @route   POST /api/products
// @access  Public
router.post('/create', upload.single('image'), createProduct)
router.get('/all', getProducts)

module.exports = router