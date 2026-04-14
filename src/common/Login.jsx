//import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from "../api/axiosInstance"

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  // NOT CHANGED your core logic and API calls
  const onSubmit = async(data) => {
    setIsLoading(true);
    try {
      console.log('Login Data:', data);
      const res = await axios.post("/user/login",data)
      //store token in cookies http only not in localstorage
      console.log(res.data.token)
      document.cookie = `token=${res.data.token}; path=/; httpOnly; secure; sameSite=Lax`;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Outer container is strictly screen-height (100vh) to avoid full-page scrolling
    <div className="flex h-screen w-full bg-bg-muted font-sans text-text-base overflow-hidden">
      
      {/* Left Design Side - Hidden on smaller screens */}
      <div className="hidden lg:flex w-5/12 xl:w-1/2 bg-primary relative overflow-hidden flex-col justify-center items-center p-12 shrink-0">
        {/* Decorative background blurs */}
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
            Welcome back to <br/> your dashboard.
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            Sign in to continue managing your daily expenses effortlessly and tracking your financial future.
          </p>

          <div className="mt-12 bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <p className="italic text-white/90">
              "ExpenseTracker has been a lifesaver for my monthly budgeting. I love seeing the breakdowns!"
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-300 rounded-full border-2 border-white/50 shrink-0"></div>
              <div>
                <p className="font-semibold text-sm">Sarah Jenkins</p>
                <p className="text-primary-200 text-xs">Verified User</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side - Scrollable internally, though login is usually short */}
      <div className="flex-1 flex flex-col h-full bg-bg-base shadow-[-10px_0_40px_rgba(0,0,0,0.05)] z-10 lg:rounded-l-[2.5rem] relative">
        
        {/* INNER SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 lg:p-12 scroll-smooth flex flex-col justify-center">
          <div className="mx-auto w-full max-w-md flex flex-col justify-center py-4">
            
            <div className="text-center lg:text-left mb-8 shrink-0">
              <h2 className="text-3xl font-bold text-text-base mb-2">Sign in to your account</h2>
              <p className="text-text-muted">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                  Create one now
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 shrink-0">
              
              <div>
                <label className="block text-sm font-medium text-text-base mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`block w-full rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-3 text-sm outline-none transition-all focus:ring-4`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Entered value does not match email format'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-base mb-1.5" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`block w-full rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-3 text-sm outline-none transition-all focus:ring-4`}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must have at least 6 characters'
                    }
                  })}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/40 focus:ring-offset-0 transition-colors cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted cursor-pointer">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-hover hover:underline transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-8 flex w-full justify-center items-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <>
                    Sign In
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
};