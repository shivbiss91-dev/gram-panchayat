import React from 'react';
import { Shield, Target, Users, CheckCircle, FileCheck, Award, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyber-blue">
          Civic Governance & Transparency
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          About The Digital Gram Panchayat Portal
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Empowering rural citizens with a transparent, responsive, and accountable digital complaint management system.
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-card grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyber-blue">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Our Purpose & Vision
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The Gram Panchayat is the foundational pillar of local self-government in India. However, traditional manual grievance reporting often suffered from lack of tracking, delays in communication, and difficulty in assessing contractor performance.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            This digital platform transforms civic engagement into a transparent collaboration. Citizens become the proactive eyes and ears of the community, while Panchayat officials gain real-time visibility, automated workload routing, and audit-ready reporting.
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyber-deep to-cyber-dark text-white rounded-2xl p-6 sm:p-8 border border-cyber-cyan/20 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold text-cyber-cyan">Key Governance Principles</h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
              <span><strong>Universal Accessibility:</strong> Simple interface accessible on mobile phones, tablets, and desktop computers.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
              <span><strong>Verifiable Audit Trail:</strong> Every single status update records the officer name, time, and specific work remarks.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
              <span><strong>Citizen-Driven Quality:</strong> 1-to-5 star ratings directly reflect the ground reality of civic repairs.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
              <span><strong>Data-Informed Budgeting:</strong> Recurring infrastructure complaints guide future development funding.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">For Rural Citizens</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Log civic issues in 60 seconds with photos and GPS. Receive automatic notifications as your grievance moves from review to on-ground resolution.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">For Panchayat Administration</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminate lost paperwork. Assign tasks to Junior Engineers and line workers with a single click and monitor resolution timelines in real-time.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Public Accountability</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Public tracking allows anyone with a Complaint ID to verify current progress without exposing sensitive citizen personal data.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-100 rounded-2xl p-8 text-center space-y-4 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800">Have a civic issue in your ward?</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Join our community of proactive citizens and help make our Gram Panchayat cleaner, safer, and well-maintained.
        </p>
        <div className="pt-2">
          <Link to="/citizen/complaints/new">
            <Button size="md">Submit a Complaint</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
