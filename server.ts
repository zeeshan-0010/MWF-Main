import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Firebase Admin will be initialized here for server-side operations
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createOrder, verifyPayment } from './backend/controllers/donationController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3001;

  // Firebase Admin Setup
  if (getApps().length === 0) {
    initializeApp({
      // credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
    });
  }
  const db = getFirestore();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Mohania Welfare backend" });
  });

  // Razorpay Donation Routes
  app.post("/api/donations/create-order", createOrder);
  app.post("/api/donations/verify-payment", verifyPayment);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
