const { model, Schema } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,

    },

    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    countryCode: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      sparse: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('email is not valid');
        }
      }


    },
    role: {
      type: String,
      required: true,
      default: 'user'
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }],
    provider: {
      type: String,
      enum: ['default', 'Google', 'Apple'],
      required: true,
      default: 'default',
    },

  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this;

  const userObj = user.toObject();

  delete userObj.tokens;


  return userObj;
}
userSchema.methods.generateToken = async function () {
  const user = this;


  const token = jwt.sign({
    _id: user._id.toString(),
    role: user.role
  }, 'ice-cream', { expiresIn: 60 * 60 * 24 });

  user.tokens = user.tokens.concat({ token })


  await user.save();
  return token
}

module.exports = model("User", userSchema);