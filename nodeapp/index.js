const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const connectToRemoteDB = require("./config/db");


//connect to local
mongoose.connect("mongodb://localhost:27017/mern_cap3", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
mongoose.connection.once("open", ()=> {
	console.log("Now connected to local MongoDB");
})

//connect to remote DB
// connectToRemoteDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//declare Models
const User = require("./models/users");
const Services = require("./models/services");
const Reservations = require("./models/reservations");



//declare resources
const usersRoute = require("./routes/users");
app.use("/users", usersRoute);
const servicesRoute = require("./routes/services");
app.use("/services", servicesRoute);
const reservationsRoute = require("./routes/reservations");
app.use("/reservations", reservationsRoute);



const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Now listening to port ${port}`)
})