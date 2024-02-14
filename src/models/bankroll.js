const mongoose = require('mongoose');

const bankrollSchema = new mongoose.Schema(
    {
        typeOfgame: {
            type: String,
            required: true,
            default: "Poker"
        },
        bank: {
            type: Number,
            required: true,
            default: 0
        },
        of: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
    }, {
        collection: "bankrolls",
        timestamps: true
    }
)

const Bankroll = mongoose.model("Bankroll", bankrollSchema);
module.exports = Bankroll;