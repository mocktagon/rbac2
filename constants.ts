
import { Project, Blueprint, CreditRequest, RoleDefinition, PermissionFeature, UserContext, Candidate, ActionItem, Integration, UnitEconomics, FinancialMetric, Invoice, PaymentMethod, UsageRecord, TalentList, TourGuide } from './types';

export const MOCK_USERS: UserContext[] = [
  {
    id: 'u-1',
    name: 'Sarah Jenning',
    role: 'ORG_OWNER',
    avatar: 'SJ'
  },
  {
    id: 'u-2',
    name: 'David Chen',
    role: 'PROJECT_OWNER',
    assignedProjectId: 'p-102', // Project Phoenix
    avatar: 'DC'
  },
  {
    id: 'u-3',
    name: 'Alice Finance',
    role: 'FINANCE_ADMIN',
    avatar: 'AF'
  },
  {
    id: 'u-4',
    name: 'Bob Recruiter',
    role: 'RECRUITER',
    avatar: 'BR'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p-101',
    name: 'Alpha Migration',
    owner: 'Sarah Jenning',
    costCenter: 'CC-NY-001',
    budget: { used: 45, softLimit: 100, hardLimit: 120, currency: 'Credits' },
    status: 'active',
  },
  {
    id: 'p-102',
    name: 'Project Phoenix',
    owner: 'David Chen',
    costCenter: 'CC-SF-402',
    budget: { used: 98, softLimit: 100, hardLimit: 120, currency: 'Credits' },
    status: 'warning',
  },
  {
    id: 'p-103',
    name: 'Cloud Native R&D',
    owner: 'Emily Ross',
    costCenter: 'CC-LDN-889',
    budget: { used: 120, softLimit: 100, hardLimit: 120, currency: 'Credits' },
    status: 'blocked',
  },
  {
    id: 'p-104',
    name: 'Data Lake Expansion',
    owner: 'Michael Scott',
    costCenter: 'CC-PA-202',
    budget: { used: 10, softLimit: 50, hardLimit: 60, currency: 'Credits' },
    status: 'active',
  },
];

export const MOCK_BLUEPRINTS: Blueprint[] = [
  { id: 'bp-1', title: 'Standard Java Round', role: 'Backend Engineer', type: 'Global', lastUpdated: '2023-10-15', usageCount: 450, tags: ['Java', 'Algorithms'] },
  { id: 'bp-2', title: 'Executive Leadership Panel', role: 'Director+', type: 'Global', lastUpdated: '2023-09-01', usageCount: 22, tags: ['Leadership', 'Soft Skills'] },
  { id: 'bp-3', title: 'Phoenix React Specific', role: 'Frontend Engineer', type: 'Private', lastUpdated: '2023-10-20', usageCount: 15, tags: ['React', 'TypeScript'] },
  { id: 'bp-4', title: 'DevOps & SRE Basics', role: 'SRE', type: 'Global', lastUpdated: '2023-11-01', usageCount: 89, tags: ['Kubernetes', 'AWS'] },
  { id: 'bp-5', title: 'Data Science Entry', role: 'Data Scientist', type: 'Private', lastUpdated: '2023-10-05', usageCount: 5, tags: ['Python', 'Statistics'] },
  { id: 'bp-6', title: 'Product Manager Core', role: 'Product Manager', type: 'Global', lastUpdated: '2023-08-20', usageCount: 120, tags: ['Strategy', 'Agile'] },
];

export const MOCK_REQUESTS: CreditRequest[] = [
  {
    id: 'req-001',
    projectId: 'p-103',
    projectName: 'Cloud Native R&D',
    amountRequested: 50,
    reason: "Unexpected surge in candidate pipeline due to Q4 ramp up. We have 3 critical roles to fill by Friday.",
    status: 'pending',
    requestDate: '2023-10-25',
  }
];

export const MOCK_ROLES: RoleDefinition[] = [
  {
    id: 'role-1',
    name: 'Org Super Admin',
    description: 'Complete control over billing, compliance, and global assets.',
    scope: 'Global',
    isSystem: true,
    activeUsers: 3,
    permissions: [] // Implied Full
  },
  {
    id: 'role-2',
    name: 'Vendor Interviewer (Phoenix)',
    description: 'Limited access for agency partners on Project Phoenix.',
    scope: 'Project',
    ownerId: 'p-102',
    isSystem: false,
    activeUsers: 12,
    permissions: [
      { featureId: 'pii', accessLevel: 'PARTIAL', constraint: 'Mask Phone/Email' },
      { featureId: 'interviews', accessLevel: 'PARTIAL', constraint: 'Only Assigned Sessions' },
      { featureId: 'billing', accessLevel: 'NONE' },
    ]
  },
  {
    id: 'role-3',
    name: 'Hiring Manager (Standard)',
    description: 'Standard access for internal managers hiring for their team.',
    scope: 'Global',
    isSystem: false,
    activeUsers: 310,
    permissions: [
      { featureId: 'pii', accessLevel: 'FULL' },
      { featureId: 'interviews', accessLevel: 'FULL' },
      { featureId: 'billing', accessLevel: 'VIEW' },
    ]
  }
];

export const FEATURES_LIST: PermissionFeature[] = [
  { id: 'billing', name: 'Billing & Credits', description: 'Manage invoices, buy credits, and set caps.', category: 'Governance' },
  { id: 'security', name: 'Security & Compliance', description: 'Data retention policies and GDPR settings.', category: 'Governance' },
  { id: 'global_talent', name: 'Global Talent Pool', description: 'View candidates across ALL projects.', category: 'Governance' },
  { id: 'pii', name: 'Candidate PII', description: 'Access to name, email, phone, and resume details.', category: 'Project Execution' },
  { id: 'interviews', name: 'Interview Mgmt', description: 'Ability to schedule, cancel, and manage sessions.', category: 'Project Execution' },
  { id: 'blueprints', name: 'Blueprints', description: 'Create and modify interview templates.', category: 'Project Execution' },
];

// --- CANDIDATE GENERATOR ---
const generateCandidates = (count: number): Candidate[] => {
  const roles = ['Frontend Developer', 'Backend Engineer', 'Product Manager', 'Data Scientist', 'UX Designer'];
  const locations = ['New York, USA', 'London, UK', 'San Francisco, USA', 'Bangalore, IN', 'Berlin, DE'];
  const statuses = ['New', 'Interviewing', 'Offer', 'Rejected', 'Pooled'];
  
  return Array.from({ length: count }).map((_, i) => {
    const role = roles[i % roles.length];
    return {
      id: `c-${i}`,
      name: `Candidate ${i + 100}`,
      role: role,
      email: `candidate${i}@example.com`,
      location: locations[i % locations.length],
      status: statuses[i % statuses.length] as any,
      matchScore: Math.floor(Math.random() * 60) + 40, // 40-100
      projectAffiliation: Math.random() > 0.7 ? 'p-102' : undefined, // 30% local, 70% global
      avatar: `https://i.pravatar.cc/150?u=${i}`,
      appliedDate: '2023-11-15',
      experienceYears: Math.floor(Math.random() * 15) + 2,
      skills: [
        { name: 'Technical', score: Math.floor(Math.random() * 100), fullMark: 100 },
        { name: 'Communication', score: Math.floor(Math.random() * 100), fullMark: 100 },
        { name: 'Problem Solving', score: Math.floor(Math.random() * 100), fullMark: 100 },
        { name: 'Culture Fit', score: Math.floor(Math.random() * 100), fullMark: 100 },
        { name: 'Experience', score: Math.floor(Math.random() * 100), fullMark: 100 },
      ]
    };
  });
};

export const MOCK_CANDIDATES: Candidate[] = generateCandidates(30);
// specific candidates for demo
MOCK_CANDIDATES[0] = {
    ...MOCK_CANDIDATES[0],
    name: "Harris",
    role: "Accounting Expert",
    location: "New York Mills, USA",
    matchScore: 16,
    status: "New",
    experienceYears: 6,
    skills: [
        { name: 'GAAP Compliance', score: 20, fullMark: 100 },
        { name: 'Financial Reporting', score: 30, fullMark: 100 },
        { name: 'Reconciliation', score: 80, fullMark: 100 },
        { name: 'Quickbooks', score: 40, fullMark: 100 },
        { name: 'Excel Advanced', score: 10, fullMark: 100 },
    ]
};

MOCK_CANDIDATES[1] = {
    ...MOCK_CANDIDATES[1],
    name: "Krishna",
    role: "Accountant",
    location: "Los Angeles, USA",
    matchScore: 44,
    status: "Interviewing",
    experienceYears: 7,
    skills: [
        { name: 'GAAP Compliance', score: 55, fullMark: 100 },
        { name: 'Financial Reporting', score: 13, fullMark: 100 },
        { name: 'Reconciliation', score: 88, fullMark: 100 },
        { name: 'Quickbooks', score: 40, fullMark: 100 },
        { name: 'Excel Advanced', score: 60, fullMark: 100 },
    ]
};

// --- TALENT LISTS ---
export const MOCK_TALENT_LISTS: TalentList[] = [
    {
        id: 'list-1',
        name: 'Global Reservoir',
        description: 'The complete database of all candidates across the organization.',
        candidateCount: 14520,
        updatedAt: 'Live',
        collaborators: [
            { userId: 'u-1', name: 'Sarah Jenning', avatar: 'SJ', role: 'Owner' }
        ],
        tags: ['All Access', 'System']
    },
    {
        id: 'list-2',
        name: 'Q4 Phoenix Hiring',
        description: 'Frontend and Backend developers for the new Phoenix rollout.',
        projectId: 'p-102',
        candidateCount: 42,
        updatedAt: '2 hrs ago',
        collaborators: [
            { userId: 'u-2', name: 'David Chen', avatar: 'DC', role: 'Owner' },
            { userId: 'u-3', name: 'Alex M', avatar: 'AM', role: 'Viewer' }
        ],
        tags: ['Priority', 'Engineering']
    },
    {
        id: 'list-3',
        name: 'Data Science - London',
        description: 'Sourcing pool for the new AI R&D center in London.',
        projectId: 'p-103',
        candidateCount: 18,
        updatedAt: '1 day ago',
        collaborators: [
            { userId: 'u-1', name: 'Sarah Jenning', avatar: 'SJ', role: 'Editor' },
            { userId: 'u-4', name: 'Emily Ross', avatar: 'ER', role: 'Owner' }
        ],
        tags: ['R&D', 'Onsite']
    }
];

// --- CHART DATA ---

export const MOCK_BUDGET_TREND = [
    { month: 'Jun', used: 4000, limit: 10000 },
    { month: 'Jul', used: 6500, limit: 12000 },
    { month: 'Aug', used: 9000, limit: 12000 },
    { month: 'Sep', used: 11000, limit: 15000 },
    { month: 'Oct', used: 14500, limit: 15000 },
    { month: 'Nov', used: 18000, limit: 20000 },
];

export const MOCK_FUNNEL_DATA = [
    { value: 1200, name: 'Sourced', fill: '#6366f1' },
    { value: 450, name: 'Screened', fill: '#8b5cf6' },
    { value: 120, name: 'Interviewed', fill: '#ec4899' },
    { value: 45, name: 'Offer Sent', fill: '#10b981' },
    { value: 38, name: 'Hired', fill: '#059669' },
];

// --- ACTION CENTER DATA ---
export const MOCK_ACTIONS: ActionItem[] = [
    {
        id: 'act-1',
        type: 'Approval',
        title: 'Project Phoenix Budget Overflow',
        description: 'Budget utilization reached 98% (Hard Cap). 50 Credits requested.',
        priority: 'High',
        timestamp: '10 mins ago',
        actionLabel: 'Review Request',
    },
    {
        id: 'act-2',
        type: 'Insight',
        title: 'Hidden Talent Detected',
        description: '3 Candidates in "Project A" rejected pile match "Project B" open roles with >85% score.',
        priority: 'Medium',
        timestamp: '2 hrs ago',
        actionLabel: 'View Candidates',
        aiConfidence: 94
    },
    {
        id: 'act-3',
        type: 'Alert',
        title: 'Role Misconfiguration',
        description: 'Role "Vendor Interviewer" has access to PII but is tagged as External.',
        priority: 'High',
        timestamp: '4 hrs ago',
        actionLabel: 'Fix Permissions',
        aiConfidence: 99
    },
    {
        id: 'act-4',
        type: 'Suggestion',
        title: 'Blueprint Optimization',
        description: '"Standard Java Round" has a 40% drop-off rate. Consider shortening Section 2.',
        priority: 'Low',
        timestamp: '1 day ago',
        actionLabel: 'Edit Blueprint',
        aiConfidence: 78
    }
];

// --- INTEGRATIONS DATA ---
export const MOCK_INTEGRATIONS: Integration[] = [
    { id: 'int-1', name: 'Greenhouse', category: 'ATS', status: 'Connected', icon: 'https://cdn.worldvectorlogo.com/logos/greenhouse-software.svg', description: 'Sync candidates and interview status.' },
    { id: 'int-2', name: 'Slack', category: 'Communication', status: 'Connected', icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg', description: 'Real-time notifications for approvals.' },
    { id: 'int-3', name: 'Workday', category: 'HRIS', status: 'Available', icon: 'https://cdn.worldvectorlogo.com/logos/workday-2.svg', description: 'Employee data synchronization.' },
    { id: 'int-4', name: 'Microsoft Teams', category: 'Communication', status: 'Available', icon: 'https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg', description: 'Interview scheduling and video links.' },
    { id: 'int-5', name: 'Google Calendar', category: 'Calendar', status: 'Connected', icon: 'https://cdn.worldvectorlogo.com/logos/google-calendar.svg', description: 'Auto-schedule interview slots.' },
];

// --- FINOPS DATA ---
export const UNIT_ECONOMICS: UnitEconomics[] = [
    { tierName: 'Standard Async', baseCost: 15, durationMultiplier: 0.5, modelComplexityFactor: 1.0, description: 'Basic screening with standard text models.' },
    { tierName: 'Live Voice AI', baseCost: 45, durationMultiplier: 1.2, modelComplexityFactor: 1.5, description: 'Real-time voice conversation with low latency.' },
    { tierName: 'Expert Coding', baseCost: 60, durationMultiplier: 1.5, modelComplexityFactor: 2.0, description: 'Code execution sandbox + complex reasoning models.' },
];

export const FINOPS_DATA: FinancialMetric[] = [
    { month: 'Jun', tier1Spend: 2000, tier2Spend: 1500, tier3Spend: 500, forecast: 4200 },
    { month: 'Jul', tier1Spend: 2200, tier2Spend: 1800, tier3Spend: 2500, forecast: 6000 },
    { month: 'Aug', tier1Spend: 2500, tier2Spend: 2000, tier3Spend: 4500, forecast: 8500 },
    { month: 'Sep', tier1Spend: 2800, tier2Spend: 2200, tier3Spend: 6000, forecast: 10500 },
    { month: 'Oct', tier1Spend: 3500, tier2Spend: 3000, tier3Spend: 8000, forecast: 14000 },
    { month: 'Nov', tier1Spend: 4200, tier2Spend: 3500, tier3Spend: 10300, forecast: 17500 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv-101', invoiceNumber: 'INV-2023-10-001', date: 'Oct 31, 2023', amount: 14500, status: 'Paid', items: 1250 },
  { id: 'inv-102', invoiceNumber: 'INV-2023-09-001', date: 'Sep 30, 2023', amount: 11000, status: 'Paid', items: 980 },
  { id: 'inv-103', invoiceNumber: 'INV-2023-11-001', date: 'Nov 30, 2023', amount: 18000, status: 'Pending', items: 1540 },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm-1', type: 'Credit Card', last4: '4242', expiry: '12/25', isDefault: true },
  { id: 'pm-2', type: 'Bank Transfer', last4: '9988', isDefault: false },
];

export const MOCK_USAGE_LOGS: UsageRecord[] = [
  { id: 'ul-1', project: 'Project Phoenix', costCenter: 'CC-SF-402', tier: 'Live Voice AI', sessions: 150, cost: 6750, trend: 12 },
  { id: 'ul-2', project: 'Alpha Migration', costCenter: 'CC-NY-001', tier: 'Standard Async', sessions: 450, cost: 6750, trend: -5 },
  { id: 'ul-3', project: 'Cloud Native R&D', costCenter: 'CC-LDN-889', tier: 'Expert Coding', sessions: 80, cost: 4800, trend: 25 },
];

// --- TOUR & SUPPORT DATA ---
export const MOCK_GUIDES: TourGuide[] = [
    {
        id: 'guide-1',
        title: 'Approve Budget Expansion',
        category: 'Governance',
        duration: '2 min',
        targetView: 'projects',
        steps: [
            { title: 'Navigate to Projects', description: 'Go to the "Requisition Authority" page.' },
            { title: 'Identify Blocked Projects', description: 'Look for projects with a red "BLOCKED" status.' },
            { title: 'Expand Budget', description: 'Click the 3-dots menu on the project card and select "Edit Budget Caps".' }
        ]
    },
    {
        id: 'guide-2',
        title: 'Create Global Talent Pool',
        category: 'Hiring',
        duration: '3 min',
        targetView: 'talent',
        steps: [
            { title: 'Go to Talent Assets', description: 'Navigate to the "Talent Pool" section.' },
            { title: 'Select Global View', description: 'Ensure you are viewing the Global Reservoir section.' },
            { title: 'Create List', description: 'Click "New List" and select "Global Pool" as the type.' }
        ]
    },
    {
        id: 'guide-3',
        title: 'Review Financial Spend',
        category: 'Finance',
        duration: '5 min',
        targetView: 'finops',
        steps: [
            { title: 'Open FinOps Dashboard', description: 'Click "FinOps & Usage" in the sidebar.' },
            { title: 'Analyze Trends', description: 'Check the "Spend Forecast" chart in the Overview tab.' },
            { title: 'Download Invoices', description: 'Switch to the "Billing" tab to view and download past invoices.' }
        ]
    }
];