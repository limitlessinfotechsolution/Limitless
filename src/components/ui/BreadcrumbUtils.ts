interface BreadcrumbItem {
  label: string;
  href: string;
  isActive: boolean;
}

// Utility function to generate breadcrumbs based on current path
export const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Convert segment to readable label
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    breadcrumbs.push({
      label,
      href: currentPath,
      isActive: index === pathSegments.length - 1
    });
  });

  return breadcrumbs;
};