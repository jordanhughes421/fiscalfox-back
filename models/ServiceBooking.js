const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
	// Client who made the service booking
	clientId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Client',
    	required: true
	},
	// Detailed description or identifier of the service requested
	serviceDetails: {
    	type: String,
    	required: true
	},
	// Client's preferred date and time for the service. This could be expanded to a range or multiple options based on requirements.
	preferredDate: {
    	type: Date,
    	required: true
	},
	// Status of the booking (e.g., Pending, Confirmed, Completed, Cancelled)
	status: {
    	type: String,
    	required: true,
    	enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    	default: 'Pending'
	},
	// Additional notes provided by the client about the service booking
	notes: {
    	type: String,
    	required: false
	}
}, { timestamps: true });

module.exports = mongoose.model('ServiceBooking', serviceBookingSchema);