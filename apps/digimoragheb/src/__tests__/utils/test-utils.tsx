import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomUIProvider } from '@workspace/custom-ui';
import { FrameworkProvider } from '@workspace/framework';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <FrameworkProvider>
      <QueryClientProvider client={queryClient}>
        <CustomUIProvider loginRoute="/auth" appRoute="/dashboard">
          {children}
        </CustomUIProvider>
      </QueryClientProvider>
    </FrameworkProvider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Export everything from testing library
export * from '@testing-library/react';
export { renderWithProviders as render };
