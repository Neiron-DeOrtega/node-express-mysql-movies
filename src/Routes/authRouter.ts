const { Router } = require('express'); 
const router = Router(); 
const verifyToken = require('../Middleware/accessMiddleware')
const authController = require('../Controllers/authController.ts')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/protected', verifyToken, authController.protected)

module.exports = router