const User = require("../models/users");
const express = require("express"); 
const router = express.Router(); 
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth")

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
router.get("/", async(req,res)=>{
	try{
		const user = await User.find()
		res.send(user)
	}catch(e){
		console.log(e)
	}
})

//get one user
router.get("/:id", async(req,res)=>{
	try{
		const user = await User.findById(req.params.id)
		res.send(user)
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
		const isMatch = await bcrypt.compare(req.body.password, user.password);

		if(!isMatch){
			return res.status(499).send({"message": "Invalid Log In Credentials!"})
		}	
		const token = await user.generateAuthToken();
		res.send({user,token})
	}catch(e){
		console.log(e)
	}
})







module.exports = router;