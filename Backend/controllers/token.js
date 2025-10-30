import jwt from 'jsonwebtoken';

const genToken = async (userId) => {
    try {
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });                                                                  // We generate a JWT token with the userId as payload, using a secret key from environment variables, and set it to expire in 7 days.
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
    }
}

export default genToken;