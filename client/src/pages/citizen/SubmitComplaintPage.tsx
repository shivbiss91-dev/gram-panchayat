import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { complaintApi } from '../../services/api';
import { ComplaintCategory, Complaint } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Image as ImageIcon,
  Check,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { FileUpload } from '../../components/common/FileUpload';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';

const CATEGORIES: ComplaintCategory[] = [
  'Road Issues',
  'Street Light Problems',
  'Water Supply Issues',
  'Drainage & Sanitation',
  'Waste Management',
  'Public Facilities',
  'Other',
];

export const SubmitComplaintPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { success, error: toastError } = useToast();

  const preselectedCategory = (searchParams.get('category') as ComplaintCategory) || 'Road Issues';

  // Multi-step wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [category, setCategory] = useState<ComplaintCategory>(preselectedCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    if (searchParams.get('category')) {
      const cat = searchParams.get('category') as ComplaintCategory;
      if (CATEGORIES.includes(cat)) {
        setCategory(cat);
      }
    }
  }, [searchParams]);

  // GPS auto-detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toastError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setIsLocating(false);
        success('GPS coordinates fetched successfully!');
      },
      (err) => {
        setIsLocating(false);
        toastError(`Unable to fetch location: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Step 1 validation
  const validateStep1 = () => {
    if (!title.trim() || title.trim().length < 5) {
      toastError('Title must be at least 5 characters long.');
      return false;
    }
    if (!description.trim() || description.trim().length < 10) {
      toastError('Description must be at least 10 characters long.');
      return false;
    }
    return true;
  };

  // Step 2 validation
  const validateStep2 = () => {
    if (!location.trim() || location.trim().length < 4) {
      toastError('Please specify the location/address of the problem.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('location', location.trim());

      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      if (imageFile) formData.append('image', imageFile);

      const res = await complaintApi.createComplaint(formData);
      if (res.success && res.data) {
        success('Complaint submitted successfully!');
        setSubmittedComplaint(res.data);
      } else {
        toastError(res.message || 'Failed to submit complaint.');
      }
    } catch (err: any) {
      toastError(err.message || 'Complaint submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If complaint was submitted, show confirmation screen
  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-card text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Complaint Registered
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Complaint Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Your grievance has been safely recorded in the Gram Panchayat system. Our field inspection team will review it shortly.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <span className="text-xs text-slate-400 font-bold uppercase">Complaint ID</span>
              <span className="font-mono text-base font-extrabold text-cyber-blue">
                {submittedComplaint.complaintNumber}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <span className="text-xs text-slate-400 font-bold uppercase">Category</span>
              <CategoryBadge category={submittedComplaint.category} size="sm" />
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <span className="text-xs text-slate-400 font-bold uppercase">Issue Title</span>
              <span className="text-xs font-bold text-slate-800 truncate max-w-[250px]">
                {submittedComplaint.title}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold uppercase">Initial Status</span>
              <StatusBadge status={submittedComplaint.status} size="sm" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to={`/citizen/complaints/${submittedComplaint.id}`}>
              <Button size="lg" variant="primary">
                <span>View Full Details</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            <Link to={`/track?id=${submittedComplaint.complaintNumber}`}>
              <Button size="lg" variant="outline">
                <span>Track Complaint</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          File a Civic Grievance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete the 3 simple steps below to record your problem with Gram Panchayat administration.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-2">
          {[
            { num: 1, title: 'Basic Details' },
            { num: 2, title: 'Location & Photo' },
            { num: 3, title: 'Review & Submit' },
          ].map((s) => {
            const isDone = s.num < step;
            const isCurrent = s.num === step;
            return (
              <div
                key={s.num}
                className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-cyan-50 border border-cyber-cyan/30 text-cyber-deep font-bold'
                    : isDone
                    ? 'text-emerald-700 font-medium'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-cyber-cyan text-cyber-deep shadow-sm'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                </div>
                <span className="text-xs truncate hidden sm:inline">{s.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        {/* STEP 1: Basic Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 1: Basic Details</h3>
              <p className="text-xs text-slate-500">
                Categorize your grievance and provide a concise summary.
              </p>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Complaint Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-cyan-50/80 border-cyber-cyan text-cyber-deep shadow-sm ring-1 ring-cyber-cyan'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <CategoryBadge category={cat} size="sm" />
                      {isSelected && <Check className="w-4 h-4 text-cyber-blue" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Complaint Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken drainage pipe flooding near Primary School"
                maxLength={150}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {title.length}/150 characters
              </span>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Detailed Description *
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail: when did it start, exact landmark, impact on villagers, danger level..."
                maxLength={2000}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                {description.length}/2000 characters (minimum 10 characters)
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: Location & Photo */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 2: Location & Evidence</h3>
              <p className="text-xs text-slate-500">
                Help field workers locate the exact site and attach a photo.
              </p>
            </div>

            {/* Address / Landmark */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Location / Street / Ward Landmark *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Near Old Hanuman Temple, Ward No. 3, North Shinde Lane"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:border-transparent"
                />
              </div>
            </div>

            {/* GPS coordinates & Auto-detect button */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    GPS Coordinates (Optional)
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Coordinates allow precise dispatch of municipal equipment
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  isLoading={isLocating}
                  onClick={handleDetectLocation}
                  leftIcon={<Navigation className="w-3.5 h-3.5 text-cyber-blue" />}
                >
                  Use My Current GPS
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Latitude (e.g. 18.5204)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                />
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Longitude (e.g. 73.8567)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Upload Photo Evidence (Optional but recommended)
              </label>
              <FileUpload
                selectedFile={imageFile}
                onFileSelect={(file) => setImageFile(file)}
              />
            </div>
          </div>
        )}

        {/* STEP 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Step 3: Review & Submit</h3>
              <p className="text-xs text-slate-500">
                Please double-check all information before final submission.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Category</span>
                <CategoryBadge category={category} size="md" />
              </div>

              <div className="border-b border-slate-200/60 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                  Issue Title
                </span>
                <p className="text-sm font-bold text-slate-900">{title}</p>
              </div>

              <div className="border-b border-slate-200/60 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                  Location
                </span>
                <p className="text-xs font-semibold text-slate-700">{location}</p>
                {(latitude || longitude) && (
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Coordinates: {latitude || '-'}, {longitude || '-'}
                  </span>
                )}
              </div>

              <div className="border-b border-slate-200/60 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                  Description
                </span>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </div>

              {imageFile && (
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                    Attached Evidence
                  </span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <ImageIcon className="w-4 h-4 text-cyber-blue" />
                    <span>{imageFile.name} ({(imageFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-cyan-50 border border-cyber-cyan/30 text-xs text-slate-700 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cyber-blue flex-shrink-0 mt-0.5" />
              <span>
                By submitting this complaint, you certify that this issue affects public civic services or safety within the Gram Panchayat boundary.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleBack}
              disabled={isSubmitting}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Step {step + 1}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onClick={handleSubmit}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit Complaint
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
