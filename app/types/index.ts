export enum ReportStatus {
  completed = "완료",
  inProgress = "진행중",
  pending = "대기중",
}

export interface Report {
  id: string;
  siteName: string;
  siteId: string;
  location: string;
  date: Date;
  status: ReportStatus;
  type: string;
  description: string;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  totalReports: number;
}
