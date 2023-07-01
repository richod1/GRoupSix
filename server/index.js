const express=require('express')
const port=3000
const cors=require('cors')
const app=express()
const mongoose=require('mongoose')
require('dotenv').config()
const authRoute=require('./routes/auth')
const userRoute=require('./routes/user')
const cartRoute=require('./routes/cart')
const paystackRoute=require('./routes/paystack')
const productRoute=require('./routes/product')
const orderRoute=require('./routes/order')


app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URL).then(()=>
console.log("DB CONNECTED SUCCESSFULLY")
).catch((err)=>
console.log("DB CONNECTION FAILED",err)
)

app.get('/api',(req,res)=>{
    res.json("hello store")
})

app.use('/api/auth',authRoute)
app.use('/api/users',userRoute)
app.use('/api/carts',cartRoute)
app.use('/api.products',productRoute)
app.use('/api/orders',orderRoute)
app.use('/api/checkout ',paystackRoute)


app.listen(port,(err)=>{
    if(err) throw new Error('Server asleep...')
    console.log(`server is running on port ${port}`)
})
