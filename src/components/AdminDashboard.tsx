import React, { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  limit,
  where,
  onSnapshot,
} from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/errorHandlers";
import {
  ShieldCheck,
  Users,
  TrendingUp,
  HandHeart,
  LayoutDashboard,
  FileText,
  Settings,
  MoreVertical,
  ArrowUpRight,
  UserPlus,
  ShieldAlert,
  Ban,
  UserCheck,
  Target,
  Building,
  AlertTriangle,
  BrainCircuit,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Campaign, Donation, ReportedUpdate } from "../types";
import { aiService } from "../services/aiService";

interface AdminDashboardProps {
  userProfile: UserProfile;
}

export default function AdminDashboard({ userProfile }: AdminDashboardProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'requests' | 'ngos' | 'reports'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [reports, setReports] = useState<ReportedUpdate[]>([]);
  const [helpRequests, setHelpRequests] = useState<any[]>([]);
  const [ngoProfiles, setNgoProfiles] = useState<any[]>([]);
  const [campaignPriority, setCampaignPriority] = useState<any[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const isSuperAdmin = userProfile.role === "super_admin";
  const isModeratorOnly = userProfile.role === "moderator";

  useEffect(() => {
    // Real-time user fetch
    const usersUnsubscribe = onSnapshot(
      query(collection(db, "users"), limit(50)),
      (snap) => {
        setUsers(snap.docs.map((d) => ({ ...d.data() }) as UserProfile));
      },
    );

    // Real-time reports fetch
    const reportsUnsubscribe = onSnapshot(
      query(collection(db, "reported_updates"), orderBy("createdAt", "desc")),
      (snap) => {
        setReports(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ReportedUpdate),
        );
      },
    );

    // Real-time beneficiary requests
    const helpUnsubscribe = onSnapshot(
      query(collection(db, "beneficiary_requests"), orderBy("createdAt", "desc")),
      (snap) => {
        setHelpRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );

    // Real-time NGO profiles
    const ngoUnsubscribe = onSnapshot(
      query(collection(db, "users"), where("role", "==", "ngo_partner")),
      (snap) => {
        setNgoProfiles(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
      }
    );

    const fetchOtherData = async () => {
      try {
        const campaignsSnap = await getDocs(collection(db, "campaigns"));
        const donationsSnap = await getDocs(
          query(
            collection(db, "donations"),
            orderBy("createdAt", "desc"),
            limit(10),
          ),
        );

        setCampaigns(
          campaignsSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as Campaign,
          ),
        );
        setDonations(
          donationsSnap.docs.map((d) => ({ ...d.data() }) as Donation),
        );

        // AI Features
        const priority = await aiService.getCampaignPriority(campaignsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setCampaignPriority(priority);

        if (donationsSnap.docs.length > 0) {
          const fraudCheck = await aiService.detectFraud(donationsSnap.docs[0].data());
          if (fraudCheck.isSuspicious) setFraudAlerts([fraudCheck]);
        }
      } catch (err) {
        console.error("Admin fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOtherData();

    return () => {
      usersUnsubscribe();
      reportsUnsubscribe();
      helpUnsubscribe();
      ngoUnsubscribe();
    };
  }, []);

  const handleUpdateRole = async (targetUserId: string, newRole: string) => {
    if (!isSuperAdmin && (newRole === "admin" || newRole === "super_admin")) {
      alert("Only Super Admins can assign Admin/Super Admin roles.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", targetUserId), {
        role: newRole,
      });
      alert(`Role updated to ${newRole} successfully.`);
      setActionMenuOpen(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${targetUserId}`);
    }
  };

  const handleUpdateStatus = async (uid: string, status: string) => {
    try {
      await updateDoc(doc(db, "users", uid), {
        status: status,
      });
      alert(`User status updated to ${status}.`);
      setActionMenuOpen(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    }
  };

  const handleDismissReport = async (reportId: string) => {
    // Logic to delete report
  };

  const handleUpdateHelpStatus = async (requestId: string, status: string) => {
    try {
      await updateDoc(doc(db, "beneficiary_requests", requestId), { status });
      alert(`Request ${status} successfully.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `beneficiary_requests/${requestId}`);
    }
  };

  const stats = [
    {
      label: "Total Donors",
      value: users.filter(u => u.role === 'donor').length,
      icon: HandHeart,
      color: "text-brand-green",
    },
    {
      label: "Total Volunteers",
      value: users.filter(u => u.role === 'volunteer').length,
      icon: Users,
      color: "text-brand-blue",
    },
    {
      label: "Beneficiaries",
      value: users.filter(u => u.role === 'beneficiary').length,
      icon: Target,
      color: "text-brand-orange",
    },
    {
      label: "NGO Partners",
      value: users.filter(u => u.role === 'ngo_partner').length,
      icon: Building,
      color: "text-purple-500",
    },
    {
      label: "Active Missions",
      value: campaigns.filter((c) => c.status === "active").length,
      icon: LayoutDashboard,
      color: "text-brand-blue",
    },
    {
      label: "Pending Approvals",
      value: users.filter(u => u.status === 'pending' || u.status === 'under_review').length,
      icon: ShieldAlert,
      color: "text-brand-orange",
    },
    {
      label: "Help Requests",
      value: helpRequests.length,
      icon: HandHeart,
      color: "text-brand-green",
    },
    {
      label: "Reports",
      value: reports.length,
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-brand-blue tracking-tighter uppercase">
            Operational Command
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            High Authority Access • Logged as{" "}
            {userProfile.role.replace("_", " ")}
          </p>
        </div>
        <div className="flex gap-4">
          {isSuperAdmin && <button className="btn-outline">Audit Logs</button>}
          {!isModeratorOnly && (
            <button className="btn-primary">
              <UserPlus size={16} /> Create Campaign
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-8">
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-2xl bg-white shadow-sm ${stat.color}`}
              >
                <stat.icon size={24} />
              </div>
              <ArrowUpRight size={16} className="text-gray-300" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-black text-brand-blue">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
        {[
          { id: 'users', label: 'Identity Pool', icon: Users },
          { id: 'requests', label: 'Help Influx', icon: HandHeart },
          { id: 'ngos', label: 'Partnership Hub', icon: Building },
          { id: 'reports', label: 'Moderation', icon: ShieldAlert }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-8 py-4 flex items-center gap-2 border-b-2 transition-all text-xs font-black uppercase tracking-widest ${
              activeAdminTab === tab.id ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-400 hover:text-brand-blue'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {activeAdminTab === 'users' && (
          <div className="glass-card overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/50">
              <h3 className="text-xl font-black text-brand-blue">
                Personnel Management
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search Identity..."
                  className="bg-gray-50 border-none rounded-full px-4 py-2 text-xs font-bold w-48 focus:ring-1 focus:ring-brand-blue/20"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-8 py-4">Individual Identity</th>
                    <th className="px-8 py-4">Role Classification</th>
                    <th className="px-8 py-4">Operational Status</th>
                    <th className="px-8 py-4">Reputation</th>
                    <th className="px-8 py-4">Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr
                      key={user.uid}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                            {user.photoURL && (
                              <img
                                src={user.photoURL}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-brand-blue">
                              {user.displayName}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                            user.role === "super_admin"
                              ? "bg-brand-orange/10 text-brand-orange border-brand-orange/20"
                              : user.role === "admin"
                                ? "bg-brand-blue/10 text-brand-blue border-brand-blue/20"
                                : "bg-gray-100 text-gray-500 border-gray-200"
                          }`}
                        >
                          {user.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
                            user.status === "approved"
                              ? "bg-brand-green/10 text-brand-green border-brand-green/20"
                              : user.status === "pending"
                                ? "bg-brand-orange/10 text-brand-orange border-brand-orange/20"
                                : "bg-red-100 text-red-500 border-red-200"
                          }`}
                        >
                          {user.status || "unknown"}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-mono text-xs text-brand-green font-bold">
                          +{user.reputation || 0}
                        </span>
                      </td>
                      <td className="px-8 py-5 relative">
                        <button
                          onClick={() =>
                            setActionMenuOpen(
                              actionMenuOpen === user.uid ? null : user.uid,
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-300 hover:text-brand-blue transition-all"
                        >
                          <MoreVertical size={16} />
                        </button>

                        <AnimatePresence>
                          {actionMenuOpen === user.uid && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-8 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50"
                            >
                              <div className="mb-2">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-3 py-2 border-b border-gray-50 mb-1">
                                  Status Protocols
                                </p>
                                {user.status === "pending" && (
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(user.uid, "approved")
                                    }
                                    className="w-full text-left px-3 py-2 text-[10px] font-bold text-brand-green hover:bg-brand-green/5 rounded-xl transition-all"
                                  >
                                    Authorize Identity
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(
                                      user.uid,
                                      user.status === "suspended"
                                        ? "approved"
                                        : "suspended",
                                    )
                                  }
                                  className="w-full text-left px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                  {user.status === "suspended"
                                    ? "Revoke Suspension"
                                    : "Suspend Operations"}
                                </button>
                              </div>

                              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-3 py-2 border-b border-gray-50 mb-1">
                                Modify Role
                              </p>
                              {[
                                { role: "member", label: "Member" },
                                { role: "moderator", label: "Moderator" },
                                {
                                  role: "admin",
                                  label: "Administrator",
                                  superOnly: true,
                                },
                                {
                                  role: "super_admin",
                                  label: "Super Admin",
                                  superOnly: true,
                                },
                              ].map(
                                (r) =>
                                  (!r.superOnly || isSuperAdmin) && (
                                    <button
                                      key={r.role}
                                      disabled={userProfile.uid === user.uid} // Can't edit own role
                                      onClick={() =>
                                        handleUpdateRole(user.uid, r.role)
                                      }
                                      className="w-full text-left px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-brand-blue/5 hover:text-brand-blue rounded-xl transition-all disabled:opacity-30"
                                    >
                                      Promote to {r.label}
                                    </button>
                                  ),
                              )}
                              <button className="w-full text-left px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all mt-2 border-t border-gray-50 pt-3">
                                Restrict Identity
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {activeAdminTab === 'requests' && (
            <div className="glass-card overflow-hidden">
               <div className="p-8 border-b border-gray-50 bg-white/50">
                  <h3 className="text-xl font-black text-brand-blue uppercase tracking-tighter">Emergency & Help Influx</h3>
               </div>
               <div className="divide-y divide-gray-50">
                  {helpRequests.map((req) => (
                    <div key={req.id} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all">
                       <div className="flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${req.priority === 'emergency' ? 'bg-red-50 text-red-500' : 'bg-brand-blue/5 text-brand-blue'}`}>
                             <AlertTriangle size={24} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-brand-blue uppercase">{req.requestType} Demand</p>
                             <p className="text-xs text-gray-400 font-medium line-clamp-1">{req.description}</p>
                             <div className="flex gap-2 mt-2">
                                <span className="text-[8px] font-black uppercase text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded-full border border-brand-orange/10">{req.status}</span>
                                <span className="text-[8px] font-black uppercase text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">{req.priority}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => handleUpdateHelpStatus(req.id, 'approved')} className="px-4 py-2 bg-brand-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Approve</button>
                          <button onClick={() => handleUpdateHelpStatus(req.id, 'rejected')} className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Reject</button>
                       </div>
                    </div>
                  ))}
                  {helpRequests.length === 0 && <div className="p-12 text-center text-gray-400 font-bold uppercase text-xs">No active help requests</div>}
               </div>
            </div>
          )}

          {activeAdminTab === 'ngos' && (
            <div className="glass-card overflow-hidden">
               <div className="p-8 border-b border-gray-50 bg-white/50">
                  <h3 className="text-xl font-black text-brand-blue uppercase tracking-tighter">NGO Alliance Verification</h3>
               </div>
               <div className="divide-y divide-gray-50">
                  {ngoProfiles.map((ngo) => (
                    <div key={ngo.uid} className="p-8 flex items-center justify-between hover:bg-gray-50 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue">
                             <Building size={24} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-brand-blue uppercase">{ngo.displayName}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{ngo.email}</p>
                             <div className="flex gap-2 mt-2">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                  ngo.status === 'approved' ? 'bg-brand-green/5 text-brand-green border-brand-green/10' : 'bg-brand-orange/5 text-brand-orange border-brand-orange/10'
                                }`}>
                                  {ngo.status}
                                </span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => handleUpdateStatus(ngo.uid, 'approved')} className="px-4 py-2 bg-brand-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Verify & Authorize</button>
                          <button onClick={() => handleUpdateStatus(ngo.uid, 'rejected')} className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Reject</button>
                       </div>
                    </div>
                  ))}
                  {ngoProfiles.length === 0 && <div className="p-12 text-center text-gray-400 font-bold uppercase text-xs">No pending NGO registrations</div>}
               </div>
            </div>
          )}

          {activeAdminTab === 'reports' && (
          <div className="glass-card p-0 overflow-hidden border-brand-orange/20">
            <div className="p-8 border-b border-gray-50 bg-brand-orange/5 text-brand-orange flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} />
                <h3 className="text-xl font-black">Community Moderation</h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-brand-orange text-white rounded-full">
                {reports.length} Alerts
              </span>
            </div>
            <div className="p-0">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-8 border-b border-gray-50 last:border-0 flex items-start gap-6 hover:bg-gray-50/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                    <Ban size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-brand-blue text-sm uppercase tracking-tight">
                        Post Violation Alert
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono">
                        ID: {report.updateId.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 font-medium italic">
                      "{report.reason}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Reported by {report.reporterName} •{" "}
                        {report.createdAt?.toDate?.().toLocaleDateString()}
                      </div>
                      <div className="flex gap-3">
                        <button className="text-[10px] font-black text-gray-400 uppercase hover:text-brand-blue transition-all">
                          View Context
                        </button>
                        <button className="text-[10px] font-black text-brand-orange uppercase hover:text-red-600 transition-all">
                          Dismiss
                        </button>
                        <button className="text-[10px] font-black text-red-600 uppercase hover:underline">
                          Revoke Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="p-12 text-center">
                  <UserCheck
                    size={40}
                    className="text-brand-green/30 mx-auto mb-4"
                  />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    System Clear • No active violations reported
                  </p>
                </div>
              )}
            </div>
          </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-black text-brand-blue mb-8">
              Treasury Pulse
            </h3>
            <div className="space-y-8">
              {campaigns.slice(0, 4).map((campaign) => (
                <div key={campaign.id} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate w-32">
                      {campaign.title}
                    </p>
                    <p className="text-[10px] font-black text-brand-blue">
                      {Math.round(
                        (campaign.currentAmount / campaign.targetAmount) * 100,
                      )}
                      %
                    </p>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(campaign.currentAmount / campaign.targetAmount) * 100}%`,
                      }}
                      className="h-full bg-brand-green"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 btn-outline py-3 text-[10px]">
              Strategic Transparency Report
            </button>
          </div>

          <div className="glass-card p-10 border border-brand-blue/10 bg-brand-blue/[0.02]">
             <div className="flex items-center gap-3 mb-8">
                <BrainCircuit className="text-brand-blue" />
                <h3 className="text-xl font-black text-brand-blue uppercase tracking-tighter">AI Mission Priority</h3>
             </div>
             <div className="space-y-4">
                {campaignPriority.length > 0 ? campaignPriority.map((p: any) => (
                  <div key={p.campaignId} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-xs ${p.priorityScore > 8 ? 'bg-red-500' : 'bg-brand-blue'}`}>
                           {p.priorityScore}
                        </div>
                        <div>
                           <p className="text-xs font-black text-brand-blue uppercase leading-none mb-1">{p.campaignId}</p>
                           <p className="text-[10px] text-gray-500 italic">{p.urgencyReason}</p>
                        </div>
                     </div>
                     <Sparkles size={16} className="text-brand-orange" />
                  </div>
                )) : (
                  <div className="text-center py-6 animate-pulse">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Optimizing Mission Priorities...</p>
                  </div>
                )}
             </div>
          </div>

          <div className="bg-brand-blue rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <ShieldCheck className="text-brand-orange mb-6" size={40} />
              <h3 className="text-2xl font-black mb-4 tracking-tighter">
                Governance Health
              </h3>
              <p className="text-sm text-brand-blue/30 font-medium mb-8 leading-relaxed">
                Platform efficiency is nominal. AI-driven fraud detection is
                active.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                  <div className="w-1.5 h-1.5 bg-brand-green rounded-full shadow-[0_0_8px_#34D399]" />
                  Database Integrity: 100%
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                  <div className="w-1.5 h-1.5 bg-brand-green rounded-full shadow-[0_0_8px_#34D399]" />
                  Cloud Sync: Latency 42ms
                </div>
              </div>
            </div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-all duration-1000" />
          </div>
        </div>
      </div>
    </div>
  );
}
