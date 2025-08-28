import { Building, ChevronDown, ChevronUp } from "lucide-react";

interface Site {
  id: string;
  name: string;
  location: string;
  totalReports: number;
}

interface SiteSelectorProps {
  sites: Site[];
  selectedSite: string;
  onSiteChange: (siteId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SiteSelector({
  sites,
  selectedSite,
  onSiteChange,
  isOpen,
  onToggle,
}: SiteSelectorProps) {
  const currentSite = sites.find((site) => site.id === selectedSite);

  return (
    <div>
      <div className="flex justify-between items-center py-2">
        <div className="flex-1">
          <button
            onClick={onToggle}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span>선택된 현장: {currentSite?.name}</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Site Selector - Collapsible */}
      {isOpen && (
        <div className="pb-4">
          <div className="flex flex-wrap gap-2">
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => onSiteChange(site.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSite === site.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Building className="h-4 w-4" />
                <span>{site.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    selectedSite === site.id
                      ? "bg-white/20 text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {site.totalReports}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
