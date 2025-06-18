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
    const [day, month, year] = date.split('/');
    return (
      <div className="flex flex-col text-xs sm:flex-row sm:items-center sm:gap-1">
        <span>{day}/{month}</span>
        <span>{year}</span>
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
    return `0 – ${startAge} Maha Dasha (Age -${startAge} - 0)`;
  }
  return `${planet} Maha Dasha (Age ${startAge - 9} - ${startAge})`;
};


  return (
    <Card className="mt-6 shadow-lg border border-amber-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-amber-700">
            {getTableTitle()}
          </CardTitle>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-amber-50">
              <TableHead className="w-6 px-1 py-0.5 text-xs text-amber-800"></TableHead>
              <TableHead className="px-1 py-0.5 text-xs text-amber-800 whitespace-nowrap">ANTAR</TableHead>
              <TableHead className="px-1 py-0.5 text-xs text-amber-800 whitespace-nowrap">DAYS</TableHead>
              <TableHead className="px-1 py-0.5 text-xs text-amber-800 whitespace-nowrap">FROM</TableHead>
              <TableHead className="px-1 py-0.5 text-xs text-amber-800 whitespace-nowrap">TO</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, index) => (
              <>
                <TableRow
                  key={index}
                  className="hover:bg-amber-25 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(index, row)}
                >
                  <TableCell className="text-center">
                    {expandedRow === index ? (
                      <ChevronDown size={16} className="text-amber-600" />
                    ) : (
                      <ChevronRight size={16} className="text-amber-600" />
                    )}
                  </TableCell>
                  <TableCell className="text-gray-800 font-medium">{row.antar}</TableCell>
                  <TableCell className="text-gray-600">{row.days}</TableCell>
                  <TableCell className="text-gray-600 text-xs sm:text-sm">{formatDateCell(row.from)}</TableCell>
                  <TableCell className="text-gray-600 text-xs sm:text-sm">{formatDateCell(row.to)}</TableCell>
                </TableRow>

                {expandedRow === index && pratyantarData.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <div className="bg-orange-25 border-l-4 border-orange-300 ml-4 mr-2 my-2">
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-orange-700 mb-3">
                            Pratyantar Dasha – {planet} – {row.antar}
                          </h4>
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-orange-50">
                                <TableHead className="w-6 text-orange-800 text-sm"></TableHead>
                                <TableHead className="text-orange-800 text-sm">PRATYANTAR</TableHead>
                                <TableHead className="text-orange-800 text-sm">DAYS</TableHead>
                                <TableHead className="text-orange-800 text-sm">FROM</TableHead>
                                <TableHead className="text-orange-800 text-sm">TO</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pratyantarData.map((pratyRow, pratyIndex) => (
                                <>
                                  <TableRow
                                    key={pratyIndex}
                                    className="text-sm hover:bg-orange-100 cursor-pointer"
                                    onClick={() => handlePratyantarRowClick(pratyIndex, pratyRow, row)}
                                  >
                                    <TableCell className="text-center">
                                      {expandedPratyantarRow === `${index}-${pratyIndex}` ? (
                                        <ChevronDown size={14} className="text-orange-600" />
                                      ) : (
                                        <ChevronRight size={14} className="text-orange-600" />
                                      )}
                                    </TableCell>
                                    <TableCell className="text-gray-700 font-medium">{pratyRow.pratyantar}</TableCell>
                                    <TableCell className="text-gray-600">{pratyRow.days}</TableCell>
                                    <TableCell className="text-gray-600 text-xs sm:text-sm">{formatDateCell(pratyRow.from)}</TableCell>
                                    <TableCell className="text-gray-600 text-xs sm:text-sm">{formatDateCell(pratyRow.to)}</TableCell>
                                  </TableRow>

                                  {expandedPratyantarRow === `${index}-${pratyIndex}` && dainikData.length > 0 && (
                                    <TableRow>
                                      <TableCell colSpan={5} className="p-0">
                                        <div className="bg-red-25 border-l-4 border-red-300 ml-6 mr-2 my-2">
                                          <div className="p-3">
                                            <h5 className="text-xs font-semibold text-red-700 mb-2">
                                              Dainik Dasha – {planet} – {row.antar} – {pratyRow.pratyantar}
                                            </h5>
                                            <Table>
                                              <TableHeader>
                                                <TableRow className="bg-red-50">
                                                  <TableHead className="text-red-800 text-xs">DAINIK</TableHead>
                                                  <TableHead className="text-red-800 text-xs">DAYS</TableHead>
                                                  <TableHead className="text-red-800 text-xs">FROM</TableHead>
                                                  <TableHead className="text-red-800 text-xs">TO</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {dainikData.map((dainikRow, dainikIndex) => (
                                                  <TableRow key={dainikIndex} className="text-xs">
                                                    <TableCell className="text-gray-700 font-medium">{dainikRow.dainik}</TableCell>
                                                    <TableCell className="text-gray-600">{dainikRow.days}</TableCell>
                                                    <TableCell className="text-gray-600 text-xs">{formatDateCell(dainikRow.from)}</TableCell>
                                                    <TableCell className="text-gray-600 text-xs">{formatDateCell(dainikRow.to)}</TableCell>
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
