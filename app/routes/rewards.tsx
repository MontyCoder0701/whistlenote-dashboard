import { Coins } from "lucide-react";
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

import { RewardStatus, type Reward } from "~/types";
import type { LayoutContext } from "../layouts/app-layout";

type StatusFilter = "all" | RewardStatus;

const mockRewards: Reward[] = [
  {
    id: "rw1",
    reportId: "1",
    reportTitle: "낙하물 위험",
    siteId: "site1",
    siteName: "민이앤아이 1 현장",
    userId: "u12900iadr",
    amount: 100_000,
    status: RewardStatus.completed,
    date: new Date("2025-08-28"),
  },
  {
    id: "rw2",
    reportId: "2",
    reportTitle: "전기 안전 위험",
    siteId: "site2",
    siteName: "강변 아파트 단지",
    userId: "u21o32jsfdlk",
    amount: 70_000,
    status: RewardStatus.inProgress,
    date: new Date("2025-06-27"),
  },
  {
    id: "rw3",
    reportId: "3",
    reportTitle: "구조물 안전 위험",
    siteId: "site3",
    siteName: "고속도로 교량 프로젝트",
    userId: "u31opjawjfklasjlfk",
    amount: 120_000,
    status: RewardStatus.pending,
    date: new Date("2025-05-26"),
  },
];

export default function RewardsPageRoute() {
  const { selectedSite } = useOutletContext<LayoutContext>();

  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);

  const [status, setStatus] = useState<StatusFilter>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const siteFiltered = useMemo(
    () => (selectedSite === "all" ? mockRewards : mockRewards.filter(r => r.siteId === selectedSite)),
    [selectedSite]
  );

  const results = useMemo(() => {
    const norm = (s: unknown) =>
      (typeof s === "string" ? s : String(s ?? "")).toLowerCase().normalize("NFC");

    const matchesQuery = (r: Reward) => {
      const needle = norm(dq.trim());
      if (!needle) return true;
      const hay = [
        r.siteName,
        r.reportTitle,
        r.userId,
        r.amount,
        r.status,
        new Date(r.date).toLocaleDateString(),
      ].map(norm).join(" ");
      return hay.includes(needle);
    };

    const matchesStatus = (r: Reward) => status === "all" || r.status === status;

    const parseYMD = (s: string) => {
      if (!s) return null;
      const d = new Date(s + "T00:00:00");
      return isNaN(d.getTime()) ? null : d;
    };
    const fromD = parseYMD(from);
    const toD = parseYMD(to);
    const atStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const inRange = (r: Reward) => {
      const rd = atStart(new Date(r.date));
      if (fromD && rd < fromD) return false;
      if (toD && rd > toD) return false;
      return true;
    };

    return siteFiltered.filter(r => matchesQuery(r) && matchesStatus(r) && inRange(r));
  }, [siteFiltered, dq, status, from, to]);

  const clearFilters = () => {
    setQ("");
    setStatus("all");
    setFrom("");
    setTo("");
  };

  const getStatusBadge = (status: RewardStatus) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    const color = {
      [RewardStatus.completed]: "bg-green-100 text-green-800",
      [RewardStatus.inProgress]: "bg-yellow-100 text-yellow-800",
      [RewardStatus.pending]: "bg-red-100 text-red-800",
    }[status];
    return <span className={`${base} ${color}`}>{status}</span>;
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-primary">포상 관리</CardTitle>
        <CardDescription>제보자 포상 시스템을 관리합니다</CardDescription>

        {/* Controls */}
        <div className="flex flex-col gap-3 md:flex-wrap md:flex-row md:items-center">
          {/* Search */}
          <div className="flex items-center gap-2 md:flex-1 min-w-[12rem]">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색: 현장/제보/사용자/금액/상태/날짜…"
              className="w-full"
            />
            <span className="text-xs text-gray-500 whitespace-nowrap">{results.length}건</span>
          </div>

          {/* Status */}
          <div className="w-full md:w-auto">
            <Select value={status} onValueChange={(v: StatusFilter) => setStatus(v)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="상태: 전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value={RewardStatus.completed}>{RewardStatus.completed}</SelectItem>
                <SelectItem value={RewardStatus.inProgress}>{RewardStatus.inProgress}</SelectItem>
                <SelectItem value={RewardStatus.pending}>{RewardStatus.pending}</SelectItem>
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
          <div className="rounded-lg border bg-white p-12 text-center">
            <Coins className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">조건에 맞는 포상 내역이 없습니다.</p>
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
                        {r.reportTitle} · {r.siteName}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{r.userId}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold text-gray-900">{r.amount}</div>
                      <div className="text-xs text-gray-600">{new Date(r.date).toLocaleDateString()}</div>
                      <div >
                        {getStatusBadge(r.status)}
                      </div>
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
                    <TableHead>제보</TableHead>
                    <TableHead>사용자</TableHead>
                    <TableHead>포인트</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>날짜</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {results.map((r) => (
                    <TableRow key={r.id} className="align-top">
                      <TableCell>
                        <div className="font-medium text-gray-900">{r.siteName}</div>
                      </TableCell>

                      <TableCell className="text-sm text-gray-700 break-words whitespace-normal">
                        {r.reportTitle}
                      </TableCell>

                      <TableCell className="text-sm text-gray-700">{r.userId}</TableCell>

                      <TableCell className="text-sm font-semibold">{r.amount}</TableCell>

                      <TableCell>{getStatusBadge(r.status)}</TableCell>

                      <TableCell className="text-sm text-gray-600">
                        {new Date(r.date).toLocaleDateString()}
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
