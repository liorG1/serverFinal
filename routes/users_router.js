const router=require('express').Router()

const {
    registrate,
    login,
    getAll,
    getUser
}=require('../controllers/users_controller.js')

router.post('/registrate',registrate);
router.post('/login',login)
router.get('/getAll',getAll)
router.post('/getUser',getUser)



module.exports=router