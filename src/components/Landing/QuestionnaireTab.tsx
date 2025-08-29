import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, CheckCircle, BarChart3, User, Briefcase, BookOpen, Users } from "lucide-react";

interface QuestionnaireTabProps {
  onSubmit: (answers: Record<string, number>) => void;
  completed: boolean;
}

const QUESTIONS = [
  // Core Personality (original 5)
  { 
    id: 'risk_tolerance', 
    label: 'Risk Tolerance', 
    hint: 'Conservative (0) → Risk-Taking (100)',
    description: 'How comfortable are you with uncertain outcomes?',
    category: 'Core Personality'
  },
  { 
    id: 'team_orientation', 
    label: 'Team Orientation', 
    hint: 'Individual (0) → Collaborative (100)',
    description: 'Do you prefer working alone or with teams?',
    category: 'Core Personality'
  },
  { 
    id: 'innovation_focus', 
    label: 'Innovation Approach', 
    hint: 'Incremental (0) → Disruptive (100)',
    description: 'How do you approach change and innovation?',
    category: 'Core Personality'
  },
  { 
    id: 'communication_style', 
    label: 'Communication Style', 
    hint: 'Direct (0) → Diplomatic (100)',
    description: 'How do you typically communicate with others?',
    category: 'Core Personality'
  },
  { 
    id: 'decision_making', 
    label: 'Decision Making', 
    hint: 'Analytical (0) → Intuitive (100)',
    description: 'How do you typically make important decisions?',
    category: 'Core Personality'
  },
  
  // Professional Style (5 new)
  { 
    id: 'work_motivation', 
    label: 'Work Motivation', 
    hint: 'Financial Reward (0) → Purpose/Impact (100)',
    description: 'What drives you most at work?',
    category: 'Professional Style'
  },
  { 
    id: 'professional_values', 
    label: 'Professional Values', 
    hint: 'Stability/Security (0) → Growth/Challenge (100)',
    description: 'What matters most in your career?',
    category: 'Professional Style'
  },
  { 
    id: 'leadership_style', 
    label: 'Leadership Style', 
    hint: 'Directive (0) → Coaching/Supportive (100)',
    description: 'How do you prefer to influence others?',
    category: 'Professional Style'
  },
  { 
    id: 'work_environment', 
    label: 'Work Style', 
    hint: 'Traditional/Office (0) → Flexible/Remote (100)',
    description: 'What\'s your ideal work environment?',
    category: 'Professional Style'
  },
  { 
    id: 'time_management', 
    label: 'Time Management', 
    hint: 'Structured/Planned (0) → Adaptive/Spontaneous (100)',
    description: 'How do you organize your work?',
    category: 'Professional Style'
  },
  
  // Learning & Growth (3 new)
  { 
    id: 'learning_preference', 
    label: 'Learning Preference', 
    hint: 'Structured/Formal (0) → Experiential/Self-directed (100)',
    description: 'How do you best acquire new skills?',
    category: 'Learning & Growth'
  },
  { 
    id: 'feedback_reception', 
    label: 'Feedback Reception', 
    hint: 'Private/Written (0) → Public/Verbal (100)',
    description: 'How do you prefer to receive feedback?',
    category: 'Learning & Growth'
  },
  { 
    id: 'technical_approach', 
    label: 'Technical Approach', 
    hint: 'Broad/Generalist (0) → Deep/Specialist (100)',
    description: 'How do you approach technical challenges?',
    category: 'Learning & Growth'
  },
  
  // Relationships & Influence (3 new)
  { 
    id: 'networking_approach', 
    label: 'Networking Approach', 
    hint: 'Formal/Strategic (0) → Casual/Organic (100)',
    description: 'How do you build professional relationships?',
    category: 'Relationships & Influence'
  },
  { 
    id: 'conflict_resolution', 
    label: 'Conflict Resolution', 
    hint: 'Avoid/Compromise (0) → Direct/Confrontational (100)',
    description: 'How do you handle disagreements?',
    category: 'Relationships & Influence'
  },
  { 
    id: 'knowledge_sharing', 
    label: 'Knowledge Sharing', 
    hint: 'Documentation/Writing (0) → Mentoring/Speaking (100)',
    description: 'How do you prefer to share expertise?',
    category: 'Relationships & Influence'
  }
];

export const QuestionnaireTab = ({ onSubmit, completed }: QuestionnaireTabProps) => {
  const [values, setValues] = useState<Record<string, number>>({
    // Core Personality
    risk_tolerance: 60,
    team_orientation: 70,
    innovation_focus: 65,
    communication_style: 55,
    decision_making: 50,
    
    // Professional Style
    work_motivation: 75,
    professional_values: 65,
    leadership_style: 60,
    work_environment: 70,
    time_management: 55,
    
    // Learning & Growth
    learning_preference: 65,
    feedback_reception: 45,
    technical_approach: 60,
    
    // Relationships & Influence
    networking_approach: 60,
    conflict_resolution: 40,
    knowledge_sharing: 55
  });

  const handleSubmit = () => {
    onSubmit(values);
  };

  const questionsByCategory = QUESTIONS.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, typeof QUESTIONS>);

  const categoryIcons = {
    'Core Personality': <User className="h-4 w-4" />,
    'Professional Style': <Briefcase className="h-4 w-4" />,
    'Learning & Growth': <BookOpen className="h-4 w-4" />,
    'Relationships & Influence': <Users className="h-4 w-4" />
  };

  const renderQuestionSection = (questions: typeof QUESTIONS) => (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="space-y-3">
          <div>
            <Label className="text-sm font-medium">{question.label}</Label>
            <p className="text-xs text-muted-foreground mt-1">{question.description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{question.hint.split(' → ')[0]}</span>
              <span className="font-mono bg-secondary px-2 py-1 rounded">
                {values[question.id]}
              </span>
              <span>{question.hint.split(' → ')[1]}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={values[question.id] ?? 50}
                onChange={(e) => setValues({ ...values, [question.id]: Number(e.target.value) })}
                className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
              />
              <Input
                type="number"
                min={0}
                max={100}
                value={values[question.id] ?? 50}
                onChange={(e) => setValues({ ...values, [question.id]: Number(e.target.value) })}
                className="w-16 h-8 text-xs text-center"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2 mb-6">
          <ClipboardList className="w-8 h-8 text-primary mx-auto" />
          <h3 className="text-lg font-semibold">Comprehensive Self-Assessment</h3>
          <p className="text-sm text-muted-foreground">
            Complete this enhanced questionnaire to maximize persona accuracy
          </p>
          <Badge variant="outline" className="text-xs">
            {QUESTIONS.length} Questions across 4 Categories
          </Badge>
        </div>

        {completed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Questionnaire Completed</p>
              <p className="text-xs text-green-600">Your responses will be included in the persona extraction</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="Core Personality" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {Object.keys(questionsByCategory).map((category) => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-1 text-xs">
                {categoryIcons[category as keyof typeof categoryIcons]}
                <span className="hidden sm:inline">{category.split(' ')[0]}</span>
                <span className="sm:hidden">{category.split(' ')[0][0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(questionsByCategory).map(([category, questions]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                    {category}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {category === 'Core Personality' && 'Fundamental traits that drive your behavior and preferences'}
                    {category === 'Professional Style' && 'Your approach to work, leadership, and career development'}
                    {category === 'Learning & Growth' && 'How you acquire knowledge and develop professionally'}
                    {category === 'Relationships & Influence' && 'Your style of building relationships and sharing knowledge'}
                  </p>
                </CardHeader>
                <CardContent>
                  {renderQuestionSection(questions)}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex gap-3">
          <Button 
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-primary to-accent"
            disabled={completed}
          >
            {completed ? 'Responses Saved' : 'Save All Responses'}
          </Button>
          <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
            <BarChart3 className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>

        <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200/50">
          <h4 className="font-medium text-sm mb-2">Enhanced self-assessment provides:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Comprehensive insight into professional and personal preferences</li>
            <li>• Multi-dimensional validation of extracted behavioral patterns</li>
            <li>• Professional context for leadership and work style</li>
            <li>• Learning and relationship patterns for deeper accuracy</li>
            <li>• Resolution of conflicting or ambiguous external signals</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};