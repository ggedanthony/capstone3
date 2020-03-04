const Reservation = require("../models/reservations");
const express = require("express"); 
const router = express.Router(); 



//create a reservation
router.post("/", async(req,res) => {
	const reservation = new Reservation(req.body);
	try{
		await reservation.save();
		res.send(reservation);
	}catch(e){
		console.log(e)
	}
})

//get all reservation
router.get("/", async(req,res) => {
	try{
		const reservation = await Reservation.find()
		res.send(reservation)
	}catch(e){
		console.log(e)
	}
})

//get one reservation
router.get("/:id", async (req,res) => {
	try{
		const reservation = await Reservation.findById(req.params.id);
		res.send(reservation)
	}catch(e){
		console.log(e)
	}
})


//Soft delete a reservation 
router.delete("/:id", async(req,res)=>{
	try{
		const reservation = await Reservation.findByIdAndDelete(req.params.id)
		if(!reservation){
			return res.status(404).send("No reservation Found!")
		}	
		res.send(reservation)
	}catch(e){
		console.log(e)
	}
})

//update a reservation
router.patch("/:id", async(req,res)=>{
	try{
		const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {new: true})
		if(!reservation){
			return res.status(404).send("Can`t find the reservation!")
		}
		res.send(reservation)
	}catch(e){
		console.log(e)
	}
})







module.exports = router;