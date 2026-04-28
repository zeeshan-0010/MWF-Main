import React from 'react';
import { 
  Building, 
  BarChart3, 
  Users, 
  FileCheck, 
  PieChart, 
  Download,
  Calendar,
  ChevronRight,
  TrendingUp,
  MapPin,
  Target
} from 'lucide-react';
import { UserProfile } from '../types';

interface CSRDashboardProps {
  userProfile: UserProfile;
}

export default function CSRDashboard({ userProfile }: CSRDashboardProps) {
  return (
    <div className="space-y-12">
      {/* Corporate Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Invested', value: '₹4.5L', icon: TrendingUp, color: 'text-brand-green' },
          { label: 'Direct Beneficiaries', value: '1,240+', icon: Users, color: 'text-brand-blue' },
          { label: 'Compliant Projects', value: '4', icon: FileCheck, color: 'text-brand-orange' },
          { label: 'CSR Score', value: '98/100', icon: BarChart3, color: 'text-brand-blue' }
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 glass-card-hover group">
            <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center ${stat.color} mb-4 shadow-sm group-hover:scale-110 transition-all`}>
              <stat.icon size={22} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-brand-blue tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content: Sponsored Projects */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-brand-blue tracking-tighter uppercase">Sponsored Projects</h3>
            <button className="text-[10px] font-black text-brand-orange uppercase tracking-widest bg-brand-orange/5 px-4 py-2 rounded-full border border-brand-orange/10">Project Intelligence</button>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Rural Smart Classrooms', fund: '75%', impacted: '450 Kids', status: 'In Progress', date: 'Launched Mar 2024' },
              { title: 'MWF Health Camps 2024', fund: '100%', impacted: '800+ Patients', status: 'Completed', date: 'Finished Jan 2024' }
            ].map((proj) => (
              <div key={proj.title} className="glass-card p-8 group hover:bg-white transition-all cursor-pointer">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/5 rounded-full text-brand-blue text-[8px] font-black uppercase tracking-widest border border-brand-blue/10">
                      <Target size={10} /> Active Partnership
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-brand-blue mb-1 uppercase tracking-tight">{proj.title}</h4>
                      <p className="text-xs text-brand-orange font-bold uppercase tracking-widest">{proj.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                     <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Funding</p>
                        <p className="text-lg font-black text-brand-blue">{proj.fund}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reach</p>
                        <p className="text-lg font-black text-brand-blue">{proj.impacted}</p>
                     </div>
                     <div className="text-center">
                        <button className="p-3 bg-gray-50 rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-all">
                           <ChevronRight size={20} />
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: CSR Compliance */}
        <div className="lg:col-span-1 space-y-8">
           <h3 className="text-2xl font-black text-brand-blue tracking-tighter uppercase">Compliance Hub</h3>
           
           <div className="glass-card p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-brand-green/5 rounded-2xl border border-brand-green/10">
                 <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-green">
                    <FileCheck size={20} />
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Audit Status</h5>
                    <p className="text-xs font-bold text-brand-green uppercase">Verified Compliant</p>
                 </div>
              </div>

              <div className="space-y-4">
                 {[
                   { name: 'FY 2023 Annual Report', type: 'PDF' },
                   { name: 'Impact Assessment Vol-2', type: 'PDF' },
                   { name: 'Project Expense Audit', type: 'DOCX' }
                 ].map((doc) => (
                   <button key={doc.name} className="w-full p-4 flex items-center justify-between bg-gray-50 rounded-xl hover:bg-brand-blue/[0.02] transition-colors group">
                      <div className="flex items-center gap-3">
                         <Download size={14} className="text-gray-400 group-hover:text-brand-blue transition-colors" />
                         <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{doc.name}</span>
                      </div>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{doc.type}</span>
                   </button>
                 ))}
              </div>

              <button className="w-full py-4 bg-brand-blue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                 Request Custom Impact Report
              </button>
           </div>

           <div className="glass-card p-8">
              <h4 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] mb-4">Strategic Contact</h4>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden" />
                 <div>
                    <p className="text-xs font-black text-brand-blue uppercase leading-none mb-1">Aditi Sharma</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">MWF CSR Manager</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
