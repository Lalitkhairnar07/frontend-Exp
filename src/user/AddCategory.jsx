import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const AddCategory = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (data) => {
    try {
      setIsSubmitting(true);
      console.log('Adding Category:', data);
      
      let res;
      if (data.type === 'expense') {
        res = await axios.post('/expenseCategory/', data);
      } else if (data.type === 'income') {
        res = await axios.post('/incomeCat/', data);
      }

      if (res && (res.status === 200 || res.status === 201)) {
        toast.success('Category added successfully!');
        reset();
        navigate('/my-categories');
      } else {
        toast.error('Failed to create category.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error.response?.data?.message || 'Failed to add category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header Block */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 p-6 sm:p-8 border-b border-slate-850">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center tracking-tight">
            Create Category
          </h1>
          <p className="text-slate-400 text-center mt-2 text-sm">
            Organize your finances by setting custom category buckets
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(submitHandler)} className="p-6 sm:p-8 space-y-6">
          
          {/* 1. Category Type Dropdown */}
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-semibold text-slate-300">
              Category Type *
            </label>
            <div className="relative">
              <select
                id="type"
                className={`w-full px-4 py-3 bg-slate-800 border ${
                  errors.type ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-indigo-500'
                } rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none`}
                {...register('type', { required: 'Category type is required' })}
              >
                <option value="" className="bg-slate-900">Select Category Type</option>
                <option value="expense" className="bg-slate-900">Expense</option>
                <option value="income" className="bg-slate-900">Income</option>
              </select>
              
              {/* Select Chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.type && (
              <p className="text-red-400 text-xs font-semibold mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* 2. Category Name Input */}
          <div className="space-y-2">
            <label htmlFor="catName" className="block text-sm font-semibold text-slate-300">
              Category Name *
            </label>
            <input
              type="text"
              id="catName"
              placeholder="e.g. Food, Travel, Investments"
              className={`w-full px-4 py-3 bg-slate-800 border ${
                errors.catName ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-indigo-500'
              } rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder-slate-550`}
              {...register('catName', { required: 'Category name is required' })}
            />
            {errors.catName && (
              <p className="text-red-400 text-xs font-semibold mt-1">{errors.catName.message}</p>
            )}
          </div>

          {/* 3. Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-slate-300">
              Description (Optional)
            </label>
            <input
              type="text"
              id="description"
              placeholder="Provide a brief context or notes"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-slate-550"
              {...register('description')}
            />
          </div>

          {/* 4. Submit Button */}
          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3.5 px-4 font-bold text-white rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${
                isSubmitting
                  ? 'bg-indigo-650 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 shadow-indigo-600/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  Create Category
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/my-categories')}
              className="px-6 py-3.5 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};