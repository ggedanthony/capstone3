const Service = require("../models/services");
const express = require("express"); 
const router = express.Router(); 



//create a service
router.post("/", async(req,res) => {
	const service = new Service(req.body);
	try{
		await service.save();
		res.send(service);
	}catch(e){
		console.log(e)
	}
})

//get all service
router.get("/", async(req,res) => {
	try{
		const service = await Service.find()
		res.send(service)
	}catch(e){
		console.log(e)
	}
})

//get one service
router.get("/:id", async (req,res) => {
	try{
		const service = await Service.findById(req.params.id);
		res.send(service)
	}catch(e){
		console.log(e)
	}
})


//Soft delete a service 
router.delete("/:id", async(req,res)=>{
	try{
		const service = await Service.findByIdAndUpdate(req.params.id, {active: false}, {new: true} )
		if(!service){
			return res.status(404).send("No Service Found!")
		}	
		res.send(service)
	}catch(e){
		console.log(e)
	}
})

//Activating an inactive service
router.put("/:id", async (req,res)=>{
		try{
		const service = await Service.findByIdAndUpdate(req.params.id, {active: true}, {new: true} )
		if(!service){
			return res.status(404).send("No Service Found!")
		}	
		res.send(service)
	}catch(e){
		console.log(e)
	}
})

router.patch("/:id", async(req,res)=>{
	try{
		const service = await Service.findByIdAndUpdate(req.params.id, req.body, {new: true})
		if(!service){
			return res.status(404).send("Can`t find the Service!")
		}
		res.send(service)
	}catch(e){
		console.log(e)
	}
})







module.exports = router;