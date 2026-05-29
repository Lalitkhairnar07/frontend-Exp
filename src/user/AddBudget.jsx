import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const AddBudget = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (data) => {
        try {
            setIsSubmitting(true);
            const res = await axiosInstance.post('/budget', data);
            toast.success("Budget added successfully!");
            reset();
            navigate('/budget'); // Or wherever you want to redirect to view the budget
        } catch (error) {
            console.error("Error adding budget:", error);
            toast.error(error.response?.data?.message || "Failed to add budget. You may already have one active.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-gray-50">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center tracking-tight">Add Budget</h1>
                    <p className="text-blue-100 text-center mt-2 text-sm sm:text-base">Set up a new budget to track your spending</p>
                </div>

                <form onSubmit={handleSubmit(submitHandler)} className="p-6 sm:p-8 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="maxAmount" className="block text-sm font-semibold text-gray-700">
                            Maximum Amount (₹)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-medium text-lg">₹</span>
                            </div>
                            <input
                                type="number"
                                id="maxAmount"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white text-lg font-medium"
                                placeholder="e.g., 50000"
                                {...register("maxAmount", { 
                                    required: "Maximum amount is required",
                                    min: { value: 1, message: "Amount must be greater than 0" }
                                })}
                            />
                        </div>
                        {errors.maxAmount && <span className="text-red-500 text-sm">{errors.maxAmount.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700">
                            Start Date
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                            {...register("startDate", { required: "Start date is required" })}
                        />
                        {errors.startDate && <span className="text-red-500 text-sm">{errors.startDate.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700">
                            End Date
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                            {...register("endDate", { required: "End date is required" })}
                        />
                        {errors.endDate && <span className="text-red-500 text-sm">{errors.endDate.message}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3.5 px-4 font-bold text-white rounded-xl shadow-md transition-all duration-300 transform flex justify-center items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            isSubmitting 
                            ? 'bg-indigo-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding Budget...
                            </>
                        ) : (
                            'Add Budget'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
