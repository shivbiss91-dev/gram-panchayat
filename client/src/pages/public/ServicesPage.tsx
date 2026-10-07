import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hammer,
  Lightbulb,
  Droplets,
  Waves,
  Trash2,
  Building2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/common/Button';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      category: 'Road Issues',
      icon: <Hammer className="w-7 h-7 text-amber-500" />,
      department: 'Road Maintenance & Civil Works',
      examples: [
        'Potholes and broken road surfaces on internal village roads',
        'Damaged culverts, bridges, or canal crossings',
        'Road widening gravel hazards or uncleared construction stones',
        'Footpath and sidewalk erosion near school zones',
      ],
      sla: 'Standard resolution target: 3–7 business days',
    },
    {
      category: 'Street Light Problems',
      icon: <Lightbulb className="w-7 h-7 text-yellow-500" />,
      department: 'Electrical Line & Solar Infrastructure',
      examples: [
        'Non-functional solar street lights or battery failures',
        'Flickering or burnt-out LED lamps on main lanes',
        'Leaning electric poles or hanging wire hazards',
        'Dark unlit intersections requiring new fixtures',
      ],
      sla: 'Standard resolution target: 24–48 hours for emergency hazards',
    },
    {
      category: 'Water Supply Issues',
      icon: <Droplets className="w-7 h-7 text-blue-500" />,
      department: 'Water Supply & Public Health Engineering',
      examples: [
        'Underground feeder pipe fractures and road leakages',
        'Muddy or contaminated drinking water tap supply',
        'Low pressure at tail-end lanes or valve imbalances',
        'Broken community borewells or electrical pump motor burnout',
      ],
      sla: 'Standard resolution target: 12–24 hours for water contamination',
    },
    {
      category: 'Drainage & Sanitation',
      icon: <Waves className="w-7 h-7 text-teal-500" />,
      department: 'Sanitation & Health Inspection',
      examples: [
        'Choked storm drains overflowing onto pedestrian pathways',
        'Damaged or uncovered sewer inspection chambers',
        'Stagnant wastewater pooling creating mosquito breeding grounds',
        'Lack of disinfectant lime powder or mosquito fogging',
      ],
      sla: 'Standard resolution target: 2–4 business days',
    },
    {
      category: 'Waste Management',
      icon: <Trash2 className="w-7 h-7 text-emerald-500" />,
      department: 'Solid Waste Management Division',
      examples: [
        'Missed daily door-to-door waste collection vehicle rounds',
        'Garbage piles remaining after weekly bazaar markets',
        'Overflowing public community dustbins',
        'Unauthorized open dumping on open ground or canal banks',
      ],
      sla: 'Standard resolution target: 24–48 hours',
    },
    {
      category: 'Public Facilities',
      icon: <Building2 className="w-7 h-7 text-purple-500" />,
      department: 'Public Infrastructure & Community Welfare',
      examples: [
        'Damaged public handpumps or cracked iron levers',
        'Broken benches, boundary gates, or swings in public gardens',
        'Roof leaks or damaged facilities in Anganwadis and community halls',
        'Damaged public bus passenger shelters',
      ],
      sla: 'Standard resolution target: 5–10 business days',
    },
    {
      category: 'Other',
      icon: <HelpCircle className="w-7 h-7 text-indigo-500" />,
      department: 'Gram Panchayat Administration',
      examples: [
        'Stray cattle causing traffic blocks at main village junctions',
        'Faded or damaged village signboards and warning signs',
        'Encroachment on public pathways or common spaces',
        'Any other local municipal or civic grievance',
      ],
      sla: 'Standard resolution target: 3–7 business days',
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyber-blue">
          Civic Services Directory
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Grievance Categories & Service Standards
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Explore all civic categories handled by the Gram Panchayat. Select any category to launch the complaint reporting flow.
        </p>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div
            key={svc.category}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center flex-shrink-0 shadow-inner">
                  {svc.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {svc.category}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {svc.department}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <span className="text-xs font-bold text-slate-700 block">Common Issues Covered:</span>
                <ul className="space-y-1.5">
                  {svc.examples.map((ex, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyber-blue mt-1.5 flex-shrink-0" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-medium text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{svc.sla}</span>
              </div>

              <Button
                variant="outline"
                className="w-full text-xs hover:border-cyber-cyan hover:text-cyber-blue"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() =>
                  navigate(`/citizen/complaints/new?category=${encodeURIComponent(svc.category)}`)
                }
              >
                Report in this Category
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
