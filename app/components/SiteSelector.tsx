import { Building, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { mockSites } from "~/lib/mock";


interface SiteSelectorProps {
  selectedSite: string;
  onSiteChange: (siteId: string) => void;
}

export function SiteSelector({
  selectedSite,
  onSiteChange,
}: SiteSelectorProps) {
  const [siteSelectionOpen, setSiteSelectionOpen] = useState(false);

  const currentSite = mockSites.find((site) => site.id === selectedSite);

  return (
    <div>
      <div className="flex justify-between items-center py-2">
        <div className="flex-1">
          <button
            onClick={() => setSiteSelectionOpen(!siteSelectionOpen)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span>선택된 현장: {currentSite?.name}</span>
            {siteSelectionOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Site Selector - Collapsible */}
      {siteSelectionOpen && (
        <div className="pb-4">
          <div className="flex flex-wrap gap-2">
            {mockSites.map((site) => (
              <button
                key={site.id}
                onClick={() => onSiteChange(site.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSite === site.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Building className="h-4 w-4" />
                <span>{site.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${selectedSite === site.id
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
