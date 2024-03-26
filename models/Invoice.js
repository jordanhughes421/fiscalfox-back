const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
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
    details: { 
        type: String, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    paid: { 
        type: Boolean, 
        required: true, 
        default: false 
    },
    datePaid: { 
        type: Date 
    }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
