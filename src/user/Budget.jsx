import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

export const Budget = () => {
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const fetchBudget = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/budget');
            if (res.data && res.data.data) {
                setBudget(res.data.data);
                
                // Format dates for the form
                const formData = {
                    ...res.data.data,
                    startDate: res.data.data.startDate ? new Date(res.data.data.startDate).toISOString().split('T')[0] : (res.data.data.createdDate ? new Date(res.data.data.createdDate).toISOString().split('T')[0] : ''),
                    endDate: res.data.data.endDate ? new Date(res.data.data.endDate).toISOString().split('T')[0] : ''
                };
                reset(formData);
            } else {
                setBudget(null);
            }
        } catch (error) {
            // 404 is expected if no budget exists
            if (error.response && error.response.status !== 404) {
                console.error("Error fetching budget", error);
                toast.error(error.response?.data?.message || 'Failed to fetch budget');
            }
            setBudget(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudget();
    }, []);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            if (budget) {
                // Update existing budget
                await axiosInstance.put(`/budget/${budget._id}`, data);
                toast.success("Budget updated successfully!");
                setIsEditing(false);
            } else {
                // Create new budget
                await axiosInstance.post('/budget', data);
                toast.success("Budget created successfully!");
            }
            fetchBudget(); // Refresh budget data
        } catch (error) {
            console.error("Error saving budget", error);
            toast.error(error.response?.data?.message || 'Failed to save budget');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your budget?")) return;
        
        try {
            setIsSubmitting(true);
            await axiosInstance.delete(`/budget/${budget._id}`);
            toast.success("Budget deleted successfully!");
            setBudget(null);
            reset({ maxAmount: '', startDate: '', endDate: '' }); // Clear form
        } catch (error) {
            console.error("Error deleting budget", error);
            toast.error(error.response?.data?.message || 'Failed to delete budget');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    // Function to calculate days remaining
    const getDaysRemaining = () => {
        if (!budget || !budget.endDate) return null;
        const end = new Date(budget.endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    return (
        <div>
            <div className="max-w-3xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Budget Management</h1>
                        <p className="text-slate-500 text-lg">Control your expenses by setting a budget goal.</p>
                    </div>
                    {budget && !isEditing && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 hover:-translate-y-0.5"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all border border-red-200 hover:border-red-300 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
                    
                    {/* Display Budget OR Edit Form */}
                    {budget && !isEditing ? (
                        <>
                            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/20 rounded-full mix-blend-overlay filter blur-xl"></div>
                            </div>
                            
                            <div className="px-8 pb-10 -mt-12 relative z-10">
                                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                                    <div className="text-center md:text-left">
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Max Amount</p>
                                        <h2 className="text-5xl font-extrabold text-slate-800 tracking-tight">₹{budget.maxAmount?.toLocaleString()}</h2>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="text-center bg-blue-50 rounded-xl p-4 border border-blue-100 min-w-[120px]">
                                            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Days Left</p>
                                            <p className="text-3xl font-bold text-slate-800">{getDaysRemaining()}</p>
                                        </div>
                                        <div className="text-center bg-slate-50 rounded-xl p-4 border border-slate-100 min-w-[120px]">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                                            <p className={`text-xl font-bold mt-1 ${budget.budgetStatus === 'Active' ? 'text-emerald-500' : 'text-slate-600'}`}>
                                                {budget.budgetStatus || 'Active'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Start Date
                                        </h3>
                                        <p className="text-lg font-medium text-slate-800">
                                            {budget.startDate ? new Date(budget.startDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : (budget.createdDate ? new Date(budget.createdDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A')}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            End Date
                                        </h3>
                                        <p className="text-lg font-medium text-slate-800">
                                            {budget.endDate ? new Date(budget.endDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-8 sm:p-10">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                    {budget ? 'Edit Budget' : 'Set New Budget'}
                                </h2>
                                <p className="text-slate-500">
                                    {budget ? 'Update your current budget constraints below.' : 'Define your spending limit and timeframe to start tracking.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Maximum Amount (₹)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="text-slate-400 font-medium text-lg">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            {...register("maxAmount", { required: "Maximum amount is required", min: { value: 1, message: "Amount must be greater than 0" } })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white text-lg font-medium"
                                            placeholder="50000"
                                        />
                                    </div>
                                    {errors.maxAmount && <span className="text-red-500 text-sm mt-1 block">{errors.maxAmount.message}</span>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            {...register("startDate", { required: "Start date is required" })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white"
                                        />
                                        {errors.startDate && <span className="text-red-500 text-sm mt-1 block">{errors.startDate.message}</span>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            {...register("endDate", { required: "End date is required" })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white"
                                        />
                                        {errors.endDate && <span className="text-red-500 text-sm mt-1 block">{errors.endDate.message}</span>}
                                    </div>
                                </div>
                                
                                {budget && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Status
                                        </label>
                                        <select 
                                            {...register("budgetStatus")}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800 bg-slate-50 focus:bg-white"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Not Active">Not Active</option>
                                        </select>
                                    </div>
                                )}

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-white shadow-md transition-all flex justify-center items-center gap-2 ${
                                            isSubmitting 
                                                ? 'bg-blue-400 cursor-not-allowed shadow-none' 
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25 hover:shadow-lg hover:-translate-y-0.5'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            budget ? 'Update Budget' : 'Create Budget'
                                        )}
                                    </button>
                                    
                                    {budget && isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                // Reset form back to original data
                                                const formData = {
                                                    ...budget,
                                                    startDate: budget.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : (budget.createdDate ? new Date(budget.createdDate).toISOString().split('T')[0] : ''),
                                                    endDate: budget.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : ''
                                                };
                                                reset(formData);
                                            }}
                                            className="px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
