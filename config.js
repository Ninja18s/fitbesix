exports.PORT = process.env.PORT || 3400;
exports.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";
exports.NODE_ENV = process.env.NODE_ENV || "development";

exports.ORIGIN = process.env.ORIGIN;
exports.JWT_key = process.env.JWT_key || 'this_is_secret';