
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UserDataForm } from '@/components/UserDataForm';
import { LoshoGrid } from '@/components/LoshoGrid';
import { NumerologyDisplay } from '@/components/NumerologyDisplay';
import { SearchTables } from '@/components/SearchTables';
import { calculateLoshoGrid } from '@/utils/gridCalculator';
import { calculateAllNumerology } from '@/utils/numerologyCalculator';
import { ref, push } from 'firebase/database';
import { database } from '@/config/firebase';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [numerologyData, setNumerologyData] = useState(null);
  const [currentView, setCurrentView] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();

  const handleFormSubmit = async (data) => {
    console.log('Form submitted:', data);
    setIsLoading(true);
    
    try {
      // Calculate grid and numerology
      const calculatedGrid = calculateLoshoGrid(data.dateOfBirth);
      const calculatedNumerology = calculateAllNumerology(data.dateOfBirth);
      
      console.log('Grid calculated:', calculatedGrid);
      console.log('Numerology calculated:', calculatedNumerology);
      
      // Prepare data for Firebase
      const tableData = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        timeOfBirth: data.timeOfBirth,
        placeOfBirth: data.placeOfBirth,
        mobileNumber: data.mobileNumber,
        gridData: calculatedGrid.frequencies,
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
      
      // Update UI state
      setUserData(data);
      setGridData(calculatedGrid);
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 tracking-wider">OM</h1>
            <p className="text-lg text-amber-600 font-light tracking-widest">HEAL YOUR SOUL</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.email}</span>
            <Button onClick={logout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => setCurrentView('form')}
            variant={currentView === 'form' ? 'default' : 'outline'}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            New Analysis
          </Button>
          <Button 
            onClick={() => setCurrentView('search')}
            variant={currentView === 'search' ? 'default' : 'outline'}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Search Records
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        {isLoading && (
          <div className="text-center mb-8">
            <div className="text-amber-600 text-lg">Calculating your sacred numbers...</div>
          </div>
        )}

        {currentView === 'form' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-700 mb-4">
                Numerology & Losho Grid Analysis
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Enter your birth details to calculate your personal numerology and sacred grid.
              </p>
            </div>
            <UserDataForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {currentView === 'results' && userData && (gridData || numerologyData) && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-light text-gray-700 mb-2">
                Your Analysis Results
              </h2>
              <p className="text-gray-600 mb-6">
                For {userData.fullName}
              </p>
              <Button 
                onClick={handleNewEntry}
                variant="outline"
                className="mb-8"
              >
                Create New Analysis
              </Button>
            </div>
            
            {numerologyData && (
              <NumerologyDisplay 
                numerologyData={numerologyData} 
                userData={userData} 
              />
            )}
            
            {gridData && (
              <LoshoGrid gridData={gridData} userData={userData} />
            )}
          </div>
        )}

        {currentView === 'search' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-700 mb-4">
                Search Existing Records
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Search for previously created analyses by mobile number.
              </p>
            </div>
            <SearchTables />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
