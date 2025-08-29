import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { FusionWeights, PersonaAttributeKey } from "@/types/run";

interface FusionControlsProps {
  weights: FusionWeights;
  onChange: (next: FusionWeights) => void;
}

const ATTRIBUTES: PersonaAttributeKey[] = ["role", "expertise", "mindset", "personality", "description"];

export const FusionControls = ({ weights, onChange }: FusionControlsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Global Fusion Weight</Label>
          <span className="text-sm text-muted-foreground">{Math.round(weights.global * 100)}%</span>
        </div>
        <Slider value={[weights.global * 100]} onValueChange={(v) => onChange({ ...weights, global: (v[0] || 0) / 100 })} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {ATTRIBUTES.map((attr) => (
          <div key={attr}>
            <div className="flex items-center justify-between mb-2">
              <Label className="capitalize">{attr}</Label>
              <span className="text-sm text-muted-foreground">{Math.round((weights.perAttribute[attr] ?? 0.7) * 100)}%</span>
            </div>
            <Slider
              value={[((weights.perAttribute[attr] ?? 0.7) * 100)]}
              onValueChange={(v) => onChange({
                ...weights,
                perAttribute: { ...weights.perAttribute, [attr]: (v[0] || 0) / 100 }
              })}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Label className="block">Strict Mode</Label>
          <p className="text-xs text-muted-foreground">High-confidence only vs. broader inclusion</p>
        </div>
        <Switch checked={weights.strictMode} onCheckedChange={(v) => onChange({ ...weights, strictMode: v })} />
      </div>
    </div>
  );
};

export default FusionControls;
