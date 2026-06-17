import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Container from '../components/layout/Container.jsx';
import Button from '../components/ui/Button.jsx';

const NotFound = () => (
  <Container className="flex min-h-[70vh] items-center justify-center py-20">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <p className="text-7xl font-extrabold text-brand-100">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link to="/">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4" /> Go back
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button>
            <Home className="h-4 w-4" /> Dashboard
          </Button>
        </Link>
      </div>
    </motion.div>
  </Container>
);

export default NotFound;
