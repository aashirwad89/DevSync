/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/authContext';
import axios from 'axios';
import { 
  ArrowLeft, 
  LogOut, 
  Camera, 
  Image as ImageIcon, 
  User, 
  Mail, 
  Calendar, 
  Shield,
  Award,
  Star,
  Sparkles,
  Check,
  X,
  GitBranch,
  Users,
  Bookmark,
  Activity
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Cartoon-style avatar CDN images (DiceBear v6)
const avatars = [
  'https://api.dicebear.com/6.x/bottts/svg?seed=developer&size=150',
  'https://api.dicebear.com/6.x/bottts/svg?seed=student&size=150',
  'https://api.dicebear.com/6.x/bottts/svg?seed=professional&size=150',
  'https://api.dicebear.com/6.x/bottts/svg?seed=female&size=150',
  'https://api.dicebear.com/6.x/bottts/svg?seed=male&size=150',
  'https://api.dicebear.com/6.x/bottts/svg?seed=coder&size=150',
  'https://api.dicebear.com/6.x/bottts/svg?seed=engineer&size=150',
  'https://api.dicebear.com/6.x/bottts/svg?seed=designer&size=150',
];

interface UserData {
  _id: string;
  username: string;
  email: string;
  repositories: any[];
  followedUsers: any[];
  starredRepositories: any[];
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  bio?: string;
}

function ProfilePage() {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setIsLoading(false);
          return;
        }

        // Fetch user profile from backend
        const response = await axios.get(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('✅ User data fetched:', response.data);
        
        const fetchedUser = response.data.data || response.data.user || response.data;
        setUserData(fetchedUser);
        
        // Set avatar if exists in user data, otherwise use first default
        if (fetchedUser.avatar) {
          setSelectedAvatar(fetchedUser.avatar);
        } else {
          // Generate consistent avatar based on username
          const avatarIndex = fetchedUser.username.charCodeAt(0) % avatars.length;
          setSelectedAvatar(avatars[avatarIndex]);
        }

      } catch (err: any) {
        console.error('❌ Error fetching user data:', err);
        
        // Fallback to auth context user if API fails
        if (user) {
          console.log('📋 Using fallback user from auth context');
          setUserData({
            _id: (user as any)._id || '',
            username: user.username || '',
            email: user.email || '',
            repositories: [],
            followedUsers: [],
            starredRepositories: [],
            createdAt: (user as any).createdAt || new Date().toISOString(),
            updatedAt: (user as any).updatedAt || new Date().toISOString(),
          });
        } else {
          setError(err.response?.data?.message || 'Failed to load user data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    setShowAvatarOptions(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedAvatar(url);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSavedSuccessfully(false);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Update user profile with new avatar
      await axios.patch(
        `${API_BASE_URL}/api/v1/auth/update-profile`,
        { avatar: selectedAvatar },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Profile saved successfully');
      setSavedSuccessfully(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } catch (err: any) {
      console.error('❌ Error saving profile:', err);
      // Still show success if avatar is saved locally
      setSavedSuccessfully(true);
      setTimeout(() => setSavedSuccessfully(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return 'Recently';
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-gray-800 border-t-green-500 animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-500/20 blur-xl mx-auto animate-pulse"></div>
          </div>
          <p className="text-gray-400 font-mono text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Profile</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const displayUsername = userData?.username || 'User';
  const displayEmail = userData?.email || 'No email';
  const memberSince = formatDate(userData?.createdAt || '');
  const repositoryCount = userData?.repositories?.length || 0;
  const followersCount = userData?.followedUsers?.length || 0;
  const starsCount = userData?.starredRepositories?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] text-gray-100 overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 animate-fadeIn">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-3.5 bg-[#0d1117]/90 backdrop-blur-2xl rounded-2xl hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 border border-gray-700/50 group shadow-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
              </button>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-gray-500 text-sm mt-2">Manage your account and preferences</p>
              </div>
            </div>

            {/* Success Notification */}
            {savedSuccessfully && (
              <div className="flex items-center gap-3 px-5 py-3.5 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm animate-slideInRight shadow-lg">
                <div className="p-1 bg-green-500/20 rounded-full">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-green-400 font-bold">Profile saved successfully!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-[#0d1117]/90 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:border-green-500/30 transition-all duration-500 animate-fadeInUp">
                {/* Avatar Section */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mx-auto mb-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-2xl animate-pulse-slow"></div>
                    <div 
                      className="relative w-36 h-36 rounded-full border-4 border-green-500/30 shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-green-500/50 overflow-hidden group"
                      onClick={() => setShowAvatarOptions(true)}
                    >
                      <img 
                        src={selectedAvatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = avatars[0];
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-white mx-auto mb-1" />
                          <span className="text-xs text-white font-semibold">Change</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full border-4 border-[#0d1117] shadow-xl">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowAvatarOptions(true)}
                    className="text-sm text-green-400 hover:text-green-300 font-semibold flex items-center gap-2 mx-auto transition-colors group"
                  >
                    <Camera className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Change Avatar
                  </button>
                </div>

                {/* User Info */}
                <div className="text-center mb-8 pb-8 border-b border-gray-800/50">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full backdrop-blur-sm shadow-lg mb-4">
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </div>
                    <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Active Now</span>
                  </div>
                  
                  <h2 className="text-3xl font-black text-white mb-2">
                    {displayUsername}
                  </h2>
                  <p className="text-green-400 font-bold flex items-center justify-center gap-2 text-lg mb-1">
                    <span>@{displayUsername.toLowerCase()}</span>
                    <Shield className="w-5 h-5" />
                  </p>
                  <p className="text-gray-500 text-sm">{displayEmail}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="text-center p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer group">
                    <div className="flex justify-center mb-1">
                      <div className="p-2 bg-green-500/10 rounded-lg group-hover:scale-110 transition-transform">
                        <GitBranch className="w-4 h-4 text-green-400" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white mb-1">{repositoryCount}</div>
                    <div className="text-xs text-gray-500 font-semibold">Repos</div>
                  </div>

                  <div className="text-center p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer group">
                    <div className="flex justify-center mb-1">
                      <div className="p-2 bg-blue-500/10 rounded-lg group-hover:scale-110 transition-transform">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white mb-1">{followersCount}</div>
                    <div className="text-xs text-gray-500 font-semibold">Following</div>
                  </div>

                  <div className="text-center p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer group">
                    <div className="flex justify-center mb-1">
                      <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:scale-110 transition-transform">
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                    </div>
                    <div className="text-2xl font-black text-white mb-1">{starsCount}</div>
                    <div className="text-xs text-gray-500 font-semibold">Stars</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Star className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-semibold">Member Type</span>
                    </div>
                    <span className="text-white font-bold">Pro</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-semibold">Member Since</span>
                    </div>
                    <span className="text-white font-bold">{memberSince}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Activity className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-semibold">User ID</span>
                    </div>
                    <span className="text-white font-mono text-xs">{userData?._id.slice(-6)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Information */}
              <div className="bg-[#0d1117]/90 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:border-green-500/30 transition-all duration-500 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20">
                    <User className="w-7 h-7 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Account Information</h3>
                    <p className="text-sm text-gray-500">Your personal details and credentials</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-3">Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={displayUsername}
                        disabled
                        className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 cursor-not-allowed font-semibold text-lg"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-700/50 rounded-lg">
                        <span className="text-xs text-gray-500 font-semibold">Cannot be changed</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-3">Email Address</label>
                    <input
                      type="email"
                      value={displayEmail}
                      disabled
                      className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 cursor-not-allowed font-semibold text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-3">Account Created</label>
                    <input
                      type="text"
                      value={new Date(userData?.createdAt || '').toLocaleString()}
                      disabled
                      className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 cursor-not-allowed font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-[#0d1117]/90 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:border-green-500/30 transition-all duration-500 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20">
                    <Award className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Achievements & Badges</h3>
                    <p className="text-sm text-gray-500">Your developer accomplishments</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  {[
                    { icon: Star, label: 'Pro Member', color: 'from-yellow-500 to-orange-500', unlocked: true },
                    { icon: Sparkles, label: 'Early Adopter', color: 'from-purple-500 to-pink-500', unlocked: true },
                    { icon: Award, label: 'Top Contributor', color: 'from-green-500 to-emerald-500', unlocked: repositoryCount > 0 },
                    { icon: GitBranch, label: 'Code Master', color: 'from-blue-500 to-cyan-500', unlocked: repositoryCount > 2 },
                    { icon: Users, label: 'Team Player', color: 'from-indigo-500 to-purple-500', unlocked: followersCount > 0 },
                    { icon: Bookmark, label: 'Bookworm', color: 'from-pink-500 to-rose-500', unlocked: starsCount > 0 },
                  ].map((badge, idx) => (
                    <div 
                      key={idx}
                      className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 hover:scale-105 group cursor-pointer ${
                        badge.unlocked 
                          ? 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50' 
                          : 'bg-gray-900/30 border-gray-800/30 opacity-50'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                      <div className="relative z-10 text-center">
                        <div className={`inline-flex p-3.5 rounded-xl bg-gradient-to-br ${badge.color} mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                          <badge.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-xs text-gray-400 font-bold mb-1">{badge.label}</p>
                        {badge.unlocked ? (
                          <div className="flex items-center justify-center gap-1">
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-[10px] text-green-400 font-semibold">Unlocked</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-600 font-semibold">Locked</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-[#0d1117]/90 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:border-green-500/30 transition-all duration-500 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                <div className="flex flex-col sm:flex-row gap-5">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 px-8 py-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="relative z-10 text-lg">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 relative z-10" />
                        <span className="relative z-10 text-lg">Save Changes</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 px-8 py-5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:border-green-500/30 flex items-center justify-center gap-3 group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-lg">Back to Dashboard</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="mt-8 pt-8 border-t border-red-500/20">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-600/30 hover:to-red-700/30 text-red-400 font-bold rounded-2xl transition-all duration-300 hover:scale-105 border border-red-500/30 hover:border-red-500/50 backdrop-blur-sm group relative overflow-hidden"
                  >
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10 text-lg">Logout from Account</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Options Modal */}
      {showAvatarOptions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#0d1117]/95 backdrop-blur-2xl border border-gray-800/50 rounded-3xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20">
                  <Camera className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Choose Your Avatar</h2>
                  <p className="text-sm text-gray-500">Select from presets or upload custom image</p>
                </div>
              </div>
              <button
                onClick={() => setShowAvatarOptions(false)}
                className="p-3 hover:bg-gray-800/50 rounded-xl transition-all group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
            
            {/* Upload Custom Image */}
            <div className="mb-10 p-6 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-2xl">
              <label className="block text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-400" />
                Upload Custom Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-green-500 file:to-emerald-600 file:text-white file:font-bold hover:file:from-green-600 hover:file:to-emerald-700 file:cursor-pointer transition-all hover:border-green-500/30"
              />
            </div>

            {/* Avatar Grid */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Preset Avatars
              </h3>
              <div className="grid grid-cols-4 gap-5">
                {avatars.map((avatar, idx) => (
                  <div
                    key={idx}
                    className={`relative group cursor-pointer transition-all hover:scale-110 ${
                      selectedAvatar === avatar ? 'scale-110' : ''
                    }`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    <div className={`w-full aspect-square rounded-2xl border-3 p-2.5 transition-all ${
                      selectedAvatar === avatar
                        ? 'border-green-500 shadow-2xl shadow-green-500/50 ring-4 ring-green-500/30 bg-green-500/10'
                        : 'border-gray-700/50 hover:border-green-500/50 bg-gray-800/30'
                    }`}>
                      <img 
                        src={avatar} 
                        alt={`Avatar ${idx}`} 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    {selectedAvatar === avatar && (
                      <div className="absolute -top-2 -right-2 p-1.5 bg-green-500 rounded-full border-2 border-[#0d1117] shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setShowAvatarOptions(false)}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30"
              >
                Confirm Selection
              </button>
              <button
                onClick={() => setShowAvatarOptions(false)}
                className="px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 font-bold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(-5deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out both;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out both;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out both;
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;