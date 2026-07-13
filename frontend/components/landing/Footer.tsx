import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-[#0a0a0a] py-8 mt-12">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
        <div>
          <p>&copy; {new Date().getFullYear()} DevSaaS. All rights reserved.</p>
        </div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-gray-300 transition">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-300 transition">Terms of Service</Link>
          <Link href="#" className="hover:text-gray-300 transition">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}
