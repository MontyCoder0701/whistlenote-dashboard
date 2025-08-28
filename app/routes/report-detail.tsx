import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/components/ui/card";
import type { LayoutContext } from "../layouts/app-layout";

export default function ReportDetailPageRoute() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { filteredReports, getStatusIcon, getStatusBadge } =
    useOutletContext<LayoutContext>();

  const report = useMemo(
    () => filteredReports.find(r => String(r.id) === String(id)),
    [filteredReports, id]
  );

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">제보 상세</CardTitle>
          <CardDescription>제보를 찾을 수 없습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> 돌아가기
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary">제보 상세</CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon(report.status)}
            {getStatusBadge(report.status)}
          </div>
        </div>
        <CardDescription>
          {report.siteName} · {new Date(report.date).toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">유형</div>
          <div className="text-sm text-gray-900">{report.type}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">위치</div>
          <div className="text-sm text-gray-900 break-words whitespace-normal">
            {report.location}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-1">설명</div>
          <div className="text-sm text-gray-900 break-words whitespace-normal min-h-[2.5rem] leading-snug">
            {report.description}
          </div>
        </div>

        <div className="pt-2">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> 목록으로
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
