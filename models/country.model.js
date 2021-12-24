const { model, Schema } = require("mongoose");

const countrySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,

        },

        code: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            sparse: true,
        },
        flag: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = model("Country", countrySchema);