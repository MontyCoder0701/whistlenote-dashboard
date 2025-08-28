import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
} from "lucide-react";
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
