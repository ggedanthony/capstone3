const User = require("../models/users");
const express = require("express"); 
const router = express.Router(); 
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth")
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

//create a user
router.post("/", async (req,res) => {
	const user = new User(req.body);
	try{
		await user.save();
		res.send(user);
	}catch(e){
		console.log(e)
	}
})

//show all user
router.get("/",auth, async(req,res)=>{

	let limit = 0;
	let skip = 0;

	if(req.query.limit){
		limit = parseInt(req.query.limit)
	}
	if(req.query.skip){
		skip = parseInt(req.query.skip)
	}

	try{
		const users = await User.find().limit(limit).skip(skip)
		const total = await User.estimatedDocumentCount()
		res.send({users,total})
	}catch(e){
		console.log(e)
	}
})


//DISPLAY AN IMAGE
router.get("/:id/upload", async (req,res) => {
	try{
		const user = await User.findById(req.params.id)
		if(!user || !user.profPic){
			return res.send(404).send("Not found!")
		}
		res.set("Content-Type", "image/PNG")
		res.send(user.profPic);
	}catch(e){
		return res.status(500).send(e)
	}
})



//get one user
router.get("/:id",auth, async(req,res)=>{
	try{
		const user = await User.findById(req.params.id)
		res.send(user)
	}catch(e){
		console.log(e)
	}
})


//get logged in user
router.get("/profile", auth, async (req,res)=>{
	try{
	res.send(req.user)
	res.send(req.token)
	}catch(e){
		console.log(e)
	}
})

//login
router.post("/login", async(req,res) => {
	try{
		const user = await User.findOne({$or: [{email: req.body.email},{username: req.body.email}]});

		if(!user){
			return res.status(404).send({"message": "User doesn`t exist!"})
		}
		if(!user.active){
			return res.status(404).send({"message": "Account is deactivated!"})
		}
		const isMatch = await bcrypt.compare(req.body.password, user.password);

		if(!isMatch){
			return res.status(499).send({"message": "Invalid Log In Credentials!"})
		}	
		const token = await user.generateAuthToken();
		res.send({user,token})
		// console.log("this is the user",user)
	}catch(e){
		console.log(e)
	}
})

//logout
router.post('/logoutAll', async(req,res) => {
	try{
		// console.log(req.member);
		req.user.tokens.splice(0);
		await req.user.save();
		res.send("You've been successfully logged out of all devices")
	}catch(e){
		res.status(500).send(e)
	}
})

router.delete("/:id",auth, async(req,res)=>{
	try{
		const user = await User.findByIdAndUpdate(req.params.id, {active: false}, {new: true} )
		if(!user){
			return res.status(404).send("No User Found!")
		}	
		res.send(user)
	}catch(e){
		console.log(e)
	}
})

//Activating an inactive service
router.patch("/:id", async (req,res)=>{
		try{
		const user = await User.findByIdAndUpdate(req.params.id, {active: true}, {new: true} )
		if(!user){
			return res.status(404).send("No User Found!")
		}	
		res.send(user)
	}catch(e){
		console.log(e)
	}
})

//update user profile
router.patch("/update/:id", auth, async (req,res)=>{
	const updates = Object.keys(req.body)
	// console.log(updates)
	const allowedUpdates = ["firstName", "lastName", "username", "email", "contact"]
	// console.log(allowedUpdates)
	const isValidUpdates = updates.every(update => allowedUpdates.includes(update))
	if(!isValidUpdates){
		return res.status(400).send({error: "Invalid Update!"})
	}
	try{
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
		if(!user){
			return res.status(404).send("Can`t find the User!")
		}
		res.send(user)
	}catch(e){
		console.log(e)
	}
})


router.post("/upload/:id", auth, upload.single("upload"), async (req,res) => {

	const user = await User.findById(req.params.id)

	const buffer = await sharp(req.file.buffer).resize({
		width: 300,
		height: 300
	}).png().toBuffer();
	user.profPic = buffer;
	await user.save();
	res.send(user);
},(error, req,res,next) => {
	res.status(400).send({error: error.message})
})



module.exports = router;