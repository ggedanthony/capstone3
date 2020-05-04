const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const connectToRemoteDB = require("./config/db");


//connect to local
// mongoose.connect("mongodb://localhost:27017/mern_cap3", {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// 	useCreateIndex: true,
// 	useFindAndModify: false
// });
// mongoose.connection.once("open", ()=> {
// 	console.log("Now connected to local MongoDB");
// })

// 	connect to remote DB
connectToRemoteDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//declare Models
// const User = require("./models/users");
// const Service = require("./models/services");
// const Reservation = require("./models/reservations");
// const Car = require("./models/cars");



//declare resources
const usersRoute = require("./routes/users");
app.use("/users", usersRoute);
const servicesRoute = require("./routes/services");
app.use("/services", servicesRoute);
const reservationsRoute = require("./routes/reservations");
app.use("/reservations", reservationsRoute);
const carsRoute = require("./routes/cars");
app.use("/cars", carsRoute);
const reviewsRoute = require("./routes/reviews");
app.use("/reviews", reviewsRoute);
const paymentsRoute = require("./routes/payments");
app.use("/payments", paymentsRoute);


const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`Now listening to port ${port}`)
})