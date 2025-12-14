import React, { useState, useEffect } from 'react';
import { User, UserRole, Language } from '../types';
import { getAllUsers, saveUser, deleteUser } from '../services/authService';
import { TEXT } from '../constants';

interface AdminPanelProps {
  lang: Language;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ lang, onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const t = TEXT[lang];

  // New User Form State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [expiration, setExpiration] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setIsLoading(false);
  };

  const handleAddUser = async () => {
    if (!newUsername || !newPassword) return;
    setIsLoading(true);
    try {
      const newUser: User = {
        id: '', // DB will assign
        username: newUsername,
        password: newPassword,
        role: UserRole.MEMBER,
        isActive: true,
        expirationDate: expiration || undefined
      };
      await saveUser(newUser);
      await fetchUsers();
      setNewUsername('');
      setNewPassword('');
      setExpiration('');
    } catch (err) {
      alert("Error adding user. Username might be taken.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (user: User) => {
    if (user.role === UserRole.ADMIN) return;
    setIsLoading(true);
    const updated = { ...user, isActive: !user.isActive };
    await saveUser(updated);
    await fetchUsers();
  };

  const changePassword = async (user: User) => {
    const newPass = prompt(`Enter new password for ${user.username}:`);
    if (newPass) {
      setIsLoading(true);
      const updated = { ...user, password: newPass };
      await saveUser(updated);
      await fetchUsers();
      alert("Password updated successfully.");
    }
  };
  
  const handleDelete = async (userId: string) => {
      if (confirm("Are you sure you want to delete this user?")) {
          setIsLoading(true);
          await deleteUser(userId);
          await fetchUsers();
      }
  };

  const shareLink = (user: User) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const loginLink = `${baseUrl}?u=${encodeURIComponent(user.username)}&p=${encodeURIComponent(user.password || '')}`;
    
    const shareText = `PERPECT AI Login Access\n------------------\nUsername: ${user.username}\nPassword: ${user.password}\nExpires: ${user.expirationDate || 'Never'}\n\nDirect Login Link:\n${loginLink}`;
    
    navigator.clipboard.writeText(shareText);
    alert('Login link and details copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 w-full max-w-5xl rounded-xl border border-perpect-600 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 bg-dark-700 flex justify-between items-center border-b border-gray-700">
          <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-perpect-500">{t.adminPanel}</h2>
              {isLoading && <span className="text-xs text-gray-400 animate-pulse">(Syncing DB...)</span>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Add User Section */}
          <div className="mb-8 p-4 bg-dark-900 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">{t.addUser}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder={t.username}
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                className="bg-dark-800 border border-gray-600 rounded p-2 text-white focus:border-perpect-500 outline-none"
              />
              <input
                type="text"
                placeholder={t.password}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="bg-dark-800 border border-gray-600 rounded p-2 text-white focus:border-perpect-500 outline-none"
              />
              <input
                type="date"
                value={expiration}
                onChange={e => setExpiration(e.target.value)}
                className="bg-dark-800 border border-gray-600 rounded p-2 text-white focus:border-perpect-500 outline-none"
              />
              <button
                onClick={handleAddUser}
                disabled={isLoading}
                className="bg-perpect-600 hover:bg-perpect-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
              >
                + {t.addUser}
              </button>
            </div>
          </div>

          {/* User List */}
          <table className="w-full text-left text-gray-300">
            <thead className="bg-dark-900 text-gray-400">
              <tr>
                <th className="p-3">{t.username}</th>
                <th className="p-3">Role</th>
                <th className="p-3">Password</th>
                <th className="p-3">{t.expiration}</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-dark-700">
                  <td className="p-3 font-medium text-white">{user.username}</td>
                  <td className="p-3 text-sm">{user.role}</td>
                  <td className="p-3 text-sm font-mono text-gray-500">****</td>
                  <td className="p-3 text-sm">
                      {user.expirationDate ? (
                          <span className={new Date(user.expirationDate) < new Date() ? 'text-red-500' : 'text-green-500'}>
                              {user.expirationDate}
                          </span>
                      ) : 'Lifetime'}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {user.isActive ? t.active : t.inactive}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {user.role !== UserRole.ADMIN && (
                      <>
                        <button onClick={() => toggleStatus(user)} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded">
                          {user.isActive ? 'Ban' : 'Unban'}
                        </button>
                        <button onClick={() => changePassword(user)} className="text-xs bg-blue-900 hover:bg-blue-800 text-blue-100 px-2 py-1 rounded">
                          {t.changePass}
                        </button>
                        <button onClick={() => shareLink(user)} className="text-xs bg-perpect-600 hover:bg-perpect-700 text-white px-2 py-1 rounded">
                          Link 🔗
                        </button>
                         <button onClick={() => handleDelete(user.id)} className="text-xs bg-red-900 hover:bg-red-800 text-red-100 px-2 py-1 rounded">
                          Del
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;