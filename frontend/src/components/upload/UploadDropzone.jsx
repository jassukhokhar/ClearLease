import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatFileSize } from '../../utils/helpers.js';
import { MAX_FILE_SIZE } from '../../utils/constants.js';

/**
 * Drag-and-drop PDF dropzone. Calls onFileAccepted(file) once a valid PDF
 * is selected.
 */
const UploadDropzone = ({ onFileAccepted, disabled = false }) => {
  const [localError, setLocalError] = useState(null);

  const onDrop = useCallback(
    (accepted, rejections) => {
      setLocalError(null);

      if (rejections?.length) {
        const code = rejections[0].errors?.[0]?.code;
        if (code === 'file-too-large') setLocalError('File is larger than 10 MB.');
        else if (code === 'file-invalid-type')
          setLocalError('Only PDF files are allowed.');
        else setLocalError('That file could not be accepted.');
        return;
      }

      const file = accepted?.[0];
      if (file) onFileAccepted?.(file);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    multiple: false,
    disabled,
  });

  return (
    <div>
      <motion.div
        {...getRootProps()}
        whileHover={disabled ? {} : { scale: 1.005 }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
          isDragActive
            ? 'border-brand-500 bg-brand-50'
            : 'border-slate-300 bg-slate-50/60 hover:border-brand-400 hover:bg-brand-50/40',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <input {...getInputProps()} />

        <span
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-full',
            isDragActive ? 'bg-brand-100 text-brand-600' : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 shadow-sm'
          )}
        >
          {isDragActive ? (
            <FileText className="h-7 w-7" />
          ) : (
            <UploadCloud className="h-7 w-7" />
          )}
        </span>

        <p className="mt-4 text-sm font-medium text-slate-900 dark:text-slate-100">
          {isDragActive ? 'Drop your lease here' : 'Drag & drop your lease PDF'}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          or <span className="font-medium text-brand-600 dark:text-brand-400">browse files</span>
        </p>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          PDF only · up to {formatFileSize(MAX_FILE_SIZE)}
        </p>
      </motion.div>

      {localError && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {localError}
        </div>
      )}
    </div>
  );
};

export default UploadDropzone;
