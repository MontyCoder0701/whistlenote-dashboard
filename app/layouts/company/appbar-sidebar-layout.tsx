import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router";


import { MobileNavTrigger, Navigation } from "~/components/Navigation";
import { SiteSelector } from "~/components/SiteSelector";

export type LayoutContext = {
  selectedSite: string;
  setSelectedSite: (v: string) => void;
};

export default function AppbarSidebarLayout() {
  const { pathname } = useLocation();
  const [selectedSite, setSelectedSite] = useState<string>("all");

  const title = useMemo(() => {
    if (pathname.startsWith("/company/reports")) return "제보 관리";
    if (pathname.startsWith("/company/rewards")) return "포상 관리";
    return "대시보드";
  }, [pathname]);


  const ctx: LayoutContext = {
    selectedSite,
    setSelectedSite,
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Navigation />
      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b flex-shrink-0">
          <div className="relative px-4 md:px-6 pt-4">
            {/* Left side: title + site selector */}
            <div className="flex flex-col min-w-0">
              <h1 className="text-2xl font-bold text-primary whitespace-nowrap pl-3">
                {title}
              </h1>
              <SiteSelector
                selectedSite={selectedSite}
                onSiteChange={setSelectedSite}
              />
            </div>

            {/* Right side: mobile hamburger pinned top-right */}
            <div className="absolute top-4 right-4">
              <MobileNavTrigger />
            </div>
          </div>
        </div>

        {/* Routed Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet context={ctx} />
        </main>
      </div>
    </div>
  );
}
