import { useState, useEffect } from 'react';
import { X, User as UserIcon, Mail, KeyRound, CheckCircle2, AlertCircle, LogIn, UserPlus, GraduationCap, BookOpen, Loader2 } from 'lucide-react';
import { User } from '../types';
import { DEMO_ASKER_USER, DEMO_SOLVER_USER } from '../data/initialData';
import { getUserFromFirestore, saveUserToFirestore, signInWithGoogle, signOutFirebaseUser } from '../utils/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  onSignup: (user: User) => void;
  onLogout: () => void;
  users: User[];
  onOpenFullProfile?: () => void;
}

export const AuthModal = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onSignup,
  onLogout,
  users,
  onOpenFullProfile,
}: AuthModalProps) => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [semester, setSemester] = useState('Semester 4');
  const [passkey, setPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Automatically dismiss error messages popping during sign in / sign up after 3 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  // Clear errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedCourse = course.trim();
    const trimmedSemester = semester.trim();
    const trimmedPasskey = passkey.trim();
    const trimmedConfirm = confirmPasskey.trim();

    if (!trimmedName || !trimmedEmail || !trimmedCourse || !trimmedSemester || !trimmedPasskey || !trimmedConfirm) {
      setError('Please fill in all fields.');
      return;
    }

    if (trimmedPasskey !== trimmedConfirm) {
      setError('Passkeys do not match.');
      return;
    }

    if (trimmedPasskey.length < 4) {
      setError('Passkey should be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    try {
      // Check both local state and Firestore database for existing user
      let existingUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);
      if (!existingUser) {
        existingUser = (await getUserFromFirestore(trimmedEmail)) || undefined;
      }

      if (existingUser) {
        setIsLoading(false);
        setError('A student account with this email already exists. Please switch to Sign In.');
        return;
      }

      const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-blue-600', 'bg-amber-600', 'bg-rose-600', 'bg-purple-600'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: trimmedName,
        email: trimmedEmail,
        passkey: trimmedPasskey,
        avatarColor: randomColor,
        joinedDate: 'Oct 2026',
        course: trimmedCourse,
        semester: trimmedSemester,
        bio: 'Enthusiastic learner participating in student community discussions.',
      };

      // Persist permanently in Firestore database
      await saveUserToFirestore(newUser);

      onSignup(newUser);
      setSuccess('Account created and saved to cloud! Welcome to StudyCircle.');
      setTimeout(() => {
        setIsLoading(false);
        onClose();
        resetForm();
      }, 800);
    } catch (err) {
      console.error('Signup error:', err);
      setIsLoading(false);
      setError('Failed to create account. Please try again.');
    }
  };

  const handleSigninSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPasskey = passkey.trim();

    if (!trimmedEmail || !trimmedPasskey) {
      setError('Please enter your email and passkey.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Look in memory/props
      let matchedUser = users.find(
        (u) => u.email.toLowerCase() === trimmedEmail && u.passkey === trimmedPasskey
      );

      // 2. If not found in local memory, look directly in Firestore cloud database
      if (!matchedUser) {
        const cloudUser = await getUserFromFirestore(trimmedEmail);
        if (cloudUser && cloudUser.passkey === trimmedPasskey) {
          matchedUser = cloudUser;
        } else if (cloudUser && !cloudUser.passkey) {
          // User exists from Google auth
          matchedUser = cloudUser;
        }
      }

      if (!matchedUser) {
        setIsLoading(false);
        setError('Invalid student email or passkey. Please check your credentials or create an account.');
        return;
      }

      onLogin(matchedUser);
      setSuccess(`Welcome back, ${matchedUser.name}!`);
      setTimeout(() => {
        setIsLoading(false);
        onClose();
        resetForm();
      }, 600);
    } catch (err) {
      console.error('Sign in error:', err);
      setIsLoading(false);
      setError('Sign in failed. Please verify your connection.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onLogin(user);
        setSuccess(`Signed in with Google as ${user.name}!`);
        setTimeout(() => {
          setIsLoading(false);
          onClose();
          resetForm();
        }, 600);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Google Sign in error:', err);
      setIsLoading(false);
      setError('Google Sign-In was cancelled or failed.');
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPasskey('');
    setConfirmPasskey('');
    setError(null);
    setSuccess(null);
    setIsLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              SC
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {currentUser ? 'Student Account' : mode === 'signup' ? 'Join StudyCircle' : 'Sign In to StudyCircle'}
              </h2>
              <p className="text-xs text-slate-500">Solve doubts, share notes, and learn together</p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          /* Profile / Logout View */
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div
                className={`w-12 h-12 rounded-full ${currentUser.avatarColor} text-white font-bold flex items-center justify-center text-lg shadow-sm`}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="font-semibold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Joined {currentUser.joinedDate}</div>
              </div>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>Academic Information</span>
              </div>
              <div className="text-xs text-slate-700">
                <span className="font-semibold">Course:</span> {currentUser.course || 'Undergraduate Degree'}
              </div>
              <div className="text-xs text-slate-700">
                <span className="font-semibold">Semester:</span> {currentUser.semester || 'Semester 1'}
              </div>
            </div>

            {onOpenFullProfile && (
              <button
                type="button"
                id="view-full-profile-btn"
                onClick={() => {
                  onClose();
                  onOpenFullProfile();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Full Student Profile</span>
              </button>
            )}

            {/* Quick Demo Role Switcher when logged in */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Role Switcher (Test Doubt Asking & Solving)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="switch-to-asker-btn"
                  onClick={() => {
                    onLogin(DEMO_ASKER_USER);
                    setSuccess(`Switched to Doubt Asker: ${DEMO_ASKER_USER.name}`);
                    setTimeout(() => onClose(), 600);
                  }}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer text-xs ${
                    currentUser.email.toLowerCase() === DEMO_ASKER_USER.email.toLowerCase()
                      ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1 font-semibold text-xs">
                    <span>❓</span> Aarav (Asker)
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">Asks doubts</span>
                </button>

                <button
                  type="button"
                  id="switch-to-solver-btn"
                  onClick={() => {
                    onLogin(DEMO_SOLVER_USER);
                    setSuccess(`Switched to Doubt Solver: ${DEMO_SOLVER_USER.name}`);
                    setTimeout(() => onClose(), 600);
                  }}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer text-xs ${
                    currentUser.email.toLowerCase() === DEMO_SOLVER_USER.email.toLowerCase()
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1 font-semibold text-xs">
                    <span>💡</span> Priya (Solver)
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">Solves & explains</span>
                </button>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                id="auth-profile-cancel-btn"
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                id="sign-out-btn"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium text-xs transition-colors border border-rose-200 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Signup / Signin Forms */
          <div className="p-6">
            {/* Tabs */}
            <div className="flex rounded-lg bg-slate-100 p-1 mb-5">
              <button
                type="button"
                id="auth-signup-tab"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signup' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign Up
              </button>
              <button
                type="button"
                id="auth-signin-tab"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            </div>

            {error && (
              <div
                id="auth-error-alert"
                className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between gap-2 text-xs text-rose-700 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  id="dismiss-auth-error-btn"
                  onClick={() => setError(null)}
                  className="text-rose-400 hover:text-rose-700 p-0.5 rounded transition-colors cursor-pointer"
                  title="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {mode === 'signup' ? (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-name-input"
                      type="text"
                      placeholder="e.g. Maya Lin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-email-input"
                      type="email"
                      placeholder="e.g. maya@student.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Course of Study</label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="signup-course-input"
                        type="text"
                        placeholder="e.g. B.Tech CS, B.Sc Geo"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <select
                        id="signup-semester-select"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
                      >
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 3">Semester 3</option>
                        <option value="Semester 4">Semester 4</option>
                        <option value="Semester 5">Semester 5</option>
                        <option value="Semester 6">Semester 6</option>
                        <option value="Semester 7">Semester 7</option>
                        <option value="Semester 8">Semester 8</option>
                        <option value="Postgraduate Year 1">Postgrad Year 1</option>
                        <option value="Postgraduate Year 2">Postgrad Year 2</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Passkey</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-passkey-input"
                      type="password"
                      placeholder="Create a passkey"
                      value={passkey}
                      onChange={(e) => setPasskey(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Passkey</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-confirm-passkey-input"
                      type="password"
                      placeholder="Re-enter passkey"
                      value={confirmPasskey}
                      onChange={(e) => setConfirmPasskey(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                  </div>
                </div>

                <button
                  id="submit-signup-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Student Account</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSigninSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signin-email-input"
                      type="email"
                      placeholder="e.g. aarav.study@student.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Passkey</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signin-passkey-input"
                      type="password"
                      placeholder="Enter your passkey"
                      value={passkey}
                      onChange={(e) => setPasskey(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      required
                    />
                  </div>
                </div>

                <button
                  id="submit-signin-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            )}

            {/* Google Authentication Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">Or</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Quick Demo Switcher - 2 Demo Users for Doubt Asking & Solving */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Test with 2 Demo Students:
                </span>
                <span className="text-[10px] text-slate-400">1-click login</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Demo User 1: Asker */}
                <button
                  type="button"
                  id="login-demo-asker-btn"
                  onClick={() => {
                    onLogin(DEMO_ASKER_USER);
                    setSuccess(`Logged in as Doubt Asker: ${DEMO_ASKER_USER.name}`);
                    setTimeout(() => onClose(), 600);
                  }}
                  className="p-2.5 rounded-xl border border-indigo-200 hover:border-indigo-400 bg-indigo-50/60 hover:bg-indigo-50 text-left transition-all cursor-pointer group flex items-start gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    ❓
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                      Aarav Sharma
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded mt-0.5">
                      Doubt Asker
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                      aarav.study@student.edu
                    </span>
                  </div>
                </button>

                {/* Demo User 2: Solver */}
                <button
                  type="button"
                  id="login-demo-solver-btn"
                  onClick={() => {
                    onLogin(DEMO_SOLVER_USER);
                    setSuccess(`Logged in as Doubt Solver: ${DEMO_SOLVER_USER.name}`);
                    setTimeout(() => onClose(), 600);
                  }}
                  className="p-2.5 rounded-xl border border-emerald-200 hover:border-emerald-400 bg-emerald-50/60 hover:bg-emerald-50 text-left transition-all cursor-pointer group flex items-start gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    💡
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                      Priya Verma
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded mt-0.5">
                      Doubt Solver
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                      priya@student.edu
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
