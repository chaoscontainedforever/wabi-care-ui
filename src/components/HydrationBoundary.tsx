'use client';

import { ReactNode, useEffect, useState } from 'react';

interface HydrationBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function HydrationBoundary({ children, fallback }: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    setIsHydrated(true);
  }, []);

  return isHydrated ? <>{children}</> : <>{fallback}</>;
}
