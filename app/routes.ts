import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/root-redirect.tsx"),

  // /company/* 
  route("company", "routes/company/_section.tsx", [
    layout("layouts/company/appbar-sidebar-layout.tsx", [
      index("routes/company/dashboard.tsx"),
      route("reports", "routes/company/reports.tsx"),
      route("reports/:id", "routes/company/report-detail.tsx"),
      route("rewards", "routes/company/rewards.tsx"),
      route("rewards/:id", "routes/company/reward-detail.tsx"),
    ]),
    layout("layouts/company/sidebar-layout.tsx", [
      route("account", "routes/company/account.tsx"),
    ]),
  ]),

  // /admin/* 
  route("admin", "routes/admin/_section.tsx", [
    layout("layouts/admin/appbar-sidebar-layout.tsx", [
      index("routes/admin/dashboard.tsx"),
      route("reports", "routes/admin/reports.tsx"),
      route("reports/:id", "routes/admin/report-detail.tsx"),
      route("rewards", "routes/admin/rewards.tsx"),
      route("rewards/:id", "routes/admin/reward-detail.tsx"),
    ]),
    layout("layouts/admin/sidebar-layout.tsx", [
      route("account", "routes/admin/account.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
