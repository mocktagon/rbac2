
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ProjectsView } from './components/views/ProjectsView';
import { BlueprintLibrary } from './components/views/BlueprintLibrary';
import { RoleManager } from './components/views/RoleManager';
import { OrgSettings } from './components/views/OrgSettings';
import { TalentPool } from './components/views/TalentPool';
import { RequestModal } from './components/RequestModal';
import { ActionCentre } from './components/ActionCentre';
import { FinOpsView } from './components/views/FinOpsView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { CollaboratorModal } from './components/CollaboratorModal';
import { SupportAssistant } from './components/SupportAssistant';
import { DashboardView } from './components/views/DashboardView';
import { MOCK_PROJECTS, MOCK_BLUEPRINTS, MOCK_REQUESTS, MOCK_ROLES, MOCK_USERS, MOCK_CANDIDATES } from './constants';
import { CreditRequest, ViewState, RoleDefinition, UserContext, Project } from './types';
import { ToastProvider, useToast } from './components/ui/Toast';

const AppContent = () => {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserContext>(MOCK_USERS[0]); 
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [roles, setRoles] = useState<RoleDefinition[]>(MOCK_ROLES);
  const [selectedRequest, setSelectedRequest] = useState<CreditRequest | null>(null);

  const { addToast } = useToast();

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;

  const visibleProjects = currentUser.role === 'ORG_OWNER' 
    ? projects 
    : projects.filter(p => p.id === currentUser.assignedProjectId);

  const visibleCandidates = currentUser.role === 'ORG_OWNER'
    ? MOCK_CANDIDATES
    : MOCK_CANDIDATES.filter(c => c.projectAffiliation === currentUser.assignedProjectId);

  const handleOpenRequest = (request: CreditRequest) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    const req = requests.find(r => r.id === id);
    if (req) {
      setProjects(prev => prev.map(p => {
        if (p.id === req.projectId) {
          return {
            ...p,
            status: 'active',
            budget: {
              ...p.budget,
              hardLimit: p.budget.hardLimit + req.amountRequested
            }
          };
        }
        return p;
      }));
      addToast('Budget Approved', `Budget capacity expanded for ${req.projectName}.`, 'success');
    }
    handleCloseModal();
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    addToast('Request Rejected', 'The budget request has been declined.', 'info');
    handleCloseModal();
  };

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
    addToast('Project Updated', 'Changes have been saved successfully.', 'success');
  };

  const handleSaveRole = (updatedRole: RoleDefinition) => {
    const exists = roles.find(r => r.id === updatedRole.id);
    if (exists) {
        setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    } else {
        setRoles(prev => [...prev, updatedRole]);
    }
    setActiveView('roles');
    addToast('Role Saved', `${updatedRole.name} definition has been updated.`, 'success');
  };

  return (
    <Layout 
        activeView={activeView} 
        onNavigate={setActiveView} 
        pendingRequestsCount={pendingRequestsCount}
        currentUser={currentUser}
        onSwitchUser={setCurrentUser}
        onToggleSupport={() => setIsSupportOpen(!isSupportOpen)}
    >
      {activeView === 'dashboard' && (
        <DashboardView 
            currentUser={currentUser}
            projects={visibleProjects}
            candidates={visibleCandidates}
            onActionClick={id => {
               const req = requests.find(r => r.id === 'req-001'); // Mock linking action to req
               if(req) setSelectedRequest(req);
            }}
        />
      )}
      {activeView === 'projects' && (
        <ProjectsView 
            projects={visibleProjects} 
            onManageAccess={() => setIsCollabModalOpen(true)} 
            onUpdateProject={handleUpdateProject}
        />
      )}
      {activeView === 'blueprints' && <BlueprintLibrary blueprints={MOCK_BLUEPRINTS} currentUser={currentUser} />}
      {activeView === 'roles' && <RoleManager roles={roles} currentUser={currentUser} onSaveRole={handleSaveRole} />}
      
      {activeView === 'settings' && currentUser.role === 'ORG_OWNER' && <OrgSettings />}
      {activeView === 'finops' && currentUser.role === 'ORG_OWNER' && <FinOpsView onManageAccess={() => setIsCollabModalOpen(true)} />}
      {activeView === 'integrations' && <IntegrationsView onManageAccess={() => setIsCollabModalOpen(true)} />}
      
      {activeView === 'talent' && (
        <TalentPool 
            candidates={visibleCandidates} 
            isGlobalView={currentUser.role === 'ORG_OWNER'} 
            onManageAccess={() => setIsCollabModalOpen(true)}
        />
      )}

      <RequestModal 
        isOpen={!!selectedRequest}
        request={selectedRequest}
        project={selectedRequest ? projects.find(p => p.id === selectedRequest.projectId) : undefined}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      
      <CollaboratorModal 
            isOpen={isCollabModalOpen} 
            onClose={() => setIsCollabModalOpen(false)} 
            activeView={activeView}
      />

      <SupportAssistant 
            isOpen={isSupportOpen}
            onClose={() => setIsSupportOpen(false)}
            activeView={activeView}
            onNavigate={setActiveView}
      />
    </Layout>
  );
}

function App() {
    return (
        <ToastProvider>
            <AppContent />
        </ToastProvider>
    )
}

export default App;
