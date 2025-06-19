
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { calculatePratyantarDasha, calculateDainikDasha, planetMap } from '@/utils/antarDashaCalculator';

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
  userData?: any;
}

export const AntarDashaTable = ({ data, planet, startAge, onClose, isPreBirth = false, userData }: AntarDashaTableProps) => {
  const [expandedAntar, setExpandedAntar] = useState<number | null>(null);
  const [pratyantarData, setPratyantarData] = useState<any[]>([]);
  const [expandedPratyantar, setExpandedPratyantar] = useState<string | null>(null);
  const [dainikData, setDainikData] = useState<any[]>([]);

  if (!Array.isArray(data)) {
    return null;
  }

  const handleAntarRowClick = (index: number, row: AntarDashaRow) => {
    if (row.from === '–' || row.to === '–') {
      return;
    }

    if (expandedAntar === index) {
      setExpandedAntar(null);
      setPratyantarData([]);
      setExpandedPratyantar(null);
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
      setExpandedAntar(index);
      setExpandedPratyantar(null);
      setDainikData([]);
    } catch (error) {
      console.error('Error calculating Pratyantar Dasha:', error);
      setPratyantarData([]);
    }
  };

  const handlePratyantarRowClick = (pratyantarIndex: number, pratyantarRow: any, antarRow: AntarDashaRow) => {
    const rowKey = `${expandedAntar}-${pratyantarIndex}`;

    if (expandedPratyantar === rowKey) {
      setExpandedPratyantar(null);
      setDainikData([]);
      return;
    }

    try {
      const dainik = calculateDainikDasha(
        pratyantarRow.from,
        pratyantarRow.to,
        pratyantarRow.planetNumber,
        planet,
        antarRow.antar,
        pratyantarRow.pratyantar
      );
      
      setDainikData(dainik);
      setExpandedPratyantar(rowKey);
    } catch (error) {
      console.error('Error calculating Dainik Dasha:', error);
      setDainikData([]);
    }
  };

  const getTableTitle = () => {
    if (isPreBirth) {
      return `0 – ${startAge} Maha Dasha (Age -${startAge} - 0)`;
    }
    return `${planet} Maha Dasha (Age ${startAge - 9} - ${startAge})`;
  };

  return (
    <Card className="mt-6 shadow-lg border border-amber-200" style={{ fontFamily: 'Calibri, sans-serif' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-amber-700 mb-2 font-bold">
            {getTableTitle()}
          </CardTitle>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="overflow-x-auto p-2">
        <div className="grid grid-cols-5 gap-1 mb-2 bg-amber-50 p-2 rounded font-bold text-amber-800">
          <div className="text-center"></div>
          <div className="text-center">ANTAR</div>
          <div className="text-center">DAYS</div>
          <div className="text-center">FROM</div>
          <div className="text-center">TO</div>
        </div>

        {data.map((row, index) => (
          <div key={`antar-${index}`}>
            <div
              className={`grid grid-cols-5 gap-1 p-2 hover:bg-amber-25 transition-colors border-b border-gray-100 ${
                row.from !== '–' && row.to !== '–' ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleAntarRowClick(index, row)}
            >
              <div className="text-center">
                {row.from !== '–' && row.to !== '–' && (
                  expandedAntar === index ? (
                    <ChevronDown size={14} className="text-amber-600 mx-auto" />
                  ) : (
                    <ChevronRight size={14} className="text-amber-600 mx-auto" />
                  )
                )}
              </div>
              <div className="text-gray-800 font-bold text-center">{row.antar}</div>
              <div className="text-gray-600 font-bold text-center">{row.days}</div>
              <div className="text-gray-600 font-bold text-center whitespace-nowrap">{row.from}</div>
              <div className="text-gray-600 font-bold text-center whitespace-nowrap">{row.to}</div>
            </div>

            {expandedAntar === index && pratyantarData.length > 0 && (
              <div className="bg-orange-25 border-l-4 border-orange-300 ml-4 mr-1 my-2 rounded">
                <div className="p-3">
                  <h4 className="font-bold text-orange-700 mb-3">
                    Pratyantar Dasha – {planet} – {row.antar}
                  </h4>
                  
                  <div className="grid grid-cols-5 gap-1 mb-2 bg-orange-50 p-2 rounded font-bold text-orange-800">
                    <div className="text-center"></div>
                    <div className="text-center">PRATYANTAR</div>
                    <div className="text-center">DAYS</div>
                    <div className="text-center">FROM</div>
                    <div className="text-center">TO</div>
                  </div>

                  {pratyantarData.map((pratyRow, pratyIndex) => (
                    <div key={`pratyantar-${index}-${pratyIndex}`}>
                      <div
                        className="grid grid-cols-5 gap-1 p-2 hover:bg-orange-100 cursor-pointer transition-colors border-b border-orange-100"
                        onClick={() => handlePratyantarRowClick(pratyIndex, pratyRow, row)}
                      >
                        <div className="text-center">
                          {expandedPratyantar === `${index}-${pratyIndex}` ? (
                            <ChevronDown size={12} className="text-orange-600 mx-auto" />
                          ) : (
                            <ChevronRight size={12} className="text-orange-600 mx-auto" />
                          )}
                        </div>
                        <div className="text-gray-700 font-bold text-center">{pratyRow.pratyantar}</div>
                        <div className="text-gray-600 font-bold text-center">{pratyRow.days}</div>
                        <div className="text-gray-600 font-bold text-center whitespace-nowrap">{pratyRow.from}</div>
                        <div className="text-gray-600 font-bold text-center whitespace-nowrap">{pratyRow.to}</div>
                      </div>

                      {expandedPratyantar === `${index}-${pratyIndex}` && dainikData.length > 0 && (
                        <div className="bg-red-25 border-l-4 border-red-300 ml-6 mr-1 my-2 rounded">
                          <div className="p-2">
                            <h5 className="font-bold text-red-700 mb-2">
                              Dainik Dasha – {planet} – {row.antar} – {pratyRow.pratyantar}
                            </h5>
                            
                            <div className="grid grid-cols-4 gap-1 mb-2 bg-red-50 p-2 rounded font-bold text-red-800">
                              <div className="text-center">DAINIK</div>
                              <div className="text-center">DAYS</div>
                              <div className="text-center">FROM</div>
                              <div className="text-center">TO</div>
                            </div>

                            {dainikData.map((dainikRow, dainikIndex) => (
                              <div
                                key={`dainik-${index}-${pratyIndex}-${dainikIndex}`}
                                className="grid grid-cols-4 gap-1 p-2 border-b border-red-100"
                              >
                                <div className="text-gray-700 font-bold text-center">{dainikRow.dainik}</div>
                                <div className="text-gray-600 font-bold text-center">{dainikRow.days}</div>
                                <div className="text-gray-600 font-bold text-center whitespace-nowrap">{dainikRow.from}</div>
                                <div className="text-gray-600 font-bold text-center whitespace-nowrap">{dainikRow.to}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
