import jwt from "jsonwebtoken";

export const ensureAuthentication = (req, res, next) => {
  try {
    // Get Authorization header (lowercase key)
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Check if it starts with "Bearer "
    // const tokenParts = authHeader.split(" ");
    // if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    //   return res.status(401).json({ message: "Invalid token format" });
    // }

    // const token = tokenParts[1]; // Extract actual token

    const token = authHeader;

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = decoded; // Attach decoded user data to request
      next();
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
