import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  IndianRupee, 
  ShieldCheck, 
  Heart, 
  Download,
  AlertCircle,
  CreditCard,
  Building,
  QrCode,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

interface DonationModalProps {
  campaign?: { id: string; title: string };
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'razorpay' | 'bank' | 'qr';

export default function DonationModal({ campaign, isOpen, onClose }: DonationModalProps) {
  const [user] = useAuthState(auth);
  const [amount, setAmount] = useState<string>('5000');
  const [cause, setCause] = useState<string>(campaign?.title || 'Education Support');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'success' | 'qr_view' | 'bank_view'>('details');
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const causes = [
    { id: 'education', label: 'Education Support' },
    { id: 'medical', label: 'Medical Emergency' },
    { id: 'women', label: 'Women Skill Fund' }
  ];

  const handleDonate = async () => {
    if (!amount || Number(amount) < 10) {
      alert("Please enter a valid amount (minimum ₹10)");
      return;
    }

    if (paymentMethod === 'qr') {
      setStep('qr_view');
      return;
    }

    if (paymentMethod === 'bank') {
      setStep('bank_view');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate Payment Process
      setTimeout(async () => {
        const mockPaymentId = `pay_${Math.random().toString(36).substring(7)}`;
        
        try {
          // Record to DB
          await addDoc(collection(db, 'donations'), {
            amount: Number(amount),
            donorName: name || user?.displayName || "Anonymous Donor",
            email: email || user?.email || "",
            cause: cause,
            campaignId: campaign?.id || null,
            donorId: user?.uid || null,
            status: 'completed',
            paymentMethod,
            paymentId: mockPaymentId,
            createdAt: serverTimestamp()
          });

          // Update user role to donor
          if (user) {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { role: 'donor' });
          }
            
          setPaymentId(mockPaymentId);
          setStep('success');
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'donations');
        } finally {
          setIsProcessing(false);
        }
      }, 2000);
      
    } catch (error) {
      console.error("Donation Error:", error);
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  const generateReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102); 
    doc.text("MOHANIA WELFARE FOUNDATION", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Official Donation Receipt", 105, 28, { align: 'center' });
    
    const details = [
      ["Receipt No:", `RCP-${Date.now()}`],
      ["Date:", new Date().toLocaleDateString()],
      ["Donor Name:", name || "Anonymous"],
      ["Email:", email],
      ["Cause:", cause],
      ["Amount:", `INR ${amount}.00`],
      ["Payment ID:", paymentId],
      ["Status:", "Verified & Completed"]
    ];

    autoTable(doc, {
      startY: 40,
      head: [['Field', 'Value']],
      body: details,
      theme: 'striped',
      headStyles: { fillColor: [0, 51, 102] }
    });

    doc.setFontSize(10);
    doc.text("Registered Under Section 8 of the Companies Act 2013", 105, 110, { align: 'center' });
    doc.text("Corporate Identity Number (CIN): U85303BR2025NPL075573", 105, 116, { align: 'center' });
    doc.text("Thank you for your generous contribution.", 105, 128, { align: 'center' });
    
    doc.save(`MWF_Receipt_${paymentId}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-blue/80 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-all z-10"
        >
          <X size={20} className="text-gray-400" />
        </button>

        {step === 'details' && (
          <div className="p-10 select-none">
            <div className="space-y-8">
              {/* Cause Selection */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Select a Cause</label>
                <div className="space-y-3">
                  {causes.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCause(c.label)}
                      className={`w-full px-6 py-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        cause === c.label 
                        ? 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-lg shadow-brand-blue/5' 
                        : 'border-gray-50 text-gray-600 hover:border-gray-100'
                      }`}
                    >
                      <span className="text-sm font-black uppercase tracking-tight">{c.label}</span>
                      {cause === c.label && <CheckCircle2 size={18} className="text-brand-blue" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Select Amount (INR)</label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['2000', '5000', '10000'].map(val => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`py-4 rounded-2xl border-2 text-sm font-black transition-all ${
                        amount === val 
                        ? 'bg-brand-blue border-brand-blue text-white shadow-xl shadow-brand-blue/20' 
                        : 'border-gray-50 text-gray-400 hover:border-gray-100'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-brand-blue text-lg">₹</div>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Other Amount"
                    className="w-full pl-12 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-2xl font-black text-brand-blue text-lg focus:outline-none focus:border-brand-blue/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'razorpay', label: 'Razorpay', icon: CreditCard },
                    { id: 'bank', label: 'Bank', icon: Building },
                    { id: 'qr', label: 'QR', icon: QrCode }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === method.id 
                        ? 'border-brand-orange bg-brand-orange/5 text-brand-orange' 
                        : 'border-gray-50 text-gray-300 hover:border-gray-100'
                      }`}
                    >
                      <method.icon size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleDonate}
                disabled={isProcessing}
                className="w-full py-6 bg-brand-orange text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-orange/30 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
              >
                {isProcessing ? 'Processing...' : 'Confirm Contribution'}
              </button>
            </div>
          </div>
        )}

        {step === 'qr_view' && (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-brand-blue/5 rounded-full flex items-center justify-center text-brand-blue mx-auto mb-8">
              <QrCode size={32} />
            </div>
            <h3 className="text-xl font-black text-brand-blue uppercase tracking-tighter mb-4 text-center">Scan to Support</h3>
            <p className="text-xs text-gray-500 font-medium mb-8">Please scan the official MWF QR code below to contribute directly via any UPI app.</p>
            
            <div className="bg-white border-4 border-gray-50 p-6 rounded-[2rem] inline-block mb-8">
               <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-xl relative overflow-hidden">
                  <QrCode size={120} className="text-brand-blue relative z-10" />
               </div>
            </div>

            <div className="bg-brand-blue/5 p-6 rounded-2xl mb-8">
               <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-1">UPI ID</p>
               <p className="text-sm font-bold text-gray-600">mohania.foundation@icici</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep('details')}
                className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  setPaymentId('UPIScan_' + Math.random().toString(36).substring(7));
                  setStep('success');
                }}
                className="flex-[2] py-4 bg-brand-green text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-green/20"
              >
                I have paid
              </button>
            </div>
          </div>
        )}

        {step === 'bank_view' && (
          <div className="p-10">
            <div className="w-16 h-16 bg-brand-blue/5 rounded-full flex items-center justify-center text-brand-blue mx-auto mb-8">
              <Building size={32} />
            </div>
            <h3 className="text-xl font-black text-brand-blue uppercase tracking-tighter mb-4 text-center">Bank Transfer</h3>
            <p className="text-xs text-gray-500 font-medium mb-8 text-center">Please use the following account details for a direct NEFT/IMPS transfer.</p>
            
            <div className="space-y-3 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Name</span>
                <span className="text-xs font-black text-brand-blue">MOHANIA WELFARE FOUNDATION</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bank Name</span>
                <span className="text-xs font-black text-brand-blue">ICICI BANK</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Number</span>
                <span className="text-xs font-black text-brand-blue">635205500XXX</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">IFSC Code</span>
                <span className="text-xs font-black text-brand-blue">ICIC0006352</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep('details')}
                className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest"
              >
                Back
              </button>
              <button 
                onClick={() => {
                  setPaymentId('BankTrans_' + Math.random().toString(36).substring(7));
                  setStep('success');
                }}
                className="flex-[2] py-4 bg-brand-green text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-green/20"
              >
                Transfer Completed
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center">
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green mx-auto mb-8"
            >
              <ShieldCheck size={48} />
            </motion.div>
            <h2 className="text-4xl font-black text-brand-blue uppercase tracking-tighter mb-4 leading-none">Contribution Confirmed</h2>
            <p className="text-gray-500 mb-10 max-w-xs mx-auto font-medium">
              Your support of <span className="font-bold text-brand-blue italic">₹{amount}</span> for <span className="text-brand-orange uppercase text-[10px] font-black">{cause}</span> has been received.
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={generateReceipt}
                className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/20 hover:scale-105 transition-all"
              >
                <Download size={16} /> Download Tax Receipt
              </button>
              <button 
                onClick={onClose}
                className="w-full py-4 border-2 border-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-brand-blue/20 hover:text-brand-blue transition-all"
              >
                Done
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-brand-green bg-brand-green/5 py-3 rounded-xl border border-brand-green/10">
               <CheckCircle2 size={14} />
               <span className="text-[8px] font-black uppercase tracking-widest">Transaction Secured via SSL</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
