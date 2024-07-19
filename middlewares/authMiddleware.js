import jwt from "jsonwebtoken";

export const requireSigninController = async (req, res, next) => {
  try {
    const decodeObj = jwt.verify(req.headers.authorization, process.env.JWTKEY);
    req.user = decodeObj;
    next();
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
    });
  }
};
