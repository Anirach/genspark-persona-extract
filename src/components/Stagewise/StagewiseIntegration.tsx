import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Play, Pause, RotateCcw } from "lucide-react";

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  duration?: number;
  logs?: string[];
}

interface WorkflowResult {
  success: boolean;
  totalSteps: number;
  error?: string;
}

interface StagewiseIntegrationProps {
  onWorkflowComplete?: (result: WorkflowResult) => void;
  onStepUpdate?: (step: WorkflowStep) => void;
}

// Embedded workflow definition (instead of importing)
const personaExtractionWorkflow = {
  name: 'persona-extraction',
  description: 'Complete persona extraction pipeline with evidence-backed analysis',
  phases: [
    {
      name: 'initialization',
      steps: [
        { id: 'initialize', name: 'Initialize', description: 'Set up extraction parameters and validate input' }
      ]
    },
    {
      name: 'discovery', 
      steps: [
        { id: 'seed_aliases', name: 'Seed & Alias Expansion', description: 'Expand search terms and aliases' },
        { id: 'query_generation', name: 'Query Generation', description: 'Generate targeted search queries' },
        { id: 'source_discovery', name: 'Source Discovery', description: 'Discover and rank potential data sources' }
      ]
    },
    {
      name: 'collection',
      steps: [
        { id: 'compliance_scheduling', name: 'Compliance & Scheduling', description: 'Ensure ethical data collection' },
        { id: 'fetching_snapshotting', name: 'Fetching & Snapshotting', description: 'Collect data with audit trail' }
      ]
    },
    {
      name: 'processing',
      steps: [
        { id: 'normalization', name: 'Normalization', description: 'Standardize and clean collected data' },
        { id: 'quality_scoring', name: 'Quality Scoring', description: 'Assess source credibility' },
        { id: 'deduplication', name: 'Deduplication', description: 'Remove duplicate content' }
      ]
    },
    {
      name: 'analysis',
      steps: [
        { id: 'segmentation_embedding', name: 'Segmentation & Embedding', description: 'Create content chunks and embeddings' },
        { id: 'targeted_retrieval', name: 'Targeted Retrieval', description: 'Extract persona-relevant information' },
        { id: 'attribute_extraction', name: 'Attribute Extraction', description: 'Extract specific persona attributes' },
        { id: 'contradictions', name: 'Contradictions', description: 'Identify and resolve conflicts' }
      ]
    },
    {
      name: 'validation',
      steps: [
        { id: 'questionnaire_fusion', name: 'Questionnaire Fusion', description: 'Integrate questionnaire responses' },
        { id: 'fusion_confidence', name: 'Fusion & Confidence', description: 'Calculate confidence scores' },
        { id: 'persona_assembly', name: 'Persona Card Assembly', description: 'Compile final persona card' },
        { id: 'statistics_verification', name: 'Statistics & Verification', description: 'Generate final statistics' }
      ]
    }
  ],
  metadata: {
    estimatedDuration: '8-10 minutes'
  }
};

export const StagewiseIntegration = ({ 
  onWorkflowComplete, 
  onStepUpdate 
}: StagewiseIntegrationProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');

  // Initialize steps from workflow definition
  useEffect(() => {
    const allSteps = personaExtractionWorkflow.phases.flatMap(phase => 
      phase.steps.map(step => ({
        id: step.id,
        name: step.name,
        description: step.description,
        status: 'pending' as const,
        progress: 0,
        duration: undefined,
        logs: []
      }))
    );
    setSteps(allSteps);
  }, []);

  const startWorkflow = async () => {
    setIsRunning(true);
    setWorkflowStatus('running');
    setCurrentStep(0);

    // Reset all steps
    setSteps(prev => prev.map(step => ({
      ...step,
      status: 'pending',
      progress: 0,
      logs: []
    })));

    // Simulate workflow execution
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Update step to running
      setSteps(prev => prev.map((step, index) => 
        index === i 
          ? { ...step, status: 'running', progress: 0 }
          : step
      ));

      // Simulate step progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setSteps(prev => prev.map((step, index) => 
          index === i 
            ? { ...step, progress }
            : step
        ));
      }

      // Mark step as completed
      setSteps(prev => prev.map((step, index) => 
        index === i 
          ? { 
              ...step, 
              status: 'completed', 
              progress: 100,
              duration: Math.random() * 30 + 5, // Random duration 5-35s
              logs: [`${step.name} completed successfully`]
            }
          : step
      ));

      if (onStepUpdate) {
        onStepUpdate(steps[i]);
      }
    }

    setIsRunning(false);
    setWorkflowStatus('completed');
    
    if (onWorkflowComplete) {
      onWorkflowComplete({ success: true, totalSteps: steps.length });
    }
  };

  const pauseWorkflow = () => {
    setIsRunning(false);
    setWorkflowStatus('idle');
  };

  const resetWorkflow = () => {
    setIsRunning(false);
    setWorkflowStatus('idle');
    setCurrentStep(0);
    setSteps(prev => prev.map(step => ({
      ...step,
      status: 'pending',
      progress: 0,
      logs: []
    })));
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPhaseForStep = (stepIndex: number) => {
    let accumulatedSteps = 0;
    for (const phase of personaExtractionWorkflow.phases) {
      if (stepIndex < accumulatedSteps + phase.steps.length) {
        return phase.name;
      }
      accumulatedSteps += phase.steps.length;
    }
    return 'unknown';
  };

  const overallProgress = steps.length > 0 
    ? (steps.filter(s => s.status === 'completed').length / steps.length) * 100
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Workflow Execution
              <Badge variant={
                workflowStatus === 'completed' ? 'default' :
                workflowStatus === 'running' ? 'secondary' :
                workflowStatus === 'error' ? 'destructive' : 'outline'
              }>
                {workflowStatus.charAt(0).toUpperCase() + workflowStatus.slice(1)}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {personaExtractionWorkflow.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={startWorkflow}
              disabled={isRunning}
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Start'}
            </Button>
            {isRunning && (
              <Button size="sm" variant="outline" onClick={pauseWorkflow}>
                <Pause className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={resetWorkflow}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`p-3 border rounded-lg transition-all ${
                index === currentStep && isRunning ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{step.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getPhaseForStep(index)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    {step.status === 'running' && (
                      <Progress value={step.progress} className="h-1" />
                    )}
                    {step.logs && step.logs.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {step.logs.map((log, logIndex) => (
                          <div key={logIndex}>{log}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {step.duration && (
                    <div>{step.duration.toFixed(1)}s</div>
                  )}
                  <div>Step {index + 1}/{steps.length}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {steps.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {steps.filter(s => s.status === 'running').length}
              </div>
              <div className="text-xs text-muted-foreground">Running</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">
                {steps.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {personaExtractionWorkflow.metadata.estimatedDuration}
              </div>
              <div className="text-xs text-muted-foreground">Est. Duration</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
