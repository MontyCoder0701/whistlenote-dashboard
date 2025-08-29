import { Outlet } from "react-router";


import { MobileNavTrigger, Navigation } from "~/components/Navigation";

export default function SidebarLayout() {
  return (
    <div className="h-screen bg-gray-50 flex">
      <Navigation />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b flex-shrink-0 md:hidden">
          <div className="flex justify-end py-4 px-4 md:px-6">
            {/* Right side: mobile hamburger */}
            <MobileNavTrigger />
          </div>
        </div>

        {/* Routed Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
