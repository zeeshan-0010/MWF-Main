import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type ActivityType = 'join' | 'profile_update' | 'post_update';

export async function logActivity(
  type: ActivityType,
  userId: string,
  userName: string,
  userPhoto?: string,
  details?: string
) {
  try {
    await addDoc(collection(db, 'activities'), {
      type,
      userId,
      userName,
      userPhoto: userPhoto || null,
      details: details || null,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}
