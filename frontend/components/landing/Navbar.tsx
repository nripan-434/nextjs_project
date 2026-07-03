'use client';

import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Community', href: '#community' },
  { label: 'Projects', href: '#collaboration' },
  { label: 'About', href: '#about' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="#home" className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-300">
            DC
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-slate-200">DEVCONNECT</p>
            <p className="text-xs text-slate-400">Developer network</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="#" className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
            Login
          </Link>
          <Link href="#" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300">
            Register
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full border border-white/10 bg-white/10 p-2 text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm text-slate-300">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="rounded-2xl px-3 py-2 hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="#" className="rounded-2xl px-3 py-2 hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link href="#" className="rounded-2xl bg-cyan-400 px-3 py-2 text-center font-medium text-slate-950" onClick={() => setOpen(false)}>
              Register
            </Link>
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
