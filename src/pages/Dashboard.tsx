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
import { UserManagementModal } from '@/components/UserManagementModal';
import { Edit, Plus, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [numerologyData, setNumerologyData] = useState(null);
  const [currentView, setCurrentView] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const [allResults, setAllResults] = useState([]);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  const [managementModal, setManagementModal] = useState({
    isOpen: false,
    mode: 'add' as 'add' | 'edit',
    userData: null,
    userIndex: -1
  });
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
      
      // Store current phone number and timestamp for future updates
      setCurrentPhoneNumber(data.phoneNumber);
      setCurrentTimestamp(timestamp.toString());
      
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
          setCurrentPhoneNumber('');
          setCurrentTimestamp('');
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
          setCurrentPhoneNumber('');
          setCurrentTimestamp('');
          setCurrentView('form');
        }, 100);
      }
    }
  }, []);

  const openUserModal = (mode: 'add' | 'edit', userData: any = null, userIndex: number = -1) => {
    setManagementModal({
      isOpen: true,
      mode,
      userData,
      userIndex
    });
  };

  const closeUserModal = () => {
    setManagementModal({
      isOpen: false,
      mode: 'add',
      userData: null,
      userIndex: -1
    });
  };

  const handleUserSave = async (userData: any) => {
    try {
      let updatedResults = [...allResults];
      
      if (managementModal.mode === 'add') {
        // Add new family member
        const calculatedNumerology = calculateAllNumerology(userData.dateOfBirth, userData.fullName);
        const newUser = {
          fullName: userData.fullName,
          dateOfBirth: userData.dateOfBirth,
          timeOfBirth: userData.timeOfBirth,
          placeOfBirth: userData.placeOfBirth,
          relation: userData.relation,
          gridData: calculatedNumerology.loshuGrid,
          numerologyData: calculatedNumerology,
          createdAt: new Date().toISOString()
        };
        updatedResults.push(newUser);
      } else {
        // Edit existing user
        const calculatedNumerology = calculateAllNumerology(userData.dateOfBirth, userData.fullName);
        updatedResults[managementModal.userIndex] = {
          ...updatedResults[managementModal.userIndex],
          fullName: userData.fullName,
          dateOfBirth: userData.dateOfBirth,
          timeOfBirth: userData.timeOfBirth,
          placeOfBirth: userData.placeOfBirth,
          relation: userData.relation || updatedResults[managementModal.userIndex].relation,
          gridData: calculatedNumerology.loshuGrid,
          numerologyData: calculatedNumerology
        };
      }

      // Update Firebase - Use existing timestamp to update the same record
      if (updatedResults.length > 0 && user?.uid && currentPhoneNumber && currentTimestamp) {
        const entriesRef = ref(database, `users/${currentPhoneNumber}/entries/${currentTimestamp}`);
        await set(entriesRef, {
          entries: updatedResults,
          phoneNumber: currentPhoneNumber,
          createdAt: new Date().toISOString(),
          userId: user.uid
        });

        console.log('Updated existing record:', currentTimestamp);
      }

      setAllResults(updatedResults);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const handleUserDelete = async () => {
    try {
      const updatedResults = allResults.filter((_, index) => index !== managementModal.userIndex);
      
      // Update Firebase - Use existing timestamp to update the same record
      if (user?.uid && currentPhoneNumber && currentTimestamp) {
        const entriesRef = ref(database, `users/${currentPhoneNumber}/entries/${currentTimestamp}`);
        await set(entriesRef, {
          entries: updatedResults,
          phoneNumber: currentPhoneNumber,
          createdAt: new Date().toISOString(),
          userId: user.uid
        });

        console.log('Updated existing record after deletion:', currentTimestamp);
      }

      setAllResults(updatedResults);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

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
                  <div className="flex justify-center gap-4 mb-8">
                    <Button 
                      onClick={handleNewEntry}
                      variant="outline"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      Create New Analysis
                    </Button>
                    <Button 
                      onClick={() => openUserModal('add')}
                      className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Family Member
                    </Button>
                  </div>
                </div>
                
                {/* Display Results with CRUD buttons */}
                {allResults.length === 1 ? (
                  // Single person - full width card
                  <div className="max-w-5xl mx-auto slide-up">
                    <Card className="shadow-xl border border-gray-200 bg-white rounded-xl">
                      <div className="absolute top-4 right-4 z-10">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openUserModal('edit', allResults[0], 0)}
                          className="flex items-center gap-2"
                        >
                          <Edit size={14} />
                          Edit
                        </Button>
                      </div>
                      <div className="p-6">
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
                    </Card>
                  </div>
                ) : (
                  // Multiple people - grid layout
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {allResults.map((result, index) => (
                      <div key={`result-${index}-${result.fullName}`} className="slide-up">
                        <Card className="shadow-xl border border-gray-200 bg-white rounded-xl h-full relative">
                          {/* CRUD Buttons */}
                          <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openUserModal('edit', result, index)}
                              className="flex items-center gap-1"
                            >
                              <Edit size={12} />
                            </Button>
                            {result.relation !== 'SELF' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setManagementModal({
                                    isOpen: true,
                                    mode: 'edit',
                                    userData: result,
                                    userIndex: index
                                  });
                                  handleUserDelete();
                                }}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={12} />
                              </Button>
                            )}
                          </div>

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

      {/* User Management Modal */}
      <UserManagementModal
        isOpen={managementModal.isOpen}
        onClose={closeUserModal}
        onSave={handleUserSave}
        onDelete={managementModal.mode === 'edit' && managementModal.userData?.relation !== 'SELF' ? handleUserDelete : undefined}
        userData={managementModal.userData}
        mode={managementModal.mode}
        isMainUser={managementModal.userData?.relation === 'SELF'}
      />

      {/* Spiritual Footer */}
      <SpiritualFooter />
    </div>
  );
};

export default Dashboard;
