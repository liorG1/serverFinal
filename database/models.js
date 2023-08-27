let mongoose=require('mongoose')

// זה בשביל המנהל כי לכל משתמש נשמור בקולקשיין יוזר את ההזמנות שלו
let order_schema=new mongoose.Schema({
    //כאן אני רוצה את המייל שם מלא טלפון כתובת
    user_detalis:{type:mongoose.Types.ObjectId,ref:"users",require:true},
    //את ההזמנות נשמור באובייקט כי אפשר להזמין כמה פעמים את אותו המוצר
    //נשמור בצורה של איידי,מידה,כמות
     products:{type:Array,ref:'products',require:true},
     total_price:{type:Number,require:true}, 
    date:{type:Date,default:Date.now()},
    status:{type:String,default:'progress'}
    //בהמשך נוסיף אובייקט של תאריך
})

let products_schema=new mongoose.Schema({
    img:{type:String,require:true},
    brand:{type:String,require:true},
    name:{type:String,require:true},
    catagory:{type:String,require:true},
    price:{type:Number,require:true},
    description:{type:String,require:true}
})

let users_schema=new mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    phone_number:{type:String,require:true},
    password:{type:String,require:true},
    country:{type:String,require:true},
    city:{type:String,require:true},
    streetAndApartment:{type:String,require:true},
    permission:{type:Number,require:false},
    peyment_details:{type:Object,require:false},
    products_marked:{type:Array,require:false}
    //הרשאות: 1 זה מנהל אתר 2 זה עורך 3 זה משתמש רגיל
    
})

module.exports={
    Orders:mongoose.model('orders',order_schema),
    Products:mongoose.model('products',products_schema),
    Users:mongoose.model('users',users_schema)
}


