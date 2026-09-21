import React, { useState } from 'react';
import { StudentProfile, ViewPath } from '../../types';
import {
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
  User,
  Plus,
  Edit2,
  BookOpen,
  Award,
  Calendar,
  Sparkles
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
  const [isEditing, setIsEditing] = useState(false);

  // Form states for profile editing
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [university, setUniversity] = useState(profile.university || '');
  const [degree, setDegree] = useState(profile.degree || '');
  const [major, setMajor] = useState(profile.major || '');
  const [cgpa, setCgpa] = useState(profile.cgpa !== undefined ? String(profile.cgpa) : '');

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
    onShowToast('Profile Updated', 'Your profile details have been saved successfully.', 'success');
  };

  const courses = profile.academicCourses || [];

  return (
    <div className="py-8 px-4 sm:px-8 max-w-5xl mx-auto text-left space-y-8 animate-fade-in">
      {/* 1. Main Student Profile Card */}
      <div className="saas-card p-6 sm:p-8 bg-white border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-blue-500/20 shrink-0">
              {(profile.fullName || 'Alex Chen').charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {profile.fullName || 'Alex Chen'}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Student
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                {profile.university || 'Stanford University'} • {profile.degree || 'B.S. in Computer Science'}
              </p>
              <p className="text-xs text-slate-400">
                Specialization: {profile.major || 'Software Systems & Distributed Computing'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-xs font-semibold saas-btn-secondary flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={onOpenLedger}
              className="px-4 py-2 text-xs font-semibold saas-btn-primary flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Credentials</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Academic GPA
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {profile.cgpa ? profile.cgpa.toFixed(2) : '3.85'}
              <span className="text-xs font-medium text-slate-400"> / 4.00</span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">Top 5% in Department</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Coursework Completed
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {courses.length || 4} Courses
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">All transcripts verified</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Academic Standing
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              Honor Roll
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Deans List • 2024 & 2025</p>
          </div>
        </div>
      </div>

      {/* 2. Edit Profile Form */}
      {isEditing && (
        <div className="saas-card p-6 sm:p-7 bg-white border border-blue-300 shadow-md space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Edit Student Profile Details
          </h2>
          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University / College</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Title</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.S. in Computer Science"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Major / Specialization</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Systems & AI"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cumulative GPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="3.85"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold saas-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold saas-btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Verified University Coursework */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Verified University Coursework</h2>
            <p className="text-xs text-slate-500">
              Official courses credited toward your technical skill foundation.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/evidence')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            + Add Course Record
          </button>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            title="No academic courses added yet."
            description="Add your university coursework to verify your technical foundations."
            icon={GraduationCap}
            actions={[
              {
                label: 'Add Course',
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
                className="saas-card p-5 bg-white border border-slate-200 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {course.courseCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{course.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    Grade: {course.grade}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  {course.semester} • {course.credits} Credits {course.instructor ? `• ${course.instructor}` : ''}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {course.associatedSkills.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfileView;
