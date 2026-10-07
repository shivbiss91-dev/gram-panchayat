import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cyber-deep border-t border-cyber-cyan/15 text-slate-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Portal Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyber-cyan via-cyber-blue to-cyber-purple flex items-center justify-center text-white shadow-cyber-glow flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-wide">
                GRAM PANCHAYAT
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Digital Grievance Redressal and Civic Complaint Management Portal. Connecting citizens directly with Panchayat administration for faster, transparent resolution.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-dark border border-cyber-cyan/20 text-[11px] text-cyber-cyan">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Portal Status: Online & Operational</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/track" className="hover:text-cyber-cyan transition-colors">
                  Track Complaint by ID
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-cyber-cyan transition-colors">
                  Complaint Categories
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-cyber-cyan transition-colors">
                  Citizen Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyber-cyan transition-colors">
                  Citizen Sign In
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-cyber-cyan transition-colors">
                  Panchayat Officer Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Civic Sectors
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Road Infrastructure & Repair</li>
              <li>Solar & Electric Street Lights</li>
              <li>Drinking Water Feeder Lines</li>
              <li>Sanitation & Drainage Channels</li>
              <li>Solid Waste Collection</li>
              <li>Public Community Facilities</li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Gram Panchayat Office
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyber-cyan flex-shrink-0 mt-0.5" />
                <span>Panchayat Bhavan, Central Ward 1, Taluka / District Office</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyber-cyan flex-shrink-0" />
                <span>Toll-Free Helpline: 1800-233-0001</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyber-cyan flex-shrink-0" />
                <span>contact@grampanchayat.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Gram Panchayat Administration. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Built for Citizens & Transparent Local Governance</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
