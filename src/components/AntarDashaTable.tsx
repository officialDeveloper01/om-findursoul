
import { useState } from 'react';
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
  isPreBirth?: boolean;
}

export const AntarDashaTable = ({ data, planet, startAge, onClose, isPreBirth = false }: AntarDashaTableProps) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [pratyantarData, setPratyantarData] = useState<any[]>([]);
  const [expandedPratyantarRow, setExpandedPratyantarRow] = useState<string | null>(null);
  const [dainikData, setDainikData] = useState<any[]>([]);

  // Validate data is an array before rendering
  if (!Array.isArray(data)) {
    return null;
  }

  const formatDateCell = (date: string) => {
    return (
      <div className="date-cell whitespace-nowrap font-bold">
        {date}
      </div>
    );
  };

  const handleRowClick = async (index: number, row: AntarDashaRow) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      setPratyantarData([]);
      return;
    }

    try {
      const pratyantar = calculatePratyantarDasha(row.from, row.to, row.planetNumber, planet);
      setPratyantarData(pratyantar);
      setExpandedRow(index);
    } catch (error) {
      console.error('Error calculating Pratyantar Dasha:', error);
    }
  };

  const handlePratyantarRowClick = async (pratyantarIndex: number, pratyantarRow: any, antarRow: AntarDashaRow) => {
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
  };

  const getTableTitle = () => {
    if (isPreBirth) {
      return `Birth Maha Dasha (Age ${planet})`;
    }
    return `${planet} Maha Dasha (Age ${startAge - 9} - ${startAge})`;
  };

  return (
    <Card className="mt-6 shadow-lg border border-amber-200 font-calibri">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="font-bold text-amber-700">
            {getTableTitle()}
          </CardTitle>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {/* Main Antar Dasha Table with Clean Borders */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 bg-gray-100 border-b border-gray-300">
            <div className="font-bold text-gray-800 py-2 px-2 border-r border-gray-300 text-center"></div>
            <div className="font-bold text-gray-800 py-2 px-2 border-r border-gray-300">ANTAR</div>
            <div className="font-bold text-gray-800 py-2 px-2 border-r border-gray-300">DAYS</div>
            <div className="font-bold text-gray-800 py-2 px-2 border-r border-gray-300">FROM</div>
            <div className="font-bold text-gray-800 py-2 px-2">TO</div>
          </div>

          {/* Table Body */}
          <div>
            {data.map((row, index) => (
              <div key={index}>
                {/* Main Antar Row */}
                <div
                  className="grid grid-cols-5 hover:bg-amber-25 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                  onClick={() => handleRowClick(index, row)}
                >
                  <div className="text-center py-2 px-2 border-r border-gray-300">
                    {expandedRow === index ? (
                      <ChevronDown size={16} className="text-amber-600 mx-auto" />
                    ) : (
                      <ChevronRight size={16} className="text-amber-600 mx-auto" />
                    )}
                  </div>
                  <div className="text-gray-800 font-bold py-2 px-2 border-r border-gray-300">{row.antar}</div>
                  <div className="text-gray-600 font-bold py-2 px-2 border-r border-gray-300">{row.days}</div>
                  <div className="text-gray-600 py-2 px-2 border-r border-gray-300">{formatDateCell(row.from)}</div>
                  <div className="text-gray-600 py-2 px-2">{formatDateCell(row.to)}</div>
                </div>

                {/* Expanded Pratyantar Content */}
                {expandedRow === index && pratyantarData.length > 0 && (
                  <div className="bg-orange-25 border-t border-orange-300">
                    <div className="p-4">
                      <h4 className="font-bold text-orange-700 mb-3">
                        Pratyantar Dasha – {planet} – {row.antar}
                      </h4>
                      <div className="border border-orange-300 rounded-lg overflow-hidden">
                        {/* Pratyantar Header */}
                        <div className="grid grid-cols-5 bg-orange-50 border-b border-orange-300">
                          <div className="font-bold text-orange-800 py-2 px-2 border-r border-orange-300 text-center"></div>
                          <div className="font-bold text-orange-800 py-2 px-2 border-r border-orange-300">PRATYANTAR</div>
                          <div className="font-bold text-orange-800 py-2 px-2 border-r border-orange-300">DAYS</div>
                          <div className="font-bold text-orange-800 py-2 px-2 border-r border-orange-300">FROM</div>
                          <div className="font-bold text-orange-800 py-2 px-2">TO</div>
                        </div>
                        
                        {/* Pratyantar Body */}
                        <div>
                          {pratyantarData.map((pratyRow, pratyIndex) => (
                            <div key={pratyIndex}>
                              {/* Pratyantar Row */}
                              <div
                                className="grid grid-cols-5 hover:bg-orange-100 cursor-pointer border-b border-orange-200 last:border-b-0"
                                onClick={() => handlePratyantarRowClick(pratyIndex, pratyRow, row)}
                              >
                                <div className="text-center py-2 px-2 border-r border-orange-300">
                                  {expandedPratyantarRow === `${index}-${pratyIndex}` ? (
                                    <ChevronDown size={14} className="text-orange-600 mx-auto" />
                                  ) : (
                                    <ChevronRight size={14} className="text-orange-600 mx-auto" />
                                  )}
                                </div>
                                <div className="text-gray-700 font-bold py-2 px-2 border-r border-orange-300">{pratyRow.pratyantar}</div>
                                <div className="text-gray-600 font-bold py-2 px-2 border-r border-orange-300">{pratyRow.days}</div>
                                <div className="text-gray-600 py-2 px-2 border-r border-orange-300">{formatDateCell(pratyRow.from)}</div>
                                <div className="text-gray-600 py-2 px-2">{formatDateCell(pratyRow.to)}</div>
                              </div>

                              {/* Expanded Dainik Content */}
                              {expandedPratyantarRow === `${index}-${pratyIndex}` && dainikData.length > 0 && (
                                <div className="bg-red-25 border-t border-red-300">
                                  <div className="p-3">
                                    <h5 className="font-bold text-red-700 mb-2">
                                      Dainik Dasha – {planet} – {row.antar} – {pratyRow.pratyantar}
                                    </h5>
                                    <div className="border border-red-300 rounded-lg overflow-hidden">
                                      {/* Dainik Header */}
                                      <div className="grid grid-cols-4 bg-red-50 border-b border-red-300">
                                        <div className="font-bold text-red-800 py-2 px-2 border-r border-red-300">DAINIK</div>
                                        <div className="font-bold text-red-800 py-2 px-2 border-r border-red-300">DAYS</div>
                                        <div className="font-bold text-red-800 py-2 px-2 border-r border-red-300">FROM</div>
                                        <div className="font-bold text-red-800 py-2 px-2">TO</div>
                                      </div>
                                      
                                      {/* Dainik Body */}
                                      <div>
                                        {dainikData.map((dainikRow, dainikIndex) => (
                                          <div key={dainikIndex} className="grid grid-cols-4 border-b border-red-200 last:border-b-0">
                                            <div className="text-gray-700 font-bold py-2 px-2 border-r border-red-300">{dainikRow.dainik}</div>
                                            <div className="text-gray-600 font-bold py-2 px-2 border-r border-red-300">{dainikRow.days}</div>
                                            <div className="text-gray-600 py-2 px-2 border-r border-red-300">{formatDateCell(dainikRow.from)}</div>
                                            <div className="text-gray-600 py-2 px-2">{formatDateCell(dainikRow.to)}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
