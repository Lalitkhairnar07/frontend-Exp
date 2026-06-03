import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-toastify'

export const MyExpenses = () => {
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [type, settype] = useState("expense")

    const getMyExpenses = async () => {
        try {
            setLoading(true)
            const url = searchTerm 
                ? `/exp/search?expName=${searchTerm}&type=${type}` 
                : `/exp/expbyuserid?type=${type}`
            const res = await axiosInstance.get(url)
            setExpenses(res.data.data)
            console.log(res.data.data)
        } catch (err) {
            console.error("Error fetching expenses", err)
        } finally {
            setLoading(false)
        }
    }

    const deleteExpense = async (id) => {
        // if (!window.confirm('Delete this expense?')) return
        try {
            await axiosInstance.delete(`/exp/${id}`)
            setExpenses(prev => prev.filter(exp => exp._id !== id))
            toast.success('Expense deleted successfully')
        } catch (err) {
            console.error('Error deleting expense', err)
            toast.error(err.response?.data?.message || 'Failed to delete expense')
        }
    }

   
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getMyExpenses()
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [searchTerm,type])

    return (
        <div className="text-slate-200">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">My Expenses</h1>
                    
                    <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64 flex-1">
                            <input 
                                type="text"
                                placeholder="Search expenses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <select className='px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium border border-indigo-500/20 whitespace-nowrap' onChange={(e) => settype(e.target.value)} value={type}>
                            <option value="expense">EXPENSE</option>
                            <option value="income">INCOME</option>
                        </select>
                        <span className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium border border-indigo-500/20 whitespace-nowrap">
                            Total Records: {expenses?.length || 0}
                        </span>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800/50 border-b border-slate-700">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Title</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Description</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Mode</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-slate-500 italic">
                                            Loading your expenses...
                                        </td>
                                    </tr>
                                ) : expenses.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-slate-500 italic">
                                            No expenses found.
                                        </td>
                                    </tr>
                                ) : (
                                    expenses.map((ex) => (
                                        <tr key={ex._id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{ex.title}</td>
                                            <td className="px-6 py-4 max-w-xs truncate text-slate-400" title={ex.description}>
                                                {ex.description || '---'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-emerald-400">
                                                ${parseFloat(ex.amount || ex.income).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                                                {new Date(ex.expenseDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 bg-slate-800 text-indigo-300 rounded-lg text-sm border border-slate-700">
                                                    {(ex.expCategory?.catName || ex.incomeCategory?.catName)?.toUpperCase() || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                                    ex.paymentMode === 'CASH' ? 'text-amber-400 bg-amber-400/10' :
                                                    ex.paymentMode === 'CARD' ? 'text-blue-400 bg-blue-400/10' :
                                                    ex.paymentMode === 'UPI' ? 'text-purple-400 bg-purple-400/10' :
                                                    'text-slate-400 bg-slate-400/10'
                                                }`}>
                                                    {ex.paymentMode}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExpense(ex._id)}
                                                    className="inline-flex items-center px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-500 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-700 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}