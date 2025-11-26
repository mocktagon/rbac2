
export interface Workspace {
  id: string;
  name: string;
  logo: string;
  plan: 'Enterprise' | 'Growth';
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  owner: string;
  costCenter: string;
  budget: {
    used: number;
    softLimit: number;
    hardLimit: number;
    currency: string; // e.g., 'Credits'
  };
  status: 'active' | 'blocked' | 'warning';
}

export interface Blueprint {
  id: string;
  workspaceId: string;
  title: string;
  role: string;
  type: 'Global' | 'Private';
  lastUpdated: string;
  usageCount: number;
  tags: string[];
}

export interface Skill {
  name: string;
  score: number; // 0-100
  fullMark: number;
}

export interface Candidate {
  id: string;
  workspaceId: string;
  name: string;
  role: string;
  email: string;
  location: string;
  status: 'New' | 'Interviewing' | 'Offer' | 'Rejected' | 'Pooled';
  matchScore: number;
  skills: Skill[];
  projectAffiliation?: string; // If null, they are in Global Reservoir
  avatar: string;
  appliedDate: string;
  experienceYears: number; // New field for scatter plot
}

export interface ListCollaborator {
  userId: string;
  name: string;
  avatar: string;
  role: 'Owner' | 'Editor' | 'Viewer';
}

export interface TalentList {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  projectId?: string; // If undefined, it is a Global List
  candidateCount: number;
  updatedAt: string;
  collaborators: ListCollaborator[];
  tags: string[];
}

export interface CreditRequest {
  id: string;
  workspaceId: string;
  projectId: string;
  projectName: string;
  amountRequested: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  riskAnalysis?: string; // AI generated
}

export type ViewState = 'dashboard' | 'projects' | 'blueprints' | 'talent' | 'roles' | 'settings' | 'finops' | 'integrations';

export interface AIAnalysisResponse {
  riskScore: number; // 0-100
  recommendation: 'APPROVE' | 'REJECT' | 'REVIEW';
  summary: string;
}

// RBAC Types
export type AccessLevel = 'FULL' | 'VIEW' | 'PARTIAL' | 'NONE';

export interface PermissionFeature {
  id: string;
  name: string;
  description: string;
  category: 'Governance' | 'Project Execution';
}

export interface PermissionSetting {
  featureId: string;
  accessLevel: AccessLevel;
  constraint?: string; // e.g., "Mask Phone/Email", "Only Assigned Sessions"
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  scope: 'Global' | 'Project'; // Global templates vs Project specific
  ownerId?: string; // If project scope, which project owns it
  isSystem?: boolean; // Cannot be deleted if true
  permissions: PermissionSetting[];
  activeUsers: number;
}

export interface UserContext {
  id: string;
  name: string;
  role: 'ORG_OWNER' | 'PROJECT_OWNER' | 'FINANCE_ADMIN' | 'RECRUITER';
  assignedProjectId?: string; // If project owner
  workspaceIds: string[];
  avatar: string;
}

// New Action Center Types
export interface ActionItem {
  id: string;
  workspaceId: string;
  type: 'Approval' | 'Suggestion' | 'Alert' | 'Insight';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  timestamp: string;
  actionLabel?: string;
  aiConfidence?: number; // 0-100
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  category: 'ATS' | 'Communication' | 'HRIS' | 'Calendar';
  status: 'Connected' | 'Available' | 'Coming Soon';
  icon: string; 
  description: string;
}

// FinOps Types
export interface UnitEconomics {
  tierName: string;
  baseCost: number; // per interview
  durationMultiplier: number; // cost per minute
  modelComplexityFactor: number; // 1.0, 1.5, etc.
  description: string;
}

export interface FinancialMetric {
  month: string;
  tier1Spend: number;
  tier2Spend: number;
  tier3Spend: number;
  forecast: number;
}

export interface Invoice {
  id: string;
  workspaceId: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: number;
  pdfUrl?: string;
}

export interface PaymentMethod {
  id: string;
  workspaceId: string;
  type: 'Credit Card' | 'Bank Transfer';
  last4: string;
  expiry?: string;
  isDefault: boolean;
}

export interface UsageRecord {
  id: string;
  workspaceId: string;
  project: string;
  costCenter: string;
  tier: string;
  sessions: number;
  cost: number;
  trend: number; // percentage change vs last month
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Support & Tour Types
export interface TourStep {
  title: string;
  description: string;
}

export interface TourGuide {
  id: string;
  title: string;
  category: 'Governance' | 'Finance' | 'Hiring';
  duration: string;
  steps: TourStep[];
  targetView: ViewState;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  suggestedAction?: {
    label: string;
    view: ViewState;
  };
}
