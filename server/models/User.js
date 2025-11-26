import mongoose from 'mongoose'

const userSchema =new mongoose.Schema({
    name:{ type: String, required: true},
    email:{ type: String, required: true, unique:true},
    password:{ type: String, required: true},
    phone:{ type: String},
    role:{ type: String, enum:["owner","user"],default:'user'},
    image:{type: String, default:''}
},{timestamps:true})//this will automatically adds  createdAt and updatedAt

const User =mongoose.model('User',userSchema)

export default User