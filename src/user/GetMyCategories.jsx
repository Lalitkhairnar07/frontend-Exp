import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { Link } from 'react-router-dom';

export const GetMyCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAllCategories = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('/expenseCategory/get');
            console.log(res.data);
            
            // Handle different possible response structures safely
            const data = res.data?.data || res.data;
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                setCategories([]);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <div className="w-full h-full font-sans">
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            My Categories
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage your expense categories efficiently.
                        </p>
                    </div>
                    {/* Add Category Button using generic SVGs */}
                    <Link
                        to="/user/addcategory"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Category
                    </Link>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-64 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="text-indigo-600 font-medium">Loading categories...</p>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="rounded-lg bg-red-50 p-4 shadow-sm border border-red-200">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : categories.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="mx-auto h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">No categories found</h3>
                        <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                            Get started by creating your first expense category to organize your finances.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/user/addcategory"
                                className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Category
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Categories Grid */
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {categories.map((category, index) => (
                            <div
                                key={category._id || index}
                                className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 ease-in-out group hover:-translate-y-1"
                            >
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-indigo-50 rounded-xl p-3.5 group-hover:bg-indigo-100 transition-colors duration-300">
                                            <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-500 truncate uppercase tracking-wider">
                                                Category
                                            </p>
                                            <h3 className="text-lg font-bold text-gray-900 truncate mt-1">
                                                {category.name || category.categoryName || 'Unnamed Category'}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    {category.description && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {category.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center group-hover:bg-gray-100 transition-colors duration-300">
                                    <div className="text-sm">
                                        <button className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
                                            View Details
                                            <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {/* Additional metadata can go here */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};