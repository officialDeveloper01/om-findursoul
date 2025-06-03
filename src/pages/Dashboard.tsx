
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UserDataForm } from '@/components/UserDataForm';
import { LoshoGrid } from '@/components/LoshoGrid';
import { SearchTables } from '@/components/SearchTables';
import { calculateLoshoGrid } from '@/utils/gridCalculator';
import { ref, push } from 'firebase/database';
import { database } from '@/config/firebase';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [currentView, setCurrentView] = useState('form');
  const { user, logout } = useAuth();

  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    
    try {
      // Calculate grid
      const calculatedGrid = calculateLoshoGrid(data.dateOfBirth);
      
      // Prepare data for Firebase
      const tableData = {
        ...data,
        gridData: calculatedGrid.frequencies,
        createdAt: new Date().toISOString()
      };
      
      // Save to Firebase under user's UID
      const userRef = ref(database, `users/${user?.uid}`);
      await push(userRef, tableData);
      
      setUserData(data);
      setGridData(calculatedGrid);
      setCurrentView('grid');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleNewEntry = () => {
    setUserData(null);
    setGridData(null);
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
            New Table
          </Button>
          <Button 
            onClick={() => setCurrentView('search')}
            variant={currentView === 'search' ? 'default' : 'outline'}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Search Tables
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        {currentView === 'form' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-700 mb-4">
                Create Your Sacred Losho Grid
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Enter your birth details to calculate your personal numerology grid based on ancient Indian traditions.
              </p>
            </div>
            <UserDataForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {currentView === 'grid' && userData && gridData && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-light text-gray-700 mb-2">
                Your Sacred Losho Grid
              </h2>
              <p className="text-gray-600 mb-6">
                For {userData.fullName}
              </p>
              <Button 
                onClick={handleNewEntry}
                variant="outline"
                className="mb-8"
              >
                Create New Grid
              </Button>
            </div>
            <LoshoGrid gridData={gridData} userData={userData} />
          </div>
        )}

        {currentView === 'search' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-light text-gray-700 mb-4">
                Search Existing Tables
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Search for previously created Losho Grids by mobile number.
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
