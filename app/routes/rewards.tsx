import { useOutletContext } from "react-router";

import { Coins } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { LayoutContext } from "../layouts/app-layout";

export default function RewardsPageRoute() {
  const { selectedSite } = useOutletContext<LayoutContext>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">포상 관리</CardTitle>
        <CardDescription>제보자 포상 시스템을 관리합니다</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Coins className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            포상 시스템
          </h3>
          <p className="text-gray-600">
            포상 관리 기능이 곧 추가될 예정입니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
