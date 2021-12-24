const { logger } = require('express-winston');
const { format, transports } = require('winston');
const { timestamp, combine, errors, json } = format;


function logs() {

    return logger({
        transports: [
            new transports.Console()
        ],
        format: combine(timestamp(), errors({ stack: false }), json())
        ,
        meta: false,

        msg: "HTTP  ",
        expressFormat: true,
        ignoreRoute: function (req, res) { return false; }
    });
}


module.exports = logs;