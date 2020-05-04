//Declare Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

//Define your Schema
const carsSchema = new Schema(
	{
			make:
			{
				type: String,
				required: true
			},
			model:
			{
				type: String,
				required: true 
			},
			year:
			{
				type: String,
				required: true
			},
			color:
			{
				type: String,
				required: true
			},
			picture:
			{
				type: Buffer,
				default: undefined
			},
			userId:
			{				
				type: mongoose.Schema.Types.ObjectId,
				required: true,
				ref: "User"
			}
	},
		{
			timestamp: true
		}	
	);

carsSchema.virtual("services", {
	ref: "Reservation", 
	localField: "_id",
	foreignField: "carId"
})


//Export the Model
module.exports = mongoose.model("Car", carsSchema);