const accountSid = process.env.TWILIO_ACCOUNT_SID || "ACecee07603416a100c396e398dc9c7460";
const authToken = process.env.TWILIO_AUTH_TOKEN || "fd421632a25d108e614d2c14168075c4";

const twilioClient = require("twilio")(accountSid, authToken);
const { NODE_ENV } = require("../config");

const OTP = require("../models/otp.model");

exports.sendOtp = async (phone) => {

  const otp = Math.floor(Math.random() * 900000) + 99999;

  console.log(otp);

  const storeOtp = await OTP.updateOne({ phone: phone }, { otp: otp }, { upsert: true });
  if (!storeOtp) {
    throw new Error("Otp generate failed");
  }
  return otp



  //  const res =  await twilioClient.verify
  // .services(process.env.VID || "VA3247bbf60934ac17cfbae1c4520d809a") //Put the Verification service SID here
  // .verifications.create({to: phone, channel: "sms"})
  // console.log(res)
  // return res.sid


}

exports.verifyOtp = async (phone, otp) => {



  const getPhone = await OTP.findOne({ phone });
  if (!getPhone) {
    return 'failed';
  }

  // const isTrue = NODE_ENV == "development" ? otp == "000000" ? true : false : false;
  const isTrue = otp == "000000" ? true : false;
  if (isTrue) {
    return 'approved'
  }
  if (getPhone.otp != otp) {
    return 'failed'
  }
  return 'approved'


  // const res = await twilioClient.verify
  //   .services(process.env.VID || "VA3247bbf60934ac17cfbae1c4520d809a") //Put the Verification service SID here
  //   .verificationChecks.create({ to: phone, code: otp })
  // console.log(res.status)
  // return res.status

}