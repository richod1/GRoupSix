const express=require('express')
const router=express.Router()
const {verifyToken,verifyTokenAndAuthorization,
    verifyTokenAndAdmin}=require('./verifyToken')
const Order=require('../models/Order.js')

// create order
router.post('/',verifyToken,async(req,res)=>{
    const newOrder=new Order(req.body)
    try{
        const savedOrder=await newOrder.save();
        res.status(200).json({
            msg:'order saved',data:savedOrder
        })

    }catch(err){
        res.status(500).json({
            err:"failed to create order"
        })

    }
})

// update order
router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const updatedOrder=await 
        Order.findByIdAndUpdate(req.params.id,{
$set:req.body,
        },{
            new:true
        })
        res.status(200).json({
            msg:"Success",data:updatedOrder
        })

    }catch(err){
        res.status(500).json({
            err:'failed to update'
        })
    }
})

// delete order
router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
  try{
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
        msg:"Order deleted successfully"
    })
  }catch(err){
    res.status(500).json({
        err:"failed to delete order"
    })
  }
})

// get user order
router.get('/find/:userId',verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const orders=await Order.find({
            userId:req.params.userId
        })

        res.status(200).json({
            msg:"Success",data:orders
        })
    }catch(err){
        res.status(500).json({
            err:"failed to get user"
        })
    }
})

// get all user of order
router.get('/',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const orders=await Order.find();
        res.status(200).json({
            msg:"Successfully",data:orders
        })
        
    }catch(err){
        res.status(500).json({
            err:"failed to get all orders"
        })
    }
})

// get monthly income
router.get('/income',verifyTokenAndAdmin,async(req,res)=>{
    const productId=req.query.pid;
    const date=new Date();
    const lastMonth=new Date(date.setMonth(date.getMonth()-1))
    const previousMonth=new Date(new Date().setMonth(lastMonth.getMonth()-1))
    
    try{
        const income=await Order.aggregate([
            {
                $match: {
                  createdAt: { $gte: previousMonth },
                  ...(productId && {
                    products: { $elemMatch: { productId } },
                  }),
                },
              },
              {
                $project: {
                  month: { $month: "$createdAt" },
                  sales: "$amount",
                },
              },
              {
                $group: {
                  _id: "$month",
                  total: { $sum: "$sales" },
                },
              },
        ])
        res.status(200).json({
            msg:"Success",data:income
        })

    }catch(err){
        res.status(500).json({
            err:"Failed to get income"
        })
    }
   
})

module.exports=router;