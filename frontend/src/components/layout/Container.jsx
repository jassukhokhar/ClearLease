import { cn } from '../../utils/helpers.js';

/**
 * Centered, max-width page container with responsive horizontal padding.
 */
const Container = ({ as: Tag = 'div', className = '', children }) => (
  <Tag className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
    {children}
  </Tag>
);

export default Container;
