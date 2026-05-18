import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { LogIn, KeyRound, Mail, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showToast('success', 'Welcome back! Login successful.');
        navigate('/');
      }
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-tr from-slate-100 via-slate-50 to-primary-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-primary-950/20 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary-300/20 blur-3xl pointer-events-none dark:bg-primary-900/10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 rounded-full bg-primary-200/20 blur-3xl pointer-events-none dark:bg-primary-800/10" />

      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-2 rounded-xl glass hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
      >
        {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Brand Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 shadow-lg shadow-primary-500/20 flex items-center justify-center text-white font-black text-xl">
            C
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
            ContactHub Portal
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage your contacts ecosystem.
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-card p-8 shadow-xl relative overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="relative">
              <Mail className="absolute right-3.5 top-9.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                label="Email Address"
                placeholder="name@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute right-3.5 top-9.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full py-3 mt-2">
              <LogIn size={16} className="mr-2" />
              Sign In
            </Button>
          </form>

          {/* Footer links */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/60 text-center text-sm">
            <span className="text-slate-500 dark:text-slate-400">New to ContactHub? </span>
            <Link
              to="/register"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
