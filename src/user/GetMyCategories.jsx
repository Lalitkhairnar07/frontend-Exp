import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../api/axiosInstance';

export const GetMyCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryType, setCategoryType] = useState('expense');
  const [error, setError] = useState(null);

  const getAllCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get('/expenseCategory/get');
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching expense categories:', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllIncomeCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get('/incomeCat/incomeCategory');
      const dataArray = res.data.data || res.data;
      if (Array.isArray(dataArray)) {
        setCategories(dataArray);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching income categories:', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category? All expenses linked to this category will also be deleted.')) return;
    try {
      if (categoryType === 'expense') {
        await axios.delete(`/expenseCategory/${id}`);
      } else {
        await axios.delete(`/incomeCat/${id}`);
      }
      toast.success('Category deleted successfully!');
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  useEffect(() => {
    if (categoryType === 'expense') {
      getAllCategories();
    } else {
      getAllIncomeCategories();
    }
  }, [categoryType]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* 1. HEADER ROW */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Categories
          </h1>
          <p className="text-slate-400 text-sm">
            Configure custom classification buckets for expenditures and deposits.
          </p>
        </div>

        <Link
          to="/add-category"
          className="inline-flex items-center px-5 py-3 bg-indigo-600 hover:bg-indigo-500 border border-transparent rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-550/30 text-sm font-bold text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 gap-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </Link>
      </section>

      {/* 2. FILTER & SORT AREA */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
            Classification Type
          </label>
          <div className="relative">
            <select
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-10 appearance-none"
            >
              <option value="expense">Expense Categories</option>
              <option value="income">Income Categories</option>
            </select>
            {/* Select Chevron */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/25 whitespace-nowrap self-stretch sm:self-auto text-center">
          Total Buckets: {categories.length}
        </div>
      </section>

      {/* 3. CORE VIEWS (LOADING / ERROR / EMPTY / GRID) */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
          </div>
          <p className="text-slate-400 text-sm font-semibold tracking-wide animate-pulse">Querying categories...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/25 p-5 shadow-sm">
          <div className="flex gap-3">
            <div className="shrink-0 text-red-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-400">Data Query Error</h3>
              <p className="mt-1 text-xs text-red-300/80">{error}</p>
            </div>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 rounded-3xl shadow-md border border-slate-800 p-8 space-y-4 flex flex-col justify-center items-center">
          <div className="w-16 h-16 bg-slate-800/80 rounded-full flex items-center justify-center text-slate-500 mb-2">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-300">No categories found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
              Start adding your custom classification buckets to organize your incomes and expenses neatly.
            </p>
          </div>
          <Link
            to="/add-category"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl shadow-md transition-all mt-4"
          >
            Create Category Buckets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-slate-900 border border-slate-800 overflow-hidden rounded-3xl hover:border-slate-700/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between h-48"
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="shrink-0 bg-indigo-500/10 rounded-2xl p-3 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                      Category
                    </p>
                    <h3 className="text-base font-bold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
                      {(category.catName || category.name || 'Unnamed Category').toUpperCase()}
                    </h3>
                  </div>
                </div>

                {category.description && (
                  <p className="text-slate-400 text-xs mt-4 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Bottom Actions Area inside Category Card */}
              <div className="bg-slate-950/40 px-6 py-3.5 border-t border-slate-800/80 flex justify-between items-center group-hover:bg-slate-950/60 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {categoryType === 'expense' ? '💸 DEBIT' : '💰 CREDIT'}
                </span>
                
                <button
                  onClick={() => deleteCategory(category._id)}
                  className="font-bold text-rose-500 hover:text-rose-400 text-xs transition-colors flex items-center bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg gap-1.5"
                  title="Remove category bucket"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
