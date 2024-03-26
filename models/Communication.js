const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    client: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Client', 
        required: true 
    },
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project'
    },
    to: { 
        type: String, 
        required: true 
    },
    from: { 
        type: String, 
        required: true 
    },
    details: { 
        type: String, 
        required: true 
    }
});

module.exports = mongoose.model('Communication', communicationSchema);
