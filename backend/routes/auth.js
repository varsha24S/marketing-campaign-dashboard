const router=require("express").Router();
const User=require("../models/User");
const bcrypt=require("bcryptjs");

router.post("/register",async(req,res)=>{
 const h=await bcrypt.hash(req.body.password,10);
 await User.create({email:req.body.email,password:h});
 res.json("ok");
});

router.post("/login",async(req,res)=>{
 const u=await User.findOne({email:req.body.email});
 if(!u) return res.json("fail");
 const ok=await bcrypt.compare(req.body.password,u.password);
 res.json(ok?"ok":"fail");
});

module.exports=router;
