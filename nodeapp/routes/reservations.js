const Reservation = require("../models/reservations");
const { ObjectId } = require("mongodb")
const express = require("express"); 
const router = express.Router();
const auth = require("../middleware/auth");



//create a reservation
router.post("/",auth, async(req,res) => {

	// const serviceId = ObjectId(req.body.serviceId)
	// const carId = ObjectId(req.body.carId)
	
	// console.log("reservation body",req.body)
	const reservation = new Reservation({
		...req.body,
		userId: req.user._id
	});
	try{
		await reservation.save();
		res.send(reservation);
	}catch(e){
		console.log(e)
	}
})

//get all reservation
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
		const reservation = await Reservation.find().populate({
			path: 'userId',
			select: 'username'
		}).populate({
			path: 'serviceId',
			model: 'Service'
		}).populate({
			path: 'carId',
			model: 'Car'
		}).limit(limit).skip(skip)
		const total = await Reservation.estimatedDocumentCount()
		
		res.send({reservation, total})
	}catch(e){
		console.log(e)
	}
})

//get one reservation
router.get("/:id",auth, async (req,res) => {

	try{
		const reservation = await Reservation.findById(req.params.id)
		res.send(reservation)
	}catch(e){
		console.log(e)
	}
})

router.delete("/cancel/:id", auth, async (req,res) =>{
	try{
		const reservation = await Reservation.findByIdAndUpdate(req.params.id, {status: "cancelled"}, {new: true})
		res.send(reservation)
	}catch(e){
		console.log(e)
	}
})

//get all reservation of the user logged in
router.get("/history/:id", auth, async (req, res) => {
	let limit = 0;
	let skip = 0;

	if(req.query.limit){
		limit = parseInt(req.query.limit)
	}
	if(req.query.skip){
		skip = parseInt(req.query.skip)
	}
	try{
		const reservation = await Reservation.find({userId: req.params.id}).populate({
			path: 'userId',
			model: 'User'
		}).populate({
			path: 'carId',
			model: 'Car'
		}).populate({
			path: 'serviceId',
			select: 'name' 
		}).limit(limit).skip(skip)
		const total = await Reservation.estimatedDocumentCount()
		res.send({reservation,total})
	}catch(e){
		console.log(e)
	}
})



//Soft delete a reservation 
// router.patch("/:id",auth,  async(req,res)=>{
// 	try{
// 		const reservation = await Reservation.findByIdAndUpdate(req.params.id, {status: "cancelled" }, {new: true})
// 		if(!reservation){
// 			return res.status(404).send("No reservation Found!")
// 		}	
// 		res.send(reservation)
// 	}catch(e){
// 		console.log(e)
// 	}
// })

//update a reservation
// router.patch("/:id",auth, async(req,res)=>{
// 	try{
// 		const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {new: true})
// 		if(!reservation){
// 			return res.status(404).send("Can`t find the reservation!")
// 		}
// 		res.send(reservation)
// 	}catch(e){
// 		console.log(e)
// 	}
// })





module.exports = router;