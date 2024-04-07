const express = require('express');
const router = express.Router();
const { registerUser, getInformation, updateUser, loginUser, logout, forget_password_token, forget_password } = require('../controllers/userController.js');
const { isRegistered } = require('../middlewares/authMiddlewares.js');


//routes for user management controllers 
router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', logout);

router.get('/getUserDetails', isRegistered, getInformation);

router.put('/updateUserDetails', isRegistered, updateUser);

router.post('/forget-password-token', isRegistered, forget_password_token);

router.post('/reset-password', isRegistered, forget_password);

module.exports = router;
