import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className = '' }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  const defaultClasses = 'font-medium transition-colors duration-200 hover:text-accent';
  const activeClasses = isActive ? 'text-accent font-semibold' : 'text-gray-700 dark:text-gray-300';
  const combinedClasses = `${defaultClasses} ${activeClasses} ${className}`.trim();

  return (
    <Link href={href} className={combinedClasses}>
      {children}
    </Link>
  );
};

export default NavLink;