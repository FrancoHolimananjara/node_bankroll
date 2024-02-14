const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            require: true
        },
        ofbankroll: {type: mongoose.Schema.Types.ObjectId, ref: "Bankroll"},
        ofsessions: [{type: mongoose.Schema.Types.ObjectId, ref: "Session"}],
        oftransactions: [{type: mongoose.Schema.ObjectId, ref: "Transaction"}]
    }, {
        collection: "users",
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema);
module.exports = User;