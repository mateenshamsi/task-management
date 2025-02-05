const jwt = require('jsonwebtoken')

const isSignedIn = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token // Make sure the token is coming from cookies
    if (!token) {
      return res.status(401).json({ message: "Token Missing" }) // 401 is more appropriate for missing token
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY)
    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" })
    }

    req.userInfo = decoded // Attach the decoded user to the request object
    next() // Proceed to the next middleware or route handler
  } catch (err) {
    // If there is any error verifying the token
    return res.status(401).json({ message: "Token is not valid" })
  }
}

module.exports = isSignedIn
