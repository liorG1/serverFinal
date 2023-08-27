const {Users}=require('../database/models')
const bycrpt=require('bcrypt')
const jwt=require('jsonwebtoken')

let checkAllProperties=(req)=>{
    if(req.body.name==undefined||req.body.email==undefined||req.body.password==undefined){
        return false
    }
    else return true
}

module.exports={
    registrate:async(req,res)=>{
        try {
           /*  if(!checkAllProperties(req)||req.body.address==undefined||req.body.phone_number==undefined){
               
                throw new Error('require fields missing')
            } */
            //סיסמא מוצפנת
            let hush= await bycrpt.hash(req.body.password,10)
            
            
            let newUserData={
                name:req.body.name,
                email:req.body.email,
                phone_number:req.body.phone_number,
                password:hush,
                city:req.body.city,
                country:req.body.country,
                streetAndApartment:req.body.streetAndApartment,
                peyment_details:req.body.peyment_details
            }



            let newUser=new Users(newUserData)

            await newUser.save()

            res.status(200).json({
                message:'success registrate',
                success:true
            })
            
        } catch (error) {
            res.status(404).json({
                message:'faield to registrate',
                success:false,
                err:error.message
            })
        }
    },
    login:async(req,res)=>{
        try {
            
            if (!checkAllProperties(req)){
                throw new Error('require fields missing')
            }
            let Authr=await Users.findOne({name:req.body.name,email:req.body.email})
            if (Authr==undefined){
                throw new Error('user dont exist')
            }
            
            if (Authr.permission==undefined){

                let is_match= await bycrpt.compare( req.body.password,Authr.password)
                
                if(!is_match) throw new Error('wrong password')
            }
            else{
                let is_match=req.body.password==Authr.password
                console.log(`is matched: ${is_match}`);
                if(!is_match) throw new Error('wrong password')
            }
           
      
            const payload={
                name:req.body.name,
                email:req.body.email,
                id:Authr._id,
                //רק לעורך ולמנהל יש permission שמור בדאטה בייס
                permission:Authr.permission==undefined?3:Authr.permission
            }

            let token= jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:"20m"})
            res.cookie("token",token)
            res.status(200).json({  
                message:'success login',
                success:true,
                token
            })
            
        } catch (error) {

            res.status(401).json({
                message:'faield to login',
                success:false,
                err:error.message
            })
        }
    },getAll:async(req,res)=>{
        try {
            const allUsers=await Users.find()
            if (!allUsers){
                res.json({
                    message:'there is no users in model'
                })
            }
            res.json({
                message:'all users:',
                users:allUsers
            })
        } catch (error) {
            res.status(404).json({
                message:'failed get all users',
                error
            })
        }
    },getUser:async(req,res)=>{
            try {
                const user=req.body.id
                /* console.log(user);
                const userId= jwt.decode(user) */
                const userDetails=await Users.findById(user).populate()
                if (userDetails){
                    return res.status(200).json({
                        message:'valid user',
                        userDetails
                    })
                }

               return res.json({
                    message:'invlid user'
                })
                
            } catch (error) {
             return   res.status(404).json({
                    err:error.message
                })
                
            }
    }

}