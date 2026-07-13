'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/utils/axios';
import { useUserStore } from '@/store/userStore';
import styles from '../Auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fetchUser = useUserStore(state => state.fetchUser);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await api.post('/auth/login', { email, password });
      await fetchUser(); // Update the global state
      router.push('/userhome'); // Redirect to dashboard
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>DevCollective</div>
        <div className={styles.logoSubtitle}>Welcome back, developer.</div>
        
        {error && <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center', marginBottom: '1rem', background: 'rgba(255, 107, 107, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</p>}

        <form className={styles.form} onSubmit={handleLocalLogin}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Email address</label>
            <input 
              className={styles.input} 
              type="email" 
              id="email" 
              placeholder="you@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input 
              className={styles.input} 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className={styles.divider}>OR</div>
        
        <a href="http://localhost:5000/auth/google" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
          <button type="button" className={styles.socialBtn} style={{ width: '100%' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </a>
        
        <div className={styles.footer}>
          Don't have an account? <Link href="/register" className={styles.link}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
