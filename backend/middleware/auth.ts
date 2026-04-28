import { adminAuth, adminDb } from '../config/firebase.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const roleMiddleware = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const userDoc = await adminDb.collection('users').doc(req.user.uid).get();
      const userData = userDoc.data();

      if (!userData || !roles.includes(userData.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Role Middleware Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};
