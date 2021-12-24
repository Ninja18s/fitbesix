const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")


const {

  doRegister,
  thirdpartyLogin,
  sendOtp,
  login
} = require("../controller/auth.controller");

router.post("/sendOtp", sendOtp);

router.put("/login", login);



router.put("/create", authMiddleware, doRegister);

router.post("/thirdPartyLogin", thirdpartyLogin);


module.exports = router;