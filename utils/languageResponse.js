

const MESSAGE = {
    "LOGGED_IN": ["successfully logged in-AR", "successfully logged in-EN"],
    "OTP_SENT": ["otp sent successfully -AR", "otp sent successfully -EN"],
    "MISSING_PHONE": ["please register a phone number -AR", "please register a phone number -EN"],
    "MISSING_EMAIL": ["please register a email address -AR", "please register a email address -EN"],
    "INCORRECT_OTP": ["incorrect otp -AR", "incorrect otp -EN"],
    "INCORRECT_PHONE": ["incorrect phone number-AR", "incorrect phone number-EN"],
    "SUCCESS_EMAIL": ["email successfully registered -AR", "email successfully  registered -EN"],
    "SUCCESS_PHONE": ["phone successfully registered -AR", "phone successfully registered -EN"],
    "USER_NOT_FOUND": ["user not found -AR", "user not found -EN"],
    "SUCCESS_USER": ["user successfully created -AR", "user successfully created -EN"],
    "SUCCESS": ["success -AR", "success -EN"],
    "UPDATE_PHONE": ["phone number successfully updated -AR", "update phone number successfully updated -EN"],

}

exports.languageFlag = (message, languageCode) => {

    const msgArray = MESSAGE[message];
    return msgArray[languageCode];
}

