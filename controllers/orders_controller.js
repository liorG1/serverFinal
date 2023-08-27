const { JSON } = require("mysql/lib/protocol/constants/types");
const { Orders, Users,Products } = require("../database/models");
const jwt=require('jsonwebtoken');
/* const SendEmail = require("../responses/nodemailer"); */

const nodemailer=require('nodemailer')
const Mailgen=require('mailgen')

module.exports={
    allOrders:async(req,res)=>{
        try{
             
                const orders=await Orders.find().populate('user_detalis')
                console.log(orders);
                if (orders){
                    res.status(401,{
                        success:false,
                        message:'no orders'
                    })
                }
                res.status(200).json({
                    orders,
                    success:true,
                    message:'success get all orders'
                })
                 

               /*  const newOrder=new Orders({user_detalis:'6419f837c84dad326fa267bc'})
                await newOrder.save()
                console.log(newOrder);
                res.json({message:'succes',newOrder}) */
        }catch{
            res.status(401,{
                success:false,
                message:'failed get all orders'
            })
        }
    },
    updateStatus:async(req,res)=>{
        try {
            const order_id=req.params.id
            await Orders.findByIdAndUpdate(order_id,{status:req.params.status})
            res.status(200).json({
                success:true,
                message:'success update status'
            })
        } catch (error) {
            res.status(400).json({
                success:false,
            message:error.message
            })
        }
    },
    orderById:async (req,res)=>{
        try {
            const id=req.params.id
            const order=await Orders.findById(id)
            
            res.status(200).json({
                message:'success get order',
                success:true,
                order
            })
        } catch (error) {
            res.status(400).json({
                message:'failed get order',
                success:false
            })
        }
       
        
    },addOrder:async(req,res)=>{
        //נשמור כל מוצר בעגלת קניות,הפונקיצה הזאת היא שליחה של כל העגלה 
        try {
            /* if(!req.body.user_detalis){
                throw new Error('missing data')
            } */
            const token=req.body.token
            /* const {user_detalis}=jwt.verify(token,process.env.TOKEN_SECRET) */
            const {id}=  jwt.decode(token)
            /* const user_detalis={email:email,id:id,name:name}
            console.log(`user details: ${user_detalis}`); */
            const user_detalis=id
        
            const total_price=req.body.total_price
            
            const orderData={
                 user_detalis, 
                products:req.body.products,
                total_price:total_price
            }
            const newOrder=new Orders(orderData)
            await newOrder.save()
            res.status(200).json({
                success:true,
                message:'success adding order',
                newOrder
            })
        } catch (error) {
            res.status(400).json({
                success:false,
                message:'failed adding order',
                err:error.message
            })
        }
    },/* sendMail:async(req,res)=>{
        try {
            const order=req.body.order
            console.log('order');
            console.log(order);
            await SendEmail(order)
            res.status(200).json({
                success:true,
                msg:'success send email'
            })

            
        } catch (error) {
            res.status(400).json({
                success:false,
                message:'failed send email',
                err:error.message
            })
        }
    } */

    Getbill:async(req,res)=>{
        try {
            const order= req.body.order
            const userDetalis=await Users.findById(order.user_detalis).populate();
            const userName= userDetalis.name
            console.log(userDetalis.email);
            const products=order.products
           const check=(id)=>{
            return products.includes(id)
           }
            const allProducts=await Products.find().then(arr=>{return arr.filter(pro=>check(pro.id))})
            let data=allProducts.map(pro=>{
                return {
                    item:pro.name,
                    img: pro.img,
                    price:pro.price
                }
            }) 
            let total_price=order.total_price;
            let config={
                service:'gmail',
                auth:{
                    user:'hermainloren@gmail.com',
                    pass:'nkeqaeoihtciyoue'
                }
            }
        
            let transporter=nodemailer.createTransport(config)
            let MailGenerator=new Mailgen({
                theme:'default',
                product:{
                    name:`lior's store`,
                    link:'https://mailgen.js',
                }
            })
        
            let response={
                body:{
                    intro :`Your bill has arravied \n order number ${order._id}`,
                    name:userName,
                    table:{
                        data:data
                    },
                    outro:'total price: '+ total_price
        
                }
            }
        
            let mail=MailGenerator.generate(response)
            
        
            let message={
                from:'liors store',
                to:userDetalis.email,
                html:mail
            }
        
            transporter.sendMail(message).then(()=>{
                return res.status(201).json({
                    msg:'you should recive an email'
                })
            }).catch(error=>{
                return res.status(500).json({
                    error
                })
            })
            
        } catch (error) {
            res.status(404).json({
                mes:'failed send email',
                err:error.message
            })
        }

       
    }
}