const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    const autoHeader=req.headers.token;
    if(autoHeader){
        const token=autoHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if(err) res.status(403).json({msg:"Token is invalid"});
            req.user=user;
            next();
        })
    }else{
        return res.status(401).json({
            msg:"you are not authenticated"
        })
    }
}

const verifyTokenAndAuthorization=(req,res,next)=>{
    verifyToken(req,res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json({
                msg:"You are not allowed to do that"
            })
        }
    })
}

const verifyTokenAndAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json({
                msg:"you are not allowed to do that"
            })
        }
    })
}

module.exports={
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization,
}