import React from 'react'
import { useForm } from 'react-hook-form'
import axios from '../api/axiosInstance'

export const AddCategory = () => {
    const { register, handleSubmit, reset } = useForm()

    const submitHanlder = async(data) => {
        try {
            //api
            const res = await axios.post("/expenseCategory/", data)
            console.log(res.data)
            reset() // clear form after submission
        } catch (error) {
            console.error("Error adding category:", error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center tracking-tight">Add Category</h1>
                    <p className="text-blue-100 text-center mt-2 text-sm sm:text-base">Create a new category for your expenses</p>
                </div>
                
                <form onSubmit={handleSubmit(submitHanlder)} className="p-6 sm:p-8 space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                            Category Name
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                            placeholder="e.g., Food, Travel, Utilities"
                            {...register("name", { required: true })} 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                            Description
                        </label>
                        <input 
                            type="text" 
                            id="description" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                            placeholder="Brief description of the category"
                            {...register("description")} 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Add Category
                    </button>
                </form>
            </div>
        </div>
    )
}