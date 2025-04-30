const verifyAccess = (roles ,req , res) => {
    
    return (req, res, next) => {
        if (!req.user || !req.user) {
            return res.status(401).json({ message: 'Unauthorized - No user data' });
        }
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    }
    
}

export default verifyAccess;