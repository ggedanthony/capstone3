const mongoose = require("mongoose");
const config = require("config");
const remoteDB = config.get("mongoURI");

const connectToRemoteDB = async () => {
	try{
		await mongoose.connect(remoteDB, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true
		})
		console.log("MongoDB Atlas is connected")
	}catch(e){
		console.log(e)
	}
}

module.exports = connectToRemoteDB