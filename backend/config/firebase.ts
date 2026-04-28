import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import config to get correct project and database IDs
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig: any = {};

if (fs.existsSync(configPath)) {
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

if (!admin.apps.length) {
  try {
    // If we have a projectId in the config, use it. 
    // Otherwise try default initialization.
    if (firebaseConfig.projectId) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId
      });
      console.log(`Firebase Admin initialized with project: ${firebaseConfig.projectId}`);
    } else {
      admin.initializeApp();
      console.log("Firebase Admin initialized with default credentials");
    }
  } catch (error) {
    console.error("Firebase Admin initialization failed:", error);
  }
}

export const adminAuth = getAuth();

// CRITICAL: Must use the specific databaseId from the applet config
export const adminDb = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(firebaseConfig.firestoreDatabaseId)
  : getFirestore();
