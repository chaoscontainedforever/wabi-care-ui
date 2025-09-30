'use client';

import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // Theme provider for shadcn/ui components with Tailwind CSS
  return <>{children}</>;
}
