"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
} from "react";

type Params = Record<string, string>;

type RouteProps = {
  path?: string;
  element?: React.ReactNode;
};

type NavigateProps = {
  to: string;
  replace?: boolean;
};

const ParamsContext = createContext<Params>({});

const normalizePath = (value?: string | null) => {
  if (!value) return "/";
  if (value === "/") return "/";
  const cleaned = value.replace(/\/+/g, "/").replace(/\/$/, "");
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
};

const splitPath = (value: string) =>
  normalizePath(value)
    .split("/")
    .filter(Boolean);

const matchPath = (routePath: string, pathname: string): Params | null => {
  const normalizedRoute = normalizePath(routePath);
  const normalizedPathname = normalizePath(pathname);

  if (normalizedRoute === "*") {
    return {};
  }

  const routeParts = splitPath(normalizedRoute);
  const pathParts = splitPath(normalizedPathname);

  if (routeParts.length !== pathParts.length) {
    return null;
  }

  const params: Params = {};

  for (let index = 0; index < routeParts.length; index += 1) {
    const routePart = routeParts[index];
    const pathPart = pathParts[index];

    if (routePart.startsWith(":")) {
      params[routePart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (routePart !== pathPart) {
      return null;
    }
  }

  return params;
};

export function BrowserRouter({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Route(_: RouteProps) {
  return null;
}

export function Routes({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";

  let element: React.ReactNode = null;
  let params: Params = {};

  for (const child of Children.toArray(children)) {
    if (!isValidElement<RouteProps>(child)) continue;

    const { path = "*", element: childElement } = child.props;

    if (path === "*") {
      element = childElement ?? null;
      continue;
    }

    const matchedParams = matchPath(path, pathname);
    if (matchedParams !== null) {
      element = childElement ?? null;
      params = matchedParams;
      break;
    }
  }

  return (
    <ParamsContext.Provider value={params}>
      {element}
    </ParamsContext.Provider>
  );
}

export function Navigate({ to, replace = false }: NavigateProps) {
  const router = useRouter();

  useEffect(() => {
    if (replace) {
      router.replace(to);
      return;
    }

    router.push(to);
  }, [replace, router, to]);

  return null;
}

export function useNavigate() {
  const router = useRouter();

  return (to: string | number) => {
    if (typeof to === "number") {
      if (to < 0) {
        router.back();
        return;
      }

      router.forward();
      return;
    }

    router.push(to);
  };
}

export function useParams<T extends Params = Params>() {
  return useContext(ParamsContext) as T;
}

export { Link };
