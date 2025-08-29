import { AlertTriangle, ArrowLeft, CheckCircle, Clock, Image as ImageIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { LayoutContext } from "~/layouts/company/appbar-sidebar-layout";
import { mockReports } from "~/lib/mock";
import { ReportStatus } from "~/types";

type Message = {
  id: string;
  author: "reporter" | "manager" | "system";
  name?: string;
  text?: string;
  createdAt: Date;
  mediaUrl?: string;
  mediaType?: "image" | "video";
};

export default function ReportDetailPageRoute() {
  const { id } = useParams();
  const nav = useNavigate();

  const { selectedSite } = useOutletContext<LayoutContext>();

  const filteredReports = useMemo(
    () =>
      selectedSite === "all"
        ? mockReports
        : mockReports.filter((r) => r.siteId === selectedSite),
    [selectedSite]
  );

  const report = useMemo(
    () => filteredReports.find((r) => String(r.id) === String(id)),
    [filteredReports, id]
  );

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

  const [authorName] = useState("담당자");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<ReportStatus | undefined>(undefined);

  // 포상 상태
  const [rewardAmount, setRewardAmount] = useState<number | "">("");
  const [decidedAmount, setDecidedAmount] = useState<number | null>(null);

  // 미디어 업로드
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 미리보기 상태
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(
    null
  );

  useEffect(() => {
    if (!report) return;
    setStatus(report.status as ReportStatus);
    setMessages([
      {
        id: "sys-0",
        author: "system",
        text: `제보 #${report.id} 채팅이 시작되었습니다.`,
        createdAt: new Date(),
      },
      {
        id: "rep-0",
        author: "reporter",
        name: "제보자",
        text: report.description || "설명이 없습니다.",
        createdAt: new Date(report.date),
      },
      {
        id: "rep-1",
        author: "reporter",
        name: "제보자",
        mediaType: "video",
        mediaUrl: "https://www.pexels.com/download/video/7565884/",
        createdAt: new Date(report.date),
      },
      {
        id: "rep-2",
        author: "reporter",
        name: "제보자",
        mediaType: "image",
        mediaUrl:
          "https://images.pexels.com/photos/32743482/pexels-photo-32743482.jpeg",
        createdAt: new Date(report.date),
      },
    ]);
  }, [report]);

  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = () => {
    const text = draft.trim();
    if (!text || !report) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `mgr-${prev.length + 1}`,
        author: "manager",
        name: authorName,
        text,
        createdAt: new Date(),
      },
    ]);
    setDraft("");
  };

  const sendMedia = (file: File) => {
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video") ? "video" : "image";
    setMessages((prev) => [
      ...prev,
      {
        id: `mgr-media-${prev.length + 1}`,
        author: "manager",
        name: authorName,
        mediaUrl: url,
        mediaType: type,
        createdAt: new Date(),
      },
    ]);
  };

  const changeStatus = (newStatus: ReportStatus) => {
    setStatus(newStatus);
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-status-${prev.length + 1}`,
        author: "system",
        text: `상태가 ${newStatus}로 변경되었습니다.`,
        createdAt: new Date(),
      },
    ]);
  };

  const decideReward = () => {
    const amt =
      typeof rewardAmount === "number"
        ? rewardAmount
        : parseInt(String(rewardAmount || 0), 10);
    if (!amt || amt <= 0 || Number.isNaN(amt)) return;
    const firstTime = decidedAmount === null;
    const prevAmt = decidedAmount;
    setDecidedAmount(amt);
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-reward-${prev.length + 1}`,
        author: "system",
        text: firstTime
          ? `포상금 ${amt} 포인트 지급이 결정되었습니다.`
          : `포상금이 ${prevAmt} → ${amt} 포인트로 변경되었습니다.`,
        createdAt: new Date(),
      },
    ]);
  };

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">제보 상세</CardTitle>
          <CardDescription>제보를 찾을 수 없습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" onClick={() => nav(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> 돌아가기
          </Button>
        </CardContent>
      </Card>
    );
  }

  const bubbleBase = "max-w-[80%] rounded-2xl px-3 py-2 shadow-sm";
  const meBubble = `${bubbleBase} bg-primary text-white ml-auto`;
  const otherBubble = `${bubbleBase} bg-gray-100 text-gray-900`;
  const sysBubble = "text-xs text-gray-500 text-center my-2";

  const rewardActive = decidedAmount !== null;

  return (
    <>
      <Card className="mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => nav(-1)} aria-label="뒤로가기">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-primary">제보 상세</CardTitle>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer select-none">
                    {status && getStatusBadge(status)}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onSelect={() => changeStatus(ReportStatus.pending)}
                  >
                    대기
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => changeStatus(ReportStatus.inProgress)}
                  >
                    진행중
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => changeStatus(ReportStatus.completed)}
                  >
                    완료
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  value={rewardAmount}
                  onChange={(e) => {
                    const v = e.target.value;
                    setRewardAmount(v === "" ? "" : Number(v));
                  }}
                  placeholder="포상금"
                  className="w-25"
                />
                <Button
                  variant={rewardActive ? "secondary" : "default"}
                  onClick={decideReward}
                  disabled={rewardAmount === "" || Number(rewardAmount) <= 0}
                >
                  {rewardActive ? "변경" : "지급"}
                </Button>
              </div>
            </div>
          </div>
          <CardDescription>
            {report.siteName} · {new Date(report.date).toLocaleDateString()}
            {rewardActive && (
              <span className="ml-2 text-amber-700">
                (포상금 {decidedAmount!} 포인트)
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border bg-white overflow-hidden">
            <div
              ref={listRef}
              className="h-[50vh] overflow-auto px-4 py-3 space-y-3"
            >
              {messages.map((m) => {
                if (m.author === "system") {
                  return (
                    <div key={m.id} className={sysBubble}>
                      {m.text} · {m.createdAt.toLocaleString()}
                    </div>
                  );
                }
                const mine = m.author === "manager";
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}
                  >
                    {!mine && (
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        {(m.name || "유저").slice(0, 2)}
                      </div>
                    )}
                    <div className={`min-w-0 ${mine ? "ml-auto" : ""}`}>
                      <div
                        className={`flex ${mine ? "justify-end" : "justify-start"} mb-1`}
                      >
                        <span className="text-[10px] text-gray-500">
                          {m.name || (mine ? authorName : "제보자")} ·{" "}
                          {m.createdAt.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={mine ? meBubble : otherBubble}>
                        {m.text && (
                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {m.text}
                          </p>
                        )}
                        {m.mediaUrl && m.mediaType === "image" && (
                          <img
                            src={m.mediaUrl}
                            alt="첨부 이미지"
                            className="mt-2 max-h-60 rounded-lg cursor-pointer"
                            onClick={() => {
                              setPreviewUrl(m.mediaUrl!);
                              setPreviewType("image");
                            }}
                          />
                        )}
                        {m.mediaUrl && m.mediaType === "video" && (
                          <video
                            src={m.mediaUrl}
                            controls
                            className="mt-2 max-h-60 rounded-lg cursor-pointer"
                            onClick={() => {
                              setPreviewUrl(m.mediaUrl!);
                              setPreviewType("video");
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t p-3 space-y-2">
              <div className="flex items-end gap-2">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="메시지를 입력하세요…"
                  className="min-h-[72px] flex-1"
                />
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      sendMedia(e.target.files[0]);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button onClick={send} disabled={!draft.trim()}>
                  보내기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 미리보기 다이얼로그 */}
      <Dialog
        open={!!previewUrl}
        onOpenChange={(o) => !o && setPreviewUrl(null)}
      >
        {/* Width capped to viewport (95vw) and 64rem, no padding */}
        <DialogContent className="p-0 max-w-[min(95vw,64rem)]">
          {/* Cap height to viewport and let media scale within */}
          <div className="w-full max-h-[85vh]">
            {previewUrl && previewType === "image" && (
              <img
                src={previewUrl}
                alt="미리보기"
                className="block w-full h-full object-contain rounded-lg"
              />
            )}

            {previewUrl && previewType === "video" && (
              <video
                src={previewUrl}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="block w-full h-full object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
