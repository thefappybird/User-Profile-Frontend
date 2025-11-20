import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
export default [
  layout("./layouts/public/layout.tsx", [
    layout("./layouts/public/landing.tsx", [
      index("routes/login.tsx"),
      route("register", "routes/register.tsx"),
    ]),
  ]),
  layout("./layouts/private/layout.tsx", [
    route("profile", "routes/profile.tsx"),
  ]),
] satisfies RouteConfig;
