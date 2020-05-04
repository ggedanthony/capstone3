//Declare Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

//Define your Schema
const reviewsSchema = new Schema(
	{
			review:
			{
				type: String,
				required: true
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


module.exports = mongoose.model("Review", reviewsSchema);