const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect("mongodb://localhost:27017/mern_cap3", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
mongoose.connection.once("open", ()=> {
	console.log("Now connected to local MongoDB");
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//declare Models
const User = require("./models/users");



//declare resources
const usersRoute = require("./routes/users");
app.use("/users", usersRoute);







app.listen(4000, () => {
	console.log("Now listening to port 4000")
})