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
			description:
			{
				type: String,
				required: true,
				maxlength:100,
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

//Export the Model
module.exports = mongoose.model("Services", servicesSchema);