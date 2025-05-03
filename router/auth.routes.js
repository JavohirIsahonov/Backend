const { Router } = require('express');
const { register, login, getMe, logout,updateMe,deleteMe,updatePassword,allusers } = require('../controller/auth.controller')
const router = Router()

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', register)

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', login)

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Public
router.get('/me', getMe)

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Public
router.get('/logout', logout)

// @desc    Update user
// @route   PUT /api/auth/update
// @access  Public
router.put('/update', updateMe)

// @desc    Delete user
// @route   DELETE /api/auth/delete
// @access  Public
router.delete('/delete', deleteMe)

// @desc    Update user password
// @route   PUT /api/auth/updatepassword
// @access  Public
router.put('/updatepassword', updatePassword)

// @desc    Get all users
// @route   GET /api/auth/allusers
// @access  Public
router.get('/allusers', allusers)

module.exports = router