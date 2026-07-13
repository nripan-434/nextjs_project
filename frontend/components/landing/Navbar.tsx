'use client';

import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useUserStore } from '@/store/userStore';

const navItems = [
  { label: 'Home', href: '/userhome' },
  { label: 'Features', href: '#features' },
  { label: 'Community', href: '#community' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUserStore();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/userhome" className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10 text-sm font-semibold text-orange-400">
            DC
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-gray-200">DEVSAAS</p>
            <p className="text-xs text-neutral-500">Idea Board</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-gray-300 lg:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <span className="text-sm text-gray-300 mr-2 border-r border-neutral-700 pr-4">Hello, {user.username}</span>
              <Link href="/profile" className="rounded-full px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
                Profile
              </Link>
              <button onClick={logout} className="rounded-full px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
                Login
              </Link>
              <Link href="/register" className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600">
                Register
              </Link>
            </>
          )}
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
        <div className="border-t border-white/10 bg-[#0a0a0a]/95 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm text-gray-300">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="rounded-2xl px-3 py-2 hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/profile" className="rounded-2xl px-3 py-2 hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <button onClick={logout} className="rounded-2xl px-3 py-2 text-left text-red-400 hover:bg-red-500/10">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-2xl px-3 py-2 hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="rounded-2xl bg-orange-500 px-3 py-2 text-center font-medium text-white" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </motion.header>
  );
}
