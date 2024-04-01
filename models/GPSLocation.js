const mongoose = require('mongoose');

const gpsLocationSchema = new mongoose.Schema({
	userId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'User',
    	required: true
	},
	latitude: {
    	type: Number,
    	required: true
	},
	longitude: {
    	type: Number,
    	required: true
	}
}, { timestamps: true });

module.exports = mongoose.model('GPSLocation', gpsLocationSchema);