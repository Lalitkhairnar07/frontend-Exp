
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const maxSize = 5 * 1024 * 1024 // 5MB

export const AddExpense = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [categories, setcategories] = useState([])
  const [selectedFile, setselectedFile] = useState("")
  const navigate = useNavigate()
  const [selectedType, setselectedType] = useState("expense")

  const getMyCategories = async () => {
    const res = await axiosInstance.get("/expenseCategory/get")
    console.log(res.data.data)
    setcategories(res.data.data)
  }

  const getMyIncomeCategories = async () => {
    const res = await axiosInstance.get("/incomeCat/incomeCategory")
    console.log(res.data.data)
    setcategories(res.data.data)
  }

  useEffect(() => {
    if (selectedType == "expense") {
      getMyCategories()
    } else {
      getMyIncomeCategories()
    }
  }, [selectedType])

  const submitHandler = async (data) => {
    try {
      console.log("Form data:", data);
      console.log("Selected type:", selectedType);
    
      if(selectedType === "income"){
        data.income = data.amount
        delete data.amount
        data.incomeCategory = data.expCategory
        delete data.expCategory
        
      }

      const res = await axiosInstance.post("/exp/", data)
      console.log(res) //expid _id
      if (res.status == 201) {

        //file upload api
        if (selectedFile) {
          console.log('File selected:', selectedFile)

          if (selectedFile.size > maxSize) {
            toast.error("File size too large. Please select a file smaller than 5MB.")
            navigate("/my-expenses")
            return
          }

          const formData = new FormData()
          formData.append("expId", res.data.data._id) //exp id
          formData.append("receipt", selectedFile)

          console.log('Uploading file:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type)
          console.log('Expense ID:', res.data.data._id)
          console.log('FormData contents:')
          for (let [key, value] of formData.entries()) {
            console.log(key, value)
          }

          try {
            const res2 = await axiosInstance.put("/exp/uploadreceipt", formData, {
              timeout: 30000, // 30 second timeout for file uploads
            })

            console.log("file upload response", res2)

            if (res2.status == 200) {
              toast.success("Expense added successfully with receipt!")
              navigate("/my-expenses")
            }
            else {
              toast.warning("Expense added successfully but receipt upload failed")
              navigate("/my-expenses")
            }
          } catch (uploadError) {
            console.error('File upload error:', uploadError)
            toast.warning("Expense added successfully but receipt upload failed: " + (uploadError.response?.data?.message || uploadError.message))
            navigate("/my-expenses")
          }
        } else {
          toast.success("Expense added successfully!")
          navigate("/my-expenses")
        }

      }
    } catch (err) {
      console.error('Error adding expense:', err)
      toast.error(err.response?.data?.message || "Failed to add expense. Please try again.")
    }
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Add New {selectedType === 'expense' ? 'Expense' : 'Income'}
          </h1>
          <p className="text-slate-400 text-lg">
            Track your finances by adding {selectedType === 'expense' ? 'expense' : 'income'} details
          </p>
        </div>

        {/* Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900 p-1.5 rounded-xl flex items-center shadow-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setselectedType('expense')}
              className={`px-8 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                selectedType === 'expense'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setselectedType('income')}
              className={`px-8 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                selectedType === 'income'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8">
          <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
            {/* Title and Description Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-slate-300">
                  Expense Title *
                </label>
                <input
                  type="text"
                  id="title"
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g. Grocery Shopping"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-slate-300">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  {...register("description")}
                  placeholder="Additional details (optional)"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Amount and Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-semibold text-slate-300">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">$</span>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0"
                    {...register("amount", { required: "Amount is required", min: { value: 0.01, message: "Amount must be greater than 0" } })}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                {errors.amount && <p className="text-red-400 text-sm">{errors.amount.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="expenseDate" className="block text-sm font-semibold text-slate-300">
                  Expense Date *
                </label>
                <input
                  type="date"
                  id="expenseDate"
                  {...register("expenseDate", { required: "Date is required" })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.expenseDate && <p className="text-red-400 text-sm">{errors.expenseDate.message}</p>}
              </div>
            </div>

            {/* Category and Payment Mode Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="expCategory" className="block text-sm font-semibold text-slate-300">
                  Category *
                </label>
                <select
                  id="expCategory"
                  {...register("expCategory", { required: "Please select a category" })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none"
                >
                  <option value="" className="bg-slate-800">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id} className="bg-slate-800">
                      {cat.catName}
                    </option>
                  ))}
                </select>
                {errors.expCategory && <p className="text-red-400 text-sm">{errors.expCategory.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="paymentMode" className="block text-sm font-semibold text-slate-300">
                  Payment Method *
                </label>
                <select
                  id="paymentMode"
                  {...register("paymentMode", { required: "Please select a payment method" })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none"
                >
                  <option value="" className="bg-slate-800">Select payment method</option>
                  <option value="CASH" className="bg-slate-800">💵 Cash</option>
                  <option value="CARD" className="bg-slate-800">💳 Card</option>
                  <option value="UPI" className="bg-slate-800">📱 UPI</option>
                  <option value="CHEQUE" className="bg-slate-800">📄 Cheque</option>
                </select>
                {errors.paymentMode && <p className="text-red-400 text-sm">{errors.paymentMode.message}</p>}
              </div>
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Receipt (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(event) => { setselectedFile(event.target.files[0]) }}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Upload receipt image or PDF (max 5MB)
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Expense
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Back to Expenses Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/my-expenses')}
            className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center mx-auto"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Expenses
          </button>
        </div>
      </div>
    </div>
  )
}