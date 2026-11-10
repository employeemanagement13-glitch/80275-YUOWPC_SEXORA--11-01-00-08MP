'use client';
import { Component, type ReactNode } from 'react';
import { icons } from 'lucide-react';

class IconErrorBoundary extends Component<{ children: ReactNode; resetKey?: string }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; resetKey?: string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidUpdate(prevProps: { resetKey?: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }
  componentDidCatch() {}
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function toPascalCase(name: string) {
  return name
    .trim()
    .replace(/[-_ ]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

export function SafeIcon({
  name,
  size = 20,
  className,
  fallback = null,
}: {
  name?: string;
  size?: number;
  className?: string;
  fallback?: ReactNode;
}) {
  if (!name) return <>{fallback}</>;

  const key = toPascalCase(name);
  const IconComponent = (icons as Record<string, any>)[key];

  if (!IconComponent) return <>{fallback}</>;

  return (
    <IconErrorBoundary resetKey={name}>
      <IconComponent size={size} className={className} aria-hidden="true" />
    </IconErrorBoundary>
  );
}
