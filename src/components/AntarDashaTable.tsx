
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { 
  calculatePratyantarDasha, 
  calculateDainikDasha,
  calculatePreBirthPratyantarDasha,
  calculatePreBirthDainikDasha
} from '@/utils/antarDashaCalculator';

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
      <div className="date-cell whitespace-nowrap font-bold min-w-fit">
        {date}
      </div>
    );
  };

  const canExpandRow = (row: AntarDashaRow) => {
    // Don't allow expansion if no valid data (days = 0 or from/to = "–")
    return row.days > 0 && row.from !== '–' && row.to !== '–';
  };

  const canExpandPratyantarRow = (pratyRow: any) => {
    // Don't allow expansion if no valid data
    return pratyRow.days > 0 && pratyRow.from !== '–' && pratyRow.to !== '–';
  };

  const handleRowClick = async (index: number, row: AntarDashaRow) => {
    console.log('Antar row clicked:', index, row);
    
    // Don't expand if row has no valid data
    if (!canExpandRow(row)) {
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
      let pratyantar;
      
      if (isPreBirth) {
        pratyantar = calculatePreBirthPratyantarDasha(row.from, row.to, row.planetNumber, planet);
      } else {
        pratyantar = calculatePratyantarDasha(row.from, row.to, row.planetNumber, planet);
      }
      
      console.log('Calculated pratyantar data:', pratyantar);
      
      setPratyantarData(Array.isArray(pratyantar) ? pratyantar : []);
      setExpandedRow(index);
      setExpandedPratyantarRow(null);
      setDainikData([]);
    } catch (error) {
      console.error('Error calculating Pratyantar Dasha:', error);
      setPratyantarData([]);
      setExpandedRow(null);
    }
  };

  const handlePratyantarRowClick = async (pratyantarIndex: number, pratyantarRow: any, antarRow: AntarDashaRow) => {
    const rowKey = `${expandedRow}-${pratyantarIndex}`;
    console.log('Pratyantar row clicked:', rowKey, pratyantarRow);

    // Don't expand if row has no valid data
    if (!canExpandPratyantarRow(pratyantarRow)) {
      return;
    }

    if (expandedPratyantarRow === rowKey) {
      setExpandedPratyantarRow(null);
      setDainikData([]);
      return;
    }

    try {
      let dainik;
      
      if (isPreBirth) {
        dainik = calculatePreBirthDainikDasha(
          pratyantarRow.from,
          pratyantarRow.to,
          pratyantarRow.planetNumber || antarRow.planetNumber,
          planet,
          antarRow.antar,
          pratyantarRow.pratyantar
        );
      } else {
        dainik = calculateDainikDasha(
          pratyantarRow.from,
          pratyantarRow.to,
          pratyantarRow.planetNumber || antarRow.planetNumber,
          planet,
          antarRow.antar,
          pratyantarRow.pratyantar
        );
      }
      
      console.log('Calculated dainik data:', dainik);
      
      setDainikData(Array.isArray(dainik) ? dainik : []);
      setExpandedPratyantarRow(rowKey);
    } catch (error) {
      console.error('Error calculating Dainik Dasha:', error);
      setDainikData([]);
      setExpandedPratyantarRow(null);
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
        <Table className="compressed-table border border-gray-300 min-w-full">
          <TableHeader>
            <TableRow className="bg-amber-50">
              <TableHead className="w-6 px-1 py-1 font-bold text-amber-800 border-r border-gray-300"></TableHead>
              <TableHead className="px-1 py-1 font-bold text-amber-800 whitespace-nowrap border-r border-gray-300 min-w-fit">ANTAR</TableHead>
              <TableHead className="px-1 py-1 font-bold text-amber-800 whitespace-nowrap border-r border-gray-300 min-w-fit">DAYS</TableHead>
              <TableHead className="px-1 py-1 font-bold text-amber-800 whitespace-nowrap border-r border-gray-300 min-w-fit">FROM</TableHead>
              <TableHead className="px-1 py-1 font-bold text-amber-800 whitespace-nowrap min-w-fit">TO</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, index) => (
              <>
                <TableRow
                  key={`antar-${index}`}
                  className={`hover:bg-amber-25 transition-colors border-b border-gray-300 ${canExpandRow(row) ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleRowClick(index, row)}
                >
                  <TableCell className="text-center px-1 py-1 border-r border-gray-300">
                    {canExpandRow(row) && (
                      expandedRow === index ? (
                        <ChevronDown size={16} className="text-amber-600" />
                      ) : (
                        <ChevronRight size={16} className="text-amber-600" />
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-gray-800 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap">{row.antar}</TableCell>
                  <TableCell className="text-gray-600 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap">{row.days}</TableCell>
                  <TableCell className="text-gray-600 px-1 py-1 border-r border-gray-300 whitespace-nowrap">{formatDateCell(row.from)}</TableCell>
                  <TableCell className="text-gray-600 px-1 py-1 whitespace-nowrap">{formatDateCell(row.to)}</TableCell>
                </TableRow>

                {expandedRow === index && pratyantarData.length > 0 && (
                  <TableRow key={`pratyantar-container-${index}`}>
                    <TableCell colSpan={5} className="p-0">
                      <div className="bg-orange-25 border-l-4 border-orange-300 ml-4 mr-2 my-2">
                        <div className="p-4">
                          <h4 className="font-bold text-orange-700 mb-3">
                            Pratyantar Dasha – {planet} – {row.antar}
                          </h4>
                          <Table className="compressed-table border border-gray-300 min-w-full">
                            <TableHeader>
                              <TableRow className="bg-orange-50">
                                <TableHead className="w-6 text-orange-800 font-bold px-1 py-1 border-r border-gray-300"></TableHead>
                                <TableHead className="text-orange-800 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap min-w-fit">PRATYANTAR</TableHead>
                                <TableHead className="text-orange-800 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap min-w-fit">DAYS</TableHead>
                                <TableHead className="text-orange-800 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap min-w-fit">FROM</TableHead>
                                <TableHead className="text-orange-800 font-bold px-1 py-1 whitespace-nowrap min-w-fit">TO</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pratyantarData.map((pratyRow, pratyIndex) => (
                                <>
                                  <TableRow
                                    key={`pratyantar-${index}-${pratyIndex}`}
                                    className={`hover:bg-orange-100 transition-colors border-b border-gray-300 ${canExpandPratyantarRow(pratyRow) ? 'cursor-pointer' : 'cursor-default'}`}
                                    onClick={() => handlePratyantarRowClick(pratyIndex, pratyRow, row)}
                                  >
                                    <TableCell className="text-center px-1 py-1 border-r border-gray-300">
                                      {canExpandPratyantarRow(pratyRow) && (
                                        expandedPratyantarRow === `${index}-${pratyIndex}` ? (
                                          <ChevronDown size={14} className="text-orange-600" />
                                        ) : (
                                          <ChevronRight size={14} className="text-orange-600" />
                                        )
                                      )}
                                    </TableCell>
                                    <TableCell className="text-gray-700 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap">{pratyRow.pratyantar}</TableCell>
                                    <TableCell className="text-gray-600 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap">{pratyRow.days}</TableCell>
                                    <TableCell className="text-gray-600 px-1 py-1 border-r border-gray-300 whitespace-nowrap">{formatDateCell(pratyRow.from)}</TableCell>
                                    <TableCell className="text-gray-600 px-1 py-1 whitespace-nowrap">{formatDateCell(pratyRow.to)}</TableCell>
                                  </TableRow>

                                  {expandedPratyantarRow === `${index}-${pratyIndex}` && dainikData.length > 0 && (
                                    <TableRow key={`dainik-container-${index}-${pratyIndex}`}>
                                      <TableCell colSpan={5} className="p-0">
                                        <div className="bg-red-25 border-l-4 border-red-300 ml-6 mr-2 my-2">
                                          <div className="p-3">
                                            <h5 className="font-bold text-red-700 mb-2">
                                              Dainik Dasha – {planet} – {row.antar} – {pratyRow.pratyantar}
                                            </h5>
                                            <Table className="compressed-table border border-gray-300 min-w-full">
                                              <TableHeader>
                                                <TableRow className="bg-red-50">
                                                  <TableHead className="text-red-800 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap min-w-fit">DAINIK</TableHead>
                                                  <TableHead className="text-red-800 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap min-w-fit">DAYS</TableHead>
                                                  <TableHead className="text-red-800 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap min-w-fit">FROM</TableHead>
                                                  <TableHead className="text-red-800 font-bold px-1 py-1 whitespace-nowrap min-w-fit">TO</TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {dainikData.map((dainikRow, dainikIndex) => (
                                                  <TableRow key={`dainik-${index}-${pratyIndex}-${dainikIndex}`} className="border-b border-gray-300">
                                                    <TableCell className="text-gray-700 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap">{dainikRow.dainik}</TableCell>
                                                    <TableCell className="text-gray-600 font-bold px-1 py-1 border-r border-gray-300 whitespace-nowrap">{dainikRow.days}</TableCell>
                                                    <TableCell className="text-gray-600 px-1 py-1 border-r border-gray-300 whitespace-nowrap">{formatDateCell(dainikRow.from)}</TableCell>
                                                    <TableCell className="text-gray-600 px-1 py-1 whitespace-nowrap">{formatDateCell(dainikRow.to)}</TableCell>
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
