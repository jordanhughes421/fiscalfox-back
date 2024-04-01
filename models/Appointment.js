const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
	// Reference to the Project or Service this appointment is for
	projectId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Project',
    	required: false // Make required as true if every appointment must be associated with a project
	},
	// Client associated with the appointment
	clientId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Client',
    	required: true
	},
	// Employee or User assigned to the appointment
	employeeId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'User', // or Employee, if you have a separate model for employees
    	required: true
	},
	// Date and time details
	appointmentDate: {
    	type: Date,
    	required: true
	},
	startTime: {
    	type: Date,
    	required: true
	},
	endTime: {
    	type: Date,
    	required: true
	},
	// Status of the appointment (Scheduled, Completed, Cancelled, etc.)
	status: {
    	type: String,
    	required: true,
    	enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'], // Enum to restrict the status to specific values
    	default: 'Scheduled'
	},
	// Type of the appointment (Consultation, Installation, etc.)
	type: {
    	type: String,
    	required: true
	},
	// Optional location for the appointment, if applicable
	location: {
    	type: String,
    	required: false // Required based on the nature of your service/appointment
	},
	// Additional notes or details about the appointment
	notes: {
    	type: String,
    	required: false
	}
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);