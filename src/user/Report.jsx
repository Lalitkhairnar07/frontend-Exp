import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export const Report = () => {
    const [expenses, setExpenses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [categoryData, setCategoryData] = useState({labels:[],datasets:[]})
    const [paymentModeData, setPaymentModeData] = useState({labels:[],datasets:[]})
    const [summaryStats, setSummaryStats] = useState({
        totalExpenses: 0,
        totalAmount: 0,
        avgExpense: 0
    })

    const getMyExpenses = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const res = await axiosInstance.get(`/exp/expbyuserid`)
            const expenseData = res.data.data || []
            setExpenses(expenseData)

            if (Array.isArray(expenseData) && expenseData.length > 0) {
                // Calculate summary statistics
                const totalAmount = expenseData.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)
                const stats = {
                    totalExpenses: expenseData.length,
                    totalAmount: totalAmount,
                    avgExpense: totalAmount / expenseData.length
                }
                setSummaryStats(stats)

                // Group expenses by category
                const categoryTotals = expenseData.reduce((acc, exp) => {
                    const catName = exp.expCategory?.catName?.toUpperCase() || 'UNCATEGORIZED'
                    acc[catName] = (acc[catName] || 0) + parseFloat(exp.amount || 0)
                    return acc
                }, {})

                // Group expenses by payment mode
                const paymentTotals = expenseData.reduce((acc, exp) => {
                    const mode = exp.paymentMode || 'UNKNOWN'
                    acc[mode] = (acc[mode] || 0) + parseFloat(exp.amount || 0)
                    return acc
                }, {})

                // Category Pie Chart Data
                const categoryChartData = {
                    labels: Object.keys(categoryTotals),
                    datasets: [{
                        label: 'Amount ($)',
                        data: Object.values(categoryTotals),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)',
                            'rgba(255, 159, 64, 0.8)',
                            'rgba(199, 199, 199, 0.8)',
                            'rgba(83, 102, 255, 0.8)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(199, 199, 199, 1)',
                            'rgba(83, 102, 255, 1)',
                        ],
                        borderWidth: 2,
                    }]
                }
                setCategoryData(categoryChartData)

                // Payment Mode Bar Chart Data
                const paymentChartData = {
                    labels: Object.keys(paymentTotals),
                    datasets: [{
                        label: 'Amount ($)',
                        data: Object.values(paymentTotals),
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false,
                    }]
                }
                setPaymentModeData(paymentChartData)
            }

        } catch (err) {
            console.error("Error fetching expenses", err)
            setError('Failed to load expense data. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(()=>{
            getMyExpenses();
    },[])
    return (
        <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                        Expense Analytics
                    </h1>
                    
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-slate-400 text-sm font-medium">Total Expenses</p>
                                <p className="text-2xl font-bold text-white">{summaryStats.totalExpenses}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-slate-400 text-sm font-medium">Total Amount</p>
                                <p className="text-2xl font-bold text-white">${summaryStats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-slate-400 text-sm font-medium">Average Expense</p>
                                <p className="text-2xl font-bold text-white">${summaryStats.avgExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col justify-center items-center h-96 space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="text-indigo-400 font-medium text-lg">Analyzing your expenses...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="rounded-lg bg-red-50 p-6 shadow-sm border border-red-200 mb-8">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Charts Grid */}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Category Pie Chart */}
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white mb-2">Spending by Category</h2>
                                <p className="text-slate-400 text-sm">Distribution of expenses across different categories</p>
                            </div>
                            <div className="h-80">
                                <Pie
                                    data={categoryData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    color: 'rgba(148, 163, 184, 1)',
                                                    font: { size: 12 }
                                                }
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function(context) {
                                                        return `${context.label}: $${context.parsed.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Payment Mode Bar Chart */}
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-white mb-2">Payment Methods</h2>
                                <p className="text-slate-400 text-sm">Breakdown of spending by payment mode</p>
                            </div>
                            <div className="h-80">
                                <Bar
                                    data={paymentModeData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: { color: 'rgba(51, 65, 85, 0.3)' },
                                                ticks: {
                                                    color: 'rgba(148, 163, 184, 1)',
                                                    callback: function(value) {
                                                        return '$' + value.toLocaleString();
                                                    }
                                                }
                                            },
                                            x: {
                                                grid: { color: 'rgba(51, 65, 85, 0.3)' },
                                                ticks: { color: 'rgba(148, 163, 184, 1)' }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: function(context) {
                                                        return `$${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* No Data State */}
                {!isLoading && !error && expenses.length === 0 && (
                    <div className="text-center py-20 bg-slate-900 rounded-2xl shadow-sm border border-slate-800">
                        <div className="mx-auto h-24 w-24 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <svg className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-slate-300">No expense data available</h3>
                        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
                            Start adding expenses to see detailed analytics and insights about your spending patterns.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}