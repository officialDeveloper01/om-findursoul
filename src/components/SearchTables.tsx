
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ref, get } from 'firebase/database';
import { database } from '@/config/firebase';
import { Phone, Calendar, MapPin, Clock } from 'lucide-react';
import { LoshoGrid } from './LoshoGrid';

export const SearchTables = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setSelectedGrid(null);
    setSelectedUserData(null);
    
    try {
      // Search across all users for tables with matching mobile number
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      const results: any[] = [];
      
      if (snapshot.exists()) {
        const users = snapshot.val();
        Object.keys(users).forEach(userId => {
          const userTables = users[userId];
          Object.keys(userTables).forEach(tableId => {
            const table = userTables[tableId];
            if (table.mobileNumber === mobileNumber) {
              results.push({
                id: tableId,
                userId,
                ...table
              });
            }
          });
        });
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowGrid = (result: any) => {
    console.log('Showing grid for result:', result);
    
    // Prepare grid data from stored frequencies
    const gridData = {
      frequencies: result.gridData || {},
      grid: [],
      originalDate: result.dateOfBirth,
      digits: []
    };
    
    // Prepare user data
    const userData = {
      fullName: result.fullName,
      dateOfBirth: result.dateOfBirth,
      timeOfBirth: result.timeOfBirth,
      placeOfBirth: result.placeOfBirth,
      mobileNumber: result.mobileNumber
    };
    
    setSelectedGrid(gridData);
    setSelectedUserData(userData);
  };

  const handleBackToSearch = () => {
    setSelectedGrid(null);
    setSelectedUserData(null);
  };

  // If showing a grid, display it
  if (selectedGrid && selectedUserData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <Button 
            onClick={handleBackToSearch}
            variant="outline"
            className="mb-6"
          >
            ← Back to Search Results
          </Button>
        </div>
        <LoshoGrid gridData={selectedGrid} userData={selectedUserData} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-light text-gray-700">
            Search by Mobile Number
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobileSearch" className="flex items-center gap-2 text-gray-700">
                <Phone size={16} />
                Mobile Number
              </Label>
              <Input
                id="mobileSearch"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Tables'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searched && (
        <div className="space-y-4">
          <h3 className="text-xl font-light text-gray-700 text-center">
            Search Results for {mobileNumber}
          </h3>
          
          {searchResults.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">No records found for this number.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {searchResults.map((result: any, index) => (
                <Card key={result.id} className="shadow-md">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">{result.fullName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span>{result.dateOfBirth}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} />
                          <span>{result.timeOfBirth}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} />
                          <span>{result.placeOfBirth}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <Button 
                          onClick={() => handleShowGrid(result)}
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Show Grid
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Created: {new Date(result.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
