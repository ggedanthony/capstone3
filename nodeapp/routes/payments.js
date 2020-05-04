const express = require('express')
const router = express.Router();
const stripe = require('stripe')('sk_test_nJhBnThR8Nns9SVZRwJcq8VB00D7QoYLdz');
const sendgrid = require('../middleware/sendgrid.js');


const stripeChargeCallback = res => (stripeErr, stripeRes) => {
		if(stripeErr){
			res.status(500).send({error: stripeErr});
		} else {
			sendgrid.sendPaymentConfirmation(stripeRes.email,stripeRes.amount,stripeRes.id)
			res.status(200).send({success: stripeRes});
		}
};

router.post("/", (req,res) => {
		const body = {
			source: req.body.token.id,
			amount: req.body.amount,
			email: req.body.email,
			currency: "PHP"
		};
		stripe.charges.create(body, stripeChargeCallback(res));
});



module.exports = router