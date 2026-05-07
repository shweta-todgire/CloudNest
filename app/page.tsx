'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/auth-context';
import {
  Cloud, Shield, Zap, Globe, Lock, Users, ArrowRight,
  Menu, X
} from 'lucide-react';
import cloudFloatData from '@/public/animations/cloud-float.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const features = [
  { icon: Cloud, title: 'Infinite Storage', desc: 'Store unlimited files securely.' },
  { icon: Shield, title: 'Top Security', desc: 'AES-256 encryption protects your data.' },
  { icon: Zap, title: 'Fast Sync', desc: 'Sync across devices instantly.' },
  { icon: Globe, title: 'Global Access', desc: 'Access files anywhere anytime.' },
  { icon: Lock, title: 'Privacy First', desc: 'Only you control your data.' },
  { icon: Users, title: 'Collaboration', desc: 'Share and work together easily.' },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#020817] text-white">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-black/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="logo" width={36} height={36} />
            <span className="font-bold text-xl">CloudNest</span>
          </Link>

          <div className="hidden md:flex gap-6 text-sm text-gray-300">
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </div>

          <div className="hidden md:flex gap-3">
            <Link href="/auth/login" className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5">
              Sign In
            </Link>
            <Link href="/auth/register" className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition">
              Get Started
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24">
        
        <Lottie animationData={cloudFloatData} className="w-64 mb-6" />

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Your files,<br />
          <span className="text-blue-500">perfectly in the cloud</span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-xl">
          Store, manage, and access your data securely from anywhere.
        </p>

        <div className="mt-8 flex gap-4">
          <Link href="/auth/register" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center gap-2">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link href="/auth/login" className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5">
            Sign In
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-3">Features</h2>
          <p className="text-gray-400">Everything you need in one place</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.03]"
            >
              <div className="mb-4">
                <f.icon className="text-blue-400 group-hover:scale-110 transition" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>

              {/* glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-blue-500/10 blur-xl"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-blue-500">CloudNest</span>
          </h2>

          <p className="text-gray-400 leading-relaxed text-lg max-w-3xl mx-auto">
            CloudNest is a next-generation cloud storage platform built to simplify
            the way you manage your digital life. From personal files to professional
            assets, everything is stored securely and accessible instantly from any device.
          </p>

          {/* highlights */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-2 text-blue-400">⚡ Fast & Reliable</h3>
              <p className="text-sm text-gray-400">
                Experience ultra-fast uploads, downloads, and seamless syncing across all your devices without delays.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-2 text-blue-400">🔐 Secure by Design</h3>
              <p className="text-sm text-gray-400">
                Your data is protected with industry-grade encryption and privacy-first architecture.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-semibold mb-2 text-blue-400">🌍 Access Anywhere</h3>
              <p className="text-sm text-gray-400">
                Whether you're on mobile, tablet, or desktop, your files are always just a click away.
              </p>
            </div>

          </div>

          {/* extra paragraph */}
          <p className="mt-12 text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Whether you're a student, freelancer, or business team, CloudNest helps you stay organized,
            collaborate effortlessly, and keep your data safe — all in one powerful platform.
          </p>

          {/* buttons */}
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/auth/register" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500">
              Get Started
            </Link>
            <Link href="/auth/login" className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5">
              Sign In
            </Link>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 border-t border-white/5">
        © 2026 CloudNest. All rights reserved.
      </footer>

    </div>
  );
}