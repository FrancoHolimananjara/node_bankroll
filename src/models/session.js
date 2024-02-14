const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        },
        buyin: {
            type: Number,
            required: true
        },
        buyout: {
            type: Number,
            required: true
        },
        place: {
            type: String,
            required: true
        },
        of: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    }, {
        collection: "sessions",
        timestamps: true
    }
)

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;