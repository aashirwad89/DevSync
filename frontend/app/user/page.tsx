/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/authContext';
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
  X
} from 'lucide-react';

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

function ProfilePage() {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Debug: Check what's in user object
  useEffect(() => {
    console.log('🔍 User object from auth:', user);
    console.log('📝 Username:', user?.username);
    console.log('📧 Email:', user?.email);
  }, [user]);

  // Get username - handle both 'username' and 'name' fields from backend
  const getUsername = () => {
    // Backend might send 'username' or 'name' field
    return user?.username || (user as any)?.name || 'DevUser';
  };

  // Get email
  const getEmail = () => {
    return user?.email || 'user@email.com';
  };

  // Get member since date
  const getMemberSince = () => {
    if ((user as any)?.createdAt) {
      return new Date((user as any).createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    }
    return 'Jan 2024';
  };

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Saving profile:', { 
      username: getUsername(), 
      avatar: selectedAvatar 
    });
    
    setIsSaving(false);
    setSavedSuccessfully(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setSavedSuccessfully(false), 3000);
  };

  const displayUsername = getUsername();
  const displayEmail = getEmail();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a] text-gray-100 overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fadeIn">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-3 bg-[#0d1117]/80 backdrop-blur-xl rounded-2xl hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 border border-gray-700/50 group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
              </button>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
              </div>
            </div>

            {/* Success Notification */}
            {savedSuccessfully && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm animate-slideInRight">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Profile saved!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-[#0d1117]/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:border-green-500/30 transition-all duration-500 animate-fadeInUp">
                {/* Avatar Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block mx-auto mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-2xl"></div>
                    <div 
                      className="relative w-32 h-32 rounded-full border-4 border-green-500/30 shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-green-500/50 overflow-hidden group"
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
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-2 bg-green-500 rounded-full border-4 border-[#0d1117] shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowAvatarOptions(true)}
                    className="text-sm text-green-400 hover:text-green-300 font-semibold flex items-center gap-2 mx-auto transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Change Avatar
                  </button>
                </div>

                {/* User Info */}
                <div className="text-center mb-6 pb-6 border-b border-gray-800/50">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-full backdrop-blur-sm shadow-lg mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-bold uppercase tracking-wide">Active</span>
                  </div>
                  
                  <h2 className="text-2xl font-black text-white mb-1">
                    {displayUsername}
                  </h2>
                  <p className="text-green-400 font-semibold flex items-center justify-center gap-1">
                    <span>@{displayUsername.toLowerCase()}</span>
                    <Shield className="w-4 h-4" />
                  </p>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Star className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-semibold">Member Type</span>
                    </div>
                    <span className="text-white font-bold">Pro</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-semibold">Member Since</span>
                    </div>
                    <span className="text-white font-bold">{getMemberSince()}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Mail className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="text-gray-400 text-sm font-semibold">Email</span>
                    </div>
                    <span className="text-white font-bold text-xs">{displayEmail}</span>
                  </div>
                </div>

                {/* Debug Info - Remove this in production */}
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-xs text-yellow-400 font-mono">
                    Debug: {user ? 'User logged in ✅' : 'No user ❌'}
                  </p>
                  {user && (
                    <p className="text-xs text-yellow-400 font-mono mt-1">
                      Fields: {Object.keys(user).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Information */}
              <div className="bg-[#0d1117]/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:border-green-500/30 transition-all duration-500 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                    <User className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Account Information</h3>
                    <p className="text-sm text-gray-500">Your personal details</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={displayUsername}
                        disabled
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 cursor-not-allowed font-semibold"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-700/50 rounded-lg">
                        <span className="text-xs text-gray-500 font-semibold">Cannot be changed</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={displayEmail}
                      disabled
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 cursor-not-allowed font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-[#0d1117]/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:border-green-500/30 transition-all duration-500 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Achievements</h3>
                    <p className="text-sm text-gray-500">Your developer badges</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Star, label: 'Pro Member', color: 'from-yellow-500 to-orange-500' },
                    { icon: Sparkles, label: 'Early Adopter', color: 'from-purple-500 to-pink-500' },
                    { icon: Award, label: 'Top Contributor', color: 'from-green-500 to-emerald-500' },
                  ].map((badge, idx) => (
                    <div 
                      key={idx}
                      className="relative overflow-hidden p-4 bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 group cursor-pointer"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                      <div className="relative z-10 text-center">
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${badge.color} bg-opacity-10 mb-2 group-hover:scale-110 transition-transform`}>
                          <badge.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-xs text-gray-400 font-semibold">{badge.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-[#0d1117]/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl hover:border-green-500/30 transition-all duration-500 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="relative z-10">Saving...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Save Changes</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:border-green-500/30 flex items-center justify-center gap-3 group"
                  >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="mt-6 pt-6 border-t border-red-500/20">
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-600/30 hover:to-red-700/30 text-red-400 font-bold rounded-2xl transition-all duration-300 hover:scale-105 border border-red-500/30 hover:border-red-500/50 backdrop-blur-sm group relative overflow-hidden"
                  >
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                    <span className="relative z-10">Logout</span>
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
          <div className="bg-[#0d1117]/95 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <Camera className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Choose Your Avatar</h2>
                  <p className="text-sm text-gray-500">Select from presets or upload custom</p>
                </div>
              </div>
              <button
                onClick={() => setShowAvatarOptions(false)}
                className="p-2 hover:bg-gray-800/50 rounded-xl transition-all group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
            
            {/* Upload Custom Image */}
            <div className="mb-8 p-6 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-2xl">
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-green-400" />
                Upload Custom Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-green-500 file:to-emerald-600 file:text-white file:font-semibold hover:file:from-green-600 hover:file:to-emerald-700 file:cursor-pointer transition-all hover:border-green-500/30"
              />
            </div>

            {/* Avatar Grid */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Preset Avatars
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {avatars.map((avatar, idx) => (
                  <div
                    key={idx}
                    className={`relative group cursor-pointer transition-all hover:scale-110 ${
                      selectedAvatar === avatar ? 'scale-110' : ''
                    }`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    <div className={`w-full aspect-square rounded-2xl border-3 p-2 transition-all ${
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
                      <div className="absolute -top-2 -right-2 p-1 bg-green-500 rounded-full border-2 border-[#0d1117] shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAvatarOptions(false)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30"
              >
                Confirm Selection
              </button>
              <button
                onClick={() => setShowAvatarOptions(false)}
                className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 text-gray-300 font-bold rounded-xl transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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
            transform: scale(0.9);
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
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
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
      `}</style>
    </div>
  );
}

export default ProfilePage;
