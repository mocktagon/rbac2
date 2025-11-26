
import React, { useState } from 'react';
import { RoleDefinition, PermissionSetting, AccessLevel, UserContext } from '../../types';
import { FEATURES_LIST, MOCK_USERS } from '../../constants';
import { Users, Shield, Edit, Plus, Check, ChevronLeft, Eye, Ban, Lock, Search, Trash2, UserPlus } from 'lucide-react';

interface RoleManagerProps {
  roles: RoleDefinition[];
  currentUser: UserContext;
  onSaveRole: (role: RoleDefinition) => void;
}

export const RoleManager: React.FC<RoleManagerProps> = ({ roles, currentUser, onSaveRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<'permissions' | 'members'>('permissions');

  // Filter roles based on user scope
  const visibleRoles = roles.filter(role => {
    if (currentUser.role === 'ORG_OWNER') return true; // Org Owner sees all
    // Project owner sees Global (Read Only) and their own Project roles
    return role.scope === 'Global' || role.ownerId === currentUser.assignedProjectId;
  });

  const emptyRole: RoleDefinition = {
    id: `role-${Date.now()}`,
    name: 'New Role',
    description: '',
    scope: currentUser.role === 'ORG_OWNER' ? 'Global' : 'Project',
    ownerId: currentUser.assignedProjectId,
    isSystem: false,
    activeUsers: 0,
    permissions: FEATURES_LIST.map(f => ({ featureId: f.id, accessLevel: 'NONE' }))
  };

  const handleEdit = (role: RoleDefinition) => {
    // Project Owners cannot edit Global roles
    if (currentUser.role === 'PROJECT_OWNER' && role.scope === 'Global') return;
    
    setCurrentRole({ ...role, permissions: [...role.permissions] });
    setActiveTab('permissions');
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentRole(emptyRole);
    setActiveTab('permissions');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (currentRole) {
      onSaveRole(currentRole);
      setIsEditing(false);
      setCurrentRole(null);
    }
  };

  const updatePermission = (featureId: string, updates: Partial<PermissionSetting>) => {
    if (!currentRole) return;
    
    const newPermissions = currentRole.permissions.map(p => {
      if (p.featureId === featureId) {
        return { ...p, ...updates };
      }
      return p;
    });

    const exists = newPermissions.find(p => p.featureId === featureId);
    if (!exists) {
        newPermissions.push({ featureId, accessLevel: 'NONE', ...updates });
    }

    setCurrentRole({ ...currentRole, permissions: newPermissions });
  };

  const getPermission = (featureId: string) => {
    return currentRole?.permissions.find(p => p.featureId === featureId) || { featureId, accessLevel: 'NONE' };
  };

  // --- EDITOR VIEW ---
  if (isEditing && currentRole) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
            >
                <ChevronLeft size={24} />
            </button>
            <div>
                <h2 className="text-2xl font-bold text-slate-900">
                    {currentRole.id.startsWith('role-') && !roles.find(r => r.id === currentRole.id) ? 'Create Access Profile' : 'Edit Access Profile'}
                </h2>
                <p className="text-slate-500">
                    {currentUser.role === 'ORG_OWNER' ? 'Defining Global or Project-specific access.' : 'Defining roles for your project team.'}
                </p>
            </div>
            <div className="ml-auto flex gap-3">
                <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-slate-300 bg-white text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                    <Shield size={18} /> Save Profile
                </button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[600px]">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-6">
                <button 
                    onClick={() => setActiveTab('permissions')}
                    className={`py-4 px-2 text-sm font-bold border-b-2 mr-6 transition-colors ${activeTab === 'permissions' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Permissions & Scope
                </button>
                <button 
                    onClick={() => setActiveTab('members')}
                    className={`py-4 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'members' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Assigned Members ({currentRole.activeUsers})
                </button>
            </div>

            <div className="p-8">
                {activeTab === 'permissions' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Role Name</label>
                                <input 
                                    type="text" 
                                    value={currentRole.name} 
                                    onChange={e => setCurrentRole({...currentRole, name: e.target.value})}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    placeholder="e.g. Vendor Interviewer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Scope</label>
                                {currentUser.role === 'ORG_OWNER' ? (
                                    <select 
                                        value={currentRole.scope}
                                        onChange={e => setCurrentRole({...currentRole, scope: e.target.value as any})}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                    >
                                        <option value="Global">Global (All Projects)</option>
                                        <option value="Project">Project Specific (Single Project)</option>
                                    </select>
                                ) : (
                                    <div className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed">
                                        Project Specific (Locked)
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                            <textarea 
                                value={currentRole.description}
                                onChange={e => setCurrentRole({...currentRole, description: e.target.value})}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
                            />
                        </div>
                        
                        {/* The Matrix */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Shield size={20} className="text-indigo-600" /> 
                                Access Matrix
                            </h3>
                            <div className="border rounded-lg overflow-hidden border-slate-200">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Feature</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Access Level</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Constraint / Mask</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {FEATURES_LIST.map((feature) => {
                                            if (currentUser.role === 'PROJECT_OWNER' && feature.category === 'Governance') return null;

                                            const perm = getPermission(feature.id);
                                            return (
                                                <tr key={feature.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-semibold text-slate-900">{feature.name}</p>
                                                        <p className="text-xs text-slate-500">{feature.category} - {feature.description}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg inline-flex">
                                                            {(['FULL', 'PARTIAL', 'VIEW', 'NONE'] as AccessLevel[]).map((level) => (
                                                                <button
                                                                    key={level}
                                                                    onClick={() => updatePermission(feature.id, { accessLevel: level })}
                                                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                                                                        perm.accessLevel === level 
                                                                        ? 'bg-white shadow-sm text-indigo-600' 
                                                                        : 'text-slate-400 hover:text-slate-600'
                                                                    }`}
                                                                >
                                                                    {level}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <input 
                                                            type="text" 
                                                            disabled={perm.accessLevel === 'NONE' || perm.accessLevel === 'FULL'}
                                                            value={perm.constraint || ''}
                                                            onChange={(e) => updatePermission(feature.id, { constraint: e.target.value })}
                                                            placeholder={perm.accessLevel === 'FULL' ? 'Full Access' : (perm.accessLevel === 'NONE' ? 'No Access' : 'e.g. Mask Phone/Email')}
                                                            className={`w-full pl-3 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none ${
                                                                (perm.accessLevel === 'NONE' || perm.accessLevel === 'FULL')
                                                                ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                                                : 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                                                            }`}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                             <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search users to add..." 
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                                />
                             </div>
                             <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
                                <UserPlus size={16} /> Add Member
                             </button>
                        </div>
                        
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Assigned Users</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {/* Mock showing users assigned */}
                                {MOCK_USERS.slice(0, currentRole.activeUsers > 0 ? 2 : 0).map((u, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {u.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{u.name}</p>
                                                <p className="text-xs text-slate-500">{u.role}</p>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-red-600 p-2 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {currentRole.activeUsers === 0 && (
                                    <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                                        <Users size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>No users assigned to this role yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Scoped Access Profiles</h2>
          <p className="text-slate-500">
            {currentUser.role === 'ORG_OWNER' 
             ? "Manage Global and Project-specific roles." 
             : "Manage roles for your project team."}
          </p>
        </div>
        <button 
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> New Role Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleRoles.map((role) => (
          <div key={role.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col group hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${role.scope === 'Global' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{role.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${role.scope === 'Global' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                        {role.scope === 'Global' ? 'Global Org' : `Project ${role.ownerId?.replace('p-','')}`}
                    </span>
                  </div>
              </div>
              {/* Only show edit if Org Owner OR Project Owner owning this local role */}
              {(currentUser.role === 'ORG_OWNER' || (role.scope === 'Project' && role.ownerId === currentUser.assignedProjectId)) ? (
                  <button 
                    onClick={() => handleEdit(role)}
                    className="text-slate-400 hover:text-indigo-600 p-1"
                  >
                    <Edit size={18} />
                  </button>
              ) : (
                  <Lock size={16} className="text-slate-300" />
              )}
            </div>

            <p className="text-sm text-slate-600 mb-6 flex-1">{role.description}</p>
            
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                    <Users size={14} /> {role.activeUsers} Users
                </span>
                {role.isSystem && <span className="flex items-center gap-1 text-slate-400"><Lock size={12}/> System</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
