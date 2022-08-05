const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const requestController = require('../controllers/requestController')

router.get('/',requestController.getRequest)
router.post('/',requestController.postRequest)
router.get('/:id_request',requestController.idRequest)
router.delete('/',requestController.deleteRequest)

module.exports = router