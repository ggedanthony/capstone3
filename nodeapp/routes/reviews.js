const Review = require("../models/reviews");
const express = require("express"); 
const router = express.Router();
const auth = require("../middleware/auth");



router.post("/",auth, async(req,res) => {
	const review = new Review(req.body);
	try{
		await review.save();
		res.send(review);
	}catch(e){
		console.log(e)
	}
})

router.get("/all", async(req,res) => {
	try{
		const review = await Review.find().populate({
			path: 'userId',
			model: 'User'
		})
		res.send(review)
	}catch(e){
		console.log(e)
	}
})

router.delete("/:id", auth, async(req,res)=>{
	try{
		const review = await Review.findByIdAndDelete(req.params.id)
		if(!review){
			return res.status(404).send("No Review Found!")
		}
		res.send(review)
	}catch(e){
		console.log(e)
	}
})

module.exports = router;