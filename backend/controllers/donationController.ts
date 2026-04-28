import Razorpay from 'razorpay';
import crypto from 'crypto';
import { adminDb } from '../config/firebase.js';

let rzp: any = null;

const getRazorpay = () => {
  if (!rzp && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return rzp;
};

export const createOrder = async (req, res) => {
  const { amount, currency = "INR", campaignId } = req.body;
  
  try {
    const razorpay = getRazorpay();
    
    if (!razorpay) {
      // Simulation mode
      return res.json({
        id: `order_sim_${Date.now()}`,
        amount: amount * 100,
        currency,
        simulation: true
      });
    }

    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: { campaignId }
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: "Failed to create donation order" });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationData } = req.body;
  
  try {
    // 1. Verify Signature
    if (process.env.RAZORPAY_KEY_SECRET) {
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ error: "Invalid payment signature" });
      }
    }

    // 2. Persist to Firestore
    const donationRef = adminDb.collection('donations').doc();
    await donationRef.set({
      ...donationData,
      id: donationRef.id,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: 'success',
      createdAt: new Date()
    });

    // 3. Update campaign progress if campaignId exists
    if (donationData.campaignId) {
      const campaignRef = adminDb.collection('campaigns').doc(donationData.campaignId);
      await adminDb.runTransaction(async (transaction) => {
        const campaignDoc = await transaction.get(campaignRef);
        if (campaignDoc.exists) {
          const currentAmount = campaignDoc.data()?.currentAmount || 0;
          transaction.update(campaignRef, {
            currentAmount: currentAmount + donationData.amount
          });
        }
      });
    }

    // 4. Create notification for community if not anonymous
    if (!donationData.isAnonymous) {
      await adminDb.collection('notifications').add({
        message: `${donationData.donorName} donated ₹${donationData.amount}!`,
        type: 'success',
        read: false,
        createdAt: new Date()
      });
    }

    res.json({ success: true, message: "Payment verified and recorded" });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ error: "Failed to record donation" });
  }
};
