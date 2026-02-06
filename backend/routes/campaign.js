const router=require("express").Router();
const Campaign=require("../models/Campaign");

router.post("/",async(req,res)=>{
 res.json(await Campaign.create(req.body));
});

router.get("/",async(req,res)=>{
 res.json(await Campaign.find());
});

router.put("/:id",async(req,res)=>{
 await Campaign.findByIdAndUpdate(req.params.id,req.body);
 res.json("updated");
});

router.delete("/:id",async(req,res)=>{
 await Campaign.findByIdAndDelete(req.params.id);
 res.json("deleted");
});

module.exports=router;
