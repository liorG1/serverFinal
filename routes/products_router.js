var express = require('express');
var router = express.Router();
const{
getAll,
add,
update,
deleteProduct,
marke_product,
deleteMark,
purchase,
getById,
getByName
}=require('../controllers/products_controller')

const {checkPermissionEditor}=require('../controllers/authoration')

/* GET users listing. */
router.get('/all', getAll);
router.get('/ById/:id',getById)
router.get('/ByName/:name',getByName)
//שייך רק לעורכים
router.post('/add'  ,checkPermissionEditor  ,add);
router.put('/update/:id' ,checkPermissionEditor ,update);
router.delete('/delete/:id' ,checkPermissionEditor ,deleteProduct)

//קנייה וביטול של מוצר על ידי משתמשים
router.post('/marke_product/:id',marke_product)
router.delete('/deleteMark/:id',deleteMark)
router.post('/purchase',purchase)
module.exports = router;
