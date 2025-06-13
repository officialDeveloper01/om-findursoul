
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { calculatePratyantarDasha } from '@/utils/antarDashaCalculator';

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

  const handleRowClick = async (index: number, row: AntarDashaRow) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      setPratyantarData([]);
      return;
    }

    try {
      const pratyantar = calculatePratyantarDasha(
        row.from,
        row.to,
        row.planetNumber
      );
      
      setPratyantarData(pratyantar);
      setExpandedRow(index);
    } catch (error) {
      console.error('Error calculating Pratyantar Dasha:', error);
    }
  };

  return (
    <Card className="mt-6 shadow-lg border border-amber-200">
      <CardHeader className="pb-4">
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
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50">
                <TableHead className="font-semibold text-amber-800 w-8"></TableHead>
                <TableHead className="font-semibold text-amber-800">ANTAR</TableHead>
                <TableHead className="font-semibold text-amber-800">DAYS</TableHead>
                <TableHead className="font-semibold text-amber-800">FROM</TableHead>
                <TableHead className="font-semibold text-amber-800">TO</TableHead>
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
                    <TableCell className="font-medium text-gray-800">{row.antar}</TableCell>
                    <TableCell className="text-gray-600">{row.days}</TableCell>
                    <TableCell className="text-gray-600">{row.from}</TableCell>
                    <TableCell className="text-gray-600">{row.to}</TableCell>
                  </TableRow>
                  
                  {expandedRow === index && pratyantarData.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <div className="bg-orange-25 border-l-4 border-orange-300 ml-4 mr-2 my-2">
                          <div className="p-4">
                            <h4 className="text-sm font-semibold text-orange-700 mb-3">
                              Pratyantar Dasha - {planet} - {row.antar}
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-orange-50">
                                  <TableHead className="font-medium text-orange-800 text-sm">PRATYANTAR</TableHead>
                                  <TableHead className="font-medium text-orange-800 text-sm">DAYS</TableHead>
                                  <TableHead className="font-medium text-orange-800 text-sm">FROM</TableHead>
                                  <TableHead className="font-medium text-orange-800 text-sm">TO</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {pratyantarData.map((pratyRow, pratyIndex) => (
                                  <TableRow key={pratyIndex} className="text-sm">
                                    <TableCell className="font-medium text-gray-700">{pratyRow.pratyantar}</TableCell>
                                    <TableCell className="text-gray-600">{pratyRow.days}</TableCell>
                                    <TableCell className="text-gray-600">{pratyRow.from}</TableCell>
                                    <TableCell className="text-gray-600">{pratyRow.to}</TableCell>
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
      </CardContent>
    </Card>
  );
};
