/**
 * ============================================================================
 * 👤 USER MANAGEMENT SCREEN - Gestión de usuarios (Web)
 * ============================================================================
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserList } from './components/UserList';
import { UserForm } from './components/UserForm';
import { UserDetail } from './components/UserDetail';
import { RolePermissions } from './components/RolePermissions';
import { userService } from '../../services/userService';

export function UserManagementScreen() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);

  const handleBack = () => navigate('/');

  const renderView = () => {
    switch (currentView) {
      case 'list':
        return (
          <UserList
            onUserSelect={(user) => {
              setSelectedUser(user);
              setCurrentView('detail');
            }}
            onEdit={(user) => {
              setSelectedUser(user);
              setCurrentView('edit');
            }}
            onCreate={() => setCurrentView('create')}
          />
        );
      case 'roles':
        return <RolePermissions />;
      case 'create':
        return (
          <UserForm
            mode="create"
            onSave={() => setCurrentView('list')}
            onCancel={() => setCurrentView('list')}
          />
        );
      case 'edit':
        return (
          <UserForm
            mode="edit"
            user={selectedUser}
            onSave={() => setCurrentView('list')}
            onCancel={() => setCurrentView('list')}
          />
        );
      case 'detail':
        return (
          <UserDetail
            user={selectedUser}
            onBack={() => setCurrentView('list')}
            onEdit={(user) => {
              setSelectedUser(user);
              setCurrentView('edit');
            }}
            onToggleStatus={async (user) => {
              try {
                await userService.toggleUserStatus(user._id || user.id);
                setCurrentView('list');
              } catch (err) {
                console.error('Error toggling status:', err);
              }
            }}
          />
        );
      default:
        return <UserList />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F2F7' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #5856D6 0%, #007AFF 100%)',
          padding: '20px 24px', borderRadius: 20, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={handleBack} style={{
                width: 40, height: 40, borderRadius: 20, border: 'none',
                backgroundColor: 'rgba(255,255,255,0.2)', cursor: 'pointer',
                fontSize: 18, color: 'white',
              }}>←</button>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'white' }}>
                  Usuarios
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                  Gestión de usuarios y permisos
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setCurrentView('roles')}
                style={{
                  padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)',
                  backgroundColor: 'transparent', color: 'white', fontSize: 14, cursor: 'pointer',
                }}
              >
                Roles y Permisos
              </button>
              <button
                onClick={() => setCurrentView('list')}
                style={{
                  padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 14, cursor: 'pointer',
                }}
              >
                Usuarios
              </button>
            </div>
          </div>
        </div>

        {renderView()}
      </div>
    </div>
  );
}

export default UserManagementScreen;