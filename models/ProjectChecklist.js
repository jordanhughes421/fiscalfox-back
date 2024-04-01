const mongoose = require('mongoose');

const projectChecklistSchema = new mongoose.Schema({
	projectId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Project',
    	required: true
	},
	templateId: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'ChecklistTemplate',
    	required: true
	},
	completedItems: [{
    	itemId: mongoose.Schema.Types.ObjectId,
    	completed: {
        	type: Boolean,
        	default: false
    	}
	}],
	status: {
    	type: String,
    	required: true,
    	enum: ['Incomplete', 'Complete'],
    	default: 'Incomplete'
	}
}, { timestamps: true });

module.exports = mongoose.model('ProjectChecklist', projectChecklistSchema);