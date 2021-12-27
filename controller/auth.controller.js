const User = require("../models/user.model");
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = "703025992612-m9i8pf8k29hvfua833srl8cmo4rtp3bt.apps.googleusercontent.com"
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');


const { sendOtp, verifyOtp } = require("../utils/twilioOtp");

exports.sendOtp = async (req, res, next) => {
  const { phone, countryCode } = req.body;

  try {
    if (!(phone && countryCode)) {
      throw new Error("missing field");
    }
    await sendOtp(countryCode + phone);



    return res.status(200).json({
      resCode: 0,
      message: "OTP_SENT",


      screenId: 15,

    });


  } catch (error) {
    logger.error(error);
    next(error);
  }
}

exports.login = async (req, res, next) => {

  const { phone, countryCode, otp } = req.body

  try {
    if (!(phone && countryCode && otp)) {
      throw new Error("missing field");
    }
    const verified = await verifyOtp(countryCode + phone, otp);
    if (!(verified == "approved")) {

      return res.status(403).json({
        resCode: 1,
        message: "INCORRECT_OTP",

      })

    }

    if (req.body.email) {
      const user = await User.findOneAndUpdate({ email: req.body.email }, { phone, countryCode });
      if (!user) {

        return res.status(500).json({
          resCode: 0,
          message: "USER_NOT_FOUND",

        })

      }
      const token = await user.generateToken();
      const refreshToken = await user.generateRefreshToken();

      return res.status(201).json({
        resCode: 0,
        message: "SUCCESS_PHONE",

        userId: user._id,
        token,
        refreshToken,
        screenId: 16


      })
    }
    if (req._id) {
      const checkUser = await User.findOne({ phone });
      if (checkUser) {
        return res.status(200).json({
          resCode: 1,
          message: "EXIST_PHONE",
          screenId: 15
        })
      }
      const user = await User.findOneAndUpdate({ _id: req._id }, { phone, countryCode }, { new: true });
      if (!user) {
        throw new Error('something went wrong')
      }
      return res.status(200).json({
        resCode: 0,
        message: "UPDATE_PHONE",

        userId: user._id,
        screenId: 16

      })
    }
    const createUser = await User.findOneAndUpdate({ phone: phone },
      { countryCode: countryCode }, { upsert: true, new: true });
    if (!createUser) {
      throw new Error('something went wrong');
    }

    const token = await createUser.generateToken();
    const refreshToken = await createUser.generateRefreshToken();
    if (!(createUser.email && createUser.name)) {

      return res.status(200).json({
        resCode: 0,
        token,
        refreshToken,
        screenId: 18,
        message: "MISSING_EMAIL"
      })

    }

    return res.status(200).json({
      resCode: 0,
      token: token,
      refreshToken,
      screenId: 16,
      message: "LOGGED_IN"
    })


  } catch (error) {
    logger.error(error);
    next(error)
  }
}

// todo:create new user ------------------------
exports.doRegister = async (req, res, next) => {

  const updates = Object.keys(req.body);
  try {
    const checkExist = await User.findOne({ email: req.body.email });
    if (checkExist) {
      return res.status(403).json({
        resCode: 1,
        message: "EXIST_EMAIL"
      })

    }
    const user = await User.findOne({ _id: req._id })
    if (!user) {
      throw new Error("User not found ");
    }
    updates.forEach((update) => {
      (user[update] = req.body[update])
    });

    const updatedUser = await user.save();
    if (!updatedUser) {
      throw new Error('something went wrong');
    }

    return res.status(201).json({
      resCode: 0,
      message: "SUCCESS_USER",

      user,
      screenId: 16,

    })


  } catch (error) {
    logger.error(error);
    next(error)
  }
}

exports.doGenerateToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  const userId = await User.verifyRefreshToken(refreshToken);
  const user = await User.findById(userId);
  const token = await user.generateToken();
  const refToken = await user.generateRefreshToken();
  return res.status(200).json({
    resCode: 0,
    userId: user._id,
    token,
    refreshToken: refToken,
    message: "SUCCESS",
    screenId: 16
  })
}

//todo: third party login ----------------------------------------------------------------
const client = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys'
});

function getAppleKey(kid) {
  return new Promise((resolve, reject) => {

    client.getSigningKey(kid, (err, key) => {

      if (err) {
        reject(err);
      }
      const signingKey = key.getPublicKey();
      resolve(signingKey);
    })
  })
}

function verifyJWT(token, appleKey) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, appleKey, (err, payload) => {
      if (err) {
        reject(err);
      }
      resolve(payload);
    })
  })
}

exports.thirdpartyLogin = async (req, res, next) => {
  const { provider } = req.body;


  try {
    if (provider == "Google") {


      const client = new OAuth2Client(CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: req.body.token,

      });
      const payload = ticket.getPayload();
      //check user exist or not ..----------------------------------------------------------------


      const createUser = await User.findOneAndUpdate({ email: payload.email }, {
        name: payload.name,
        provider: 'Google'
      }, { upsert: true, new: true });


      if (!createUser) {
        throw new Error('something went wrong');
      }

      if (!createUser.phone) {

        return res.status(200).json({
          resCode: 0,
          message: "MISSING_PHONE",

          userId: createUser._id,
          screenId: 15,


        })


      }

      const token = await createUser.generateToken();
      const refreshToken = await createUser.generateRefreshToken();



      return res.status(200).json({
        resCode: 0,
        message: "LOGGED_IN",

        userId: createUser._id,
        screenId: 16,
        token,
        refreshToken,

      })

    }

    else if (provider == 'Apple') {
      const idToken = req.body.token;
      if (!idToken) {
        throw new Error('missing token');
      }

      const decoded = jwt.decode(idToken, { complete: true });

      const kid = decoded.header.kid;
      const appleKey = await getAppleKey(kid);
      if (!appleKey) {
        throw new Error('something went wrong')
      }
      const payload = await verifyJWT(idToken, appleKey);
      if (!payload) {
        throw new Error('Invalid token received');
      }

      const createUser = await User.findOneAndUpdate({ email: payload.email },
        { name: req.body.name, provider: 'Apple' },

        { upsert: true, new: true }
      );
      if (!createUser) {
        throw new Error('something went wrong');
      }
      if (!createUser.phone) {
        return res.status(200).json({
          resCode: 0,
          message: "MISSING_PHONE",

          userId: createUser._id,
          screenId: 15,


        })

      }
      const token = await createUser.generateToken();
      const refreshToken = await createUser.generateRefreshToken();

      return res.status(200).json({
        resCode: 0,
        message: "LOGGED_IN",

        userId: createUser._id,
        screenId: 16,
        token,
        refreshToken

      })


    }



  } catch (error) {
    logger.error(error);
    next(error);

  }
}

exports.blacklist = async (req, res, next) => {
  try {
    const { email, phone } = payload;
    const user = await User.findOne({ $or: [{ email: email }, { phone: phone }] });
    if (!user) {
      throw `user with email: ${email}  or phoneNumber: ${phone} cannot be found`;
    }
    user.isBlacklisted = !user.isBlacklisted;
    await user.save()
    return res.status(200).json({
      resCode: 0,
      message: "Blacklisted",
      userId: createUser._id,
      screenId: 16,
      token
    })


  } catch (error) {
    next(error)

  }

}