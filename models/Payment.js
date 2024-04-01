const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
	invoiceId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Invoice',
    	required: true
	},
	amount: {
    	type: Number,
    	required: true
	},
	date: {
    	type: Date,
    	required: true
	},
	method: {
    	type: String,
    	required: true,
    	enum: ['Credit Card', 'Bank Transfer', 'PayPal', 'Cash']
	},
	status: {
    	type: String,
    	required: true,
    	enum: ['Pending', 'Completed', 'Failed'],
    	default: 'Pending'
	}
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);