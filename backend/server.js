import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
const { Schema, model } = mongoose;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
console.log(process.env.NODEMAILER_EMAIL)

let otps = []

const userSchema = new Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  pno: { type: Number, unique: true },
});

const playerSchema = new Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  score : Number,
  sport : String,
});

const User = model("User", userSchema);
const Player = model("Player", playerSchema);
mongoose.connect(process.env.MONGO_URI, 
  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});
function otp_() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

app.get("/sendotp", async (req, res) => {
  try {
      let email = "saishanmukhapanidepu@gmail.com"
      let otp = otp_();
      console.log(otp)
      let x = otps.find((i)=>i.mail===email)
      if(x){
        x.otp = otp
      }
      else{
        otps.push({mail:email,otp:otp})
      } 
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: "saishanmukhapanidepu@gmail.com",
        subject: "Password Reset",
        text: `Your OTP is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).send("Failed to send OTP");
        } else {
          console.log("Email sent: " + info.response);
          res.send("Email sent")
        }
      });
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/verifyotp", async(req, res) => {
    
  try{
  console.log(req.body)
  const{email,otp} = req.body
   let x = otps.find((i)=>i.mail===email)
      if(x){
       if(x.otp === otp){
        res.send("Success")
       }
       else{
        res.send("Invlaid otp")
       }
      }
      else{
        res.send("Invalid user")
      } 
  }
  catch(err){
    console.log(err)
  }
});

app.get("/login", (req, res) => {
  console.log(req)
});

app.get("/otps", (req, res) => {
  res.send(otps)
});

app.get("/signup", async(req, res) => {
    
  try{
  console.log(req.body)
  const{fname,lname,email,pno} = req.body
  let user = await User.findOne({email:email})
  if(user){
    res.send("user exists")
  }
  else{
    const user = new User({
        fname:fname,
        lname:lname,
        email:email,
        pno:pno,
    })
    await user.save()
    return res.send("User created")
  }
  }
  catch(err){
    console.log(err)
  }
});

app.get("/signin", async(req, res) => {
    
  try{
  console.log(req.body)
  const{email,otp} = req.body
  let user = await User.findOne({email:email})
  if(user){
    res.send("user exists")
    let x = otps.find((i)=>i.mail===email)
      if(x){
        if(x.otp === otp){
            res.send("success")
        }
      }
      else{
        res.send("failed login")
      }
  }
  else{
    return res.send("failed login")
  }
  }
  catch(err){
    console.log(err)
  }

});

app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Server started at http://localhost:${port}`);
  }
});