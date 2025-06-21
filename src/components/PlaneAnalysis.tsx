
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface PlaneAnalysisProps {
  frequencies: Record<number, number>;
  onBack: () => void;
}

const PLANE_DEFINITIONS = [
  { 
    name: "Thought Plane", 
    numbers: [4, 3, 8], 
    description: "Excellent intellect — analytical, imaginative, clear thinking." 
  },
  { 
    name: "Will Power Plane", 
    numbers: [9, 5, 1], 
    description: "Strong willpower, leadership, inner strength." 
  },
  { 
    name: "Action Plane", 
    numbers: [2, 7, 6], 
    description: "Emotionally intelligent and responsible in actions." 
  },
  { 
    name: "Mental Plane", 
    numbers: [4, 9, 2], 
    description: "Strategic thinker with vision and emotional intelligence." 
  },
  { 
    name: "Emotional Plane", 
    numbers: [3, 5, 7], 
    description: "Emotionally expressive, intuitive, and spiritually wise." 
  },
  { 
    name: "Practical Plane", 
    numbers: [8, 1, 6], 
    description: "Grounded, reliable, executes tasks with leadership." 
  },
  { 
    name: "Silver Plane", 
    numbers: [2, 5, 8], 
    description: "Emotionally aware and instinctively good with finances." 
  },
  { 
    name: "Golden Plane", 
    numbers: [4, 5, 6], 
    description: "Emotionally mature, disciplined, balanced and composed under pressure." 
  }
];

export const PlaneAnalysis = ({ frequencies, onBack }: PlaneAnalysisProps) => {
  const formedPlanes = PLANE_DEFINITIONS.filter(plane =>
    plane.numbers.every(num => (frequencies[num] || 0) > 0)
  );

  const missingPlanes = PLANE_DEFINITIONS.filter(plane =>
    !plane.numbers.every(num => (frequencies[num] || 0) > 0)
  );

  return (
    <Card className="shadow-xl border border-amber-200 bg-white rounded-xl font-calibri">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-bold text-amber-700 text-center">
          Plane Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Positive/Formed Planes Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
            <CheckCircle size={20} />
            Positive Planes
          </h3>
          
          {formedPlanes.length === 0 ? (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-600">No positive planes found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {formedPlanes.map((plane, index) => (
                <div 
                  key={`formed-${index}`} 
                  className="border border-green-300 rounded-lg p-4 shadow-sm bg-green-50"
                >
                  <div className="font-bold text-lg text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    {plane.name}
                  </div>
                  <div className="text-gray-700 font-bold text-left">
                    {plane.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing/Negative Planes Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-red-700 flex items-center gap-2">
            <XCircle size={20} />
            Missing Planes
          </h3>
          
          {missingPlanes.length === 0 ? (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-lg font-bold text-green-600">All planes are formed! Excellent numerological balance.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {missingPlanes.map((plane, index) => (
                <div 
                  key={`missing-${index}`} 
                  className="border border-red-300 rounded-lg p-4 shadow-sm bg-red-50"
                >
                  <div className="font-bold text-lg text-red-800 mb-2 flex items-center gap-2">
                    <XCircle size={16} className="text-red-600" />
                    {plane.name}
                  </div>
                  <div className="text-gray-600 font-bold text-left">
                    Missing: {plane.description}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Required numbers: {plane.numbers.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-center pt-4">
          <Button 
            onClick={onBack}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2"
          >
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
