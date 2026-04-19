'use client';

import { ProgressProvider } from '@bprogress/next/app';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="5px"
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};