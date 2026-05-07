'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { resetPassword } from '@/lib/auth';
import successData from '@/public/animations/success.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword(data.email);
      setSentEmail(data.email);
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/user-not-found') {
        // Security: don't reveal if email exists or not
        setSentEmail(data.email);
        setSent(true);
      } else {
        toast.error('Failed to send reset email. Please try again.');
      }
    }
  };

  if (sent) {
    return (
      <div className="auth-container text-center">
        <div className="w-32 h-32 mx-auto mb-6">
          <Lottie animationData={successData} loop={false} />
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-3">Check your inbox</h1>
        <p className="text-slate-400 text-sm mb-2">
          We&apos;ve sent a password reset link to:
        </p>
        <p className="text-sky-400 font-medium text-sm mb-8 break-all">{sentEmail}</p>
        <p className="text-slate-500 text-xs mb-8">
          Didn&apos;t receive it? Check your spam folder, or{' '}
          <button
            onClick={() => setSent(false)}
            className="text-sky-400 hover:text-sky-300 transition-colors"
          >
            try again
          </button>
          .
        </p>
        <Link
          href="/auth/login"
          className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm"
        >
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Link href="/auth/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors group">
        <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
        Back to sign in
      </Link>

      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-sky-500/20">
          <Mail size={22} className="text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Reset your password</h1>
        <p className="text-slate-400 text-sm">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="input-field pl-10"
              autoComplete="email"
              autoFocus
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {isSubmitting ? (
            <><Loader2 size={18} className="animate-spin" /> Sending reset link...</>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remembered your password?{' '}
        <Link href="/auth/login" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
