const { model, Schema } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { JWT_SECRECT_key, JWT_key } = require("../config");
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

    token: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      enum: ['default', 'Google', 'Apple'],
      required: true,
      default: 'default',
    },
    isBlacklisted: {
      type: Boolean,
      default: false
    }
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
  }, JWT_key, { expiresIn: '1d' });

  user.token = token


  await user.save();
  return token
}
userSchema.methods.generateRefreshToken = async function () {
  const user = this;


  const refreshToken = jwt.sign({
    _id: user._id.toString(),
    role: user.role
  }, JWT_SECRECT_key, { expiresIn: '1y' });


  return refreshToken;
}
//--watch this______----IMPORTANT---
userSchema.statics.verifyRefreshToken = async function (refreshToken) {


  const dedcoded = jwt.verify(refreshToken, JWT_SECRECT_key);
  if (!dedcoded) {
    const error = {
      resCode: 1,
      msg: 'token expired'
    }
    throw new Error(error);
  }
  const userId = dedcoded._id;

  return userId



}

module.exports = model("User", userSchema);