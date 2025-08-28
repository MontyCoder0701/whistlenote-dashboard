import { useDeferredValue, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "~/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "~/components/ui/table";
import { ReportStatus } from "~/types";
import type { LayoutContext } from "../layouts/app-layout";

type StatusFilter = "all" | ReportStatus;

export default function ReportsPageRoute() {
  const { filteredReports, getStatusIcon, getStatusBadge } =
    useOutletContext<LayoutContext>();

  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);

  const [status, setStatus] = useState<StatusFilter>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const results = useMemo(() => {
    const norm = (s: unknown) =>
      (typeof s === "string" ? s : String(s ?? "")).toLowerCase().normalize("NFC");

    const matchesQuery = (r: any) => {
      const needle = norm(dq.trim());
      if (!needle) return true;

      const hay = [r.siteName, r.type, r.location, r.description].map(norm).join(" ");
      return hay.includes(needle);
    };

    const matchesStatus = (r: any) => status === "all" || r.status === status;

    const parseYMD = (s: string) => {
      if (!s) return null;
      const d = new Date(s + "T00:00:00");
      return isNaN(d.getTime()) ? null : d;
    };

    const fromD = parseYMD(from);
    const toD = parseYMD(to);

    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const inRange = (r: any) => {
      const rd = startOfDay(new Date(r.date));
      if (fromD && rd < fromD) return false;
      if (toD && rd > toD) return false;
      return true;
    };

    return filteredReports.filter((r) => matchesQuery(r) && matchesStatus(r) && inRange(r));
  }, [filteredReports, dq, status, from, to]);

  const clearFilters = () => {
    setQ("");
    setStatus("all");
    setFrom("");
    setTo("");
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-primary">제보 관리</CardTitle>
        <CardDescription>모든 제보를 테이블로 관리합니다.</CardDescription>

        {/* Controls */}
        <div className="flex flex-col gap-3 md:flex-wrap md:flex-row md:items-center">
          {/* Search */}
          <div className="flex items-center gap-2 md:flex-1 min-w-[12rem]">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색: 현장/유형/설명/위치…"
              className="w-full"
            />
            <span className="text-xs text-gray-500 whitespace-nowrap">{results.length}건</span>
          </div>

          {/* Status filter */}
          <div className="w-full md:w-auto">
            <Select value={status} onValueChange={(v: StatusFilter) => setStatus(v)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="상태: 전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value={ReportStatus.completed}>{ReportStatus.completed}</SelectItem>
                <SelectItem value={ReportStatus.inProgress}>{ReportStatus.inProgress}</SelectItem>
                <SelectItem value={ReportStatus.pending}>{ReportStatus.pending}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="flex-1 md:w-[9.5rem]"
            />
            <span className="text-gray-400">~</span>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 md:w-[9.5rem]"
            />
          </div>

          <div className="w-full md:w-auto md:ml-auto">
            <Button variant="secondary" onClick={clearFilters} className="w-full md:w-auto">
              필터 초기화
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {results.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center text-sm text-gray-600">
            조건에 맞는 제보가 없습니다.
          </div>
        ) : (
          <>
            {/* Mobile: stacked cards */}
            <div className="md:hidden space-y-3">
              {results.map((r) => (
                <div key={r.id} className="rounded-xl border p-4 bg-white">
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
                  {results.map((r) => (
                    <TableRow key={r.id} className="align-top">
                      <TableCell>
                        <div className="font-medium text-gray-900">{r.siteName}</div>
                      </TableCell>

                      <TableCell className="text-sm text-gray-600">{r.type}</TableCell>

                      <TableCell>{getStatusBadge(r.status)}</TableCell>

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
          </>
        )}
      </CardContent>
    </Card>
  );
}
