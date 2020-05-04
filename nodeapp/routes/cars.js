const Car = require("../models/cars");
const express = require("express"); 
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");


//UPLOADING A FILES
const upload = multer({
	// dest: "images/members",	
	limits: {
	 	fileSize: 1000000
	 },
	fileFilter(req, file, cb){
		if(!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)){
			return cb(new Error("Please upload an image only!"))
	}
		cb(undefined, true)
	}
})

//adding a car to a user
router.post("/", auth, async(req,res)=>{
	const car = new Car({
		...req.body,
		userId: req.user._id
	})
	try{
		await car.save();
		res.send(car)
	}catch(e){
		console.log(e)
	}
})

//DISPLAY AN IMAGE
router.get("/:id/upload", async (req,res) => {
	try{
		const car = await Car.findById(req.params.id)
		if(!car || !car.picture){
			return res.send(404).send("Not found!")
		}
		res.set("Content-Type", "image/PNG")
		res.send(car.picture);
	}catch(e){
		return res.status(500).send(e)
	}
})


//get cars of the user logged in
router.get("/:id", auth, async(req,res)=>{
	try{
		const car = await Car.findOne({userId: req.params.id})
		res.send(car)
	}catch(e){
		console.log(e)
	}
})


//delete a car
router.delete("/:id", auth, async(req,res)=>{
	try{
		const car = await Car.findByIdAndDelete(req.params.id)
		res.send(car)
	}catch(e){
		console.log(e)
	}
})

//update a car
router.patch("/:id", auth,async(req,res)=>{
	const updates = Object.keys(req.body)
	const allowedUpdates = ["make", "model", "color", "year"]
	const isValidUpdates = updates.every(update => allowedUpdates.includes(update))
	if(!isValidUpdates){
		return res.status(400).send({error: "Invalid Update!"})
	}
	try{
		const car = await Car.findByIdAndUpdate(req.params.id, req.body, {new: true})
		if(!car){
			return res.status(404).send("Can`t find Car!")
		}
		res.send(car)
	}catch(e){
		console.log(e)
	}
})




router.post("/upload/:id", auth, upload.single("upload"), async (req,res) => {

	const car = await Car.findById(req.params.id)

	const buffer = await sharp(req.file.buffer).resize({
		width: 300,
		height: 300
	}).png().toBuffer();
	car.picture = buffer;
	await car.save();
	// res.send({message: "All good"})
	res.send(car);
},(error, req,res,next) => {
	res.status(400).send({error: error.message})
})





module.exports = router;