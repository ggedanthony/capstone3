//Declare Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

//Define your Schema
const servicesSchema = new Schema(
		{
			name:
			{
				type: String,
				required: true
			},
			price:
			{
				type: Number,
				required: true

			},
			description:
			{
				type: String,
				required: true,
				maxlength:1000,
				required: true
				
			},
			time:
			{
				type: String,
				required: true
			},
			active:
			{
				type: Boolean,
				default: true
			}		
	},
	{
		timestamp: true
	}
	);

//SET THE RELATIONSHIP BETWEEN User AND reservation
servicesSchema.virtual("reservations", {
	ref: "Reservation", 
	localField: "_id",
	foreignField: "serviceId"
})


//Export the Model
module.exports = mongoose.model("Service", servicesSchema);