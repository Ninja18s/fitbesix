exports.PORT = process.env.PORT || 3500;
exports.MONGODB_URI = "mongodb://tarun:tarun1234@cluster0-shard-00-00.6bbgt.mongodb.net:27017,cluster0-shard-00-01.6bbgt.mongodb.net:27017,cluster0-shard-00-02.6bbgt.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-j17m0b-shard-0&authSource=admin&retryWrites=true&w=majority";
exports.NODE_ENV = process.env.NODE_ENV || "development";

exports.ORIGIN = process.env.ORIGIN;
exports.JWT_key = process.env.JWT_key || 'this_is_secret';
exports.JWT_SECRECT_key = process.env.JWT_SECRECT_key || 'refresh-token'