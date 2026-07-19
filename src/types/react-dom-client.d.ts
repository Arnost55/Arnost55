// Minimal ambient types for react-dom/client.
// The real @types/react-dom package is not installed in this environment, so we
// declare just the surface area used by the app (createRoot) backed by the
// already-installed @types/react.
declare module 'react-dom/client' {
  import type { ReactNode } from 'react';

  export interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }

  export interface RootOptions {
    hydrate?: boolean;
    onRecoverableError?: (error: unknown) => void;
    identifierPrefix?: string;
    onCaughtError?: (error: unknown, errorInfo: unknown) => void;
  }

  export function createRoot(
    container: Element | Document | DocumentFragment,
    options?: RootOptions
  ): Root;

  export function hydrateRoot(
    container: Element | Document | DocumentFragment,
    initialChildren: ReactNode,
    options?: RootOptions
  ): Root;
}
