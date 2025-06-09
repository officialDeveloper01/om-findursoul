
import { Heart, Mail, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const SpiritualFooter = () => {
  return (
    <footer className="bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700 text-white relative overflow-hidden">
      {/* Sacred geometry background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-32 h-32 border border-amber-400/30 rotate-45"></div>
        <div className="absolute top-8 left-8 w-24 h-24 border border-amber-400/20 rotate-45"></div>
        <div className="absolute bottom-4 right-4 w-40 h-40 border border-purple-400/30 rounded-full"></div>
        <div className="absolute bottom-8 right-8 w-32 h-32 border border-purple-400/20 rounded-full"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <Star className="w-8 h-8 text-amber-400 floating" />
              <div>
                <h3 className="text-2xl font-bold mystic-text">ॐ</h3>
                <p className="text-amber-400 text-sm tracking-widest">HEAL YOUR SOUL</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              Discover the ancient wisdom of numerology and sacred geometry. 
              Your spiritual journey begins with understanding the cosmic patterns 
              within your birth details.
            </p>
          </div>

          {/* Sacred Quote */}
          <div className="text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-amber-400/20">
              <p className="text-amber-300 italic text-lg font-light mb-2">
                "सर्वं खल्विदं ब्रह्म"
              </p>
              <p className="text-slate-300 text-sm">
                All this is indeed Brahman
              </p>
              <div className="flex justify-center mt-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-medium text-amber-400 mb-4">
              <Mail className="w-5 h-5 inline mr-2" />
              Cosmic Updates
            </h4>
            <p className="text-slate-300 text-sm mb-4">
              Receive spiritual insights and numerology wisdom
            </p>
            <div className="flex gap-2 max-w-sm mx-auto md:ml-auto">
              <Input 
                placeholder="Enter your email" 
                className="bg-white/10 border-amber-400/30 text-white placeholder-slate-400"
              />
              <Button className="sacred-button text-white px-6">
                Join
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-600/50 mt-8 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-400" /> for spiritual seekers
            </p>
            <p className="text-slate-500 text-xs">
              © 2024 OM Numerology. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
