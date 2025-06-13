
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { calculatePratyantarDasha, calculateDainikDasha } from '@/utils/antarDashaCalculator';

interface AntarDashaRow {
  antar: string;
  days: number;
  from: string;
  to: string;
  planetNumber: number;
}

interface AntarDashaTableProps {
  data: AntarDashaRow[];
  planet: string;
  startAge: number;
  onClose: () => void;
}

export const AntarDashaTable = ({ data, planet, startAge, onClose }: AntarDashaTableProps) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [pratyantarData, setPratyantarData] = useState<any[]>([]);
  const [expandedPratyantarRow, setExpandedPratyantarRow] = useState<string | null>(null);
  const [dainikData, setDainikData] = useState<any[]>([]);

  const handleRowClick = useCallback(async (index: number, row: AntarDashaRow) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      setPratyantarData([]);
      setExpandedPratyantarRow(null);
      setDainikData([]);
      return;
    }

    try {
      const pratyantar = calculatePratyantarDasha(
        row.from,
        row.to,
        row.planetNumber,
        planet
      );
      
      setPratyantarData(pratyantar);
      setExpandedRow(index);
      setExpandedPratyantarRow(null);
      setDainikData([]);
    } catch (error) {
      console.error('Error calculating Pratyantar Dasha:', error);
    }
  }, [expandedRow, planet]);

  const handlePratyantarRowClick = useCallback(async (pratyantarIndex: number, pratyantarRow: any, antarRow: AntarDashaRow) => {
    const rowKey = `${expandedRow}-${pratyantarIndex}`;
    
    if (expandedPratyantarRow === rowKey) {
      setExpandedPratyantarRow(null);
      setDainikData([]);
      return;
    }

    try {
      const dainik = calculateDainikDasha(
        pratyantarRow.from,
        pratyantarRow.to,
        pratyantarRow.planetNumber || antarRow.planetNumber,
        planet,
        antarRow.antar,
        pratyantarRow.pratyantar
      );
      
      setDainikData(dainik);
      setExpandedPratyantarRow(rowKey);
    } catch (error) {
      console.error('Error calculating Dainik Dasha:', error);
    }
  }, [expandedRow, expandedPratyantarRow, planet]);

  return (
    <Card className="mt-6 shadow-lg border border-amber-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-amber-700">
            {planet} Maha Dasha (Age {startAge} - {startAge + 9})
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-amber-50 border-b border-amber-200">
                <th className="text-left py-2 px-3 font-semibold text-amber-800 w-8"></th>
                <th className="text-left py-2 px-3 font-semibold text-amber-800">ANTAR</th>
                <th className="text-left py-2 px-3 font-semibold text-amber-800">DAYS</th>
                <th className="text-left py-2 px-3 font-semibold text-amber-800">FROM</th>
                <th className="text-left py-2 px-3 font-semibold text-amber-800">TO</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <>
                  <tr 
                    key={index} 
                    className="hover:bg-amber-25 cursor-pointer transition-colors border-b border-gray-100"
                    onClick={() => handleRowClick(index, row)}
                  >
                    <td className="py-2 px-3 text-center">
                      {expandedRow === index ? (
                        <ChevronDown size={16} className="text-amber-600" />
                      ) : (
                        <ChevronRight size={16} className="text-amber-600" />
                      )}
                    </td>
                    <td className="py-2 px-3 font-medium text-gray-800">{row.antar}</td>
                    <td className="py-2 px-3 text-gray-600">{row.days}</td>
                    <td className="py-2 px-3 text-gray-600">{row.from}</td>
                    <td className="py-2 px-3 text-gray-600">{row.to}</td>
                  </tr>
                  
                  {expandedRow === index && pratyantarData.length > 0 && (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <div className="bg-orange-25 border-l-4 border-orange-300 mx-2 my-1">
                          <div className="p-3">
                            <h4 className="text-sm font-semibold text-orange-700 mb-2">
                              Pratyantar Dasha - {planet} - {row.antar}
                            </h4>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-orange-50">
                                  <th className="text-left py-1 px-2 font-medium text-orange-800 w-6"></th>
                                  <th className="text-left py-1 px-2 font-medium text-orange-800">PRATYANTAR</th>
                                  <th className="text-left py-1 px-2 font-medium text-orange-800">DAYS</th>
                                  <th className="text-left py-1 px-2 font-medium text-orange-800">FROM</th>
                                  <th className="text-left py-1 px-2 font-medium text-orange-800">TO</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pratyantarData.map((pratyRow, pratyIndex) => (
                                  <>
                                    <tr 
                                      key={pratyIndex} 
                                      className="hover:bg-orange-100 cursor-pointer transition-colors border-b border-orange-100"
                                      onClick={() => handlePratyantarRowClick(pratyIndex, pratyRow, row)}
                                    >
                                      <td className="py-1 px-2 text-center">
                                        {expandedPratyantarRow === `${index}-${pratyIndex}` ? (
                                          <ChevronDown size={12} className="text-orange-600" />
                                        ) : (
                                          <ChevronRight size={12} className="text-orange-600" />
                                        )}
                                      </td>
                                      <td className="py-1 px-2 font-medium text-gray-700">{pratyRow.pratyantar}</td>
                                      <td className="py-1 px-2 text-gray-600">{pratyRow.days}</td>
                                      <td className="py-1 px-2 text-gray-600">{pratyRow.from}</td>
                                      <td className="py-1 px-2 text-gray-600">{pratyRow.to}</td>
                                    </tr>
                                    
                                    {expandedPratyantarRow === `${index}-${pratyIndex}` && dainikData.length > 0 && (
                                      <tr>
                                        <td colSpan={5} className="p-0">
                                          <div className="bg-red-25 border-l-4 border-red-300 mx-2 my-1">
                                            <div className="p-2">
                                              <h5 className="text-xs font-semibold text-red-700 mb-1">
                                                Dainik Dasha - {planet} - {row.antar} - {pratyRow.pratyantar}
                                              </h5>
                                              <table className="w-full text-xs">
                                                <thead>
                                                  <tr className="bg-red-50">
                                                    <th className="text-left py-1 px-2 font-medium text-red-800">DAINIK</th>
                                                    <th className="text-left py-1 px-2 font-medium text-red-800">DAYS</th>
                                                    <th className="text-left py-1 px-2 font-medium text-red-800">FROM</th>
                                                    <th className="text-left py-1 px-2 font-medium text-red-800">TO</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {dainikData.map((dainikRow, dainikIndex) => (
                                                    <tr key={dainikIndex} className="border-b border-red-100">
                                                      <td className="py-1 px-2 font-medium text-gray-700">{dainikRow.dainik}</td>
                                                      <td className="py-1 px-2 text-gray-600">{dainikRow.days}</td>
                                                      <td className="py-1 px-2 text-gray-600">{dainikRow.from}</td>
                                                      <td className="py-1 px-2 text-gray-600">{dainikRow.to}</td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
