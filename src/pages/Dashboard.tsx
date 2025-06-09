import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserDataForm } from '@/components/UserDataForm';
import { LoshoGrid } from '@/components/LoshoGrid';
import { NumerologyDisplay } from '@/components/NumerologyDisplay';
import { SearchTables } from '@/components/SearchTables';
import { CelestialHeader } from '@/components/CelestialHeader';
import { SpiritualFooter } from '@/components/SpiritualFooter';
import { CelestialLoader } from '@/components/CelestialLoader';
import { calculateAllNumerology } from '@/utils/numerologyCalculator';
import { ref, push } from 'firebase/database';
import { database } from '@/config/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, BarChart3, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [numerologyData, setNumerologyData] = useState(null);
  const [currentView, setCurrentView] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleFormSubmit = async (data) => {
    console.log('Form submitted:', data);
    setIsLoading(true);
    
    try {
      // Calculate grid and numerology using Indian system with Chaldean numbers
      const calculatedNumerology = calculateAllNumerology(data.dateOfBirth, data.fullName);
      
      console.log('Numerology calculated:', calculatedNumerology);
      
      // Prepare data for Firebase with Indian numerology structure and Chaldean numbers
      const tableData = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        timeOfBirth: data.timeOfBirth,
        placeOfBirth: data.placeOfBirth,
        mobileNumber: data.mobileNumber,
        gridData: calculatedNumerology.loshuGrid, // Use the loshu grid from numerology
        numerologyData: calculatedNumerology,
        createdAt: new Date().toISOString()
      };
      
      // Wait for user to be available
      if (!user?.uid) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      // Save to Firebase under user's UID
      const userRef = ref(database, `users/${user.uid}`);
      const result = await push(userRef, tableData);
      console.log('Data saved to Firebase with key:', result.key);
      
      // Update UI state - prepare grid data in expected format
      const gridDataForDisplay = {
        frequencies: calculatedNumerology.loshuGrid,
        grid: [],
        originalDate: data.dateOfBirth,
        digits: []
      };
      
      setUserData(data);
      setGridData(gridDataForDisplay);
      setNumerologyData(calculatedNumerology);
      setCurrentView('results');
      
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewEntry = () => {
    setUserData(null);
    setGridData(null);
    setNumerologyData(null);
    setCurrentView('form');
  };

  return (
    <div className="min-h-screen celestial-bg">
      {/* Celestial Header */}
      <CelestialHeader currentView={currentView} setCurrentView={setCurrentView} />

      {/* Hero Section - Only show when on form view */}
      {currentView === 'form' && !userData && (
        <section className="pt-24 pb-16 px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="slide-up">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 mystic-text">
                Discover Your Sacred Numbers
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Unlock the ancient wisdom hidden in your birth details through 
                <span className="golden-glow"> Vedic Numerology </span> 
                and the mystical 
                <span className="golden-glow"> Lo Shu Grid</span>
              </p>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card className="sacred-card">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-4 floating" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Numerology Analysis</h3>
                    <p className="text-slate-600 text-sm">Driver, Conductor & Chaldean calculations</p>
                  </CardContent>
                </Card>
                
                <Card className="sacred-card">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-4 floating" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Lo Shu Grid</h3>
                    <p className="text-slate-600 text-sm">Sacred geometry patterns from your birth date</p>
                  </CardContent>
                </Card>
                
                <Card className="sacred-card">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-12 h-12 text-emerald-500 mx-auto mb-4 floating" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Spiritual Insights</h3>
                    <p className="text-slate-600 text-sm">Ancient wisdom for modern life guidance</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="relative">
        {/* Background for content sections */}
        <div className="bg-gradient-to-b from-transparent via-white/95 to-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-12">
            
            {isLoading && (
              <div className="text-center mb-8">
                <CelestialLoader />
              </div>
            )}

            {currentView === 'form' && (
              <div className="space-y-8">
                <div className="text-center mb-12 fade-in">
                  <h2 className="text-4xl font-light text-slate-700 mb-6">
                    Begin Your Sacred Journey
                  </h2>
                  <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    Enter your birth details to calculate your personal numerology and discover 
                    the cosmic patterns that influence your life path.
                  </p>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6"></div>
                </div>
                
                <div className="slide-up">
                  <UserDataForm onSubmit={handleFormSubmit} />
                </div>
              </div>
            )}

            {currentView === 'results' && userData && (gridData || numerologyData) && (
              <div className="space-y-8 pt-16">
                <div className="text-center fade-in">
                  <h2 className="text-4xl font-light text-slate-700 mb-2">
                    Your Sacred Analysis
                  </h2>
                  <p className="text-slate-600 mb-6 text-lg">
                    For <span className="golden-glow font-semibold">{userData.fullName}</span>
                  </p>
                  <Button 
                    onClick={handleNewEntry}
                    variant="outline"
                    className="mb-8 border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    Create New Analysis
                  </Button>
                </div>
                
                {/* Keep existing Loshu Grid and Numerology Display unchanged */}
                <div className="slide-up">
                  {gridData && (
                    <LoshoGrid gridData={gridData} userData={userData} />
                  )}
                  
                  {numerologyData && (
                    <NumerologyDisplay 
                      numerologyData={numerologyData} 
                      userData={userData} 
                    />
                  )}
                </div>
              </div>
            )}

            {currentView === 'search' && (
              <div className="space-y-8 pt-16">
                <div className="text-center mb-12 fade-in">
                  <h2 className="text-4xl font-light text-slate-700 mb-6">
                    Search Sacred Records
                  </h2>
                  <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    Find previously created numerological analyses by searching with mobile numbers.
                  </p>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-6"></div>
                </div>
                
                <div className="slide-up">
                  <SearchTables />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Spiritual Footer */}
      <SpiritualFooter />
    </div>
  );
};

export default Dashboard;
