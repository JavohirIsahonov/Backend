const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:[true,'User name is required'],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Invalid email"]
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        trim:true,
        select:false
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    image:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    basket:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ],
    apiKey:{
        type:String,
        required:true,
        unique:true,
    },
},{
    timestamps:true
})


userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})

// token
userSchema.methods.getToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:'30d'})
}

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User',userSchema)