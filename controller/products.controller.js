const Product = require('../model/products.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const { uploadToCloudinary } = require('../middlewares/cloudinary');

// @desc    Create new product
// @route   POST /api/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Iltimos rasm yuklang', 400));
    }

    const imageUrl = await uploadToCloudinary(req.file);
    req.body.image = imageUrl;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    });
});

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});
