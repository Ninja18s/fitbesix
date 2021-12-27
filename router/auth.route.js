const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")


const {

  doRegister,
  thirdpartyLogin,
  sendOtp,
  login,
  blacklist,
  doGenerateToken,
} = require("../controller/auth.controller");

router.post("/sendOtp", sendOtp);

router.put("/login", login);

router.post("/generateToken", doGenerateToken)


router.put("/updatePhone", authMiddleware, login)
router.put("/create", authMiddleware, doRegister);

router.post("/thirdPartyLogin", thirdpartyLogin);
router.post("/blacklist", blacklist);


module.exports = router;