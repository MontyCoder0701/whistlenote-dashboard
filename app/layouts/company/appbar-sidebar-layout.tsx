import { Coins, Home, LogOut, Menu, MessageCircleWarning, User } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";


import { SiteSelector } from "~/components/SiteSelector";
import { Button } from "~/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet";

export type LayoutContext = {
  selectedSite: string;
  setSelectedSite: (v: string) => void;
};

type NavItem = {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
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

  const items: NavItem[] = [
    { name: "대시보드", to: "/company", icon: Home, end: true },
    { name: "제보", to: "/company/reports", icon: MessageCircleWarning },
    { name: "포상", to: "/company/rewards", icon: Coins },
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      <aside className="hidden md:flex bg-white shadow-lg flex-shrink-0">
        <div className="flex flex-col h-screen">
          {/* Logo/Brand */}
          <NavLink to={"/"} className="p-6 border-b">
            <h2 className="text-xl font-bold text-primary">Whistlenote</h2>
            <p className="text-sm text-gray-600 mt-1">건설 제보 대시보드</p>
          </NavLink>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile + Logout */}
          <div className="p-4 border-t space-y-2">
            <NavLink to={'/company/account'} className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">회사 관리자</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </NavLink>

            {/* Logout button */}
            <button
              onClick={() => {
                console.log("로그아웃");
              }}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
              로그아웃
            </button>
          </div>
        </div>
      </aside>

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
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="-ml-2">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">메뉴 열기</span>
                    </Button>
                  </SheetTrigger>

                  <SheetContent side="right" className="p-0 w-80">
                    <SheetHeader className="p-6 pb-3 text-left">
                      <SheetTitle className="text-primary">Whistlenote</SheetTitle>
                      <SheetDescription className="text-sm text-gray-600">건설 제보 대시보드</SheetDescription>
                    </SheetHeader>

                    <nav className="p-4">
                      <ul className="space-y-1">
                        {items.map((item) => (
                          <li key={item.to}>
                            <SheetClose className="flex items-center gap-3 px-4 py-3" asChild>
                              <NavLink
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                  `rounded-lg text-base ${isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-800 hover:bg-gray-100"
                                  }`
                                }
                              >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                              </NavLink>
                            </SheetClose>
                          </li>
                        ))}
                      </ul>
                    </nav>

                    <div className="border-t p-4 space-y-2">
                      <NavLink to={"/company/account"} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">관리자</p>
                          <p className="text-xs text-gray-500">admin@example.com</p>
                        </div>
                      </NavLink>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          console.log("로그아웃");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="h-5 w-5 text-gray-500" />
                        로그아웃
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
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
