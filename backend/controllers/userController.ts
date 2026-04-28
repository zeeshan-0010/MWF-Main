import { adminDb } from '../config/firebase.js';

export const syncUser = async (req, res) => {
  const { userData } = req.body;
  const { uid } = req.user;

  try {
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const isSuperAdmin = userData.email === 'shaikhzeeshan10zeeshan@gmail.com';
      await userRef.set({
        ...userData,
        uid,
        role: isSuperAdmin ? 'super_admin' : 'member',
        reputation: 0,
        createdAt: new Date()
      });
      return res.status(201).json({ message: 'User created', isNew: true });
    }

    // Update existing user info if needed
    await userRef.update({
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      email: userData.email || userDoc.data()?.email
    });

    res.json({ message: 'User synced', isNew: false });
  } catch (error) {
    console.error('Sync User Error:', error);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const snapshot = await adminDb.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
