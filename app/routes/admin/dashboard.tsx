import { AlertTriangle, Calendar, CheckCircle, Clock, FileText, MapPin } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router";
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
import { mockReports } from "~/lib/mock";
import { ReportStatus, type Report } from "~/types";
import type { LayoutContext } from "../layouts/appbar-sidebar-layout";

export default function DashboardPageRoute() {
  const nav = useNavigate();

  const { selectedSite } = useOutletContext<LayoutContext>();

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

  const chartData = useMemo(
    () => generateChartData(filteredReports),
    [filteredReports]
  );

  const chartConfig = {
    incidents: {
      label: "사고 건수",
      color: "var(--primary)",
    },
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                월별 사고 발생 현황
              </CardTitle>
              <CardDescription>최근 6개월간 사고 발생 건수</CardDescription>
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
                  <YAxis tickLine={false} axisLine={false} tickMargin={6} />
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
          <h2 className="text-lg font-medium text-primary mb-4">최근 제보</h2>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => nav(`/reports/${report.id}`)}
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
                      <p className="text-gray-600 mt-2">{report.description}</p>
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
    </>
  );
}
