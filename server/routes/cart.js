const express=require('express')
const router=express.Router()
const Cart=require('../models/Cart')
const {verifyToken,verifyTokenAndAuthorization,
    verifyTokenAndAdmin}=require('./verifyToken')


// create endpoint
router.post("/",verifyToken,async(req,res)=>{
    const newCart=new Cart(req.body);

    try{
        const savedCart=await newCart.save();
        res.status(200).json({
            msg:"product saved",data:savedCart
        })
    }catch(err){
        res.status(500).json({
            msg:"Cant save",err
        })
    }
})

// update 
router.put('/:id',verifyTokenAndAuthorization, async(req,res)=>{
    try{
        const updatedCart=await Cart.findByIdAndUpdate(
            req.params.id,{
                $set:req.body,
            },{
                new:true
            }
        )
        res.status(200).json({
            msg:"cart updated success",data:updatedCart
        });
    }catch(err){
        res.status(500).json({
            err:"Something wernt wrong"
        })
    }
})

// delete item from cart
router.delete("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({
            msg:"Cart has been deleted!.."
        })

    }catch(err){
        res.status(500).json({
            err:"Somthing went wrong"
        })
    }
})

// get user cart
router.get('/find/:userId',verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const cart=await Cart.findOne({
            userId:req.params.userId
        })
        res.status(200).json({
            msg:"Success",data:cart
        })

    }catch(err){
        res.status(500).json({
            err:"Somthing went wrong"
        })
    }
})

// get all cart
router.get('/',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const carts=await Cart.find();
        res.status(200).json({
            msg:"Success",data:carts
        })
        
    }catch(err){
        res.status(500).json({
            err:"failed"
        })
    }
})





module.exports=router;