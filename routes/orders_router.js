const { Router } = require("express");
const {allOrders, updateStatus,orderById,addOrder,Getbill}=require('../controllers/orders_controller.js')

const ordersRouter=Router()

ordersRouter.get('/all',allOrders)
ordersRouter.get('/updateStatus/:id/:status',updateStatus) 
ordersRouter.get('/ById/:id',orderById)
ordersRouter.post('/add',addOrder)
/* ordersRouter.post('/sendEmail',sendMail) */
ordersRouter.post('/GetBill',Getbill)


const getbill=require('../nodemailer.js')
ordersRouter.get('/getbill',getbill)

module.exports= ordersRouter