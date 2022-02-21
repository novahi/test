const express = require('express')
const userController = require('../app/controllers/UserController')
const router = express.Router()


router.get('/', userController.get)
router.post('/', userController.post)

module.exports = router
