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
  Loader2,
} from 'lucide-react';

import {
  signInWithEmail,
  signInWithGoogle,
} from '@/lib/auth';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // EMAIL LOGIN
  const onSubmit = async (data: FormData) => {
    try {
      await signInWithEmail(
        data.email,
        data.password
      );

      toast.success('Welcome back!');

      router.replace('/dashboard');
    } catch (error: any) {
      console.error(error);

      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('User not found');
          break;

        case 'auth/wrong-password':
          toast.error('Incorrect password');
          break;

        case 'auth/invalid-credential':
          toast.error('Invalid email or password');
          break;

        default:
          toast.error('Login failed');
      }
    }
  };

  // GOOGLE LOGIN
  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);

      await signInWithGoogle();

      toast.success('Signed in with Google!');

      router.replace('/dashboard');
    } catch (error: any) {
      console.error('Google Sign In Error:', error);

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          toast.error(
            'Popup closed before completing sign in'
          );
          break;

        case 'auth/popup-blocked':
          toast.error('Popup blocked by browser');
          break;

        case 'auth/network-request-failed':
          toast.error(
            'Network error. Check internet connection'
          );
          break;

        default:
          toast.error(
            error.message || 'Google sign in failed'
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
          width={80}
          height={80}
          priority
        />

        <h1 className="text-5xl font-bold mt-6">
          CloudNest
        </h1>

        <p className="text-slate-300 mt-5 max-w-md leading-relaxed">
          Secure cloud storage platform with
          real-time sync, collaboration,
          lightning-fast uploads, and modern
          workspace tools.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          <h1 className="text-3xl font-bold mb-2">
            Welcome back
          </h1>

          <p className="text-slate-400 text-sm mb-8">
            Sign in to continue to CloudNest
          </p>

          {/* GOOGLE BUTTON */}
          <button
            onClick={handleGoogle}
            disabled={
              googleLoading || isSubmitting
            }
            className="w-full flex items-center justify-center gap-3 border border-white/10 hover:bg-white/10 rounded-xl py-3 mb-6 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2
                className="animate-spin"
                size={18}
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
              ? 'Signing in...'
              : 'Continue with Google'}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-700" />

            <span className="text-slate-400 text-xs whitespace-nowrap">
              or continue with email
            </span>

            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* LOGIN FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>
              <label className="text-sm text-slate-300">
                Email
              </label>

              <div className="relative mt-1">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center text-sm text-slate-300">
                <span>Password</span>

                <Link
                  href="/auth/reset-password"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Forgot?
                </Link>
              </div>

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
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
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

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={
                isSubmitting || googleLoading
              }
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* REGISTER */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Create new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}