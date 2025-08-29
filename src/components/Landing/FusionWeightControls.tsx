import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Globe, Upload, ClipboardList, Sparkles, RotateCcw } from "lucide-react";

interface FusionWeights {
  aiGeneration: number;
  webExtraction: number;
  fileUpload: number;
  questionnaire: number;
}

interface DataSourceEnabled {
  aiGeneration: boolean;
  webExtraction: boolean;
  fileUpload: boolean;
  questionnaire: boolean;
}

interface FusionWeightControlsProps {
  weights: FusionWeights;
  onWeightsChange: (weights: FusionWeights) => void;
}

const DEFAULT_WEIGHTS: FusionWeights = {
  aiGeneration: 40,
  webExtraction: 15,
  fileUpload: 15,
  questionnaire: 30
};

const DEFAULT_ENABLED: DataSourceEnabled = {
  aiGeneration: true,
  webExtraction: true,
  fileUpload: true,
  questionnaire: true
};

export const FusionWeightControls = ({ weights, onWeightsChange }: FusionWeightControlsProps) => {
  const [enabled, setEnabled] = useState<DataSourceEnabled>(DEFAULT_ENABLED);
  const [sliderValues, setSliderValues] = useState<FusionWeights>(weights);

  // Only update slider values on initial load or reset
  useEffect(() => {
    // Only sync slider values on component mount or when weights are reset to defaults
    const isDefaultWeights = 
      weights.aiGeneration === DEFAULT_WEIGHTS.aiGeneration &&
      weights.webExtraction === DEFAULT_WEIGHTS.webExtraction &&
      weights.fileUpload === DEFAULT_WEIGHTS.fileUpload &&
      weights.questionnaire === DEFAULT_WEIGHTS.questionnaire;
    
    if (isDefaultWeights) {
      setSliderValues(weights);
    }
  }, [weights]);

  const normalizeWeights = (newWeights: FusionWeights, enabledSources: DataSourceEnabled): FusionWeights => {
    // Only consider enabled sources
    const enabledKeys = Object.keys(enabledSources).filter(key => 
      enabledSources[key as keyof DataSourceEnabled]
    ) as (keyof FusionWeights)[];

    if (enabledKeys.length === 0) {
      // If no sources enabled, reset to defaults
      return DEFAULT_WEIGHTS;
    }

    // Calculate total of enabled sources
    const enabledTotal = enabledKeys.reduce((sum, key) => sum + newWeights[key], 0);

    if (enabledTotal === 0) {
      // If all enabled sources are 0, distribute equally
      const equalWeight = Math.floor(100 / enabledKeys.length);
      const remainder = 100 - (equalWeight * enabledKeys.length);
      
      const result = { ...newWeights };
      // Set disabled sources to 0
      Object.keys(result).forEach(key => {
        if (!enabledSources[key as keyof DataSourceEnabled]) {
          result[key as keyof FusionWeights] = 0;
        }
      });
      
      // Distribute equal weights
      enabledKeys.forEach((key, index) => {
        result[key] = equalWeight + (index < remainder ? 1 : 0);
      });
      
      return result;
    }

    // Normalize enabled sources to 100%
    const factor = 100 / enabledTotal;
    const result = { ...newWeights };

    // Set disabled sources to 0
    Object.keys(result).forEach(key => {
      if (!enabledSources[key as keyof DataSourceEnabled]) {
        result[key as keyof FusionWeights] = 0;
      }
    });

    // Apply factor and floor values
    enabledKeys.forEach(key => {
      result[key] = Math.floor(result[key] * factor);
    });

    // Calculate remainder and distribute to largest values
    const currentTotal = enabledKeys.reduce((sum, key) => sum + result[key], 0);
    const remainder = 100 - currentTotal;

    if (remainder > 0) {
      const sortedKeys = enabledKeys.sort((a, b) => result[b] - result[a]);
      for (let i = 0; i < remainder && i < sortedKeys.length; i++) {
        result[sortedKeys[i]]++;
      }
    }

    return result;
  };

  const updateWeight = (source: keyof FusionWeights, value: number) => {
    // For input field changes - just update this value directly without affecting sliders
    const newValue = Math.round(Math.max(0, Math.min(100, value))); // Ensure integer between 0-100
    const newWeights = { ...weights, [source]: newValue };
    onWeightsChange(newWeights);
  };

  const handleSliderChange = (source: keyof FusionWeights, value: number) => {
    const roundedValue = Math.round(value);
    
    // Get the order of sources (AI Generation -> Web Extraction -> File Upload -> Questionnaire)
    const sourceOrder: (keyof FusionWeights)[] = ['aiGeneration', 'webExtraction', 'fileUpload', 'questionnaire'];
    const currentIndex = sourceOrder.indexOf(source);
    
    // Calculate current total of upper sources (sources above the current one)
    const upperSources = sourceOrder.slice(0, currentIndex).filter(
      key => enabled[key as keyof DataSourceEnabled]
    );
    const upperTotal = upperSources.reduce((sum, key) => sum + sliderValues[key], 0);
    
    // Calculate the maximum allowed value for this slider
    const maxAllowed = 100 - upperTotal;
    
    // Prevent exceeding 100% total
    const constrainedValue = Math.min(roundedValue, maxAllowed);
    
    // If the value would exceed the limit, don't allow the change
    if (constrainedValue !== roundedValue) {
      return; // Exit early if the move would exceed 100%
    }
    
    // Update slider values to track slider positions separately
    const newSliderValues = { ...sliderValues };
    const newWeights = { ...weights };
    newSliderValues[source] = constrainedValue;
    newWeights[source] = constrainedValue;
    
    // Get enabled sources that come AFTER the current one (lower bars only)
    const lowerEnabledSources = sourceOrder.slice(currentIndex + 1).filter(
      key => enabled[key as keyof DataSourceEnabled]
    );
    
    if (lowerEnabledSources.length === 0) {
      // If no lower sources are enabled, just set this value
      setSliderValues(newSliderValues);
      onWeightsChange(newWeights);
      return;
    }
    
    // Calculate how much weight is available for lower sources
    const currentUpperTotal = upperTotal + constrainedValue;
    const availableForLower = Math.max(0, 100 - currentUpperTotal);
    
    // Calculate current total of lower sources
    const lowerTotal = lowerEnabledSources.reduce((sum, key) => sum + sliderValues[key], 0);
    
    if (lowerTotal > 0 && availableForLower >= 0) {
      // Redistribute proportionally among lower sources
      let distributedTotal = 0;
      lowerEnabledSources.forEach((key, index) => {
        if (index === lowerEnabledSources.length - 1) {
          // Last item gets remainder to ensure exact 100%
          const remaining = availableForLower - distributedTotal;
          newSliderValues[key] = Math.max(0, remaining);
          newWeights[key] = Math.max(0, remaining);
        } else {
          const proportion = sliderValues[key] / lowerTotal;
          const distributed = Math.round(availableForLower * proportion);
          newSliderValues[key] = Math.max(0, distributed);
          newWeights[key] = Math.max(0, distributed);
          distributedTotal += distributed;
        }
      });
    } else if (availableForLower >= 0) {
      // If lower sources are all 0, distribute equally
      const equalShare = Math.floor(availableForLower / lowerEnabledSources.length);
      const remainder = availableForLower % lowerEnabledSources.length;
      
      lowerEnabledSources.forEach((key, index) => {
        const value = equalShare + (index < remainder ? 1 : 0);
        newSliderValues[key] = value;
        newWeights[key] = value;
      });
    }
    
    // Update slider values and weights
    setSliderValues(newSliderValues);
    onWeightsChange(newWeights);
  };

  const toggleSource = (source: keyof DataSourceEnabled) => {
    const newEnabled = { ...enabled, [source]: !enabled[source] };
    setEnabled(newEnabled);
    
    if (!newEnabled[source]) {
      // If disabling, redistribute this source's weight to others
      const currentValue = weights[source];
      const currentSliderValue = sliderValues[source];
      const otherEnabledSources = Object.keys(newEnabled)
        .filter(key => key !== source && newEnabled[key as keyof DataSourceEnabled]) as (keyof FusionWeights)[];
      
      if (otherEnabledSources.length > 0 && currentValue > 0) {
        const newWeights = { ...weights, [source]: 0 };
        const newSliderValues = { ...sliderValues, [source]: 0 };
        const otherTotal = otherEnabledSources.reduce((sum, key) => sum + weights[key], 0);
        const otherSliderTotal = otherEnabledSources.reduce((sum, key) => sum + sliderValues[key], 0);
        
        if (otherTotal > 0) {
          // Distribute proportionally for both weights and sliders
          otherEnabledSources.forEach(key => {
            const proportion = weights[key] / otherTotal;
            newWeights[key] = weights[key] + (currentValue * proportion);
            
            const sliderProportion = sliderValues[key] / (otherSliderTotal || 1);
            newSliderValues[key] = sliderValues[key] + (currentSliderValue * sliderProportion);
          });
        } else {
          // Distribute equally if others are all 0
          const equalShare = currentValue / otherEnabledSources.length;
          const equalSliderShare = currentSliderValue / otherEnabledSources.length;
          otherEnabledSources.forEach(key => {
            newWeights[key] = equalShare;
            newSliderValues[key] = equalSliderShare;
          });
        }
        
        setSliderValues(newSliderValues);
        onWeightsChange(newWeights);
      } else {
        // Just set to 0 if no other sources
        setSliderValues(prev => ({ ...prev, [source]: 0 }));
        onWeightsChange({ ...weights, [source]: 0 });
      }
    } else {
      // If enabling, take some weight from others proportionally
      const otherEnabledSources = Object.keys(newEnabled)
        .filter(key => key !== source && newEnabled[key as keyof DataSourceEnabled]) as (keyof FusionWeights)[];
      
      if (otherEnabledSources.length > 0) {
        const totalOthers = otherEnabledSources.reduce((sum, key) => sum + weights[key], 0);
        const totalOtherSliders = otherEnabledSources.reduce((sum, key) => sum + sliderValues[key], 0);
        
        if (totalOthers > 0) {
          // Give this source 10% by taking from others proportionally
          const giveAmount = Math.min(10, totalOthers);
          const giveSliderAmount = Math.min(10, totalOtherSliders);
          const newWeights = { ...weights, [source]: giveAmount };
          const newSliderValues = { ...sliderValues, [source]: giveSliderAmount };
          
          otherEnabledSources.forEach(key => {
            const proportion = weights[key] / totalOthers;
            const reduction = giveAmount * proportion;
            newWeights[key] = Math.max(0, weights[key] - reduction);
            
            const sliderProportion = sliderValues[key] / (totalOtherSliders || 1);
            const sliderReduction = giveSliderAmount * sliderProportion;
            newSliderValues[key] = Math.max(0, sliderValues[key] - sliderReduction);
          });
          
          setSliderValues(newSliderValues);
          onWeightsChange(newWeights);
        }
      }
    }
  };

  const resetToDefaults = () => {
    setEnabled(DEFAULT_ENABLED);
    setSliderValues(DEFAULT_WEIGHTS); // Reset slider values
    onWeightsChange(DEFAULT_WEIGHTS);
  };

  const sources = [
    {
      key: 'aiGeneration' as const,
      label: 'AI Generation',
      icon: Sparkles,
      description: 'AI-powered persona insights and behavioral predictions',
      color: 'text-purple-600'
    },
    {
      key: 'webExtraction' as const,
      label: 'Web Extraction',
      icon: Globe,
      description: 'Extract persona data from public web sources',
      color: 'text-primary'
    },
    {
      key: 'fileUpload' as const,
      label: 'File Upload',
      icon: Upload,
      description: 'Extract from uploaded documents (PDF, DOCX, TXT)',
      color: 'text-accent'
    },
    {
      key: 'questionnaire' as const,
      label: 'Questionnaire',
      icon: ClipboardList,
      description: 'Self-reported data from SPQ questionnaire',
      color: 'text-muted-foreground'
    }
  ];

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50/50 to-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-primary flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Data Source Weighting
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Adjust how much each data source contributes to the final persona
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {sources.map((source) => {
          const Icon = source.icon;
          const value = weights[source.key];
          const sliderValue = sliderValues[source.key];
          const isEnabled = enabled[source.key];
          
          return (
            <div key={source.key} className={`space-y-3 transition-opacity ${!isEnabled ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleSource(source.key)}
                    className="scale-75"
                  />
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${source.color}`} />
                    <Label className="font-medium">{source.label}</Label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono bg-secondary px-2 py-1 rounded min-w-[40px] text-center">
                    {value}%
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground ml-8">
                {source.description}
              </p>
              {isEnabled && (
                <div className="ml-8">
                  <Slider
                    value={[sliderValue]}
                    onValueChange={([newValue]) => handleSliderChange(source.key, newValue)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          );
        })}
        
        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className={`font-mono font-medium ${
              weights.aiGeneration + weights.webExtraction + weights.fileUpload + weights.questionnaire === 100 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {weights.aiGeneration + weights.webExtraction + weights.fileUpload + weights.questionnaire}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Enabled sources: {Object.values(enabled).filter(Boolean).length} of {sources.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};