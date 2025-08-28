import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
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

interface Report {
  id: string;
  siteName: string;
  location: string;
  date: string;
  status: "completed" | "in-progress" | "pending";
  type: string;
  description: string;
}

const mockReports: Report[] = [
  {
    id: "1",
    siteName: "다운타운 오피스 복합건물",
    location: "다운타운 메인가 123번지",
    date: "2025-08-28",
    status: "completed",
    type: "낙하물 위험",
    description:
      "5층 작업장에서 안전망 미설치 및 낙하물 위험 발견, 즉시 조치 완료",
  },
  {
    id: "2",
    siteName: "강변 아파트 단지",
    location: "리버사이드 강변로 456번지",
    date: "2025-08-27",
    status: "in-progress",
    type: "전기 안전 위험",
    description: "지하 전기실 누수로 인한 감전 위험, 전기 안전 점검 진행 중",
  },
  {
    id: "3",
    siteName: "고속도로 교량 프로젝트",
    location: "15번 국도 42km 지점",
    date: "2025-08-26",
    status: "pending",
    type: "구조물 안전 위험",
    description:
      "임시 비계 불안정으로 인한 붕괴 위험, 구조 엔지니어 검토 대기 중",
  },
  {
    id: "4",
    siteName: "지하철역 확장 공사",
    location: "중앙역 광장",
    date: "2025-08-25",
    status: "completed",
    type: "화재 위험",
    description: "용접 작업 중 가연물 근접 화재 위험, 안전 구역 설정 완료",
  },
  {
    id: "5",
    siteName: "쇼핑센터 리모델링",
    location: "상업대로 789번지",
    date: "2025-08-24",
    status: "in-progress",
    type: "유해물질 노출",
    description: "석면 해체 작업 중 방진 마스크 미착용 발견, 안전교육 진행 중",
  },
];

const incidentData = [
  { month: "1월", incidents: 12 },
  { month: "2월", incidents: 8 },
  { month: "3월", incidents: 15 },
  { month: "4월", incidents: 6 },
  { month: "5월", incidents: 10 },
  { month: "6월", incidents: 18 },
  { month: "7월", incidents: 14 },
  { month: "8월", incidents: 9 },
];

const chartConfig = {
  incidents: {
    label: "사고 건수",
    color: "var(--primary)",
  },
};

function getStatusIcon(status: Report["status"]) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "pending":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
  }
}

function getStatusBadge(status: Report["status"]) {
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  switch (status) {
    case "completed":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "in-progress":
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case "pending":
      return `${baseClasses} bg-red-100 text-red-800`;
  }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Whistlenote 제보 대시보드
          </h1>
          <p className="text-gray-600 mt-2">현장: 민이앤아이 1 현장</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">
                  월별 사고 발생 현황
                </CardTitle>
                <CardDescription>최근 8개월간 사고 발생 건수</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart data={incidentData}>
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
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
                  <span className="text-2xl font-bold text-primary">9건</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">완료</span>
                  <span className="text-lg font-semibold text-green-600">
                    2건
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">진행 중</span>
                  <span className="text-lg font-semibold text-yellow-600">
                    3건
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">대기 중</span>
                  <span className="text-lg font-semibold text-red-600">
                    1건
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg border-t-4 border-primary">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-primary mb-4">최근 제보</h2>
            <div className="space-y-4">
              {mockReports.map((report) => (
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
                            <span className={getStatusBadge(report.status)}>
                              {report.status === "completed"
                                ? "완료"
                                : report.status === "in-progress"
                                  ? "진행 중"
                                  : "대기 중"}
                            </span>
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
  );
}
