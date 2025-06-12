
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AntarDashaRow {
  antar: string;
  days: number;
  from: string;
  to: string;
}

interface AntarDashaTableProps {
  data: AntarDashaRow[];
  planet: string;
  startAge: number;
  onClose: () => void;
}

export const AntarDashaTable = ({ data, planet, startAge, onClose }: AntarDashaTableProps) => {
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
                <TableHead className="font-semibold text-amber-800">ANTAR</TableHead>
                <TableHead className="font-semibold text-amber-800">DAYS</TableHead>
                <TableHead className="font-semibold text-amber-800">FROM</TableHead>
                <TableHead className="font-semibold text-amber-800">TO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="hover:bg-amber-25">
                  <TableCell className="font-medium text-gray-800">{row.antar}</TableCell>
                  <TableCell className="text-gray-600">{row.days}</TableCell>
                  <TableCell className="text-gray-600">{row.from}</TableCell>
                  <TableCell className="text-gray-600">{row.to}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
