import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET);
}

export default generateToken;
