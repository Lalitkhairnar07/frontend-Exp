import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export const ExpenseDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time-of-day greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Execute parallel requests to keep loading time low
        const [userRes, expRes, incRes, budgetRes, catRes] = await Promise.allSettled([
          axiosInstance.get('/user/me'),
          axiosInstance.get('/exp/expbyuserid?type=expense'),
          axiosInstance.get('/exp/expbyuserid?type=income'),
          axiosInstance.get('/budget'),
          axiosInstance.get('/expenseCategory/get'),
        ]);

        if (userRes.status === 'fulfilled') setUser(userRes.value.data.user);
        if (expRes.status === 'fulfilled') setExpenses(expRes.value.data.data || []);
        if (incRes.status === 'fulfilled') setIncomes(incRes.value.data.data || []);
        if (budgetRes.status === 'fulfilled' && budgetRes.value.data?.data) {
          setBudget(budgetRes.value.data.data);
        }
        if (catRes.status === 'fulfilled') setCategories(catRes.value.data.data || []);
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Summary Math
  const totalExpenseAmount = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  const totalIncomeAmount = incomes.reduce((sum, item) => sum + parseFloat(item.income || 0), 0);
  const netSavings = totalIncomeAmount - totalExpenseAmount;
  
  // Calculate budget utilization percentage
  const budgetLimit = budget ? parseFloat(budget.maxAmount || 0) : 0;
  const budgetUtilization = budgetLimit > 0 ? (totalExpenseAmount / budgetLimit) * 100 : 0;

  // Combine & Sort recent transactions (top 5)
  const recentTransactions = [
    ...expenses.map(item => ({ ...item, type: 'expense', amt: parseFloat(item.amount || 0) })),
    ...incomes.map(item => ({ ...item, type: 'income', amt: parseFloat(item.income || 0) }))
  ]
    .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[70vh] space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600/20 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
        </div>
        <p className="text-slate-400 font-semibold tracking-wide text-lg animate-pulse">Aggregating financial statistics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* 1. WELCOME HERO SECTION */}
      <section className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Abstract blur background elements */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{getGreeting()}</span>
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {user ? `, ${user.firstName}!` : '!'}
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed">
            Here's a summary of your financial status. You've tracked <strong className="text-indigo-300 font-semibold">{expenses.length + incomes.length} transactions</strong> and set up your monthly tracking systems.
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex gap-3 relative z-10">
          <Link
            to="/add-expense"
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add Transaction
          </Link>
        </div>
      </section>

      {/* 2. STATS CARDS GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CARD 1: Expenses */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md hover:border-slate-700/60 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-800 rounded-full text-slate-400 uppercase tracking-widest">
              Expenses
            </span>
          </div>
          <p className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wide">Total Expenses</p>
          <p className="text-3xl font-extrabold text-white tracking-tight group-hover:text-rose-400 transition-colors">
            ₹{totalExpenseAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* CARD 2: Income */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md hover:border-slate-700/60 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
              </svg>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-800 rounded-full text-slate-400 uppercase tracking-widest">
              Income
            </span>
          </div>
          <p className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wide">Total Income</p>
          <p className="text-3xl font-extrabold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
            ₹{totalIncomeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* CARD 3: Net Balance (Savings) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md hover:border-slate-700/60 transition-all group sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${netSavings >= 0 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-800 rounded-full text-slate-400 uppercase tracking-widest">
              Savings
            </span>
          </div>
          <p className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wide">Net Savings</p>
          <p className={`text-3xl font-extrabold tracking-tight transition-colors ${netSavings >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
            ₹{netSavings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      </section>

      {/* 3. DOUBLE PANEL: BUDGET TRACKER & QUICK ACTIONS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL 1: Budget Utilization Tracker (2/3 width on large screen) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Budget Performance
            </h2>
            <p className="text-slate-400 text-sm">
              Real-time monitoring of your expenses relative to your monthly budget limit.
            </p>
          </div>

          {budget ? (
            <div className="space-y-6">
              {/* Progress bar container */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400 font-semibold">Budget Utilized ({budgetUtilization.toFixed(1)}%)</span>
                  <span className="text-white font-bold">
                    ₹{totalExpenseAmount.toLocaleString()} / ₹{budgetLimit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      budgetUtilization >= 90
                        ? 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
                        : budgetUtilization >= 75
                        ? 'bg-gradient-to-r from-amber-600 to-orange-500'
                        : 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                    }`}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Status and dates */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-4 border border-slate-800 rounded-2xl text-sm">
                <div>
                  <p className="text-slate-500 font-semibold mb-1">Timeframe</p>
                  <p className="text-slate-300 font-semibold">
                    {new Date(budget.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{' '}
                    {new Date(budget.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold mb-1">Status Recommendation</p>
                  {budgetUtilization >= 100 ? (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      ⚠️ Limit Exceeded
                    </span>
                  ) : budgetUtilization >= 80 ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      🚨 Warning Limit
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      ✅ Under Control
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 p-8 border border-dashed border-slate-800 rounded-2xl text-center space-y-4 flex flex-col justify-center items-center py-10">
              <div className="w-12 h-12 bg-slate-800/80 rounded-full flex items-center justify-center text-slate-500 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-slate-300 font-bold mb-1">No Active Budget Set</h4>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Set a monthly limit to monitor category-wise spending patterns, prevent overspending, and grow your net savings.
                </p>
              </div>
              <Link
                to="/add-budget"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Set Budget Limit
              </Link>
            </div>
          )}
        </div>

        {/* PANEL 2: Quick Operations (1/3 width on large screen) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-1 mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Quick Operations</h2>
            <p className="text-slate-500 text-xs">Direct pathways to perform essential actions.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Quick Link 1: Add Expense */}
            <Link
              to="/add-expense"
              className="p-4 bg-slate-950/40 border border-slate-800 hover:border-indigo-500/40 rounded-2xl flex flex-col justify-center items-center text-center gap-2.5 hover:bg-slate-800/40 transition-all duration-200 group"
            >
              <span className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">Add Expense</span>
            </Link>

            {/* Quick Link 2: Category list */}
            <Link
              to="/my-categories"
              className="p-4 bg-slate-950/40 border border-slate-800 hover:border-indigo-500/40 rounded-2xl flex flex-col justify-center items-center text-center gap-2.5 hover:bg-slate-800/40 transition-all duration-200 group"
            >
              <span className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">View Categories</span>
            </Link>

            {/* Quick Link 3: Analytics */}
            <Link
              to="/reports"
              className="p-4 bg-slate-950/40 border border-slate-800 hover:border-indigo-500/40 rounded-2xl flex flex-col justify-center items-center text-center gap-2.5 hover:bg-slate-800/40 transition-all duration-200 group"
            >
              <span className="p-2.5 bg-violet-500/10 text-violet-400 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">View Reports</span>
            </Link>

            {/* Quick Link 4: Set/Edit Budget */}
            <Link
              to="/budget"
              className="p-4 bg-slate-950/40 border border-slate-800 hover:border-indigo-500/40 rounded-2xl flex flex-col justify-center items-center text-center gap-2.5 hover:bg-slate-800/40 transition-all duration-200 group"
            >
              <span className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" />
                </svg>
              </span>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">Manage Budget</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. RECENT ACTIVITY LIST */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h2>
            <p className="text-slate-400 text-sm">
              Your most recent income and expense transactions in one consolidated ledger.
            </p>
          </div>
          <Link
            to="/my-expenses"
            className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors shrink-0"
          >
            See All Ledger
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Transaction Details</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Payment Method</th>
                  <th className="pb-3 pl-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm font-semibold text-slate-200">
                {recentTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-950/20 transition-colors">
                    {/* Details */}
                    <td className="py-4 pr-4">
                      <p className="text-white font-bold">{tx.title}</p>
                      <p className="text-slate-500 font-medium text-xs truncate max-w-xs">{tx.description || 'No description provided.'}</p>
                    </td>
                    
                    {/* Date */}
                    <td className="py-4 px-4 text-slate-400 font-medium whitespace-nowrap">
                      {new Date(tx.expenseDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    
                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-slate-800 text-indigo-300 rounded-lg text-xs border border-slate-700">
                        {(tx.expCategory?.catName || tx.incomeCategory?.catName || 'Uncategorized').toUpperCase()}
                      </span>
                    </td>
                    
                    {/* Mode */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {tx.type === 'expense' ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase ${
                          tx.paymentMode === 'CASH' ? 'text-amber-400 bg-amber-400/10' :
                          tx.paymentMode === 'CARD' ? 'text-blue-400 bg-blue-400/10' :
                          tx.paymentMode === 'UPI' ? 'text-purple-400 bg-purple-400/10' :
                          'text-slate-400 bg-slate-400/10'
                        }`}>
                          {tx.paymentMode || 'N/A'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase text-emerald-400 bg-emerald-400/10">
                          DEPOSIT
                        </span>
                      )}
                    </td>
                    
                    {/* Amount */}
                    <td className={`py-4 pl-4 text-right font-mono font-bold whitespace-nowrap ${tx.type === 'expense' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {tx.type === 'expense' ? '-' : '+'}₹{tx.amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-slate-950/40 border border-dashed border-slate-800 p-12 text-center rounded-2xl py-16 space-y-3">
            <div className="w-12 h-12 bg-slate-800/80 rounded-full flex items-center justify-center text-slate-500 mx-auto mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
              </svg>
            </div>
            <div>
              <h4 className="text-slate-300 font-bold mb-1">No Transactions Tracked Yet</h4>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Once you start recording your daily income deposits and expense purchases, your recent ledger will render dynamically here.
              </p>
            </div>
          </div>
        )}
      </section>

    </div>
  );
};