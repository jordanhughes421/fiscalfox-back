const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String 
    }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
