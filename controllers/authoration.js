const jwt=require('jsonwebtoken')

const checkPermissionEditor=(req,res,nxt)=>{
    console.log('req.headers')
    console.log(req.headers)
    
    const token=  jwt.decode(req.headers['token'].split('=')[1])
    
    if (token.permission!=2){
        res.status(401).send('unathoraized user')
    }
    nxt()
}

const checkPermissionMenager=(req,res,nxt)=>{
    const token=jwt.decode(req.headers['token'].split('=')[1])

    if (token.permission!=3){
        res.status(401).send('unathoraized user')
    }
    console.log('menager connected');
    nxt()
}

module.exports={checkPermissionEditor,checkPermissionMenager}

