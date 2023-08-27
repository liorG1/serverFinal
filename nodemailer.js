const nodemailer=require('nodemailer')
const Mailgen=require('mailgen')
const { response } = require('./app')

module.exports= Getbill=(req,res)=>{
    let config={
        service:'gmail',
        auth:{
            user:'hermainloren@gmail.com',
            pass:'gokfivjmvrloljts'
        }
    }

    let transporter=nodemailer.createTransport(config)

    let MailGenerator=new Mailgen({
        theme:'default',
        product:{
            name:'Mailgen',
            link:'https://mailgen.js'
        }
    })

    let response={
        body:{
            intro :'Your bill has arravied',
            table:{
                data:[
                {
                    item:'Nodemailer stack book',
                    description:'A backend application',
                    price:'10$'
                }
            ]
            },
            

        }
    }

    let mail=MailGenerator.generate(response)

    let message={
        from:process.env.GMAIL,
        to:'lior.getahun4@gmail.com',
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
}