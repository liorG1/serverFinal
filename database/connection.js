
let mongoose=require('mongoose')

let url='mongodb+srv://liorgetahun4:liorDatabase100@cluster0.dppxhbx.mongodb.net/finalProject_1'

let connection=()=> mongoose.connect(url)

module.exports=connection