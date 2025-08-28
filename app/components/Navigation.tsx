import { Coins, Home, MessageCircleWarning, Settings } from "lucide-react";

export type PageType = "dashboard" | "reports" | "rewards";

interface NavigationItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  page: PageType;
}

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navigationItems: NavigationItem[] = [
    { name: "대시보드", icon: Home, page: "dashboard" },
    { name: "제보", icon: MessageCircleWarning, page: "reports" },
    { name: "포상", icon: Coins, page: "rewards" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg flex-shrink-0">
      <div className="flex flex-col h-screen">
        {/* Logo/Brand */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-primary">Whistlenote</h2>
          <p className="text-sm text-gray-600 mt-1">건설 제보 대시보드</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => onPageChange(item.page)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    currentPage === item.page
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Settings className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">관리자</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
