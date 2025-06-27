import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret-key';

export function ensureAuthenticated(returnJson = false) {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }

        if (returnJson) {
            return res.status(401).json({ error: 'Authentication required' });
        } else {
            return res.redirect('/');
        }
    };
}

export function ensureJWTAuthenticated() {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'JWT token required' });
        }
        
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
}
