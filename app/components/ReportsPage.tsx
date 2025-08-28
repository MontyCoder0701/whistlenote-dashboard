import type { JSX } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

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

enum ReportStatus {
  completed = "완료",
  inProgress = "진행중",
  pending = "대기중",
}

interface ReportsPageProps {
  filteredReports: Report[];
  getStatusIcon: (status: ReportStatus) => JSX.Element;
  getStatusBadge: (status: ReportStatus) => JSX.Element;
}

export function ReportsPage({
  filteredReports,
  getStatusIcon,
  getStatusBadge,
}: ReportsPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">제보 관리</CardTitle>
        <CardDescription>모든 제보를 테이블로 관리합니다</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold text-gray-900">
                  현장
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  유형
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  상태
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  날짜
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  설명
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  위치
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {report.siteName}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">{report.type}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      {getStatusBadge(report.status)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <span className="text-sm text-gray-600 line-clamp-2">
                      {report.description}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-600">
                      {report.location}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
