import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from 'cors'
const { Schema, model } = mongoose;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3000;
const app = express();

app.use(express.json())


let otps = []

const userSchema = new Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  pno: { type: Number, unique: true },
  sports : {type:[String] ,default:["cricket"]},
  scores: {type:mongoose.Schema.Types.Mixed,default:{cricket_scre:0}},
  level: {type:Number , default:0},
});



const User = model("User", userSchema);

const line = ()=>{
    console.log("-------------------------------------------------")
}

mongoose.connect(process.env.MONGO_URI, 
  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {console.log('Connected to MongoDB')
   line()})
.catch(err => console.error('MongoDB connection error:', err));


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

function generateOtp() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

let id = setInterval(async()=>{
    otps = otps.filter(i => new Date()-i.time <=30000)
},60000)


app.post("/sendotp", async (req, res) => {
  try {
      const {email} = req.body
      let otp = generateOtp()  
     let x = otps.find((i)=>i.mail===email)
      if(x){
        x.otp = otp
        x.time = new Date()
      }
      else{
        otps.push({mail:email,otp:otp,time:new Date()})
      } 
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "OTP VERIFICATION",
        text: `Your OTP is ${otp}`,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          line()
          return res.send({"otpstatus":0})
        } else {
          console.log(`Email sent: ${email} ${otp} ` + info.response);
          line()
          return res.send({"otpstatus":1})
        }
      })
      
     
    
  } catch (error) {
    console.error(error);
    line()
    return res.send({"otpstatus":-1})
    
  }
});

app.post("/verifyotp", async(req, res) => {
    
  try{
  console.log(req.body)
  const{email,otp} = req.body
   let x = otps.find((i)=>i.mail===email)
      if(x){
       if(x.otp === otp){
        return res.send({"otpverify":1})
       }
       else{
        return res.send({"otpverify":0})
       }
      }
      else{
        return res.send({"otpverify":-1})
      } 
  }
  catch(err){
    console.log(err)
    line()
    return res.send({"otpverify":-1})
    
  }
});

app.post("/resetpass", async(req, res) => {
    
  try{
 
  const{email,password} = req.body
  let user = await User.findOne({email:email})
  if(user){
    user.password = await bcrypt.hash(password,10)
    await user.save()
    console.log(`${email} pass reset`)
      line()
    return res.send({"resetpassStatus":1})
  }
  else{
    return res.send({"resetpassStatus":0})
  }
  }
  catch(err){
    console.log(err)
    line()
     return res.send({"resetpassStatus":-1})
  }
});


app.post("/signup", async(req, res) => {
    
  try{

  const{fname,lname,email,pno,password} = req.body
  let user = await User.findOne({email:email})
  if(user){
    return res.send({"signupStatus":0})
  }
  else{
    const pass = await bcrypt.hash(password,10)
    const newUser = new User()
    newUser.fname = fname
    newUser.lname = lname
    newUser.email = email
    newUser.password = pass
    newUser.pno = pno

    await newUser.save()
    return res.send({"signupStatus":1})
  }
  }
  catch(err){
    console.log(err)
    line()
    return res.send({"signupStatus":-1})
    
  }
});

app.get("/signin", async(req, res) => {
    
  try{
 
  const{email,password} = req.body
  let user = await User.findOne({email:email})
  if(user){
    
    let x = await bcrypt.compare(password,user.password)
      if(x){
        res.send({"signinStatus":1})
      }
      else{
        res.send({"signinStatus":0})
      }
  }
  else{
    return res.send({"signinStatus":-1})
  }
  
  }
  catch(err){
    console.log(err)
    line()
    return res.send({"signinStatus":-1})
  }
});

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    line()
    console.log(`Server started at http://localhost:${port}`);
  }
});