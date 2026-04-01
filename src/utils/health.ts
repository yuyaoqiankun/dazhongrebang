export interface HealthErrorInfo {
  at: string;
  message: string;
  code?: string;
  status?: number;
  url?: string;
}

export interface RouteHealthInfo {
  route: string;
  title?: string;
  lastFetchAt?: string;
  lastSuccessAt?: string;
  lastFailureAt?: string;
  lastDurationMs?: number;
  lastResultCount?: number;
  fromCache?: boolean;
  consecutiveFailures: number;
  status: "idle" | "ok" | "error";
  lastError?: HealthErrorInfo;
}

const routeHealthStore = new Map<string, RouteHealthInfo>();

const getExistingRouteHealth = (route: string): RouteHealthInfo => {
  return routeHealthStore.get(route) || { route, status: "idle", consecutiveFailures: 0 };
};

export const recordRouteSuccess = (route: string, options: Omit<RouteHealthInfo, "route" | "status" | "consecutiveFailures">) => {
  const current = getExistingRouteHealth(route);
  routeHealthStore.set(route, {
    ...current,
    ...options,
    route,
    status: "ok",
    consecutiveFailures: 0,
  });
};

export const recordRouteFailure = (route: string, error: HealthErrorInfo, options?: Partial<RouteHealthInfo>) => {
  const current = getExistingRouteHealth(route);
  routeHealthStore.set(route, {
    ...current,
    ...options,
    route,
    status: "error",
    consecutiveFailures: current.consecutiveFailures + 1,
    lastFailureAt: error.at,
    lastFetchAt: error.at,
    lastError: error,
  });
};

export const getRouteHealthList = () => {
  return [...routeHealthStore.values()].sort((a, b) => a.route.localeCompare(b.route));
};

export const getHealthSummary = () => {
  const routes = getRouteHealthList();
  const ok = routes.filter((route) => route.status === "ok").length;
  const error = routes.filter((route) => route.status === "error").length;
  const idle = routes.filter((route) => route.status === "idle").length;
  return {
    total: routes.length,
    ok,
    error,
    idle,
    routes,
  };
};

export const initRouteHealth = (route: string, title?: string) => {
  if (routeHealthStore.has(route)) return;
  routeHealthStore.set(route, {
    route,
    title,
    status: "idle",
    consecutiveFailures: 0,
  });
};
