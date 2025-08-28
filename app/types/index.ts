export enum ReportStatus {
  completed = "완료",
  inProgress = "진행중",
  pending = "대기중",
}

export enum RewardStatus {
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

export interface Reward {
  id: string;
  reportId: string;
  reportTitle: string;
  siteId: string;
  siteName: string;
  userId: string;
  amount: number;
  status: RewardStatus;
  date: Date;
};

export interface Site {
  id: string;
  name: string;
  location: string;
  totalReports: number;
}
