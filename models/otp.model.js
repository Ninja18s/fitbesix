const { model, Schema } = require("mongoose");
const otpSchema = new Schema({
    phone: {
        type: String,
    },
    otp: {
        type: String,
    },
    expireAt: {
        type: Date,
        default: new Date(new Date().getTime() + 90000)
    }

},
    { timestamps: true },
);
otpSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 1 });
module.exports = model("OTP", otpSchema);