"use client";

import { useSyncExternalStore } from "react";
import AppShell from "@/src/app-shell/AppShell";

export default function ClientOnlyApp() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return null;
  }

  return <AppShell />;
}
