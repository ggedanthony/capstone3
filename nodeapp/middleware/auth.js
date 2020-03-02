const jwt = require("jsonwebtoken");
const User = require("../models/users");

const auth = async (req,res,next) => {
	try{

		const token = req.header("Authorization").replace("Bearer ", "")
		const decoded = jwt.verify(token, "secret")
		const user = await User.findOne({_id: decoded._id, "tokens.token": token})
		if(!user){
			throw new Error("user Doesn`t Exist")
		}
		req.user = user
		req.token = token
		next()
	}catch(e){
		res.status(401).send({"message": "Please authenticate!"})
	}
}

module.exports = auth