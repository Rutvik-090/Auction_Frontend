import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let avatarUrl = '';
    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append('image', avatarFile);
        const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        avatarUrl = data.url;
      }
      await register(name, email, password, avatarUrl);
      showNotification('Your account has been successfully created!', 'success');
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration Failed. Please try again.';
      showNotification(errorMsg, 'error');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col pt-16">
      <div className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background Shapes for Gallery Feel */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-fixed/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl"></div>

        <main className="w-full max-w-[440px] z-10 mt-8">
          {/* Brand Identity */}
          <div className="text-center mb-10">
            <h1 className="font-headline text-3xl font-black text-primary tracking-tighter mb-2">Request Invite</h1>
            <p className="text-on-surface-variant font-medium tracking-tight">Join the exclusive gallery collection.</p>
          </div>

          {/* Card */}
          <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(19,27,46,0.08)]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div className="space-y-2">
                <label className="block font-label text-xs font-bold text-on-surface-variant ml-1">Profile Photo (Optional)</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-surface-container overflow-hidden flex items-center justify-center border border-outline-variant shrink-0">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-outline text-2xl">person</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setAvatarFile(e.target.files[0]);
                        setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-label text-xs font-bold text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">person</span>
                  <input
                    className="input-field"
                    id="name"
                    name="name"
                    placeholder="Collector Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-label text-xs font-bold text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">mail</span>
                  <input
                    className="input-field"
                    id="email"
                    name="email"
                    placeholder="curator@gallery.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-label text-xs font-bold text-on-surface-variant ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">lock</span>
                  <input
                    className="input-field"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Register Button */}
              <button
                className="btn-primary"
                type="submit"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading & Applying...' : 'Apply for Access'}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center mt-10 text-sm text-on-surface-variant font-medium">
              Already have an account?
              <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 ml-1">Log in</Link>
            </p>
          </div>
        </main>
      </div>

      <footer className="p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-outline uppercase tracking-[0.1em] mt-auto">
        <div className="flex gap-6">
          <a className="hover:text-primary transition-colors" href="#">Privacy Charter</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Sale</a>
        </div>
        <p>© 2024 The Auction Curator. High-End Digital Assets.</p>
      </footer>
    </div>
  );
};

export default Register;
