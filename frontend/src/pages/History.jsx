import { useEffect, useState } from 'react';
import Container from '../components/layout/Container.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import LeaseHistoryGrid from '../components/history/LeaseHistoryGrid.jsx';
import Modal from '../components/ui/Modal.jsx';
import Button from '../components/ui/Button.jsx';
import { useLeaseStore } from '../store/leaseStore.js';

const History = () => {
  const { leases, loadingHistory, fetchHistory, deleteLease } = useLeaseStore();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    await deleteLease(pendingDelete._id);
    setDeleting(false);
    setPendingDelete(null);
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-50/50 dark:bg-slate-950/40">
        <Container className="py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Lease history
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              All your previously analyzed lease agreements.
            </p>
          </div>

          <LeaseHistoryGrid
            leases={leases}
            loading={loadingHistory}
            onDelete={(lease) => setPendingDelete(lease)}
          />
        </Container>
      </div>

      {/* Delete confirmation */}
      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete this analysis?"
        description="This permanently removes the lease and its report. This action cannot be undone."
      >
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setPendingDelete(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} loading={deleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default History;
