const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstName: { type: String, required: false }, // Optional based on your requirements
	lastName: { type: String, required: false }, // Optional based on your requirements
	companyName: { type: String, required: false }, // For users associated with a company
	profilePicture: { type: String, required: false }, // Could store a URL to the image
	role: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Role',
    	required: true
	}
}, { timestamps: true });
// Hash password before saving
UserSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
