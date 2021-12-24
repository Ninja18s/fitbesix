const express = require("express");
const router = express.Router();

const { addCountryDetails, getCountryDetails } = require('../controller/country.controller')

router.post('/add', addCountryDetails)

router.get('/get', getCountryDetails)

module.exports = router