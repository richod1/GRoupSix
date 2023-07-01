const {verifyToken,verifyTokenAndAuthorization,
    verifyTokenAndAdmin}=require('./verifyToken')
    const Product=require('../models/Product')
    const express=require('express')
    const router=express.Router()

    // create products
    router.post("/",verifyTokenAndAdmin,async(req,res)=>{
        const newProduct=new Product(req.body);
        try{
            const savedProduct= await newProduct.save();
            res.status(200).json({
                msg:"Success",data:savedProduct
            })

        }catch(err){
            res.status(500).json({
                err:"failed to create products"
            })
        }
    })

    // update product
    router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
        try{
            const updatedProduct=await Product.findByIdAndUpdate(
                req.params.id,{$set:req.body},{new:true}
            );
            res.status(200).json({msg:"Success update",data:updatedProduct})

        }catch(err){
            res.status(500).json({
                err:"failed to upadet products"
            })
        }
    })


// Get products
router.get("/find/:id",async(req,res)=>{
    try{
        const product=await Product.findById(req.params.id)
        res.status(200).json({
            msg:"Success getting products",data:product
        })

    }catch(err){
        res.status(500).json({err:"failed to get products"})
    }
})

// Get all products
router.get("/",async(req,res)=>{
    const qNew=req.query.new;
    const qCategory=req.query.category;
    try{
        let products;
        if(qNew){
            products=await Product.find().sort({createdAt:-1}).limit();
        }else if(qCategory){
            products=await Product.find({categories:{
                $in:[qCategory]
            }})
            
        }else{
            products=await Product.find();
        }

    }catch(err){
        res.status(500).json({
            err:"failed to get all products"
        })
    }
})

module.exports=router;