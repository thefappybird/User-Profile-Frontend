import {
  Outlet,
  redirect,
  type ClientLoaderFunction,
  type MetaFunction,
} from "react-router";
import { DashboardLayout } from "~/components/private/dashboard-wrapper";
import LoadingSpinner from "~/components/ui/loading-spinner";
import { authService } from "~/utils/authService";

export const clientLoader: ClientLoaderFunction = async () => {
  const res = await authService.getCurrentUser();
  if (!res) {
    throw redirect("/");
  }
  return res;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Profile Dashboard" },
    { name: "description", content: "Profile Dashboard" },
  ];
};
export function HydrateFallback() {
  return <LoadingSpinner />;
}

function Layout({ loaderData }: any) {
  return (
    <DashboardLayout currentUser={loaderData}>
      <Outlet />
    </DashboardLayout>
  );
}

export default Layout;
