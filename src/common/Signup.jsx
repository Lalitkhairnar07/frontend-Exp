import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from '../api/axiosInstance';

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Note: data.profilePic is a FileList containing the selected file
    console.log("Form Data:", data);
    
    // Simulate API call
    const res = await axios.post("/user/signup",data)
    console.log(res.data)
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    // Outer container is strictly screen-height (100vh) to avoid full-page scrolling
    <div className="flex h-screen w-full bg-bg-muted font-sans text-text-base overflow-hidden">
      
      {/* Left Design Side - Hidden on smaller screens */}
      <div className="hidden lg:flex w-5/12 xl:w-1/2 bg-primary relative overflow-hidden flex-col justify-center items-center p-12 shrink-0">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-900/40 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 text-white max-w-md w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xl shadow-lg shrink-0">
              E
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">ExpenseTracker</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Start saving your <br/> money today.
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            Join thousands of users who are managing their daily expenses effortlessly.
          </p>

          <div className="mt-12 bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <p className="italic text-white/90">
              "This app changed the way I track my finances. Highly recommended for anyone looking to budget wisely!"
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-300 rounded-full border-2 border-white/50 shrink-0"></div>
              <div>
                <p className="font-semibold text-sm">Alex Johnson</p>
                <p className="text-primary-200 text-xs">Verified User</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side - Scrollable internally if content over-flows height */}
      <div className="flex-1 flex flex-col h-full bg-bg-base shadow-[-10px_0_40px_rgba(0,0,0,0.05)] z-10 lg:rounded-l-[2.5rem] relative">
        
        {/* INNER SCROLL CONTAINER: This handles scrolling for the form on small screens! */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 lg:p-12 scroll-smooth">
          <div className="mx-auto w-full max-w-xl flex flex-col min-h-full justify-center py-4">
            
            <div className="text-center lg:text-left mb-8 shrink-0">
              <h2 className="text-3xl font-bold text-text-base mb-2">Create an account</h2>
              <p className="text-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 shrink-0 pb-4">
              
              {/* Name Row: firstName & lastName */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-base mb-1.5">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className={`block w-full rounded-xl border ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-2.5 text-sm outline-none transition-all focus:ring-4`}
                    {...register("firstName", { required: "First name is required" })}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-base mb-1.5">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className={`block w-full rounded-xl border ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-2.5 text-sm outline-none transition-all focus:ring-4`}
                    {...register("lastName", { required: "Last name is required" })}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-base mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`block w-full rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-2.5 text-sm outline-none transition-all focus:ring-4`}
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" }
                  })}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-text-base mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`block w-full rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-2.5 text-sm outline-none transition-all focus:ring-4`}
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "At least 6 characters" }
                  })}
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              {/* Age & Gender Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-base mb-1.5">Age</label>
                  <input
                    type="number"
                    placeholder="25"
                    className={`block w-full rounded-xl border ${errors.age ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-2.5 text-sm outline-none transition-all focus:ring-4`}
                    {...register("age", { 
                      required: "Age is required", 
                      min: { value: 13, message: "Must be at least 13" },
                      max: { value: 120, message: "Invalid age" }
                    })}
                  />
                  {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-base mb-1.5">Gender</label>
                  <div className="relative">
                    <select
                      className={`block w-full rounded-xl border ${errors.gender ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 appearance-none`}
                      {...register("gender", { required: "Gender is required" })}
                      defaultValue=""
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    {/* Custom Select Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
                </div>
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-text-base mb-1.5">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100 border ${errors.profilePic ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-bg-muted/50 p-1 cursor-pointer transition-all`}
                  {...register("profilePic")}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full justify-center items-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <>Create Account</>
                )}
              </button>
              
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Signup;
