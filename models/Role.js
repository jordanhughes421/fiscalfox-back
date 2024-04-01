const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	permissions: [{
    	type: String,
    	required: true
	}] // This array could list the permissions this role has, e.g., ['create_project', 'view_financials']
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);