import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Brain, Zap, Settings, Clock, Target } from "lucide-react";

export const AIGenerationTab = () => {
  const [modelProvider, setModelProvider] = useState('openai-gpt4');
  const [generationMode, setGenerationMode] = useState('comprehensive');
  const [customPrompt, setCustomPrompt] = useState('');
  const [creativityLevel, setCreativityLevel] = useState(70);
  const [focusAreas, setFocusAreas] = useState<string[]>(['professional', 'personality']);

  const modelOptions = [
    { id: 'openai-gpt4', name: 'OpenAI GPT-4 Turbo', description: 'Most accurate, detailed analysis' },
    { id: 'openai-gpt35', name: 'OpenAI GPT-3.5 Turbo', description: 'Fast, cost-effective' },
    { id: 'anthropic-claude', name: 'Anthropic Claude 3', description: 'Excellent for nuanced personality traits' },
    { id: 'google-gemini', name: 'Google Gemini Pro', description: 'Strong analytical capabilities' }
  ];

  const generationModes = [
    { id: 'comprehensive', name: 'Comprehensive Analysis', description: 'Deep dive into all personality aspects' },
    { id: 'professional', name: 'Professional Focus', description: 'Work style, leadership, and career patterns' },
    { id: 'behavioral', name: 'Behavioral Patterns', description: 'Communication style and decision-making' },
    { id: 'creative', name: 'Creative Profile', description: 'Innovation style and creative thinking patterns' }
  ];

  const focusAreaOptions = [
    { id: 'professional', label: 'Professional Style' },
    { id: 'personality', label: 'Core Personality' },
    { id: 'communication', label: 'Communication Patterns' },
    { id: 'leadership', label: 'Leadership Approach' },
    { id: 'innovation', label: 'Innovation & Creativity' },
    { id: 'relationships', label: 'Relationship Building' }
  ];

  const toggleFocusArea = (areaId: string) => {
    setFocusAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2 mb-6">
          <Sparkles className="w-8 h-8 text-primary mx-auto" />
          <h3 className="text-lg font-semibold">AI-Powered Persona Generation</h3>
          <p className="text-sm text-muted-foreground">
            Generate comprehensive persona insights using advanced AI models
          </p>
        </div>

        <div className="space-y-6">
          {/* Model Selection */}
          <div className="space-y-3">
            <Label htmlFor="model-provider">AI Model Provider</Label>
            <Select value={modelProvider} onValueChange={setModelProvider}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generation Mode */}
          <div className="space-y-3">
            <Label htmlFor="generation-mode">Analysis Mode</Label>
            <Select value={generationMode} onValueChange={setGenerationMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {generationModes.map((mode) => (
                  <SelectItem key={mode.id} value={mode.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{mode.name}</span>
                      <span className="text-xs text-muted-foreground">{mode.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Focus Areas */}
          <div className="space-y-3">
            <Label>Focus Areas</Label>
            <div className="flex flex-wrap gap-2">
              {focusAreaOptions.map((area) => (
                <Badge
                  key={area.id}
                  variant={focusAreas.includes(area.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => toggleFocusArea(area.id)}
                >
                  {area.label}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Select areas to emphasize in the AI analysis
            </p>
          </div>

          {/* Creativity Level */}
          <div className="space-y-3">
            <Label htmlFor="creativity-level">Creativity & Interpretation Level</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span className="font-mono bg-secondary px-2 py-1 rounded">
                  {creativityLevel}%
                </span>
                <span>Creative</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={creativityLevel}
                  onChange={(e) => setCreativityLevel(Number(e.target.value))}
                  className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={creativityLevel}
                  onChange={(e) => setCreativityLevel(Number(e.target.value))}
                  className="w-16 h-8 text-xs text-center"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Higher values enable more interpretative and creative personality insights
            </p>
          </div>

          <Separator />

          {/* Custom Prompt (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="custom-prompt">Custom Analysis Prompt (Optional)</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Enter specific instructions for the AI analysis (e.g., 'Focus on leadership communication style' or 'Emphasize technical decision-making patterns')..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[80px] text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Add specific context or requirements for the AI analysis
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
              <Brain className="w-4 h-4 mr-2" />
              Generate AI Persona
            </Button>
            <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
              <Settings className="w-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>
        </div>

        {/* AI Generation Info */}
        <div className="space-y-4">
          <div className="bg-purple-50/50 rounded-lg p-4 border border-purple-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-sm text-purple-800">AI Generation Process</h4>
            </div>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• Analyzes subject name and available context</li>
              <li>• Generates persona traits based on AI knowledge</li>
              <li>• Creates behavioral patterns and preferences</li>
              <li>• Provides confidence estimates for each trait</li>
            </ul>
          </div>

          <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-amber-600" />
              <h4 className="font-medium text-sm text-amber-800">Best Used For</h4>
            </div>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Initial persona hypothesis generation</li>
              <li>• Filling gaps when limited data is available</li>
              <li>• Creative exploration of personality dimensions</li>
              <li>• Baseline for comparison with extracted data</li>
            </ul>
          </div>

          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-sm">Estimated Generation Time</h4>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <div className="flex justify-between">
                <span>GPT-4 Turbo:</span>
                <span>15-30 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>GPT-3.5 Turbo:</span>
                <span>5-15 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Claude 3:</span>
                <span>10-25 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
