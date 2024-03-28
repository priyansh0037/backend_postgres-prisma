import jwt from "jsonwebtoken";
import "dotenv/config";

export const authMiddleware = (req, res, next) => {
  
  const authHeaders = req.headers.authorization;


  // check for token    
  if (authHeaders == undefined || authHeaders == null) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authHeaders.split(" ")[1];
  console.log("token is",token)

  //   verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log("user is",user)
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
        error:err
      });
    }
    req.user = user;
    next();
  });
};
