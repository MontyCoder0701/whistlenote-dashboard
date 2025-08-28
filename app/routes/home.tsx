import { useState } from "react";

import {
  AlertTriangle,
  BarChart3,
  Building,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Home,
  LogOut,
  MapPin,
  Settings,
} from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "휘슬노트 제보 대시보드" },
    { name: "description", content: "휘슬노트 제보 대시보드" },
  ];
}

enum ReportStatus {
  completed = "완료",
  inProgress = "진행중",
  pending = "대기중",
}

interface Report {
  id: string;
  siteName: string;
  siteId: string;
  location: string;
  date: Date;
  status: ReportStatus;
  type: string;
  description: string;
}

interface Site {
  id: string;
  name: string;
  location: string;
  totalReports: number;
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

const chartConfig = {
  incidents: {
    label: "사고 건수",
    color: "var(--primary)",
  },
};

function getStatusIcon(status: Report["status"]) {
  switch (status) {
    case ReportStatus.completed:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case ReportStatus.inProgress:
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case ReportStatus.pending:
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
}

function getStatusBadge(status: Report["status"]) {
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

  const filteredReports =
    selectedSite === "all"
      ? mockReports
      : mockReports.filter((report) => report.siteId === selectedSite);

  const currentSite = sites.find((site) => site.id === selectedSite);

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

  const navigationItems = [
    { name: "대시보드", icon: Home, active: true },
    { name: "통계", icon: BarChart3, active: false },
  ];

  const accountMenuItems = [
    { name: "계정 설정", icon: Settings },
    { name: "로그아웃", icon: LogOut },
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex-shrink-0">
        <div className="flex flex-col h-screen">
          {/* Logo/Brand */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-primary">Whistlenote</h2>
            <p className="text-sm text-gray-600 mt-1">제보 대시보드</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <button
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      item.active
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

            {/* Account Menu Items */}
            <div className="mt-8 pt-4 border-t">
              <ul className="space-y-2">
                {accountMenuItems.map((item) => (
                  <li key={item.name}>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b flex-shrink-0">
          <div className="px-6">
            <div className="flex justify-between items-center py-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-primary">대시보드</h1>
                <p className="text-sm text-gray-600 mt-1">
                  현장: {currentSite?.name}
                </p>
              </div>

              <button
                onClick={() => setSiteSelectionOpen(!siteSelectionOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span>현장 선택</span>
                {siteSelectionOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Site Selector - Collapsible */}
            {siteSelectionOpen && (
              <div className="pb-4">
                <div className="flex flex-wrap gap-2">
                  {sites.map((site) => (
                    <button
                      key={site.id}
                      onClick={() => setSelectedSite(site.id)}
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
        </div>

        {/* Dashboard Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">
                      월별 사고 발생 현황
                    </CardTitle>
                    <CardDescription>
                      최근 6개월간 사고 발생 건수
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig}>
                      <BarChart data={chartData}>
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={6}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                          dataKey="incidents"
                          fill="var(--color-incidents)"
                          radius={4}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">이번 달 통계</CardTitle>
                    <CardDescription>8월 현재 현황</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">총 제보</span>
                      <span className="text-2xl font-bold text-primary">
                        {stats.total}건
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {ReportStatus.completed}
                      </span>
                      <span className="text-lg font-semibold text-green-600">
                        {stats.completed}건
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {ReportStatus.inProgress}
                      </span>
                      <span className="text-lg font-semibold text-yellow-600">
                        {stats.inProgress}건
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {ReportStatus.pending}
                      </span>
                      <span className="text-lg font-semibold text-red-600">
                        {stats.pending}건
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border-t-4 border-primary">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-primary mb-4">
                  최근 제보
                </h2>
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {report.siteName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{report.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(report.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 mt-2">
                              {report.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-3">
                              <span className="text-sm font-medium text-gray-900">
                                {report.type}
                              </span>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(report.status)}
                                {getStatusBadge(report.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
