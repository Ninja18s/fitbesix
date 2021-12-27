

const MESSAGE = {
    "LOGGED_IN": ["تسجيل الدخول بنجاح", "successfully logged in"],
    "OTP_SENT": ["OTP إرسالها بنجاح ", "otp sent successfully "],
    "MISSING_PHONE": ["يرجى تسجيل رقم هاتف", "please register a phone number "],
    "MISSING_EMAIL": ["يرجى تسجيل عنوان بريد إلكتروني", "please register a email address "],
    "INCORRECT_OTP": ["OTP غير صحيحة", "incorrect otp "],
    "INCORRECT_PHONE": ["رقم هاتف غير صحيح", "incorrect phone number"],
    "SUCCESS_EMAIL": ["تم تسجيل البريد الإلكتروني بنجاح", "email successfully  registered "],
    "SUCCESS_PHONE": ["الهاتف المسجلة بنجاح", "phone successfully registered "],
    "USER_NOT_FOUND": ["لم يتم العثور على المستخدم", "user not found"],
    "SUCCESS_USER": ["تم إنشاء المستخدم بنجاح", "user successfully created "],
    "SUCCESS": ["تم بنجاح", "successfully done -EN"],
    "UPDATE_PHONE": ["رقم الهاتف الذي تم تحديثه بنجاح", "update phone number successfully updated "],
    "EXIST_PHONE": ["رقم الهاتف موجود بالفعل حاول واحد آخر", "phone number already exists try another one"],
    "FAILED": ["فشل", "failed"],
    "EXIST_EMAIL": ["البريد الإلكتروني موجود بالفعل حاول آخر واحد", "email already exists try another one"]
}

exports.languageFlag = (message, languageCode) => {

    const msgArray = MESSAGE[message];
    return msgArray[languageCode];
}

