import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserDataForm } from '@/components/UserDataForm';
import { LoshoGrid } from '@/components/LoshoGrid';
import { SearchTables } from '@/components/SearchTables';
import { CelestialHeader } from '@/components/CelestialHeader';
import { SpiritualFooter } from '@/components/SpiritualFooter';
import { CelestialLoader } from '@/components/CelestialLoader';
import { Badge } from '@/components/ui/badge';
import { calculateAllNumerology } from '@/utils/numerologyCalculator';
import { ref, set } from 'firebase/database';
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
  const [allResults, setAllResults] = useState([]);
  const { user } = useAuth();

  const handleFormSubmit = useCallback(async (data) => {
    console.log('Form submitted with entries:', data);
    setIsLoading(true);
    
    try {
      const results = [];
      
      // Process each entry (main user + relatives)
      for (const entry of data.entries) {
        const calculatedNumerology = calculateAllNumerology(entry.dateOfBirth, entry.fullName);
        
        console.log(`Numerology calculated for ${entry.fullName}:`, calculatedNumerology);
        
        const entryData = {
          fullName: entry.fullName,
          dateOfBirth: entry.dateOfBirth,
          timeOfBirth: entry.timeOfBirth,
          placeOfBirth: entry.placeOfBirth,
          relation: entry.relation,
          gridData: calculatedNumerology.loshuGrid,
          numerologyData: calculatedNumerology,
          createdAt: new Date().toISOString()
        };
        
        results.push(entryData);
      }
      
      // Wait for user to be available
      if (!user?.uid) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      // Create unique timestamp-based key for this submission
      const timestamp = Date.now();
      
      // Save to Firebase using phone number as key with proper structure
      const entriesRef = ref(database, `users/${data.phoneNumber}/entries/${timestamp}`);
      
      // Save all entries under one timestamp key
      await set(entriesRef, {
        entries: results,
        phoneNumber: data.phoneNumber,
        createdAt: new Date().toISOString(),
        userId: user.uid
      });
      
      console.log('Data saved to Firebase with timestamp:', timestamp);
      
      // iOS-safe state update with error handling
      if (typeof window !== 'undefined') {
        try {
          requestAnimationFrame(() => {
            setAllResults(results);
            setCurrentView('results');
          });
        } catch (error) {
          console.error('Error updating state:', error);
          // Fallback for iOS
          setTimeout(() => {
            setAllResults(results);
            setCurrentView('results');
          }, 100);
        }
      }
      
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const handleNewEntry = useCallback(() => {
    // iOS-safe state reset with error handling
    if (typeof window !== 'undefined') {
      try {
        requestAnimationFrame(() => {
          setUserData(null);
          setGridData(null);
          setNumerologyData(null);
          setAllResults([]);
          setCurrentView('form');
        });
      } catch (error) {
        console.error('Error resetting state:', error);
        // Fallback for iOS
        setTimeout(() => {
          setUserData(null);
          setGridData(null);
          setNumerologyData(null);
          setAllResults([]);
          setCurrentView('form');
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen celestial-bg">
      {/* Celestial Header */}
      <CelestialHeader currentView={currentView} setCurrentView={setCurrentView} />

      {/* Hero Section - Only show when on form view */}

      {/* Main Content */}
      <main className="relative">
        {/* Background for content sections */}
        <div className="bg-gradient-to-b from-transparent via-white/95 to-white min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-12">
            
            {isLoading && (
              <div className="text-center mb-8">
                <CelestialLoader />
              </div>
            )}

            {currentView === 'form' && (
              <div className="space-y-8">
                <div className="text-center mb-12 fade-in">
                  <h2 className="text-4xl font-bold text-amber-600 mb-6">
                    Begin Your Sacred Journey
                  </h2>
                  <p className="text-amber-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Enter your birth details and optionally add family members to calculate 
                    personal numerology and discover the cosmic patterns that influence your lives.
                  </p>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6"></div>
                </div>
                
                <div className="slide-up">
                  <UserDataForm onSubmit={handleFormSubmit} />
                </div>
              </div>
            )}

            {currentView === 'results' && allResults.length > 0 && (
              <div className="space-y-8 pt-16">
                <div className="text-center fade-in">
                  <h2 className="text-4xl font-light text-amber-700 mb-2">
                    Your Sacred Analysis
                  </h2>
                  <p className="text-amber-400 mb-6 text-lg">
                    Family Reading ({allResults.length} member{allResults.length > 1 ? 's' : ''})
                  </p>
                  <Button 
                    onClick={handleNewEntry}
                    variant="outline"
                    className="mb-8 border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    Create New Analysis
                  </Button>
                </div>
                
                {/* Display Results - Single card for one person, grid for multiple */}
                {allResults.length === 1 ? (
                  // Single person - full width card
                  <div className="max-w-5xl mx-auto slide-up">
                    <LoshoGrid 
                      gridData={{
                        frequencies: allResults[0].gridData,
                        grid: [],
                        originalDate: allResults[0].dateOfBirth,
                        digits: []
                      }} 
                      userData={{
                        fullName: allResults[0].fullName,
                        dateOfBirth: allResults[0].dateOfBirth,
                        timeOfBirth: allResults[0].timeOfBirth,
                        placeOfBirth: allResults[0].placeOfBirth,
                        numerologyData: allResults[0].numerologyData
                      }}
                    />
                  </div>
                ) : (
                  // Multiple people - grid layout
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {allResults.map((result, index) => (
                      <div key={`result-${index}-${result.fullName}`} className="slide-up">
                        <Card className="shadow-xl border border-gray-200 bg-white rounded-xl h-full">
                          <div className="p-6">
                            <div className="text-center mb-6">
                              <h3 className="text-xl font-semibold text-blue-800 mb-3">
                                {result.fullName}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className={`
                                  px-3 py-1 text-sm font-medium rounded-full
                                  ${result.relation === 'SELF' 
                                    ? 'bg-amber-100 text-amber-700 border-amber-300' 
                                    : 'bg-blue-100 text-blue-700 border-blue-300'
                                  }
                                `}
                              >
                                {result.relation === 'SELF' ? 'Main' : result.relation}
                              </Badge>
                            </div>
                            
                            <LoshoGrid 
                              gridData={{
                                frequencies: result.gridData,
                                grid: [],
                                originalDate: result.dateOfBirth,
                                digits: []
                              }} 
                              userData={{
                                fullName: result.fullName,
                                dateOfBirth: result.dateOfBirth,
                                timeOfBirth: result.timeOfBirth,
                                placeOfBirth: result.placeOfBirth,
                                numerologyData: result.numerologyData
                              }}
                            />
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentView === 'search' && (
              <div className="space-y-8 pt-16">
                <div className="text-center mb-12 fade-in">
                  <h2 className="text-4xl font-light text-amber-700 mb-6">
                    Search Sacred Records
                  </h2>
                  <p className="text-amber-400  max-w-2xl mx-auto text-lg leading-relaxed">
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
