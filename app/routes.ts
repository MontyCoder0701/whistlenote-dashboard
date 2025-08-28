import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/app-layout.tsx", [
    index("routes/dashboard.tsx"),
    route("reports", "routes/reports.tsx"),
    route("rewards", "routes/rewards.tsx"),
  ]),
] satisfies RouteConfig;
