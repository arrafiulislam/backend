const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.js");

const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    try {
      // Get Token from Header
      token = authorization.split(" ")[1];

      // Verify token
      const { UserID } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Get User From Token
      req.user = await UserModel.findById(UserID).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .send({ status: "failed", message: "Unauthorized User" });
      }

      next();
    } catch (error) {
      console.log("Token verification error:", error);
      return res
        .status(401)
        .send({ status: "failed", message: "Unauthorized User" });
    }
  }

  if (!token) {
    return res.status(401).send({
      status: "failed",
      message: "Unauthorized User, No Token Provided",
    });
  }
};

module.exports = checkUserAuth;
