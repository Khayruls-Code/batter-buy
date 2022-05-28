const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct } = require("../controllers/productController");
const { getAuthenTicateUser, checkRoles } = require("../middleware/auth");
const router = express.Router()

router.route('/products').get(getAllProducts)
router.route('/product/new').post(getAuthenTicateUser, checkRoles("admin"), createProduct)
router.route('/product/:id').put(getAuthenTicateUser, checkRoles("admin"), updateProduct).delete(getAuthenTicateUser, checkRoles("admin"), deleteProduct).get(getSingleProduct)

module.exports = router;