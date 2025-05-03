const User = require('../model/user.model')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })

    const options = {
        expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            data: user
        })
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body
    const userExists = await User.findOne({ email })
    if (userExists) {
        return next(new ErrorResponse('Foydalanuvchi allaqachon mavjud', 400))
    }

    const user = await User.create({
        username,
        email,
        password,
        apiKey: uuid.v4()
    })

    sendTokenResponse(user, 201, res)
})

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorResponse('Email va parolni kiriting', 400))
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new ErrorResponse('Noto\'g\'ri email yoki parol', 401))
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse('Noto\'g\'ri email yoki parol', 401))
    }

    sendTokenResponse(user, 200, res)
})

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
    }

    console.log('User:', req.user);

    res.status(200).json({
        success: true,
        data: req.user,
    });
})

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })
})


// @desc    Update user details
// @route   PUT /api/auth/me
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc    Delete user
// @route   DELETE /api/auth/me
// @access  Private
exports.deleteMe = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.user.id)

    res.status(200).json({
        success: true,
        data: {}
    })
})


// @desc    Update user password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Noto\'g\'ri parol', 401))
    }

    user.password = req.body.newPassword
    await user.save()

    sendTokenResponse(user, 200, res)
})


// @desc allusers 
// @route GET /api/auth/allusers
// @access Private
exports.allusers = asyncHandler(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        success: true,
        data: users
    })
})
