import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const getProfile = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/user/me');
            setUser(res.data.user);
            reset(res.data.user);
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

    const onSubmit = async (data) => {
        try {
            setIsUpdating(true);
            // const res = await axiosInstance.put('/user/me', data);
            setUser(res.data.user);
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile", error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            toast.info("Uploading image...", { autoClose: false, toastId: 'uploading' });
            const res = await axiosInstance.put('/user/profilePic', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(res.data.user);
            toast.update('uploading', { render: "Profile picture updated successfully!", type: "success", autoClose: 3000 });
        } catch (error) {
            console.error("Error uploading profile pic", error);
            toast.update('uploading', { render: error.response?.data?.message || 'Failed to upload image', type: "error", autoClose: 3000 });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center py-20 text-white">
                <div className="text-center bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-400 mb-4">No Profile Found</h2>
                    <p className="text-slate-500">We couldn't load your profile information.</p>
                </div>
            </div>
        );
    }

    const getInitials = () => {
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <div className="text-slate-200">
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative">
                    {/* Header Background */}
                    <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-50 backdrop-blur-sm"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
                    </div>
                    
                    <div className="px-8 pb-12">
                        {/* Profile Picture & Basic Info */}
                        <div className="relative flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-24 mb-8 sm:mb-12 gap-6">
                            <div className="relative z-10 flex items-center justify-center">
                                {user.profilePic ? (
                                    <img 
                                        src={user.profilePic} 
                                        alt="Profile" 
                                        className="w-40 h-40 rounded-full border-4 border-slate-900 object-cover shadow-xl"
                                    />
                                ) : (
                                    <div className="w-40 h-40 rounded-full border-4 border-slate-900 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                                        <span className="text-5xl font-bold text-white tracking-wider">{getInitials()}</span>
                                    </div>
                                )}
                                
                                {/* Status Indicator */}
                                <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900 z-20" title={user.status || 'Active'}></div>

                                {/* Visible Upload Button on Side */}
                                <label className="absolute bottom-2 -right-4 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-full cursor-pointer shadow-lg transition-transform hover:scale-110 border-4 border-slate-900 z-20 flex items-center justify-center" title="Update Profile Picture">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </label>
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

                        {/* Top Action Bar */}
                        <div className="flex justify-end mb-6">
                            {!isEditing ? (
                                <button
                                    onClick={() => { reset(user); setIsEditing(true); }}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() => { reset(user); setIsEditing(false); }}
                                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel Editing
                                </button>
                            )}
                        </div>

                        {/* View or Edit Mode */}
                        {!isEditing ? (
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
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700/50">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile Details
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">First Name</label>
                                        <input 
                                            type="text" 
                                            {...register("firstName", { required: "First name is required" })}
                                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                            placeholder="Enter your first name"
                                        />
                                        {errors.firstName && <span className="text-red-400 text-xs mt-1 block">{errors.firstName.message}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Last Name</label>
                                        <input 
                                            type="text" 
                                            {...register("lastName", { required: "Last name is required" })}
                                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                            placeholder="Enter your last name"
                                        />
                                        {errors.lastName && <span className="text-red-400 text-xs mt-1 block">{errors.lastName.message}</span>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                                        <input 
                                            type="email" 
                                            {...register("email", { 
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                            className="w-full bg-slate-900 border border-slate-700 text-slate-400 rounded-lg px-4 py-2.5 cursor-not-allowed"
                                            placeholder="Enter your email"
                                            readOnly
                                            title="Email cannot be changed"
                                        />
                                        {errors.email && <span className="text-red-400 text-xs mt-1 block">{errors.email.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Age</label>
                                        <input 
                                            type="number" 
                                            {...register("age", { min: { value: 1, message: "Age must be positive" } })}
                                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                            placeholder="E.g., 25"
                                        />
                                        {errors.age && <span className="text-red-400 text-xs mt-1 block">{errors.age.message}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Gender</label>
                                        <select 
                                            {...register("gender")}
                                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                                            isUpdating 
                                                ? 'bg-indigo-600/50 cursor-not-allowed shadow-none' 
                                                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                                        }`}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Save Profile
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
