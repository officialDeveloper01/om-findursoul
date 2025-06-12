import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, Sparkles, Moon } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const FIXED_AUTH_PASS = 'vedic2024'; // 🔐 Replace with your secure pass

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (authPass !== FIXED_AUTH_PASS) {
      setError('Invalid Auth Pass');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen celestial-bg flex items-center justify-center px-4">
      {/* Sacred geometry background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 border border-purple-400/20 rotate-12 rounded-lg"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 border border-amber-400/20 rounded-full"></div>
        <div className="absolute top-2/3 right-3/4 w-40 h-40 border border-purple-400/30 rotate-45"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="relative">
              <Moon className="w-12 h-12 text-purple-400 floating" />
              <div className="absolute inset-0 w-12 h-12 bg-purple-400/20 rounded-full blur-lg"></div>
            </div>
            <div>
              <h1 className="text-6xl font-bold mystic-text tracking-wider">ॐ</h1>
              <p className="text-amber-300 font-light tracking-widest text-lg">HEAL YOUR SOUL</p>
            </div>
            <div className="relative">
              <Sparkles className="w-12 h-12 text-amber-400 floating" />
              <div className="absolute inset-0 w-12 h-12 bg-amber-400/20 rounded-full blur-lg"></div>
            </div>
          </div>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
        </div>

        <Card className="sacred-card slide-up">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-light text-slate-700">Begin Your Journey</CardTitle>
            <p className="text-slate-500 mt-2">Create your sacred space to explore cosmic wisdom</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-slate-700">
                  <User size={16} />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your sacred name"
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-slate-700">
                  <Mail size={16} />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-slate-700">
                  <Lock size={16} />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a sacred password"
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-slate-700">
                  <Lock size={16} />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authPass" className="flex items-center gap-2 text-slate-700">
                  🔐 Auth Pass
                </Label>
                <Input
                  id="authPass"
                  type="password"
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  placeholder="Enter the secret pass"
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full sacred-button text-white py-3 text-lg font-light tracking-wide"
                disabled={loading}
              >
                {loading ? 'Creating Sacred Space...' : 'Begin Sacred Journey'}
              </Button>

              <div className="text-center">
                <p className="text-slate-600">
                  Already enlightened?{' '}
                  <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                    Enter Here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Floating spiritual elements */}
        <div className="absolute -top-6 -right-6 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-6 -left-6 w-3 h-3 bg-amber-400 rounded-full animate-ping animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default Signup;
