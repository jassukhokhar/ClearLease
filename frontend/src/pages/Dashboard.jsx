import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  ShieldAlert,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import Container from '../components/layout/Container.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import Button from '../components/ui/Button.jsx';
import UploadDropzone from '../components/upload/UploadDropzone.jsx';
import UploadProgress from '../components/upload/UploadProgress.jsx';
import LeaseHistoryGrid from '../components/history/LeaseHistoryGrid.jsx';
import RiskTrendGraph from '../components/dashboard/RiskTrendGraph.jsx';
import CommonRiskCategories from '../components/dashboard/CommonRiskCategories.jsx';
import RecentConversations from '../components/dashboard/RecentConversations.jsx';
import ComparisonHistory from '../components/dashboard/ComparisonHistory.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useUpload } from '../hooks/useUpload.js';
import { useLeaseStore } from '../store/leaseStore.js';
import { useComparisonStore } from '../store/comparisonStore.js';
import { leaseService } from '../services/leaseService.js';
import { chatService } from '../services/chatService.js';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { leases, loadingHistory, fetchHistory, deleteLease } = useLeaseStore();
  const { comparisons, fetchComparisons } = useComparisonStore();
  const { status, progress, activeStep, error, result, upload, reset } =
    useUpload();

  const [file, setFile] = useState(null);
  const [stats, setStats] = useState({ riskTrend: [], categories: [] });
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchHistory();
    fetchComparisons();
    leaseService
      .stats()
      .then((d) => setStats({ riskTrend: d.riskTrend || [], categories: d.categories || [] }))
      .catch(() => {});
    chatService
      .recent()
      .then((d) => setConversations(d.conversations || []))
      .catch(() => {});
  }, [fetchHistory, fetchComparisons]);

  // Scroll to the upload section when arriving via #upload hash.
  useEffect(() => {
    if (location.hash === '#upload') {
      const el = document.getElementById('upload');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location]);

  const handleFile = async (selected) => {
    setFile(selected);
    const res = await upload(selected);
    if (res.ok && res.lease?._id) {
      // Brief pause so the user sees the "Report Ready" state.
      setTimeout(() => navigate(`/lease/${res.lease._id}`), 900);
    }
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  // Analytics across all leases.
  const analytics = useMemo(() => {
    const total = leases.length;
    const highRisk = leases.filter((l) => l.riskLabel === 'HIGH RISK').length;
    const flags = leases.reduce((sum, l) => sum + (l.totalFlags || 0), 0);
    const avg =
      total > 0
        ? Math.round(
            leases.reduce((s, l) => s + (l.overallRiskScore || 0), 0) / total
          )
        : 0;
    return { total, highRisk, flags, avg };
  }, [leases]);

  const recent = leases.slice(0, 3);
  const isBusy = status === 'uploading' || status === 'processing';

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-50/50 dark:bg-slate-950/40">
        <Container className="py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Upload a lease to reveal hidden risks, or review your past
              analyses.
            </p>
          </div>

          {/* ===== Top: Upload card ===== */}
          <section id="upload" className="mb-10">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Analyze a new lease
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Drag and drop a PDF to get started.
                  </p>
                </div>
                {(status === 'error' || status === 'success') && (
                  <Button variant="secondary" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" /> New upload
                  </Button>
                )}
              </div>

              {status === 'idle' && (
                <UploadDropzone onFileAccepted={handleFile} />
              )}

              {(isBusy || status === 'success') && (
                <UploadProgress
                  progress={progress}
                  activeStep={activeStep}
                  status={status}
                  file={file}
                />
              )}

              {status === 'success' && result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3"
                >
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Report ready — opening your analysis…
                  </p>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/lease/${result._id}`)}
                  >
                    View now <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {status === 'error' && (
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error || 'Something went wrong. Please try again.'}
                </div>
              )}
            </div>
          </section>

          {/* ===== Middle: Recent analyses ===== */}
          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Recent analyses
              </h2>
              {leases.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/history')}
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
            <LeaseHistoryGrid
              leases={recent}
              loading={loadingHistory}
              onDelete={(lease) => deleteLease(lease._id)}
            />
          </section>

          {/* ===== Bottom: Analytics cards ===== */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Your stats
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={FileText}
                label="Leases analyzed"
                value={analytics.total}
                tone="text-brand-600 bg-brand-50"
              />
              <StatCard
                icon={ShieldAlert}
                label="High-risk leases"
                value={analytics.highRisk}
                tone="text-rose-600 bg-rose-50"
              />
              <StatCard
                icon={AlertCircle}
                label="Total flags"
                value={analytics.flags}
                tone="text-amber-600 bg-amber-50"
              />
              <StatCard
                icon={TrendingUp}
                label="Avg. risk score"
                value={analytics.avg}
                tone="text-emerald-600 bg-emerald-50"
              />
            </div>
          </section>

          {/* ===== Insights: trend + categories ===== */}
          <section className="mt-10 grid gap-5 lg:grid-cols-2">
            <RiskTrendGraph data={stats.riskTrend} />
            <CommonRiskCategories categories={stats.categories} />
          </section>

          {/* ===== Activity: conversations + comparisons ===== */}
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <RecentConversations items={conversations} />
            <ComparisonHistory items={comparisons} />
          </section>
        </Container>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, tone }) => (
  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
    <p className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
  </div>
);

export default Dashboard;
