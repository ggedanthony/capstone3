const Service = require("../models/services");
const express = require("express");
const auth = require("../middleware/auth"); 
const router = express.Router(); 



//create a service
router.post("/",auth,  async(req,res) => {
	const service = new Service(req.body);
	try{
		await service.save();
		res.send(service);
	}catch(e){
		console.log(e)
	}
})

//get all service
router.get("/",auth, async(req,res) => {
	let limit = 0;
	let skip = 0;

	if(req.query.limit){
		limit = parseInt(req.query.limit)
	}
	if(req.query.skip){
		skip = parseInt(req.query.skip)
	}

	try{
		if(!req.query.active){
			const services = await Service.find().limit(limit).skip(skip)
			const total = await Service.estimatedDocumentCount()
			res.send({services, total})
			console.log("no sort")
		}
			const active = await Service.find({active: req.query.active}).limit(limit).skip(skip)
			const total = await active.estimatedDocumentCount()
			res.send({active, total})
			console.log("with sort")

	}catch(e){
		console.log(e)
	}
})

//get all service active
router.get("/active", auth,async(req,res)=>{
	try{
		const service = await Service.find({active: true})
		res.send(service)
	}catch(e){
		console.log(e)
	}
})

//get all service for front page without auth
router.get("/front", async(req,res) => {
	try{
		const service = await Service.find({active: true})
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
router.delete("/:id",auth, async(req,res)=>{
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
router.patch("/resume/:id", async (req,res)=>{
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

//update a service
router.patch("/:id",auth, async(req,res)=>{

	const updates = Object.keys(req.body)
	const allowedUpdates = ["description", "price"]
	const isValidUpdates = updates.every(update => allowedUpdates.includes(update))
	if(!isValidUpdates){
		return res.status(400).send({error: "Invalid Update!"})
	}

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