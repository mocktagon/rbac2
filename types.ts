
export interface Project {
  id: string;
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

export interface CreditRequest {
  id: string;
  projectId: string;
  projectName: string;
  amountRequested: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  riskAnalysis?: string; // AI generated
}

export type ViewState = 'dashboard' | 'projects' | 'blueprints' | 'talent' | 'roles' | 'settings';

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
  role: 'ORG_OWNER' | 'PROJECT_OWNER';
  assignedProjectId?: string; // If project owner
  avatar: string;
}

// New Action Center Types
export interface ActionItem {
  id: string;
  type: 'Approval' | 'Suggestion' | 'Alert' | 'Insight';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  timestamp: string;
  actionLabel?: string;
  aiConfidence?: number; // 0-100
}
