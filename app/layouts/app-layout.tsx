import { useMemo, useState, type JSX } from "react";
import { Outlet, useLocation } from "react-router";

import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

import { Navigation } from "~/components/Navigation";
import { SiteSelector } from "~/components/SiteSelector";
import { ReportStatus, type Report, type Site } from "~/types";

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

function generateChartData(reports: Report[]) {
  const monthly: Record<string, number> = {};
  reports.forEach((r) => {
    const m = `${r.date.getMonth() + 1}월`;
    monthly[m] = (monthly[m] || 0) + 1;
  });
  return ["3월", "4월", "5월", "6월", "7월", "8월"].map((m) => ({
    month: m,
    incidents: monthly[m] || 0,
  }));
}

export type LayoutContext = {
  sites: Site[];
  selectedSite: string;
  setSelectedSite: (v: string) => void;
  filteredReports: Report[];
  stats: {
    completed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
  chartData: { month: string; incidents: number }[];
  getStatusIcon: (s: ReportStatus) => JSX.Element;
  getStatusBadge: (s: ReportStatus) => JSX.Element;
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [siteSelectionOpen, setSiteSelectionOpen] = useState(false);

  const filteredReports = useMemo(
    () =>
      selectedSite === "all"
        ? mockReports
        : mockReports.filter((r) => r.siteId === selectedSite),
    [selectedSite]
  );

  const stats = useMemo(() => {
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
  }, [filteredReports]);

  const chartData = useMemo(
    () => generateChartData(filteredReports),
    [filteredReports]
  );

  const title = useMemo(() => {
    if (pathname.startsWith("/reports")) return "제보 관리";
    if (pathname.startsWith("/rewards")) return "포상 관리";
    return "대시보드";
  }, [pathname]);

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.completed:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case ReportStatus.inProgress:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case ReportStatus.pending:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    const color = {
      [ReportStatus.completed]: "bg-green-100 text-green-800",
      [ReportStatus.inProgress]: "bg-yellow-100 text-yellow-800",
      [ReportStatus.pending]: "bg-red-100 text-red-800",
    }[status];
    return <span className={`${base} ${color}`}>{status}</span>;
  };

  const ctx: LayoutContext = {
    sites,
    selectedSite,
    setSelectedSite,
    filteredReports,
    stats,
    chartData,
    getStatusIcon,
    getStatusBadge,
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Navigation />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b flex-shrink-0">
          <div className="flex items-center justify-between gap-4 py-4 px-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-2xl font-bold text-primary whitespace-nowrap">
                  {title}
                </h1>

                <SiteSelector
                  sites={sites}
                  selectedSite={selectedSite}
                  onSiteChange={setSelectedSite}
                  isOpen={siteSelectionOpen}
                  onToggle={() => setSiteSelectionOpen(!siteSelectionOpen)}
                />
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
