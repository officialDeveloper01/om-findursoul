
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  userData?: any;
}

export const AntarDashaTable = ({ data, planet, startAge, onClose, isPreBirth = false, userData }: AntarDashaTableProps) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [pratyantarData, setPratyantarData] = useState<any[]>([]);
  const [expandedPratyantarRow, setExpandedPratyantarRow] = useState<string | null>(null);
  const [dainikData, setDainikData] = useState<any[]>([]);

  if (!Array.isArray(data)) {
    return null;
  }

  const formatDateCell = (date: string) => {
    // Fix: Always show date in one line for mobile
    return (
      <div className="text-xs whitespace-nowrap">
        <span>{date}</span>
      </div>
    );
  };

  const handleRowClick = async (index: number, row: AntarDashaRow) => {
    // Skip rows with no valid dates (e.g., "–" entries)
    if (row.from === '–' || row.to === '–') {
      return;
    }

    if (expandedRow === index) {
      setExpandedRow(null);
      setPratyantarData([]);
      setExpandedPratyantarRow(null);
      setDainikData([]);
      return;
    }

    try {
      console.log('Calculating Pratyantar for row:', row);
      const pratyantar = calculatePratyantarDasha(row.from, row.to, row.planetNumber, planet);
      setPratyantarData(pratyantar);
      setExpandedRow(index);
      setExpandedPratyantarRow(null);
      setDainikData([]);
    } catch (error) {
      console.error('Error calculating Pratyantar Dasha:', error);
      setPratyantarData([]);
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
      console.log('Calculating Dainik for pratyantar row:', pratyantarRow);
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
          <div className="flex-1">
            <CardTitle className="text-lg text-amber-700 mb-2 font-bold">
              {getTableTitle()}
            </CardTitle>
          </div>
          
          <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 ml-2">
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-2">
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50">
              <TableHead className="w-6 px-1 py-1 text-xs text-amber-800 font-bold"></TableHead>
              <TableHead className="px-1 py-1 text-xs text-amber-800 whitespace-nowrap font-bold">ANTAR</TableHead>
              <TableHead className="px-1 py-1 text-xs text-amber-800 whitespace-nowrap font-bold">DAYS</TableHead>
              <TableHead className="px-1 py-1 text-xs text-amber-800 whitespace-nowrap font-bold">FROM</TableHead>
              <TableHead className="px-1 py-1 text-xs text-amber-800 whitespace-nowrap font-bold">TO</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, index) => (
              <>
                <TableRow
                  key={index}
                  className={`hover:bg-amber-25 transition-colors ${row.from !== '–' && row.to !== '–' ? 'cursor-pointer' : ''}`}
                  onClick={() => handleRowClick(index, row)}
                >
                  <TableCell className="text-center px-1 py-1">
                    {row.from !== '–' && row.to !== '–' && (
                      expandedRow === index ? (
                        <ChevronDown size={14} className="text-amber-600" />
                      ) : (
                        <ChevronRight size={14} className="text-amber-600" />
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-gray-800 font-bold px-1 py-1 text-sm">{row.antar}</TableCell>
                  <TableCell className="text-gray-600 font-bold px-1 py-1 text-sm">{row.days}</TableCell>
                  <TableCell className="text-gray-600 font-bold px-1 py-1 text-sm">{formatDateCell(row.from)}</TableCell>
                  <TableCell className="text-gray-600 font-bold px-1 py-1 text-sm">{formatDateCell(row.to)}</TableCell>
                </TableRow>

                {expandedRow === index && pratyantarData.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <div className="bg-orange-25 border-l-4 border-orange-300 ml-2 mr-1 my-1">
                        <div className="p-2">
                          <h4 className="text-sm font-bold text-orange-700 mb-2">
                            Pratyantar Dasha – {planet} – {row.antar}
                          </h4>
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-orange-50">
                                <TableHead className="w-6 text-orange-800 text-xs font-bold px-1 py-1"></TableHead>
                                <TableHead className="text-orange-800 text-xs font-bold px-1 py-1">PRATYANTAR</TableHead>
                                <TableHead className="text-orange-800 text-xs font-bold px-1 py-1">DAYS</TableHead>
                                <TableHead className="text-orange-800 text-xs font-bold px-1 py-1">FROM</TableHead>
                                <TableHead className="text-orange-800 text-xs font-bold px-1 py-1">TO</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pratyantarData.map((pratyRow, pratyIndex) => (
                                <>
                                  <TableRow
                                    key={pratyIndex}
                                    className="text-xs hover:bg-orange-100 cursor-pointer"
                                    onClick={() => handlePratyantarRowClick(pratyIndex, pratyRow, row)}
                                  >
                                    <TableCell className="text-center px-1 py-1">
                                      {expandedPratyantarRow === `${index}-${pratyIndex}` ? (
                                        <ChevronDown size={12} className="text-orange-600" />
                                      ) : (
                                        <ChevronRight size={12} className="text-orange-600" />
                                      )}
                                    </TableCell>
                                    <TableCell className="text-gray-700 font-bold px-1 py-1 text-xs">{pratyRow.pratyantar}</TableCell>
                                    <TableCell className="text-gray-600 font-bold px-1 py-1 text-xs">{pratyRow.days}</TableCell>
                                    <TableCell className="text-gray-600 font-bold px-1 py-1 text-xs">{formatDateCell(pratyRow.from)}</TableCell>
                                    <TableCell className="text-gray-600 font-bold px-1 py-1 text-xs">{formatDateCell(pratyRow.to)}</TableCell>
                                  </TableRow>

                                  {expandedPratyantarRow === `${index}-${pratyIndex}` && dainikData.length > 0 && (
                                    <TableRow>
                                      <TableCell colSpan={5} className="p-0">
                                        <div className="bg-red-25 border-l-4 border-red-300 ml-4 mr-1 my-1">
                                          <div className="p-1">
                                            <h5 className="text-xs font-bold text-red-700 mb-1">
                                              Dainik Dasha – {planet} – {row.antar} – {pratyRow.pratyantar}
                                            </h5>
                                            <Table>
                                              <TableHeader>
                                                <TableRow className="bg-red-50">
                                                  <TableHead className="text-red-800 text-xs font-bold px-1 py-1">DAINIK</TableHead>
                                                  <TableHead className="text-red-800 text-xs font-bold px-1 py-1">DAYS</TableHead>
                                                  <TableHead className="text-red-800 text-xs font-bold px-1 py-1">FROM</TableHead>
                                                  <TableHead className="text-red-800 text-xs font-bold px-1 py-1">TO</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {dainikData.map((dainikRow, dainikIndex) => (
                                                  <TableRow key={dainikIndex} className="text-xs">
                                                    <TableCell className="text-gray-700 font-bold px-1 py-1 text-xs">{dainikRow.dainik}</TableCell>
                                                    <TableCell className="text-gray-600 font-bold px-1 py-1 text-xs">{dainikRow.days}</TableCell>
                                                    <TableCell className="text-gray-600 font-bold px-1 py-1 text-xs">{formatDateCell(dainikRow.from)}</TableCell>
                                                    <TableCell className="text-gray-600 font-bold px-1 py-1 text-xs">{formatDateCell(dainikRow.to)}</TableCell>
                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>
                                          </div>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
