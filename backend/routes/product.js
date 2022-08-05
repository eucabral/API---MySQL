const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const multer = require('multer')
const verifytoken = require('../helpers/verify-token')
const productController = require('../controllers/productController')


const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, './uploads/')
    },
    filename: function(req,file,cb) {
        cb(null,new Date().toISOString + file.originalname)
    }
})
const upload = multer ({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }

})


router.get('/',productController.getProduct)
router.post('/',verifytoken.obrigatorio,upload.single('product_image'),productController.postProduct)
router.get('/:id_product',productController.idProduct)
router.patch('/',verifytoken.obrigatorio,productController.patchProduct)
router.delete('/',verifytoken.obrigatorio,productController.deleteProduct)

module.exports = router