
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { calculatePratyantarDasha, calculateDainikDasha } from '@/utils/antarDashaCalculator';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';

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
  const isMobile = useIsMobile();

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

  const formatDateForMobile = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      dayMonth: format(date, "dd/MM"),
      year: format(date, "yyyy")
    };
  };

  const renderMobileRow = (row: AntarDashaRow, index: number) => {
    const fromFormatted = formatDateForMobile(row.from);
    const toFormatted = formatDateForMobile(row.to);
    
    return (
      <div key={`antar-mobile-${index}-${row.antar}`} className="border-b border-gray-100">
        <div 
          className="p-3 cursor-pointer hover:bg-amber-25 transition-colors"
          onClick={() => handleRowClick(index, row)}
        >
          <div className="flex justify-between items-center text-sm font-semibold">
            <div className="flex items-center gap-2">
              {expandedRow === index ? (
                <ChevronDown size={14} className="text-amber-600" />
              ) : (
                <ChevronRight size={14} className="text-amber-600" />
              )}
              <span className="text-gray-800">{row.antar}</span>
            </div>
            <span className="text-gray-600">{row.days} days</span>
            <span className="text-gray-600">{fromFormatted.dayMonth} - {toFormatted.dayMonth}</span>
          </div>
          <div className="flex justify-end text-xs text-gray-500 mt-1">
            <span className="mr-8">{fromFormatted.year}</span>
            <span>{toFormatted.year}</span>
          </div>
        </div>
        
        {expandedRow === index && pratyantarData.length > 0 && (
          <div className="bg-orange-25 border-l-4 border-orange-300 mx-2 my-1">
            <div className="p-2">
              <h4 className="text-xs font-semibold text-orange-700 mb-2">
                Pratyantar Dasha - {planet} - {row.antar}
              </h4>
              {pratyantarData.map((pratyRow, pratyIndex) => {
                const pratyFromFormatted = formatDateForMobile(pratyRow.from);
                const pratyToFormatted = formatDateForMobile(pratyRow.to);
                
                return (
                  <div key={`pratyantar-mobile-${index}-${pratyIndex}-${pratyRow.pratyantar}`}>
                    <div 
                      className="p-2 cursor-pointer hover:bg-orange-100 transition-colors border-b border-orange-100"
                      onClick={() => handlePratyantarRowClick(pratyIndex, pratyRow, row)}
                    >
                      <div className="flex justify-between items-center text-xs font-medium">
                        <div className="flex items-center gap-1">
                          {expandedPratyantarRow === `${index}-${pratyIndex}` ? (
                            <ChevronDown size={10} className="text-orange-600" />
                          ) : (
                            <ChevronRight size={10} className="text-orange-600" />
                          )}
                          <span className="text-gray-700">{pratyRow.pratyantar}</span>
                        </div>
                        <span className="text-gray-600">{pratyRow.days} days</span>
                        <span className="text-gray-600">{pratyFromFormatted.dayMonth} - {pratyToFormatted.dayMonth}</span>
                      </div>
                      <div className="flex justify-end text-xs text-gray-500 mt-1">
                        <span className="mr-6">{pratyFromFormatted.year}</span>
                        <span>{pratyToFormatted.year}</span>
                      </div>
                    </div>
                    
                    {expandedPratyantarRow === `${index}-${pratyIndex}` && dainikData.length > 0 && (
                      <div className="bg-red-25 border-l-4 border-red-300 mx-1 my-1">
                        <div className="p-1">
                          <h5 className="text-xs font-semibold text-red-700 mb-1">
                            Dainik Dasha - {planet} - {row.antar} - {pratyRow.pratyantar}
                          </h5>
                          {dainikData.map((dainikRow, dainikIndex) => {
                            const dainikFromFormatted = formatDateForMobile(dainikRow.from);
                            const dainikToFormatted = formatDateForMobile(dainikRow.to);
                            
                            return (
                              <div key={`dainik-mobile-${index}-${pratyIndex}-${dainikIndex}-${dainikRow.dainik}`} className="p-1 border-b border-red-100">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-gray-700 font-medium">{dainikRow.dainik}</span>
                                  <span className="text-gray-600">{dainikRow.days} days</span>
                                  <span className="text-gray-600">{dainikFromFormatted.dayMonth} - {dainikToFormatted.dayMonth}</span>
                                </div>
                                <div className="flex justify-end text-xs text-gray-500 mt-1">
                                  <span className="mr-6">{dainikFromFormatted.year}</span>
                                  <span>{dainikToFormatted.year}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="mt-6 shadow-lg border border-amber-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg md:text-xl text-amber-700">
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
        {isMobile ? (
          // Mobile view - Card-based layout
          <div className="w-full">
            {data.map((row, index) => renderMobileRow(row, index))}
          </div>
        ) : (
          // Desktop view - Original table layout
          <div className="w-full overflow-visible">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="bg-amber-50 border-b border-amber-200">
                  <th className="text-left py-1 px-2 font-semibold text-amber-800 w-4"></th>
                  <th className="text-left py-1 px-2 font-semibold text-amber-800">ANTAR</th>
                  <th className="text-left py-1 px-2 font-semibold text-amber-800">DAYS</th>
                  <th className="text-left py-1 px-2 font-semibold text-amber-800">FROM</th>
                  <th className="text-left py-1 px-2 font-semibold text-amber-800">TO</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <>
                    <tr 
                      key={`antar-desktop-${index}-${row.antar}`}
                      className="hover:bg-amber-25 cursor-pointer transition-colors border-b border-gray-100"
                      onClick={() => handleRowClick(index, row)}
                    >
                      <td className="py-1 px-2 text-center">
                        {expandedRow === index ? (
                          <ChevronDown size={14} className="text-amber-600" />
                        ) : (
                          <ChevronRight size={14} className="text-amber-600" />
                        )}
                      </td>
                      <td className="py-1 px-2 font-medium text-gray-800 text-xs md:text-sm">{row.antar}</td>
                      <td className="py-1 px-2 text-gray-600 text-xs">{row.days}</td>
                      <td className="py-1 px-2 text-gray-600 text-xs">{row.from}</td>
                      <td className="py-1 px-2 text-gray-600 text-xs">{row.to}</td>
                    </tr>
                    
                    {expandedRow === index && pratyantarData.length > 0 && (
                      <tr key={`pratyantar-container-desktop-${index}`}>
                        <td colSpan={5} className="p-0">
                          <div className="bg-orange-25 border-l-4 border-orange-300 mx-1 my-1">
                            <div className="p-2">
                              <h4 className="text-xs font-semibold text-orange-700 mb-1">
                                Pratyantar Dasha - {planet} - {row.antar}
                              </h4>
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-orange-50">
                                    <th className="text-left py-1 px-1 font-medium text-orange-800 w-4"></th>
                                    <th className="text-left py-1 px-1 font-medium text-orange-800">PRATYANTAR</th>
                                    <th className="text-left py-1 px-1 font-medium text-orange-800">DAYS</th>
                                    <th className="text-left py-1 px-1 font-medium text-orange-800">FROM</th>
                                    <th className="text-left py-1 px-1 font-medium text-orange-800">TO</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {pratyantarData.map((pratyRow, pratyIndex) => (
                                    <>
                                      <tr 
                                        key={`pratyantar-desktop-${index}-${pratyIndex}-${pratyRow.pratyantar}`}
                                        className="hover:bg-orange-100 cursor-pointer transition-colors border-b border-orange-100"
                                        onClick={() => handlePratyantarRowClick(pratyIndex, pratyRow, row)}
                                      >
                                        <td className="py-1 px-1 text-center">
                                          {expandedPratyantarRow === `${index}-${pratyIndex}` ? (
                                            <ChevronDown size={10} className="text-orange-600" />
                                          ) : (
                                            <ChevronRight size={10} className="text-orange-600" />
                                          )}
                                        </td>
                                        <td className="py-1 px-1 font-medium text-gray-700 text-xs">{pratyRow.pratyantar}</td>
                                        <td className="py-1 px-1 text-gray-600 text-xs">{pratyRow.days}</td>
                                        <td className="py-1 px-1 text-gray-600 text-xs">{pratyRow.from}</td>
                                        <td className="py-1 px-1 text-gray-600 text-xs">{pratyRow.to}</td>
                                      </tr>
                                      
                                      {expandedPratyantarRow === `${index}-${pratyIndex}` && dainikData.length > 0 && (
                                        <tr key={`dainik-container-desktop-${index}-${pratyIndex}`}>
                                          <td colSpan={5} className="p-0">
                                            <div className="bg-red-25 border-l-4 border-red-300 mx-1 my-1">
                                              <div className="p-1">
                                                <h5 className="text-xs font-semibold text-red-700 mb-1">
                                                  Dainik Dasha - {planet} - {row.antar} - {pratyRow.pratyantar}
                                                </h5>
                                                <table className="w-full text-xs">
                                                  <thead>
                                                    <tr className="bg-red-50">
                                                      <th className="text-left py-1 px-1 font-medium text-red-800">DAINIK</th>
                                                      <th className="text-left py-1 px-1 font-medium text-red-800">DAYS</th>
                                                      <th className="text-left py-1 px-1 font-medium text-red-800">FROM</th>
                                                      <th className="text-left py-1 px-1 font-medium text-red-800">TO</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {dainikData.map((dainikRow, dainikIndex) => (
                                                      <tr key={`dainik-desktop-${index}-${pratyIndex}-${dainikIndex}-${dainikRow.dainik}`} className="border-b border-red-100">
                                                        <td className="py-1 px-1 font-medium text-gray-700 text-xs">{dainikRow.dainik}</td>
                                                        <td className="py-1 px-1 text-gray-600 text-xs">{dainikRow.days}</td>
                                                        <td className="py-1 px-1 text-gray-600 text-xs">{dainikRow.from}</td>
                                                        <td className="py-1 px-1 text-gray-600 text-xs">{dainikRow.to}</td>
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
        )}
      </CardContent>
    </Card>
  );
};
