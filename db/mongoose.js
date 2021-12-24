const { MONGODB_URI } = require("../config");

const mongoose = require('mongoose');




mongoose.connect(MONGODB_URI,
    { useNewUrlParser: true })
    .then(
        () => console.log('database successfully connected '))
    .catch(
        (err) => {
            console.log(err);
            process.exit(1);
        }
    );



