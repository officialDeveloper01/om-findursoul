
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PreBirthAntarDashaTableProps {
  conductorValue: number;
  title: string;
  dateOfBirth: string;
  onClose: () => void;
}

interface PlanetData {
  name: string;
  days: number;
}

const planetMap: Record<number, PlanetData> = {
  1: { name: 'SURYA', days: 164 },
  2: { name: 'CHANDRA', days: 274 },
  3: { name: 'GURU', days: 438 },
  4: { name: 'RAHU', days: 493 },
  5: { name: 'BUDH', days: 465 },
  6: { name: 'SHUKRA', days: 547 },
  7: { name: 'KETU', days: 192 },
  8: { name: 'SHANI', days: 520 },
  9: { name: 'MANGAL', days: 192 }
};

const fixedSequence = [1, 2, 9, 4, 3, 8, 5, 7, 6];

const getPlanetSequence = (startPlanetNumber: number): PlanetData[] => {
  const startIndex = fixedSequence.indexOf(startPlanetNumber);
  const rotatedSequence = [
    ...fixedSequence.slice(startIndex),
    ...fixedSequence.slice(0, startIndex)
  ];
  return rotatedSequence.map(num => planetMap[num]);
};

const parseDateDDMMYYYY = (dateStr: string): Date => {
  // Handle different date formats
  if (dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day));
  } else if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  return new Date();
};

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const calculatePreBirthAntarDasha = (dateOfBirth: string, conductorValue: number) => {
  const dobDate = parseDateDDMMYYYY(dateOfBirth);
  const planetSequence = getPlanetSequence(conductorValue);
  const totalDays = 365 * 9; // 9 years
  const totalPlanetDays = planetSequence.reduce((sum, p) => sum + p.days, 0);

  // Start 9 years before DOB and work forward
  const startDate = new Date(dobDate);
  startDate.setFullYear(startDate.getFullYear() - 9);

  const antarDashaData: any[] = [];
  let currentDate = new Date(startDate);

  // Generate all periods for 9 years
  for (let i = 0; i < planetSequence.length; i++) {
    const antar = planetSequence[i];
    const fromDate = new Date(currentDate);
    
    const proportionalDays = Math.round((antar.days / totalPlanetDays) * totalDays);
    const toDate = addDays(currentDate, proportionalDays);

    antarDashaData.push({
      antar: antar.name,
      days: antar.days,
      from: formatDate(fromDate),
      to: formatDate(toDate),
      planetNumber: conductorValue
    });

    currentDate = new Date(toDate);
  }

  // Filter to show only periods that end on or before DOB
  const filteredData = antarDashaData.filter(period => {
    const periodEndDate = parseDateDDMMYYYY(period.to);
    return periodEndDate <= dobDate;
  });

  // Find the period that contains DOB and include it
  const containingPeriod = antarDashaData.find(period => {
    const periodStartDate = parseDateDDMMYYYY(period.from);
    const periodEndDate = parseDateDDMMYYYY(period.to);
    return periodStartDate <= dobDate && dobDate <= periodEndDate;
  });

  if (containingPeriod && !filteredData.includes(containingPeriod)) {
    filteredData.push(containingPeriod);
  }

  return filteredData.sort((a, b) => parseDateDDMMYYYY(a.from).getTime() - parseDateDDMMYYYY(b.from).getTime());
};

export const PreBirthAntarDashaTable = ({ conductorValue, title, dateOfBirth, onClose }: PreBirthAntarDashaTableProps) => {
  const data = calculatePreBirthAntarDasha(dateOfBirth, conductorValue);
  const planetName = planetMap[conductorValue]?.name || 'UNKNOWN';

  const formatDateCell = (date: string) => (
    <div className="flex flex-col sm:flex-row sm:gap-1 sm:items-center">
      <span>{date.slice(0, 6)}</span>
      <span>{date.slice(6)}</span>
    </div>
  );

  return (
    <Card className="mt-6 shadow-lg border border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-blue-700">
            Pre-birth Antar Dasha: {title} ({planetName})
          </CardTitle>
          <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-hidden">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-50">
                <TableHead className="px-3 py-2 text-sm text-blue-800 whitespace-nowrap">ANTAR DASHA</TableHead>
                <TableHead className="px-3 py-2 text-sm text-blue-800 whitespace-nowrap">FROM</TableHead>
                <TableHead className="px-3 py-2 text-sm text-blue-800 whitespace-nowrap">TO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="hover:bg-blue-25">
                  <TableCell className="text-gray-800 font-medium px-3 py-2">{row.antar}</TableCell>
                  <TableCell className="text-gray-600 text-sm px-3 py-2">{formatDateCell(row.from)}</TableCell>
                  <TableCell className="text-gray-600 text-sm px-3 py-2">{formatDateCell(row.to)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
