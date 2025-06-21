import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ref, get, set, remove } from 'firebase/database';
import { database } from '@/config/firebase';
import { Phone, Calendar, MapPin, Clock, Edit, Plus, Trash2 } from 'lucide-react';
import { LoshoGrid } from './LoshoGrid';
import { UserManagementModal } from './UserManagementModal';
import { useAuth } from '@/hooks/useAuth';
import { calculateAllNumerology } from '@/utils/numerologyCalculator';

export const SearchTables = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedResults, setSelectedResults] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState('');
  const [managementModal, setManagementModal] = useState({
    isOpen: false,
    mode: 'add' as 'add' | 'edit',
    userData: null,
    userIndex: -1
  });
  const { user } = useAuth();

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    setSelectedResults([]);
    
    try {
      // Search by phone number directly
      const phoneRef = ref(database, `users/${mobileNumber}`);
      const snapshot = await get(phoneRef);
      const results: any[] = [];
      
      if (snapshot.exists()) {
        const phoneData = snapshot.val();
        
        if (phoneData.entries) {
          // Handle new structure with entries
          Object.keys(phoneData.entries).forEach(entryId => {
            const entryGroup = phoneData.entries[entryId];
            if (entryGroup.entries && Array.isArray(entryGroup.entries)) {
              // Each entryGroup contains multiple family members
              entryGroup.entries.forEach((entry: any, index: number) => {
                results.push({
                  id: `${entryId}-${index}`,
                  groupId: entryId,
                  phoneNumber: mobileNumber,
                  ...entry,
                  createdAt: entryGroup.createdAt
                });
              });
            }
          });
        }
      }
      
      console.log('Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching tables:', error);
    } finally {
      setLoading(false);
    }
  }, [mobileNumber]);

  const handleShowResults = useCallback((groupId: string) => {
    console.log('Showing results for group:', groupId);
    
    // Get all entries from the same group
    const groupResults = searchResults.filter(result => result.groupId === groupId);
    
    const formattedResults = groupResults.map(result => ({
      fullName: result.fullName,
      dateOfBirth: result.dateOfBirth,
      timeOfBirth: result.timeOfBirth,
      placeOfBirth: result.placeOfBirth,
      relation: result.relation,
      phoneNumber: result.phoneNumber,
      gridData: result.gridData,
      numerologyData: result.numerologyData
    }));
    
    // Store the current group ID for updates
    setCurrentGroupId(groupId);
    
    // iOS-safe state update
    requestAnimationFrame(() => {
      setSelectedResults(formattedResults);
    });
  }, [searchResults]);

  const handleBackToSearch = useCallback(() => {
    // iOS-safe state update
    requestAnimationFrame(() => {
      setSelectedResults([]);
      setCurrentGroupId('');
    });
  }, []);

  // CRUD Operations
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
      let updatedResults = [...selectedResults];
      
      if (managementModal.mode === 'add') {
        // Add new family member
        const calculatedNumerology = calculateAllNumerology(userData.dateOfBirth, userData.fullName);
        const newUser = {
          fullName: userData.fullName,
          dateOfBirth: userData.dateOfBirth,
          timeOfBirth: userData.timeOfBirth,
          placeOfBirth: userData.placeOfBirth,
          relation: userData.relation,
          phoneNumber: selectedResults[0]?.phoneNumber || mobileNumber,
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

      // Update Firebase - Update existing group instead of creating new one
      if (updatedResults.length > 0 && user?.uid) {
        const phoneNumber = selectedResults[0]?.phoneNumber || mobileNumber;
        
        if (phoneNumber && currentGroupId) {
          // Update the existing group entry
          const entriesRef = ref(database, `users/${phoneNumber}/entries/${currentGroupId}`);
          await set(entriesRef, {
            entries: updatedResults,
            phoneNumber: phoneNumber,
            createdAt: new Date().toISOString(),
            userId: user.uid
          });

          console.log('Updated existing group:', currentGroupId);
        }
      }

      setSelectedResults(updatedResults);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const handleUserDelete = async () => {
    try {
      const updatedResults = selectedResults.filter((_, index) => index !== managementModal.userIndex);
      
      // Update Firebase - Update existing group instead of creating new one
      if (user?.uid) {
        const phoneNumber = selectedResults[0]?.phoneNumber || mobileNumber;
        
        if (phoneNumber && currentGroupId) {
          if (updatedResults.length > 0) {
            // Update the existing group entry
            const entriesRef = ref(database, `users/${phoneNumber}/entries/${currentGroupId}`);
            await set(entriesRef, {
              entries: updatedResults,
              phoneNumber: phoneNumber,
              createdAt: new Date().toISOString(),
              userId: user.uid
            });
          } else {
            // If no users left, remove the entire group
            const entriesRef = ref(database, `users/${phoneNumber}/entries/${currentGroupId}`);
            await remove(entriesRef);
            
            // Check if this was the last group for this phone number
            const phoneRef = ref(database, `users/${phoneNumber}`);
            const snapshot = await get(phoneRef);
            if (snapshot.exists()) {
              const phoneData = snapshot.val();
              if (!phoneData.entries || Object.keys(phoneData.entries).length === 0) {
                // Remove the entire phone number entry if no groups left
                await remove(phoneRef);
              }
            }
          }

          console.log('Updated existing group after deletion:', currentGroupId);
        }
      }

      setSelectedResults(updatedResults);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // If showing results, display them in responsive grid with CRUD functionality
  if (selectedResults.length > 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <Button 
            onClick={handleBackToSearch}
            variant="outline"
            className="mb-6"
          >
            ← Back to Search Results
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h3 className="text-2xl font-light text-amber-600 mb-2">
            Family Reading Results
          </h3>
          <p className="text-amber-400">
            {selectedResults.length} member{selectedResults.length > 1 ? 's' : ''} found
          </p>
          <div className="flex justify-center gap-4 mt-4">
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
        {selectedResults.length === 1 ? (
          // Single person - full width card
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-xl border border-gray-200 bg-white rounded-xl relative">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openUserModal('edit', selectedResults[0], 0)}
                  className="flex items-center gap-2"
                >
                  <Edit size={14} />
                  Edit
                </Button>
              </div>
              <div className="p-6">
                <LoshoGrid 
                  gridData={{
                    frequencies: selectedResults[0].gridData,
                    grid: [],
                    originalDate: selectedResults[0].dateOfBirth,
                    digits: []
                  }} 
                  userData={{
                    fullName: selectedResults[0].fullName,
                    dateOfBirth: selectedResults[0].dateOfBirth,
                    timeOfBirth: selectedResults[0].timeOfBirth,
                    placeOfBirth: selectedResults[0].placeOfBirth,
                    numerologyData: selectedResults[0].numerologyData
                  }}
                />
              </div>
            </Card>
          </div>
        ) : (
          // Multiple people - grid layout
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {selectedResults.map((result, index) => (
              <div key={`search-result-${index}-${result.fullName}`}>
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
                      <h4 className="text-xl font-semibold text-blue-800 mb-3">
                        {result.fullName}
                      </h4>
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
      </div>
    );
  }

  // Group results by groupId for display
  const groupedResults = searchResults.reduce((groups, result) => {
    const groupId = result.groupId || result.id;
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(result);
    return groups;
  }, {});

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
              {loading ? 'Searching...' : 'Search Records'}
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
          
          {Object.keys(groupedResults).length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">No records found for this number.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedResults).map(([groupId, groupResults]: [string, any[]]) => (
                <Card key={groupId} className="shadow-md">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-800 text-center">
                        Family Reading ({groupResults.length} member{groupResults.length > 1 ? 's' : ''})
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupResults.slice(0, 2).map((result: any, index) => (
                          <div key={index} className="space-y-2">
                            <div className="font-medium text-gray-800">{result.fullName}</div>
                            <div className="inline-block px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                              {result.relation}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={14} />
                              <span>{result.dateOfBirth}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {groupResults.length > 2 && (
                        <div className="text-sm text-gray-500 text-center">
                          +{groupResults.length - 2} more member{groupResults.length - 2 > 1 ? 's' : ''}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center">
                        <Button 
                          onClick={() => handleShowResults(groupId)}
                          className="bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          Show Family Analysis
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500 text-center">
                      Created: {new Date(groupResults[0].createdAt).toLocaleDateString()}
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
