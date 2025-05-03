const mongoose = require('mongoose');

const productSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Product name is required'],
        trim:true,
        unique:true
    },
    description:{
        type:String,
        required:[true,'Product description is required'],
        trim:true,
    },
    price:{
        type:Number,
        required:[true,'Product price is required'],
        trim:true,
    },
    image:{
        type:String,
        required:[true,'Product image is required'],
        trim:true,
    },
    category:{
        type:String,
        required:[true,'Product category is required'],
        trim:true,
    },
    stock:{
        type:Number,
        required:[true,'Product stock is required'],
        trim:true,
    },
    rating:{
        type:Number,
        default:0,
    },
},{
    timestamps:true
})

module.exports = mongoose.model('Product',productSchema);