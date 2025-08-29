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
    route("reports/:id", "routes/report-detail.tsx"),

    route("rewards", "routes/rewards.tsx"),
    route("rewards/:id", "routes/reward-detail.tsx"),
  ]),
] satisfies RouteConfig;
