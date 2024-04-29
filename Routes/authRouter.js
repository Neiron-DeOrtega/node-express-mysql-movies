const { Router } = require('express'); 
const router = Router(); 
const verifyToken = require('../Middleware/accessMiddleware')
const authController = require('../Controllers/authController')

console.log("authController:", authController);
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/protected', verifyToken, authController.protected)
console.log("После определения маршрутов");

module.exports = router