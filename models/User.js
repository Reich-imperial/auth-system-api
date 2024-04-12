import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

const userSchema =mongoose.Schema({
    username:{
        type:String,
        required:[true, "Please provide the username"],
        maxLength:50,
        minLength:3,
    },
    email:{
        type:String,
        required:[true, "Please provide a valid email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique: [true, "Email address already taken..."]
    },
    password:{
        type:String,
        required:[true, "Please provide a passowrd"],
    }, 
    profile:{
        type:String,
    }
},
{
    timestamp:true,
},
);

// Hash password before saving to database
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    next();
  });
  
  // Generate JWT token
  userSchema.methods.generateAuthToken = function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return token;
  };
  
  // Verify password
  userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };
  
  // Create User model
export default mongoose.model('User', userSchema);