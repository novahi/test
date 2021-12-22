const express = require('express')
const userController = require('../app/controllers/UserController')
const router = express.Router()


router.get('/', userController.view)
router.get('/create', userController.create)
router.get('/:id/edit',userController.edit)
router.put('/:id', userController.update)
router.delete('/:id', userController.destroy)
router.post('/store', userController.store)
router.get('/:slug', userController.show)

module.exports = router
