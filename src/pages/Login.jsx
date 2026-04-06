import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      showNotification('Welcome back to the curation platform!', 'success');
      navigate('/');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Authentication Failed. Please check your credentials.';
      showNotification(errorMsg, 'error');
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
            <h1 className="font-headline text-3xl font-black text-primary tracking-tighter mb-2">The Auction Curator</h1>
            <p className="text-on-surface-variant font-medium tracking-tight">Access your private gallery collection.</p>
          </div>

          {/* Login Card */}
          <div className="bg-surface-container-lowest p-10 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(19,27,46,0.08)]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Email Field */}
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

              {/* Password Field */}
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

              {/* Options */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative w-4 h-4 rounded bg-surface-container-high group-hover:bg-primary-fixed transition-colors">
                    <input className="peer absolute opacity-0 w-full h-full cursor-pointer" type="checkbox" />
                    <span className="material-symbols-outlined text-[14px] text-primary absolute inset-0 hidden peer-checked:flex items-center justify-center">check</span>
                  </div>
                  <span className="text-on-surface-variant">Remember device</span>
                </label>
                <a className="text-primary hover:underline underline-offset-4 transition-all" href="#">Forgot Password?</a>
              </div>

              {/* Login Button */}
              <button
                className="btn-primary"
                type="submit"
              >
                Enter The Gallery
              </button>
            </form>

            {/* Footer */}
            <p className="text-center mt-10 text-sm text-on-surface-variant font-medium">
              New to the collection?
              <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4 ml-1">Request an invite</Link>
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

export default Login;
