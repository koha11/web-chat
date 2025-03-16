const jwt = require('jsonwebtoken');

verifyToken = (req, res, next) => {
  let token;
  try {
    token =
      req.cookies.access_token || req.headers['authorization'].split(' ')[1];
  } catch {
    token = null;
  }

  if (!token) {
    res.locals._user = {};
    res.json({
      status: 0,
      message: 'Không có quyền truy cập',
    });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: err.toString(),
      });
    }
    res.locals._user = decoded;
    next();
  });
};

module.exports = {
  verifyToken,
};
