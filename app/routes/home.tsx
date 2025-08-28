import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

import { DashboardPage } from "~/components/DashboardPage";
import { Navigation } from "~/components/Navigation";
import { ReportsPage } from "~/components/ReportsPage";
import { RewardsPage } from "~/components/RewardsPage";
import { SiteSelector } from "~/components/SiteSelector";
import { ReportStatus, type PageType, type Report, type Site } from "~/types";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "휘슬노트 제보 대시보드" },
    { name: "description", content: "휘슬노트 제보 대시보드" },
  ];
}

const sites: Site[] = [
  { id: "all", name: "전체 현장", location: "모든 현장", totalReports: 32 },
  {
    id: "site1",
    name: "민이앤아이 1 현장",
    location: "다운타운 메인가 123번지",
    totalReports: 9,
  },
  {
    id: "site2",
    name: "강변 아파트 단지",
    location: "리버사이드 강변로 456번지",
    totalReports: 8,
  },
  {
    id: "site3",
    name: "고속도로 교량 프로젝트",
    location: "15번 국도 42km 지점",
    totalReports: 7,
  },
  {
    id: "site4",
    name: "지하철역 확장 공사",
    location: "중앙역 광장",
    totalReports: 5,
  },
  {
    id: "site5",
    name: "쇼핑센터 리모델링",
    location: "상업대로 789번지",
    totalReports: 3,
  },
];

const mockReports: Report[] = [
  {
    id: "1",
    siteName: "민이앤아이 1 현장",
    siteId: "site1",
    location: "다운타운 메인가 123번지",
    date: new Date("2025-08-28"),
    status: ReportStatus.completed,
    type: "낙하물 위험",
    description:
      "5층 작업장에서 안전망 미설치 및 낙하물 위험 발견, 즉시 조치 완료",
  },
  {
    id: "2",
    siteName: "강변 아파트 단지",
    siteId: "site2",
    location: "리버사이드 강변로 456번지",
    date: new Date("2025-06-27"),
    status: ReportStatus.inProgress,
    type: "전기 안전 위험",
    description: "지하 전기실 누수로 인한 감전 위험, 전기 안전 점검 진행 중",
  },
  {
    id: "3",
    siteName: "고속도로 교량 프로젝트",
    siteId: "site3",
    location: "15번 국도 42km 지점",
    date: new Date("2025-05-26"),
    status: ReportStatus.pending,
    type: "구조물 안전 위험",
    description:
      "임시 비계 불안정으로 인한 붕괴 위험, 구조 엔지니어 검토 대기 중",
  },
  {
    id: "4",
    siteName: "지하철역 확장 공사",
    siteId: "site4",
    location: "중앙역 광장",
    date: new Date("2025-03-25"),
    status: ReportStatus.completed,
    type: "화재 위험",
    description: "용접 작업 중 가연물 근접 화재 위험, 안전 구역 설정 완료",
  },
  {
    id: "5",
    siteName: "쇼핑센터 리모델링",
    siteId: "site5",
    location: "상업대로 789번지",
    date: new Date("2025-03-24"),
    status: ReportStatus.inProgress,
    type: "유해물질 노출",
    description: "석면 해체 작업 중 방진 마스크 미착용 발견, 안전교육 진행 중",
  },
  {
    id: "6",
    siteName: "민이앤아이 1 현장",
    siteId: "site1",
    location: "다운타운 메인가 123번지",
    date: new Date("2025-01-26"),
    status: ReportStatus.pending,
    type: "작업장 정리",
    description: "작업 도구 방치 및 통로 확보 필요",
  },
  {
    id: "7",
    siteName: "강변 아파트 단지",
    siteId: "site2",
    location: "리버사이드 강변로 456번지",
    date: new Date("2025-01-25"),
    status: ReportStatus.inProgress,
    type: "소음 문제",
    description: "야간 작업 소음 규정 위반, 작업시간 조정 완료",
  },
];

const generateChartData = (reports: Report[]) => {
  const monthlyData: { [key: string]: number } = {};

  reports.forEach((report) => {
    const month = `${report.date.getMonth() + 1}월`;
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  return ["3월", "4월", "5월", "6월", "7월", "8월"].map((month) => ({
    month,
    incidents: monthlyData[month] || 0,
  }));
};

function getStatusIcon(status: ReportStatus) {
  switch (status) {
    case ReportStatus.completed:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case ReportStatus.inProgress:
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case ReportStatus.pending:
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
}

function getStatusBadge(status: ReportStatus) {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const colorMap = {
    [ReportStatus.completed]: "bg-green-100 text-green-800",
    [ReportStatus.inProgress]: "bg-yellow-100 text-yellow-800",
    [ReportStatus.pending]: "bg-red-100 text-red-800",
  };
  return <span className={`${baseClasses} ${colorMap[status]}`}>{status}</span>;
}

export default function Main() {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [siteSelectionOpen, setSiteSelectionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

  const filteredReports =
    selectedSite === "all"
      ? mockReports
      : mockReports.filter((report) => report.siteId === selectedSite);

  const getFilteredStats = () => {
    const completed = filteredReports.filter(
      (r) => r.status === ReportStatus.completed
    ).length;
    const inProgress = filteredReports.filter(
      (r) => r.status === ReportStatus.inProgress
    ).length;
    const pending = filteredReports.filter(
      (r) => r.status === ReportStatus.pending
    ).length;
    return { completed, inProgress, pending, total: filteredReports.length };
  };

  const stats = getFilteredStats();
  const chartData = generateChartData(filteredReports);

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "대시보드";
      case "reports":
        return "제보 관리";
      case "rewards":
        return "포상 관리";
      default:
        return "대시보드";
    }
  };

  const renderCurrentPage = () => {
    const props = {
      filteredReports,
      getStatusIcon,
      getStatusBadge,
    };

    switch (currentPage) {
      case "dashboard":
        return <DashboardPage {...props} stats={stats} chartData={chartData} />;
      case "reports":
        return <ReportsPage {...props} />;
      case "rewards":
        return <RewardsPage />;
      default:
        return <DashboardPage {...props} stats={stats} chartData={chartData} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b flex-shrink-0">
          <div className="flex justify-between items-center pt-4 px-6">
            <h1 className="text-2xl font-bold text-primary">
              {getPageTitle()}
            </h1>
          </div>

          <SiteSelector
            sites={sites}
            selectedSite={selectedSite}
            onSiteChange={setSelectedSite}
            isOpen={siteSelectionOpen}
            onToggle={() => setSiteSelectionOpen(!siteSelectionOpen)}
          />
        </div>

        {/* Page Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">{renderCurrentPage()}</div>
        </div>
      </div>
    </div>
  );
}
