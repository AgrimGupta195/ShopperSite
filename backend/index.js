const port = 4000;
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path'); // getting director of backend
const cors = require('cors');
const { type } = require('os');
const { error } = require('console');

app.use(express.json());
app.use(cors());
//  Database connection with mongo
mongoose.connect('mongodb+srv://agrimgupt195:vNa2ZIvCnkSD15LG@cluster0.mos5p.mongodb.net/e-commerce');
// Api Creation
app.get('/',(req,res)=>{
    res.send('running');
})
// multer image storage

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})
const upload = multer({storage:storage});
//creating upload end point
app.use('/images',express.static('upload/images'));
app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// SCHEMA 
const Product =mongoose.model('Product',{
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    }
});
app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product = last_product_array[0];
        id=last_product.id+1;
    }else{
        id=1;
    }
    const product =new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    await product.save();
    res.json({
        success:true,
        name:req.body.name,
    })
});
//deleting products
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    res.json({
        success:true,
        name:req.body.name,
    })
});
//getting all product
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    res.send(products);
})

const Users = mongoose.model('Users',{
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now(),
    }
});

app.post('/signup',async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({
            success:false,
            errors:"User Already Exist",
        })
    }
    let cart ={};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    });
    await user.save();

    const data ={
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,"secret_key");
    res.json({
        success:true,
        token,
    })
});
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const comparePass = req.body.password === user.password;
        if(comparePass){
            const data ={
                user:{
                    id:user.id,
                }
            }
            const token = jwt.sign(data,'secret_key');
            res.json(
                {
                    success:true,
                    token,
                }
            )
        }else{
            res.json({success:false,errors:"Wrong PassWord"})
        }
    }else{
        res.json({
            success:false,
            errors:"Email",
        })
    }
})
// for new collection

app.get('/newcollection',async(req,res)=>{
    let products= await Product.find({});
    let newCollection=products.slice(1).slice(-8);
    res.send(newCollection)
})
app.get('/popularinwomen',async(req,res)=>{
    let product = await Product.find({category:"women"});
    let popular_in_women=product.slice(0,4);
    res.send(popular_in_women);
})
//create middleware
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: 'Please Login' });
    }
    try {
        const data = jwt.verify(token, 'secret_key');
        req.user = data.user;
        next();
    } catch {
        return res.status(401).send({ error: 'Login using valid token' });
    }
};

app.post('/addtocart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
});
//creating remove  cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    let userData = await Users.findOne({ _id: req.user.id });
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
})
app.post('/getcart',fetchUser,async(req,res)=>{
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})
app.listen(port,(err)=>{
    if(!err){
        console.log("Server Running on PORT"+port);
    }else{
        console.log(err);
    }
})