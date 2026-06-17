import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.js';
import Container from './Container.jsx';
import Logo from './Logo.jsx';
import Button from '../ui/Button.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import UserMenu from './UserMenu.jsx';
import { cn } from '../../utils/helpers.js';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    cn(
      'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </NavLink>
              <NavLink to="/history" className={navLinkClass}>
                <Clock className="h-4 w-4" /> History
              </NavLink>
              <ThemeToggle />
              <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />
              <UserMenu />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get started</Button>
              </Link>
              <ThemeToggle />
            </>
          )}
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className={navLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </NavLink>
                  <NavLink
                    to="/history"
                    className={navLinkClass}
                    onClick={() => setOpen(false)}
                  >
                    <Clock className="h-4 w-4" /> History
                  </NavLink>
                  <Button
                    variant="secondary"
                    className="mt-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full">Get started</Button>
                  </Link>
                </>
              )}
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
