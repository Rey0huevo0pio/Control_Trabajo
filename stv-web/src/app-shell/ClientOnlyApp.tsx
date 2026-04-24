"use client";

import { useEffect, useState } from "react";
import AppShell from "@/src/app-shell/AppShell";

export default function ClientOnlyApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <AppShell />;
}
