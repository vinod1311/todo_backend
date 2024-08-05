const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

function extractToken(authorizationHeader) {
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1];
      return token;
  }
  return null;
}

verifyToken = (req, res, next) => {

  const token = extractToken(req.headers['authorization']);
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Unauthorized!",
                });
              }
              req.userId = decoded.id;
              next();
            });
};


const authJwt = {
  verifyToken,
};
module.exports = authJwt;
