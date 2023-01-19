const jwt = require("jsonwebtoken");
const { response } = require("../helper/response");
const { TOKEN_SERVICE } = require("../pkg/dotenv");

const midBearerToken = (req, res, next) => {
  const token = req.headers.authorization;

  try {
    let decoded = jwt.verify(token, TOKEN_SERVICE);
    req.user = decoded?.data[0];
    next();
  } catch (error) {
    console.log(error);
    if (error?.name === "TokenExpiredError") {
      response(res, {
        code: 401,
        message: "Your session expired",
      });
      return;
    }
    response(res, {
      code: 500,
      message: "Invalid token",
    });
  }
};

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = {
  midBearerToken,
  verifyToken,
};
