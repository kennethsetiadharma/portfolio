"use client";

import { Component, type ReactNode } from "react";

// If the 3D scene throws (e.g. WebGL context creation fails), render nothing and
// tell the parent, which keeps showing the static die.
export class HeroErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
