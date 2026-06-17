import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names with Tailwind conflict resolution.
 */
export const cn = (...inputs) => twMerge(clsx(inputs));

/**
 * Format a date string into a readable form, e.g. "Jun 15, 2026".
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Human-readable file size.
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

/**
 * Build an absolute URL to a backend file (handles dev proxy + prod).
 */
export const fileUrl = (relativeUrl) => {
  if (!relativeUrl) return '';
  if (/^https?:\/\//.test(relativeUrl)) return relativeUrl;
  return relativeUrl; // served via Vite proxy / same origin
};

/**
 * Pick a friendly error message from an Axios error.
 */
export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  'Something went wrong. Please try again.';
