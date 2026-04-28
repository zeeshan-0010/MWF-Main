import React from 'react';
import { 
  BarChart3, 
  Users, 
  Megaphone, 
  FileText, 
  Plus, 
  ArrowRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { UserProfile } from '../types';
import { motion } from 'motion/react';

interface StaffDashboardProps {
  userProfile: UserProfile;
}

export default function StaffDashboard({ userProfile }: StaffDashboardProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-brand-blue tracking-tight">Staff Terminal</h2>
          <p className="text-gray-400 text-sm font-medium">Operations & Campaign Management Hub</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary flex gap-2 items-center">
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Campaigns', value: '12', icon: Megaphone, color: 'text-brand-blue' },
          { label: 'Total Reach', value: '45.2k', icon: TrendingUp, color: 'text-brand-green' },
          { label: 'New Leads', value: '124', icon: Users, color: 'text-brand-orange' },
          { label: 'Reports Pending', value: '8', icon: FileText, color: 'text-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-8 group">
            <div className="p-3 bg-gray-50 rounded-2xl w-fit mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all">
              <stat.icon size={20} className={stat.color + " group-hover:text-white"} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-brand-blue">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10">
          <h3 className="text-sm font-black text-brand-blue uppercase tracking-tight mb-8">Campaign Performance</h3>
          <div className="space-y-6">
            {[
              { name: 'Slum Education Fund', raised: '₹4.2L', goal: '₹5L', progress: 84 },
              { name: 'Oxygen Bank Support', raised: '₹8.5L', goal: '₹10L', progress: 85 },
              { name: 'Weekend Meal Prep', raised: '₹1.2L', goal: '₹2L', progress: 60 },
            ].map(campaign => (
              <div key={campaign.name} className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-brand-blue">{campaign.name}</span>
                  <span className="text-gray-400">{campaign.raised} / {campaign.goal}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-orange transition-all duration-1000" 
                    style={{ width: `${campaign.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 mt-8 bg-gray-50 text-[10px] font-black text-brand-blue uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-blue hover:text-white transition-all">
            View Analytics <ArrowRight size={14} />
          </button>
        </div>

        <div className="glass-card p-10">
          <h3 className="text-sm font-black text-brand-blue uppercase tracking-tight mb-8">Operational Tasklist</h3>
          <div className="space-y-4">
            {[
              { task: 'Verify donation #RCP-9021', priority: 'high', date: 'Today' },
              { task: 'Email new volunteer leads', priority: 'medium', date: 'Today' },
              { task: 'Update campaign photo assets', priority: 'low', date: 'Tomorrow' },
              { task: 'Review monthly impact report', priority: 'high', date: 'In 2 days' },
            ].map(item => (
              <div key={item.task} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-brand-orange' : 'bg-brand-blue'}`}></div>
                  <span className="text-sm font-bold text-gray-700">{item.task}</span>
                </div>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
