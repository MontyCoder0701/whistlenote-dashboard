import { Building2, Coins, MapPin } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "~/components/ui/table";
import { mockRewards, mockSites } from "~/lib/mock";
import { RewardStatus } from "~/types";

const COMPANY_NAME = "민이앤아이";

const CURRENT_USER_ID = "u12900iadr";
const nf = new Intl.NumberFormat("ko-KR");

export default function AccountPageRoute() {
  const myCompletedPoints = useMemo(() => {
    return mockRewards
      .filter(r => r.userId === CURRENT_USER_ID && r.status === RewardStatus.completed)
      .reduce((sum, r) => sum + r.amount, 0);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-primary">내 계정</CardTitle>
          <CardDescription>회사 정보와 보상 포인트, 현장 목록을 확인합니다</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Building2 className="h-4 w-4" />
                내 회사 이름
              </div>
              <div className="mt-2 text-lg font-semibold text-gray-900">
                {COMPANY_NAME}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Coins className="h-4 w-4" />
                내 총 포인트
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-900">
                {nf.format(myCompletedPoints)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 내 현장 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>내 현장 목록</CardTitle>
          <CardDescription>회사에 소속된 현장 리스트</CardDescription>
        </CardHeader>

        <CardContent>
          {/* 모바일 카드 */}
          <div className="md:hidden space-y-3">
            {mockSites.map((s) => (
              <div key={s.id} className="rounded-xl border bg-white p-4">
                <div className="font-medium text-gray-900">{s.name}</div>
                <div className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {s.location ?? "-"}
                </div>
                <div className="mt-3">
                  <Link to={`/reports?site=${s.id}`}>
                    <Button size="sm" variant="secondary" className="w-full">해당 현장 제보 보기</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 데스크톱 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>현장명</TableHead>
                  <TableHead>지역</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSites.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-sm text-gray-700">{s.location ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
