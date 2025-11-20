import { Outlet, redirect, type ClientLoaderFunction } from "react-router";
import LoadingSpinner from "~/components/ui/loading-spinner";
import { authService } from "~/utils/authService";

export const clientLoader: ClientLoaderFunction = async () => {
  const res = await authService.getCurrentUser();
  if (res) {
    throw redirect("/profile");
  }
};

export function HydrateFallback() {
  return <LoadingSpinner />;
}

function Layout() {
  return <Outlet />;
}

export default Layout;
