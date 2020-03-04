//Declare Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

//Define your Schema
const reservationsSchema = new Schema(
	{
			firstName:
			{
				type: String,
				trim: true,
				maxlength: 30,
				validate(value){
					if(validator.isLength(value) > 30){
						throw new Error("Name too Long!")
					}
				}
			},
			lastName:
			{
				type: String,
				trim: true,
				maxlength: 30,
				validate(value){
					if(validator.isLength(value) > 30){
						throw new Error("Surname too Long!")
					}
				}
			},
			username:
			{
				type: String,
				required: true,
				trim: true,
				unique: true,
				maxlength: 30,
				validate(value){
					if(validator.isLength(value) > 10){
						throw new Error("Too many characters!")
					}
					if(!validator.isAlphanumeric(value)){
						throw new Error("Only Alphanumeric is allowed!")
					}
				}
			},
			status:
			{
				type: String,
				enum: ["reserved","completed", "declined"],
				default: "reserved"
			},
			model:
			{
				type: String,
				required: true 
			},
			make:
			{
				type: String,
				required: true
			}
	},
		{
			timestamp: true
		}	
	);

//Export the Model
module.exports = mongoose.model("Reservation", reservationsSchema);