
export enum AppView {
  LANDING = 'LANDING',
  SIGNUP = 'SIGNUP',
  QUIZ = 'QUIZ',
  DASHBOARD = 'DASHBOARD'
}

export enum DashboardSection {
  OVERVIEW = 'OVERVIEW',
  DIAGNOSIS = 'DIAGNOSIS',
  PREDICTION = 'PREDICTION',
  REPORT_EXPLAINER = 'REPORT_EXPLAINER',
  CHATBOT = 'CHATBOT'
}

export interface UserProfile {
  name: string;
  email: string;
  age?: string;
  gender?: string;
  conditions?: string;
  goal?: string;
}

export interface DiagnosisResult {
  disease: string;
  probability: number;
  severity: 'Low' | 'Medium' | 'High';
  explanation: string;
  recommendations: string[];
}

export interface BloodMarker {
  name: string;
  value: string;
  status: 'Normal' | 'Borderline' | 'Abnormal';
  meaning: string;
}

export interface BloodReportAnalysis {
  summary: string;
  markers: BloodMarker[];
  advice: string;
}

export interface HealthPredictionItem {
  heading: string;
  description: string;
  isHighPriority: boolean;
}

export interface HealthPrediction {
  summary: string;
  riskCategories: {
    category: string;
    items: HealthPredictionItem[];
  }[];
  monitoringSigns: {
    sign: string;
    description: string;
    urgency: 'Low' | 'Medium' | 'High';
  }[];
}
