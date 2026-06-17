import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import Container from '../components/layout/Container.jsx';
import Logo from '../components/layout/Logo.jsx';
import Button from '../components/ui/Button.jsx';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    setServerError(null);
    const res = await login(data);
    if (res.ok) navigate(from, { replace: true });
    else setServerError(res.message);
  };

  return (
    <Container className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue analyzing your leases.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
          {serverError && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Field
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />
            <Field
              label="Password"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { required: 'Password is required' })}
            />

            <Button type="submit" className="w-full" loading={isSubmitting}>
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </Container>
  );
};

/**
 * Reusable labeled input with a leading icon. forwardRef so RHF can register.
 */
import { forwardRef } from 'react';
const Field = forwardRef(
  ({ label, icon: Icon, error, ...props }, ref) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          ref={ref}
          className={`h-11 w-full rounded-xl border bg-white dark:bg-slate-900 pl-10 pr-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-300 focus:ring-rose-400'
              : 'border-slate-200 dark:border-slate-800 focus:border-brand-400 focus:ring-brand-300'
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
);
Field.displayName = 'Field';

export default Login;
