import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuestionnaireProps {
  onSubmit: (answers: Record<string, number>) => void;
}

const ITEMS = [
  { id: 'risk_tolerance', label: 'Risk tolerance', hint: 'Low 0 - 100 High' },
  { id: 'team_orientation', label: 'Team orientation', hint: 'Individual 0 - 100 Team' },
  { id: 'innovation_focus', label: 'Innovation focus', hint: 'Incremental 0 - 100 Disruptive' },
];

export const Questionnaire = ({ onSubmit }: QuestionnaireProps) => {
  const [values, setValues] = useState<Record<string, number>>({ risk_tolerance: 60, team_orientation: 70, innovation_focus: 65 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optional Questionnaire (SPQ v1.0)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ITEMS.map((it) => (
          <div key={it.id} className="grid md:grid-cols-3 gap-3 items-center">
            <div>
              <Label>{it.label}</Label>
              <p className="text-xs text-muted-foreground">{it.hint}</p>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={values[it.id] ?? 50}
              onChange={(e) => setValues({ ...values, [it.id]: Number(e.target.value) })}
            />
            <Input value={values[it.id] ?? 50} onChange={(e) => setValues({ ...values, [it.id]: Number(e.target.value) })} />
          </div>
        ))}
        <div className="flex justify-end">
          <Button onClick={() => onSubmit(values)}>Save Questionnaire</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Questionnaire;
