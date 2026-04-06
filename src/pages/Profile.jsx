import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, login, logout } = useContext(AuthContext); // Assuming login updates the context if it accepts user data, otherwise might need an update user function. We can just use localStorage if not.
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let currentFormData = { ...formData };
      if (avatarFile) {
        setIsUploading(true);
        const fileData = new FormData();
        fileData.append('image', avatarFile);
        const { data } = await axios.post('http://localhost:5000/api/upload', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        currentFormData.avatar = data.url;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const res = await axios.put('http://localhost:5000/api/auth/profile', currentFormData, config);
      
      // Update local storage and context
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      // Hacky way to force auth context to use new user data if no update fn is provided
      window.location.reload(); 
      
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed.' });
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-surface-container-lowest/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(19,27,46,0.04)] border border-outline-variant/30 p-8 md:p-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="relative group w-24 h-24 mb-6">
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white text-3xl font-black headline ring-4 ring-primary/10 shadow-xl overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <span className="material-symbols-outlined">photo_camera</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setAvatarFile(e.target.files[0]);
                    setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </label>
          </div>
          <h1 className="text-3xl font-black headline tracking-tighter text-on-surface">Your Profile</h1>
          <p className="text-sm text-on-surface-variant mt-2 font-medium">Manage your curator identity and security preferences.</p>
        </div>

        {message.text && (
          <div className={`mb-8 p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${message.type === 'success' ? 'bg-secondary-container/20 text-secondary' : 'bg-error-container/20 text-error'}`}>
             <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
             {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-outline">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:bg-surface-container-lowest outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-outline">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:bg-surface-container-lowest outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-outline-variant/20">
            <label className="text-xs font-bold uppercase tracking-widest text-outline">New Password</label>
            <p className="text-[10px] text-on-surface-variant mb-2">Leave blank if you don't want to change your password.</p>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-surface-container-low border border-transparent focus:border-primary/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:bg-surface-container-lowest outline-none transition-all shadow-sm"
            />
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center gap-4 border-t border-outline-variant/20 mt-8">
            <button 
              type="submit" 
              disabled={loading || isUploading}
              className="w-full md:w-auto flex-1 bg-gradient-to-r from-primary to-primary-container text-white py-3 px-8 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all outline-none"
            >
              {loading || isUploading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={handleLogout}
              className="w-full md:w-auto bg-error-container/10 text-error hover:bg-error-container hover:text-on-error-container py-3 px-8 rounded-full font-bold transition-all outline-none flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">logout</span>
              Log Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
