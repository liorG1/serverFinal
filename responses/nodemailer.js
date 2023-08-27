"use strict";
const nodemailer = require("nodemailer");
const Mailgen=require('mailgen')
const {Products,Orders,Users} =require('../database/models');
const { useState } = require("react");

function addDays(date, days) {
    const dateCopy = new Date();
    dateCopy.setDate(date.getDate() + days);
    return dateCopy;
  }


  
const findproductDetalis=async(product)=>{
    const pro=await Products.findById(product)
    return pro
}
const date=new Date()
const SendEmail=async(order)=>{
    const deliveryDay=addDays(date,13)
    const [data,setData]=useState([])
    const user=await Users.findById(order.user_detalis).populate()
     console.log(user.email);
    order.products.map(async(product) => {
        const productDetalis=await findproductDetalis(product)

        setData(arr=>[...arr,
            {
                item:`${productDetalis.name}`, 
                img:`<img src="${productDetalis.img}" width="100" height="100" />`,
                description:`${productDetalis.description}`,
                price:`${productDetalis.price}` 
            }])

        /*  data.push({
            item:`${productDetalis.name}`, 
            img:`<img src="${productDetalis.img}" width="100" height="100" />`,
            description:`${productDetalis.description}`,
            price:`${productDetalis.price}` 
        }) */
    }); 
   
    let config={
        service:'gmail',
        auth:{
            user:'hermainloren@gmail.com',
            pass:'gokfivjmvrloljts'
        }
    }

    let transportere=nodemailer.createTransport(config)

    let mailgenGenerator=new Mailgen({
        "theme":"default",
        "product":{
            name:"lior store",
            link:"https//mailgen.js"
        }
    })

    let response={
        body:{
            name:`${user.name}`,
            intro:`your order number is : ${order._id} \n your expected delivery date : ${deliveryDay.getDate()}/${deliveryDay.getMonth()}/${deliveryDay.getFullYear()}`,
            table:{
                data
            },
            outro:`total price : ${order.totalPrice}`
        }
    }
    let mail=mailgenGenerator.generate(response)
    let messsage={
        from:'liorsStore@gmail.com',
        to:`${user.email}.com`,
        subject:"order completed!!",
        html:mail
    }
    transportere.sendMail(messsage)
}
module.exports=SendEmail
