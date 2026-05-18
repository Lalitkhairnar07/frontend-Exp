import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getProfile = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/user/me');
            setUser(res.data.user);
        } catch (error) {
            console.error("Error fetching profile", error);
            toast.error(error.response?.data?.message || 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="text-center bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-400 mb-4">No Profile Found</h2>
                    <p className="text-slate-500">We couldn't load your profile information.</p>
                </div>
            </div>
        );
    }

    // Default avatar if no profilePic is available
    const getInitials = () => {
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-200">
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative">
                    {/* Header Background */}
                    <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-50 backdrop-blur-sm"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
                    </div>
                    
                    <div className="px-8 pb-12">
                        {/* Profile Picture & Basic Info */}
                        <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-24 mb-8 sm:mb-12 gap-6">
                            <div className="relative z-10 group cursor-pointer">
                                {user.profilePic ? (
                                    <img 
                                        src={user.profilePic} 
                                        alt="Profile" 
                                        className="w-40 h-40 rounded-full border-4 border-slate-900 object-cover shadow-xl transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-40 h-40 rounded-full border-4 border-slate-900 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-105">
                                        <span className="text-5xl font-bold text-white tracking-wider">{getInitials()}</span>
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center" title={user.status || 'Active'}>
                                </div>
                            </div>
                            
                            <div className="text-center sm:text-left flex-1 pb-2">
                                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="text-indigo-400 font-medium text-lg flex items-center justify-center sm:justify-start gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {user.email}
                                </p>
                            </div>

                            <div className="hidden sm:block pb-2">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${
                                    user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}>
                                    {user.status || 'Active'}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {/* Personal Details */}
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Personal Information
                                </h3>
                                
                                <div className="space-y-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Full Name</span>
                                        <span className="text-lg text-slate-200 font-semibold">{user.firstName} {user.lastName}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Email Address</span>
                                        <span className="text-lg text-slate-200 font-semibold">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Account Details
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Age</span>
                                        <span className="text-lg text-slate-200 font-semibold">{user.age || 'Not specified'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Gender</span>
                                        <span className="text-lg text-slate-200 font-semibold">{user.gender || 'Not specified'}</span>
                                    </div>
                                    <div className="flex flex-col col-span-2">
                                        <span className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Joined On</span>
                                        <span className="text-lg text-slate-200 font-semibold">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            }) : 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
