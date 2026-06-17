import { useState, useCallback, useRef } from 'react';
import { leaseService } from '../services/leaseService.js';
import { useLeaseStore } from '../store/leaseStore.js';
import { getErrorMessage } from '../utils/helpers.js';
import { MAX_FILE_SIZE } from '../utils/constants.js';

/**
 * Manages the upload + analysis lifecycle: progress %, animated step state,
 * error handling, and persisting the new lease into the store.
 *
 * Steps: upload -> extract -> analyze -> detect -> report -> done
 */
export const useUpload = () => {
  const addLease = useLeaseStore((s) => s.addLease);

  const [status, setStatus] = useState('idle'); // idle|uploading|processing|success|error
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const reset = useCallback(() => {
    clearTimers();
    setStatus('idle');
    setProgress(0);
    setActiveStep(-1);
    setError(null);
    setResult(null);
  }, []);

  /**
   * Drive the processing step animation while the request is in flight.
   * The backend is one round-trip, so we simulate the intermediate steps
   * for UX, then snap to "done" when the response arrives.
   */
  const runStepAnimation = () => {
    // step 0 (upload) is complete once the file is sent.
    const schedule = [
      [1, 400], // extract
      [2, 1600], // analyze
      [3, 3200], // detect
      [4, 4800], // report
    ];
    schedule.forEach(([step, delay]) => {
      timers.current.push(setTimeout(() => setActiveStep(step), delay));
    });
  };

  const upload = useCallback(
    async (file) => {
      setError(null);

      if (!file) return { ok: false };
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        setStatus('error');
        return { ok: false };
      }
      if (file.size > MAX_FILE_SIZE) {
        setError('File is larger than 10 MB.');
        setStatus('error');
        return { ok: false };
      }

      try {
        setStatus('uploading');
        setActiveStep(0);

        const data = await leaseService.upload(file, (pct) => {
          setProgress(pct);
          if (pct >= 100) {
            setStatus('processing');
            runStepAnimation();
          }
        });

        clearTimers();
        setActiveStep(5); // done
        setResult(data.lease);
        setStatus('success');
        addLease(stripHeavy(data.lease));
        return { ok: true, lease: data.lease };
      } catch (err) {
        clearTimers();
        const message = getErrorMessage(err);
        setError(message);
        setStatus('error');
        return { ok: false, message };
      }
    },
    [addLease]
  );

  return { status, progress, activeStep, error, result, upload, reset };
};

// Keep the history list light — drop the big fields the grid doesn't need.
const stripHeavy = (lease) => {
  const { extractedText, analysisResults, ...rest } = lease;
  return rest;
};
