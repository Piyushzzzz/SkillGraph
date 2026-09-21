import React, { useState } from 'react';
import { StudentProfile, ViewPath, AcademicCourse } from '../../types';
import {
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Award,
  BookOpen,
  Calendar,
  Lock,
  FileCheck,
  User,
  Plus,
  Edit2
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface StudentProfileViewProps {
  profile: StudentProfile;
  onUpdateProfile?: (updated: Partial<StudentProfile>) => void;
  onNavigate: (view: ViewPath) => void;
  onOpenLedger: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
  onOpenLedger,
  onShowToast
}) => {
  const [copiedSha, setCopiedSha] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states for profile editing
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [university, setUniversity] = useState(profile.university || '');
  const [degree, setDegree] = useState(profile.degree || '');
  const [major, setMajor] = useState(profile.major || '');
  const [cgpa, setCgpa] = useState(profile.cgpa !== undefined ? String(profile.cgpa) : '');

  const handleCopySha = () => {
    if (!profile.cgpaVerificationHash) return;
    navigator.clipboard.writeText(profile.cgpaVerificationHash);
    setCopiedSha(true);
    onShowToast('Attestation Copied', profile.cgpaVerificationHash, 'success');
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Partial<StudentProfile> = {
      fullName,
      university: university || undefined,
      degree: degree || undefined,
      major: major || undefined,
      cgpa: cgpa ? parseFloat(cgpa) : undefined,
      maxCgpa: 4.0
    };
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    setIsEditing(false);
    onShowToast('Profile Updated', 'Student profile details saved.', 'success');
  };

  const courses = profile.academicCourses || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-left">
      {/* 1. Profile Hero */}
      <section className="p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm card-hover-3d">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName || 'Student'}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#E2E8F0] shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
                <User className="w-10 h-10 text-[#0F172A]" />
              </div>
            )}
            {profile.institutionalTranscriptVerified && (
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                VERIFIED
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold font-mono text-[#0F172A]">
                {profile.fullName || 'Student Candidate'}
              </h1>
              {profile.cohortPercentile && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0]">
                  Cohort {profile.cohortPercentile}
                </span>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] text-xs font-mono border border-[#E2E8F0] flex items-center gap-1 shadow-xs transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
            {profile.university ? (
              <p className="text-xs text-[#475569]">
                {profile.university} {profile.school ? `• ${profile.school}` : ''}
              </p>
            ) : (
              <p className="text-xs text-[#64748B]">No university registered</p>
            )}
            {profile.degree && (
              <p className="text-xs text-[#64748B] font-mono">
                {profile.degree} {profile.major ? `• Major in ${profile.major}` : ''}
              </p>
            )}
            {profile.publicId && (
              <p className="text-xs text-[#64748B] font-mono">
                Public ID: {profile.publicId}
              </p>
            )}
          </div>
        </div>

        {/* CGPA / Evidence Status Box */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          {profile.cgpa !== undefined ? (
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left w-full sm:w-auto">
              <div className="text-[10px] font-mono text-[#64748B] uppercase">
                Cumulative GPA (CGPA)
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-mono font-bold text-emerald-600">
                  {profile.cgpa.toFixed(2)}
                </span>
                {profile.maxCgpa && (
                  <span className="text-sm font-mono text-[#64748B]">/ {profile.maxCgpa.toFixed(2)}</span>
                )}
                {profile.institutionalTranscriptVerified && (
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    REGISTRAR SEALED
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left w-full sm:w-auto">
              <div className="text-[10px] font-mono text-[#64748B] uppercase">
                Academic Profile
              </div>
              <div className="text-sm font-mono text-[#0F172A] mt-1 font-semibold">
                {courses.length} Course records
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenLedger}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-sm transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Inspect Proof Ledger</span>
            </button>
          </div>
        </div>
      </section>

      {/* Edit Form Modal/Drawer */}
      {isEditing && (
        <section className="p-6 rounded-2xl bg-white border border-[#0F172A] shadow-md space-y-4">
          <h2 className="text-sm font-mono font-bold text-[#0F172A] uppercase">
            Update Student Profile Details
          </h2>
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:border-[#111827] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">University / College</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. University of California, Berkeley"
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:border-[#111827] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">Degree Title</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.S. in Computer Science"
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:border-[#111827] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">Major / Specialization</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Software Engineering"
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:border-[#111827] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#475569] mb-1">CGPA (if available)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 3.85"
                className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] focus:border-[#111827] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-mono text-[#475569] hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#111827] hover:bg-black text-xs font-mono font-semibold text-white shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      )}

      {/* 2. Cryptographic Attestation Banner (if hash exists) */}
      {profile.cgpaVerificationHash && (
        <section className="p-4 rounded-xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono text-[#0F172A] overflow-hidden">
            <Lock className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span className="text-[#64748B] shrink-0">Attestation SHA-256:</span>
            <span className="text-emerald-700 font-semibold truncate">{profile.cgpaVerificationHash}</span>
          </div>
          <button
            onClick={handleCopySha}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            {copiedSha ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
            <span>{copiedSha ? 'Copied' : 'Copy'}</span>
          </button>
        </section>
      )}

      {/* 3. Academic Coursework Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-sm font-mono font-bold text-[#0F172A] uppercase tracking-wider">
              Validated Academic Coursework
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/evidence')}
            className="text-xs text-[#2563EB] hover:underline font-mono font-semibold"
          >
            + Add Academic Evidence
          </button>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            title="No academic courses linked yet."
            description="Add your university coursework, grades, and associated competencies to verify your academic foundations."
            icon={GraduationCap}
            actions={[
              {
                label: 'Add Course Evidence',
                onClick: () => onNavigate('/evidence'),
                variant: 'primary',
                icon: Plus
              }
            ]}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all space-y-2 shadow-sm card-hover-3d"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0]">
                      {course.courseCode}
                    </span>
                    <h3 className="text-xs font-semibold text-[#0F172A] mt-1.5">{course.title}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    Grade: {course.grade}
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B] font-mono">
                  {course.semester} • {course.credits} Credits {course.instructor ? `• ${course.instructor}` : ''}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {course.associatedSkills.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentProfileView;
