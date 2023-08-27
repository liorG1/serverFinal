let {Products,Users,Orders}=require('../database/models')
const jwt=require('jsonwebtoken')
const { use } = require('../routes/products_router')
let SendEmail=require('../responses/nodemailer')
let checkAllProperties=(req)=>{
    if(req.body.img==undefined||req.body.catagory==undefined||req.body.price==undefined||req.body.description==undefined||req.body.brand==undefined||req.body.name==undefined){
        return false
    }
    else return true
}

const User=async(req,res)=>{

    const userId=jwt.verify(req.headers['cookie'].split('=')[1],process.env.TOKEN_SECRET).id
    const user= await Users.findById(userId)
    return user
}

module.exports={
    getAll:async(req,res)=>{
        try {

            let all=await Products.find()

            res.send(all)
            
        } catch (error) {
            res.status(404).json({
                message:'failed to get all Products',
                success:false,
                err:error.message
            })
        }
    },
    add:async(req,res)=>{
        try {
            console.log('req');
            console.log(req.headers);
            if (!checkAllProperties(req)){
                throw new Error('require fields missing')
            }
            
            let newProductObj={
                img:req.body.img,
                catagory:req.body.catagory,
                price:req.body.price,
                description:req.body.description,
                brand:req.body.brand,
                name:req.body.name
            }

            let newProduct =new Products(newProductObj)

            await newProduct.save()
/* 
            const token=await jwt.verify(req.headers['cookie'].split('=')[1],process.env.TOKEN_SECRET) */


            res.status(200).json({
                message:'success adding product',
                success:true,
                /* token */
            })

        } catch (error) {
            res.status(404).json({
                message:'failed to get add product',
                success:false,
                err:error.message
            })
        }
    },
    update:async(req,res)=>{
        try {

            //לפה מגיעים אחרי שעברו מידלור 
            //פה נמצא רק מישהו שהוא עורך עם הרשאה 2
            
            const newData={
                img:req.body.img,
                catagory:req.body.catagory,
                price:req.body.price,
                description:req.body.description,
                brand:req.body.brand,
                name:req.body.name
            }

            await Products.findByIdAndUpdate(req.params.id,newData)

            res.status(200).json({
                message:'success updating',
                success:true
            })
            

            
        } catch (error) {
            res.status(404).json({
                message:'falied to update',
                success:false,
                err:error.message
            })
        }
    },
    deleteProduct:async(req,res)=>{
        try {
            
            await Products.findByIdAndDelete(req.params.id)
            res.status(200).json({
                message:'success deleting product',
                success:true
            })

        } catch (error) {
            res.status(404).json({
                message:'failed to delete product',
                success:false
            })
        }
    },marke_product:async(req,res)=>{
        try {

            

            const product=await Products.findById(req.params.id)

            if(product==undefined){
                throw new Error('product not exist')
            }

           const user=await User(req,res)
            user.products_marked.push(product)

            user.save()
            

            res.status(200).json({
                message:'success purchasing product',
                success:true
            })



            
        } catch (error) {
            res.status(500).json({
                message:'failed purchase product',
                success:false,
                err:error.message
            })
        }
    },deleteMark:async(req,res)=>{
        try {

            /* const product=await Products.findById(req.body.id) */

            const user=await User(req,res)
            let newOrders=[]
            user.products_marked.map(product=>{
                if (product._id!=req.params.id){
                    newOrders.push(/* order */product)
                }
            })
            console.log(newOrders);
            await user.updateOne({products_marked:newOrders})
            await user.save()

            res.status(200).json({
                message:'success deleting product',
                success:true
            })

            
            
        } catch (error) {
            res.status(500).json({
                message:'failed deleting product from list',
                success:false,
                err:error.message
            })
        }
    },purchase:async(req,res)=>{
        try {
            const user=await User(req,res)
            const products=user.products_marked
            
            let totalPrice=0
            products.map(product=>totalPrice+=product.price)
            
            const {_id,name,email,phone_number,address}=user
            const user_detalis={
                _id,
                name,
                email,
                phone_number,
                address
            }
            const date=new Date()
            
            const newOrder=new Orders({user_detalis,products,totalPrice,date})

            await newOrder.save()
            await SendEmail(req,res,newOrder)
            
            user.products_marked=[]
            await user.save()

            res.status(200).json({
                message:'success purchasing products',
                success:true
            })
            
            
        } catch (error) {
            res.status(500).json({
                message:'faield to purchase product',
                success:false,
                ree:error.message
            })
        }
    },getById:async(req,res)=>{
        try {
            const id=req.params.id
            const product=await Products.findById(id).populate()
            res.status(200).json({
                success:true,
                message:'success find product',
                product
            })
        } catch (error) {
            res.status(400).json({
                success:false,
                message:'failed find product',
                err:error.message
            })
        }
    },getByName:async(req,res)=>{
        try {
            const name=req.params.name
            const product=await Products.find({name})
            console.log(JSON.stringify(product));
            res.status(200).json({
                success:true,
                message:'success find product',
                product
            })
        } catch (error) {
            res.status(400).json({
                success:false,
                message:'failed find product',
                err:error.message
            })
        }
    }
}