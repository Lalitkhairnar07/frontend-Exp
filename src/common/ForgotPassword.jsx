import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { toast } from 'react-toastify';

export const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onTouched'
  });

  const newPasswordValue = watch('newPassword');

  const onSendOtp = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/user/forgotPassword', { email: data.email });
      if (res.status === 200) {
        toast.success(res.data.message || 'OTP sent successfully to your email!');
        setEmail(data.email);
        setStep(2);
        // Clear form errors/state and reset with the email
        reset({ email: data.email });
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/user/resetPassword', {
        email: email,
        otp: data.otp,
        newPassword: data.newPassword
      });

      if (res.status === 200) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error('Failed to reset password');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-bg-muted font-sans text-text-base">
      
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
            Recover your <br /> account access.
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            Don't worry, it happens. Just follow the simple steps to reset your password and get back on track.
          </p>

          <div className="mt-12 bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-2xl shadow-xl">
            <p className="italic text-white/90">
              "Resetting my password was super quick and easy, I was back in my dashboard within two minutes."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-300 rounded-full border-2 border-white/50 shrink-0"></div>
              <div>
                <p className="font-semibold text-sm">Marcus Vance</p>
                <p className="text-primary-200 text-xs">Verified User</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="flex-1 flex flex-col min-h-screen bg-bg-base shadow-[-10px_0_40px_rgba(0,0,0,0.05)] z-10 lg:rounded-l-[2.5rem] relative">
        <div className="flex-1 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-md flex flex-col justify-center py-4">
            
            <div className="text-center lg:text-left mb-8 shrink-0">
              <h2 className="text-3xl font-bold text-text-base mb-2">
                {step === 1 ? 'Forgot Password?' : 'Reset Password'}
              </h2>
              <p className="text-text-muted text-sm">
                {step === 1 
                  ? 'Enter your email address and we will send you an OTP to reset your password.'
                  : `We've sent a 4-digit verification code to ${email}`
                }
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSubmit(onSendOtp)} className="space-y-6 shrink-0">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-8 flex w-full justify-center items-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <>
                      Send OTP
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit(onResetPassword)} className="space-y-5 shrink-0">
                <div>
                  <label className="block text-sm font-medium text-text-base mb-1.5" htmlFor="otp">
                    Verification Code (OTP)
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={4}
                    placeholder="Enter 4-digit OTP"
                    className={`block w-full rounded-xl border ${errors.otp ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-3 text-sm outline-none transition-all focus:ring-4`}
                    {...register('otp', {
                      required: 'OTP is required',
                      pattern: {
                        value: /^[0-9]{4}$/,
                        message: 'OTP must be a 4-digit number'
                      }
                    })}
                  />
                  {errors.otp && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.otp.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-base mb-1.5" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`block w-full rounded-xl border ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-3 text-sm outline-none transition-all focus:ring-4`}
                    {...register('newPassword', {
                      required: 'New Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must have at least 6 characters'
                      }
                    })}
                  />
                  {errors.newPassword && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-base mb-1.5" htmlFor="confirmNewPassword">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`block w-full rounded-xl border ${errors.confirmNewPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-primary focus:ring-primary/20'} bg-bg-muted/50 px-4 py-3 text-sm outline-none transition-all focus:ring-4`}
                    {...register('confirmNewPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === newPasswordValue || 'Passwords do not match'
                    })}
                  />
                  {errors.confirmNewPassword && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.confirmNewPassword.message}</p>
                  )}
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      reset();
                    }}
                    className="flex-1 justify-center items-center rounded-xl border border-gray-200 px-4 py-3.5 text-sm font-semibold text-text-muted hover:bg-bg-muted focus:outline-none transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-2 w-full justify-center items-center rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    {isLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <>Reset Password</>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 text-center shrink-0">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Sign In
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
