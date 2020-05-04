const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("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");

const sendPaymentConfirmation = (email, amount, stripePaymentCode) => {

	const msg = {
		to: 'ggedanthony@gmail.com',
		from: 'test@example.com',
		subject: "WashMe Stripe Payment Confirmation",
		text: `You paid PHP ${amount} via Stripe payment. Your transaction code is ${stripePaymentCode}`,
		html: `<div>You paid PHP ${amount} via Stripe payment. Your transaction code is <strong>${stripePaymentCode}</strong></div>`,
	};
	sgMail.send(msg);

}

module.exports = {sendPaymentConfirmation}