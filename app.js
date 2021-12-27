const express = require("express");
const cors = require("cors");
require("dotenv").config();
const logs = require('./utils/logger/logs')
const logger = require('./utils/logger');
const fixResponse = require('./utils/responseBody');


const { PORT, MONGODB_URI, NODE_ENV, ORIGIN } = require("./config.js");

//db connection
require('./db/mongoose');

// routes
const authRoutes = require("./router/auth.route");
const countryRoutes = require('./router/country.route');


// init express app
const app = express();

// middlewares



app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.use(logs())


// index route

app.get("/", (req, res) => {
  res.status(200).json({
    type: "success",
    message: "server is up and running",
    data: null,
  });
});

// routes middlewares

const messageMap = {

  1: "success",

  0: "failed"

}



app.use("*", fixResponse)


app.use("/api/auth", authRoutes);
app.use("/api/country", countryRoutes);



// page not found error handling  middleware


app.use("*", (req, res, next) => {
  const error = {
    status: 404,
    message: "API_ENDPOINT_NOT_FOUND_ERR",
  };
  logger.error(error);
  next(error);
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({

    status: err.status || 500,
    resCode: 1,
    msg: err.message,
    message: 'FAILED'

  })
})



app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

