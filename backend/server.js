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

console.log(process.env.NODEMAILER_EMAIL)

let otps = []

const userSchema = new Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  pno: { type: Number, unique: true },
  sports : {type:JSON },
  scores: {type:JSON},
  level: Number,
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

app.post("/sendotp", async (req, res) => {
  try {
      const {email} = req.body
      let otp = generateOtp();
      console.log(otp)
      console.log(email)
      
      let x = otps.find((i)=>i.mail===email)
      if(x){
        x.otp = otp
      }
      else{
        otps.push({mail:email,otp:otp})
      } 
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Password Reset",
        text: `Your OTP is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.send({"otpstatus":0})
        } else {
          console.log("Email sent: " + info.response);
          return res.send({"otpstatus":1})
        }
      });
      line()
    
  } catch (error) {
    console.error(error);
    line()
    res.status(500).send("Internal Server Error");
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
  }
});

app.get("/login", (req, res) => {
  console.log(req)
});

app.get("/otps", (req, res) => {
  res.send('adasdadsasd')
});

app.post("/signup", async(req, res) => {
    
  try{

  const{fname,lname,email,pno,password} = req.body
  console.log(`${fname} ${lname} ${email} ${pno} ${password}`)
  let user = await User.findOne({email:email})
  if(user){
    return res.send({"signupStatus":0})
  }
  else{
    const pass = await bcrypt.hash(password,10)
    const user = new User({
        fname:fname,
        lname:lname,
        email:email,
        password:pass,
        pno:pno,
    })
    await user.save()
    return res.send({"signupStatus":1})
  }
  }
  catch(err){
    console.log(err)
    line()
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