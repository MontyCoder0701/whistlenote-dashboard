import { ArrowLeft, CalendarDays, Coins } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { RewardStatus, type Reward } from "~/types";

const MOCK_REWARDS: Reward[] = [
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

const nf = new Intl.NumberFormat("ko-KR");
const df = new Intl.DateTimeFormat("ko-KR");

function StatusBadge({ status }: { status: RewardStatus }) {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const color =
    status === RewardStatus.completed
      ? "bg-green-100 text-green-800"
      : status === RewardStatus.inProgress
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";
  return <span className={`${base} ${color}`}>{status}</span>;
}

export default function RewardDetailPageRoute() {
  const { id } = useParams();
  const nav = useNavigate();

  const reward = useMemo(
    () => MOCK_REWARDS.find((r) => r.id === id),
    [id]
  );

  if (!reward) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => nav(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-primary">포상 상세</CardTitle>
          <CardDescription>해당 포상을 찾을 수 없습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-white p-12 text-center">
            <Coins className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">유효하지 않은 포상 ID입니다.</p>
            <div className="mt-4">
              <Link to="/rewards">
                <Button variant="secondary">목록으로</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => nav(-1)} aria-label="뒤로가기">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-primary">포상 상세</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border bg-white p-5 space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="mt-2">
                <div className="text-lg font-semibold text-gray-900">{reward.reportTitle}</div>
                <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <StatusBadge status={reward.status} />
                  <span>{df.format(new Date(reward.date))}</span>
                </div>
              </div>

              <Link to={`/reports/${reward.reportId}`}>
                <Button size="sm">제보 상세 확인하기</Button>
              </Link>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-sm">
                <div className="text-gray-500">사용자 ID</div>
                <div className="font-mono text-gray-900 break-all">{reward.userId}</div>
              </div>

              <div className="text-sm">
                <div className="text-gray-500">금액</div>
                <div className="text-xl font-bold text-gray-900">
                  ₩{nf.format(reward.amount)}
                </div>
              </div>

              <div className="text-sm">
                <div className="text-gray-500">상태</div>
                <StatusBadge status={reward.status} />
              </div>

              <div className="text-sm">
                <div className="text-gray-500">날짜</div>
                <div className="flex items-center gap-2 text-gray-900">
                  <CalendarDays className="h-4 w-4" />
                  {df.format(new Date(reward.date))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
