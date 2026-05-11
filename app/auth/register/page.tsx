'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
} from 'lucide-react';

import {
  signUpWithEmail,
  signInWithGoogle,
} from '@/lib/auth';

const schema = z
  .object({
    displayName: z
      .string()
      .min(2, 'Name must be at least 2 characters'),

    email: z
      .string()
      .email('Enter a valid email'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[0-9]/, 'Must include a number'),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  /* =========================================
      EMAIL SIGNUP
  ========================================= */

  const onSubmit = async (data: FormData) => {
    try {
      await signUpWithEmail(
        data.email,
        data.password,
        data.displayName
      );

      toast.success(
        'Account created successfully!'
      );

      router.replace('/dashboard');
    } catch (err: any) {
      console.error('Signup Error:', err);

      switch (err?.code) {
        case 'auth/email-already-in-use':
          toast.error('Email already exists');
          break;

        case 'auth/invalid-email':
          toast.error('Invalid email address');
          break;

        case 'auth/weak-password':
          toast.error('Weak password');
          break;

        default:
          toast.error('Failed to create account');
      }
    }
  };

  /* =========================================
      GOOGLE SIGNUP
  ========================================= */

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);

      await signInWithGoogle();

      toast.success(
        'Account created with Google!'
      );

      router.replace('/dashboard');
    } catch (err: any) {
      console.error(
        'Google Sign In Error:',
        err
      );

      switch (err?.code) {
        case 'auth/popup-closed-by-user':
          toast.error('Popup closed');
          break;

        case 'auth/cancelled-popup-request':
          toast.error(
            'Popup request cancelled'
          );
          break;

        case 'auth/popup-blocked':
          toast.error(
            'Popup blocked by browser'
          );
          break;

        case 'auth/unauthorized-domain':
          toast.error(
            'Domain not authorized in Firebase'
          );
          break;

        default:
          toast.error(
            err?.message ||
              'Google sign in failed'
          );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#020817] text-white">
      
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col items-center justify-center px-10 text-center border-r border-white/10">
        
        <Image
          src="/logo.png"
          alt="CloudNest"
          width={72}
          height={72}
          priority
        />

        <h1 className="text-5xl font-bold mt-6">
          CloudNest
        </h1>

        <p className="text-slate-300 mt-5 max-w-md leading-7">
          Secure cloud storage platform with
          real-time sync, collaboration and
          smart file management.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6 py-10">
        
        <div className="w-full max-w-md">
          
          <h1 className="text-3xl font-bold">
            Create Account
          </h1>

          <p className="text-slate-400 text-sm mt-2 mb-6">
            Join CloudNest and start storing
            your files securely.
          </p>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={
              googleLoading || isSubmitting
            }
            className="w-full flex items-center justify-center gap-3 border border-white/10 hover:bg-white/10 transition rounded-xl py-3 disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 11.1H12v2.98h5.35c-.23 1.24-.93 2.3-1.98 3.02v2.5h3.2c1.87-1.72 2.78-4.25 2.78-7.02 0-.49-.04-.98-.1-1.48z"
                />
                <path
                  fill="#34A853"
                  d="M12 22c2.52 0 4.63-.83 6.17-2.25l-3.2-2.5c-.89.6-2.03.95-2.97.95-2.28 0-4.22-1.54-4.91-3.6H3.78v2.55A9.99 9.99 0 0012 22z"
                />
                <path
                  fill="#FBBC05"
                  d="M7.09 14.6A5.99 5.99 0 016.8 12c0-.9.16-1.77.45-2.6V6.85H3.78A9.99 9.99 0 002 12c0 1.61.39 3.14 1.78 4.85l3.31-2.55z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.5c1.37 0 2.6.47 3.57 1.39l2.68-2.68C16.62 2.69 14.52 2 12 2 7.7 2 4.02 4.5 3.78 6.85l3.31 2.55C7.78 7.04 9.72 5.5 12 5.5z"
                />
              </svg>
            )}

            {googleLoading
              ? 'Connecting...'
              : 'Continue with Google'}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700" />

            <span className="text-xs text-slate-400">
              or sign up with email
            </span>

            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* NAME */}
            <Input
              label="Full Name"
              icon={<User size={16} />}
              error={
                errors.displayName?.message
              }
              {...register('displayName')}
            />

            {/* EMAIL */}
            <Input
              label="Email"
              type="email"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-slate-300">
                Password
              </label>

              <div className="relative mt-1">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  {...register('password')}
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <Input
              label="Confirm Password"
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              icon={<Lock size={16} />}
              error={
                errors.confirmPassword?.message
              }
              {...register('confirmPassword')}
            />

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-lg py-3 font-medium disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* LOGIN */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================
    INPUT COMPONENT
========================================= */

type InputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    icon: React.ReactNode;
    error?: string;
  };

function Input({
  label,
  icon,
  error,
  ...props
}: InputProps) {
  return (
    <div>
      <label className="text-sm text-slate-300">
        {label}
      </label>

      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          {...props}
          className="w-full pl-10 pr-3 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}