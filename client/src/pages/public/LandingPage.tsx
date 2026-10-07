import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicApi } from '../../services/api';
import { PortalStats, Complaint } from '../../types';
import {
  Shield,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  RefreshCw,
  Lightbulb,
  Droplets,
  Trash2,
  Building2,
  Waves,
  Hammer,
  HelpCircle,
  FileText,
  UserCheck,
  CheckCircle,
  Eye,
  TrendingUp,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Timeline } from '../../components/common/Timeline';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Dynamic portal stats from backend
  const [stats, setStats] = useState<PortalStats>({
    totalComplaints: 0,
    resolvedComplaints: 0,
    inProgressComplaints: 0,
    pendingComplaints: 0,
    assignedComplaints: 0,
    resolutionRate: 0,
  });

  // Track complaint section state
  const [trackId, setTrackId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  useEffect(() => {
    publicApi
      .getStats()
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not load public stats:', err);
      });
  }, []);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;

    setIsTracking(true);
    setTrackError(null);
    setTrackedComplaint(null);

    try {
      const res = await publicApi.trackComplaint(trackId.trim());
      if (res.success && res.data) {
        setTrackedComplaint(res.data);
      } else {
        setTrackError(res.message || 'Complaint not found.');
      }
    } catch (err: any) {
      setTrackError(err.message || 'Unable to find a complaint matching that ID.');
    } finally {
      setIsTracking(false);
    }
  };

  const categories = [
    {
      name: 'Road Issues',
      icon: <Hammer className="w-6 h-6 text-amber-500" />,
      desc: 'Potholes, damaged culverts, dangerous debris, and unpaved pathways.',
      color: 'hover:border-amber-400/60',
    },
    {
      name: 'Street Light Problems',
      icon: <Lightbulb className="w-6 h-6 text-yellow-500" />,
      desc: 'Faulty solar lamps, dark junctions, burnt LED fixtures, and damaged poles.',
      color: 'hover:border-yellow-400/60',
    },
    {
      name: 'Water Supply Issues',
      icon: <Droplets className="w-6 h-6 text-blue-500" />,
      desc: 'Pipeline bursts, contaminated tap water, low pressure, and borewell breakdowns.',
      color: 'hover:border-blue-400/60',
    },
    {
      name: 'Drainage & Sanitation',
      icon: <Waves className="w-6 h-6 text-teal-500" />,
      desc: 'Blocked sewer lines, overflowing open drains, and mosquito breeding ditches.',
      color: 'hover:border-teal-400/60',
    },
    {
      name: 'Waste Management',
      icon: <Trash2 className="w-6 h-6 text-emerald-500" />,
      desc: 'Garbage dump accumulation, market litter, and missed door-to-door tractor pickups.',
      color: 'hover:border-emerald-400/60',
    },
    {
      name: 'Public Facilities',
      icon: <Building2 className="w-6 h-6 text-purple-500" />,
      desc: 'Community halls, anganwadi centers, public gardens, handpumps, and bus shelters.',
      color: 'hover:border-purple-400/60',
    },
    {
      name: 'Other',
      icon: <HelpCircle className="w-6 h-6 text-indigo-500" />,
      desc: 'Stray cattle obstructions, broken signboard notices, and miscellaneous civic matters.',
      color: 'hover:border-indigo-400/60',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Report',
      description: 'Submit your civic issue with exact ward location and an optional photo.',
      icon: <FileText className="w-6 h-6 text-cyber-cyan" />,
    },
    {
      step: '02',
      title: 'Review',
      description: 'Panchayat officers verify the report and assign the responsible department.',
      icon: <Eye className="w-6 h-6 text-cyber-blue" />,
    },
    {
      step: '03',
      title: 'Resolve',
      description: 'On-ground field crews fix the problem and record resolution remarks.',
      icon: <CheckCircle className="w-6 h-6 text-emerald-400" />,
    },
    {
      step: '04',
      title: 'Track',
      description: 'Monitor real-time progress using your unique Complaint ID and submit feedback.',
      icon: <TrendingUp className="w-6 h-6 text-cyber-purple" />,
    },
  ];

  return (
    <div className="space-y-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] bg-cyber-deep cyber-navy-gradient text-white flex items-center overflow-hidden py-16 px-4 sm:px-6 lg:px-8 border-b border-cyber-cyan/20">
        {/* Subtle Cyber Grid & Ambient Lighting Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#00C8FF_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyber-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyber-dark/80 border border-cyber-cyan/40 text-xs font-semibold text-cyber-cyan shadow-cyber-sm">
              <Shield className="w-4 h-4 text-cyber-cyan" />
              <span>Official Gram Panchayat Civic Redressal</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Stronger Communities Through{' '}
              <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                Better Governance
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Report civic issues, track progress, and help build a cleaner, safer, and better Gram Panchayat. Transparent, direct, and accountable administration for every village resident.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/citizen/complaints/new">
                <Button size="lg" className="shadow-cyber-glow">
                  <span>Submit a Complaint</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>

              <a href="#track-section">
                <Button variant="secondary" size="lg">
                  <Search className="w-4 h-4 mr-1 text-cyber-cyan" />
                  <span>Track Complaint</span>
                </Button>
              </a>
            </div>

            {/* Micro Feature Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-cyan" />
                <span>Instant GP-YYYY-XXXX Tracking ID</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Field Resolutions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyber-purple" />
                <span>Citizen Feedback Loop</span>
              </div>
            </div>
          </div>

          {/* Hero Right Floating Glass Card */}
          <div className="lg:col-span-5">
            <div className="glass-cyber-card rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Your Voice Matters</h3>
                  <p className="text-xs text-cyber-cyan">Live Panchayat Grievance Metrics</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-xs text-slate-400 font-medium block">Total Complaints</span>
                  <span className="text-3xl font-extrabold text-white mt-1 block">
                    {stats.totalComplaints}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Recorded on portal</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-xs text-emerald-400 font-medium block">Resolved</span>
                  <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">
                    {stats.resolvedComplaints}
                  </span>
                  <span className="text-[10px] text-emerald-300 mt-1 block">
                    {stats.resolutionRate}% resolution rate
                  </span>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-xs text-cyber-cyan font-medium block">In Progress</span>
                  <span className="text-3xl font-extrabold text-cyber-cyan mt-1 block">
                    {stats.inProgressComplaints}
                  </span>
                  <span className="text-[10px] text-cyan-200 mt-1 block">Active on-ground</span>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <span className="text-xs text-amber-400 font-medium block">Under Review</span>
                  <span className="text-3xl font-extrabold text-amber-400 mt-1 block">
                    {stats.pendingComplaints}
                  </span>
                  <span className="text-[10px] text-amber-300 mt-1 block">Verification phase</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Real-time Database Sync
                </span>
                <Link to="/track" className="text-cyber-cyan font-semibold hover:underline">
                  Search an ID &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES / COMPLAINT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-cyber-blue">
            Civic Categories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            What Can You Report?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Select a category below to start your complaint submission with that category preselected.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/citizen/complaints/new?category=${encodeURIComponent(cat.name)}`)}
              className={`bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between ${cat.color}`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  {cat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-cyber-blue transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyber-blue">
                <span>Report Issue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PUBLIC TRACK COMPLAINT SECTION */}
      <section id="track-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-cyber-deep via-cyber-dark to-slate-900 rounded-3xl p-6 sm:p-10 border border-cyber-cyan/20 text-white shadow-xl">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-cyber-cyan">
              Public Tracking
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Track Your Complaint Status
            </h2>
            <p className="text-sm text-slate-300">
              Enter your unique Complaint ID (e.g., <code className="bg-white/10 px-2 py-0.5 rounded text-cyber-cyan font-mono">GP-2026-0001</code>) to check current progress and administrative remarks.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="max-w-xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="Enter Complaint ID (e.g. GP-2026-0001)"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent font-mono uppercase"
                  required
                />
              </div>
              <Button type="submit" size="lg" isLoading={isTracking}>
                <span>Track Complaint</span>
              </Button>
            </div>
          </form>

          {/* Tracking Result View */}
          {trackError && (
            <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-950/80 border border-rose-700/60 text-rose-200 text-sm text-center">
              {trackError}
            </div>
          )}

          {trackedComplaint && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 text-slate-900 border border-slate-200 shadow-2xl animate-in fade-in duration-200">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-extrabold text-cyber-blue">
                      {trackedComplaint.complaintNumber}
                    </span>
                    <StatusBadge status={trackedComplaint.status} size="md" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    {trackedComplaint.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {trackedComplaint.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(trackedComplaint.submittedAt).toLocaleDateString(undefined, {
                        dateStyle: 'medium',
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Department</span>
                  <span className="text-xs font-bold text-slate-700 block">
                    {trackedComplaint.assignedDepartment || 'Pending Assignment'}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Description</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {trackedComplaint.description}
                </p>
              </div>

              {/* Progress Stepper & Timeline */}
              <Timeline
                currentStatus={trackedComplaint.status}
                history={trackedComplaint.statusHistory}
              />
            </div>
          )}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-cyber-blue">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            How The Portal Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            From complaint registration to verified resolution, our system ensures speed and full accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.title}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              <div className="text-4xl font-extrabold text-slate-100 absolute top-4 right-4 select-none">
                {st.step}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center mb-4 shadow-sm">
                {st.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{st.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ABOUT SECTION */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyber-blue">
              About The Initiative
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Modern Digital Governance for Village Communities
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Digital Complaint Portal bridges the gap between rural citizens and Gram Panchayat administration. Previously, filing grievances required manual paper letters, physical visits to the office, and lack of clarity on progress.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              With this platform, every citizen can report issues instantly from their mobile device, attach photographic evidence, track status in real-time, and hold administration accountable through recorded timelines and citizen feedback ratings.
            </p>

            <div className="pt-2">
              <Link to="/about">
                <Button variant="outline">Learn More About Governance</Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Shield className="w-8 h-8 text-cyber-blue mb-3" />
              <h4 className="text-sm font-bold text-slate-900">Transparent Records</h4>
              <p className="text-xs text-slate-500 mt-1">
                Every grievance status change is immutably timestamped with the officer's name and remarks.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Clock className="w-8 h-8 text-emerald-500 mb-3" />
              <h4 className="text-sm font-bold text-slate-900">Faster Resolution</h4>
              <p className="text-xs text-slate-500 mt-1">
                Automated assignment to road, electrical, water, or sanitation teams cuts administrative delay.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <TrendingUp className="w-8 h-8 text-cyber-purple mb-3" />
              <h4 className="text-sm font-bold text-slate-900">Data Analytics</h4>
              <p className="text-xs text-slate-500 mt-1">
                Panchayat officers identify recurring bottlenecks and plan civic budgets intelligently.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-amber-500 mb-3" />
              <h4 className="text-sm font-bold text-slate-900">Citizen Feedback</h4>
              <p className="text-xs text-slate-500 mt-1">
                Residents rate work quality from 1 to 5 stars once marked resolved to maintain high standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-cyber-deep via-cyber-dark to-cyber-deep rounded-3xl p-8 sm:p-12 text-center text-white border border-cyber-cyan/30 shadow-cyber-glow">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Ready to Help Improve Your Village?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Create an account in less than 2 minutes and submit your first civic complaint directly to the Gram Panchayat.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg">Create Citizen Account</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-slate-900">
                Log In Existing Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
