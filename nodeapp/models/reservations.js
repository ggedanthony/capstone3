//Declare Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

//Define your Schema
const reservationsSchema = new Schema(
	{
			status:
			{
				type: String,
				enum: ["reserved","completed", "cancelled"],
				default: "reserved"
			},
			date:
			{
				type: String,
				required: true
			},
			time:
			{
				type: String,
				required: true
			},
			serviceId:
			{
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: "Service"
			},
			userId:
			{				
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: "User"
			},
			carId:
			{
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: "Car"
			},
	},
		{
			timestamp: true
		}	
	);




//Export the Model
module.exports = mongoose.model("Reservation", reservationsSchema);