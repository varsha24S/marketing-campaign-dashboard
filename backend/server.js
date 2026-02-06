require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");

const auth=require("./routes/auth");
const campaign=require("./routes/campaign");

const app=express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongo Connected"))
.catch(e=>console.log(e));

app.use("/api/auth",auth);
app.use("/api/campaign",campaign);

app.get("/",(req,res)=>res.send("Backend Running"));

app.listen(5000,()=>console.log("Server Started on 5000"));
