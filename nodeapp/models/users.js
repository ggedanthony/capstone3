//Declare Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new Schema(
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
				// index: true,
				maxlength: 10,
				validate(value){
					if(validator.isLength(value) > 10){
						throw new Error("Too many characters!")
					}
					if(!validator.isAlphanumeric(value)){
						throw new Error("Only Alphanumeric is allowed!")
					}
				}
			},
			role:
			{
				type: String,
				enum: ["admin","user"],
				default: "user"
			},
			email:
			{
				type: String,
				required: true,
				trim: true,
				unique: true,
				validate(value){
					if(!validator.isEmail(value)){
						throw new Error("Invalid Email!");
					}
				}
			},
			contact:
			{
				type: String,
				required: true,
				validate(value){
					if(validator.isLength(value) === 11){
						throw new Error("Invalid Number!")
					}
				}
			},
			birthday:
			{
				type: String,
				required: true
			},
			password:
			{
				type: String,
				required: true,
				minlength: [8, "Password Too Weak!"]
			},
			active:
			{
				type: Boolean,
				required: true,
				default: true
			},
			profPic:
			{
				type: Buffer,
				default: undefined
			},
			tokens: 
			[
				{
					token: {
						type: String,
						required: true
					}
				}
			]
		},
		{
			timestamp: true
		}	
	);

userSchema.pre("save", async function (next){
	const user = this
	if(user.isModified('password')){
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt)
	}
	next();
})



userSchema.methods.generateAuthToken = async function(){
	const user = this
	const token = jwt.sign({_id: user._id.toString()}, "secret", {expiresIn: '5 days'})

	//saving token to db
	user.tokens = user.tokens.concat({token})
	await user.save();
	return token;
}

userSchema.methods.toJSON = function() {
	const user = this
	const userObj = user.toObject();

	delete userObj.password;
	delete userObj.tokens;
	// delete userObj.profPic;
	return userObj;
}

//SET THE RELATIONSHIP BETWEEN User AND reservation
userSchema.virtual("reservations", {
	ref: "Reservation", 
	localField: "_id",
	foreignField: "userId"
})

//SET THE RELATIONSHIP BETWEEN User AND reservation
userSchema.virtual("cars", {
	ref: "Car", 
	localField: "_id",
	foreignField: "userId"
})

//SET THE RELATIONSHIP BETWEEN User AND reservation
userSchema.virtual("reviews", {
	ref: "Review", 
	localField: "_id",
	foreignField: "userId"
})

userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);
module.exports = User;
