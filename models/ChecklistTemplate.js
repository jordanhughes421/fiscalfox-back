const mongoose = require('mongoose');

const checklistTemplateSchema = new mongoose.Schema({
	name: {
    	type: String,
    	required: true
	},
	items: [{
    	description: String,
    	required: Boolean
	}],
	category: {
    	type: String,
    	required: true
	}
}, { timestamps: true });

module.exports = mongoose.model('ChecklistTemplate', checklistTemplateSchema);