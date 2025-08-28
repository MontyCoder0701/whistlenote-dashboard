import { useOutletContext } from "react-router";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "~/components/ui/table";
import type { LayoutContext } from "../layouts/app-layout";

export default function ReportsPageRoute() {
  const { filteredReports, getStatusIcon, getStatusBadge } =
    useOutletContext<LayoutContext>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">제보 관리</CardTitle>
        <CardDescription>모든 제보를 테이블로 관리합니다</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-3">
          {filteredReports.map((r) => (
            <div key={r.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 break-words">
                    {r.siteName}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{r.type}</div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {getStatusIcon(r.status)}
                  {getStatusBadge(r.status)}
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <div className="text-gray-900">
                  <span className="font-medium mr-2">날짜</span>
                  <span className="text-gray-600">
                    {new Date(r.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-gray-900">
                  <span className="font-medium mr-2">위치</span>
                  <span className="text-gray-600 break-words whitespace-normal">
                    {r.location}
                  </span>
                </div>
                <div className="text-gray-900">
                  <span className="font-medium mr-2">설명</span>
                  <span className="text-gray-600 break-words whitespace-normal">
                    {r.description}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>현장</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>날짜</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>위치</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredReports.map((r) => (
                <TableRow key={r.id} className="align-top">
                  <TableCell>
                    <div className="font-medium text-gray-900">{r.siteName}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{r.type}</TableCell>
                  <TableCell>
                    {getStatusBadge(r.status)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(r.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 break-words whitespace-normal">
                    {r.description}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {r.location}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
