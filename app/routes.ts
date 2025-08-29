import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/appbar-sidebar-layout.tsx", [
    index("routes/dashboard.tsx"),

    route("reports", "routes/reports.tsx"),
    route("reports/:id", "routes/report-detail.tsx"),

    route("rewards", "routes/rewards.tsx"),
    route("rewards/:id", "routes/reward-detail.tsx"),
  ]),
  layout("layouts/sidebar-layout.tsx", [
    route("account", "routes/account.tsx"),
  ]),
] satisfies RouteConfig;
