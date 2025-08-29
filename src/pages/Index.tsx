import { useState } from 'react';
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FusionWeightControls } from "@/components/Landing/FusionWeightControls";
import { WebCrawlTab } from "@/components/Landing/WebCrawlTab";
import { FileUploadTab } from "@/components/Landing/FileUploadTab";
import { QuestionnaireTab } from "@/components/Landing/QuestionnaireTab";
import { Brain, Database, FileText, Globe, Shield, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const [fusionWeights, setFusionWeights] = useState({
    aiGeneration: 40,
    webExtraction: 15,
    fileUpload: 15,
    questionnaire: 30
  });
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [aliases, setAliases] = useState('');

  const handleQuestionnaireSubmit = (answers: Record<string, number>) => {
    console.log('Questionnaire answers:', answers);
    setQuestionnaireCompleted(true);
  };

  const features = [
    {
      icon: Globe,
      title: "Web-Centric Extraction",
      description: "Intelligently discovers and analyzes public web content to build comprehensive persona profiles"
    },
    {
      icon: Brain,
      title: "Evidence-Backed Analysis",
      description: "Every persona attribute is supported by verifiable quotes and citations from credible sources"
    },
    {
      icon: Database,
      title: "Multi-Source Fusion",
      description: "Combines web data, document uploads, and questionnaire responses with configurable weightings"
    },
    {
      icon: Shield,
      title: "Transparent Processing",
      description: "Complete audit trail with step-by-step processing trace and verification statistics"
    },
    {
      icon: TrendingUp,
      title: "Quality Scoring",
      description: "Advanced quality metrics including source credibility, recency, and agreement analysis"
    },
    {
      icon: FileText,
      title: "Review Workflow",
      description: "Built-in reviewer approval process with commenting and audit logging capabilities"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <SEO title="Persona Extraction Prototype" description="Generate evidence-backed persona cards with a transparent processing trace." canonical={location.origin + '/'} />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Research Prototype v1.0
          </Badge>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              Persona Extraction
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Platform
            </h2>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Generate evidence-backed persona cards through intelligent web extraction, 
            document analysis, and optional questionnaire fusion — with complete transparency 
            and verification at every step.
          </p>

          <div className="flex justify-center gap-4">
            <a href="/personaextraction">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-blue px-8"
              >
                Start Extraction
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="/reviewer-admin">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/20 hover:bg-primary/5 px-8"
              >
                <Shield className="w-4 h-4 mr-2" />
                Reviewer Dashboard
              </Button>
            </a>
          </div>
        </div>

        {/* Start Extraction Dialog */}
        <Dialog open={isStartOpen} onOpenChange={setIsStartOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Start Persona Extraction</DialogTitle>
              <DialogDescription>
                Enter the subject and provide data sources. Adjust weights to control each source's influence.
              </DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Person Name</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Ada Lovelace"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aliases">Aliases (comma separated)</Label>
                <Input
                  id="aliases"
                  placeholder="e.g., Ada, Countess of Lovelace"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="web-crawl" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 h-12">
                  <TabsTrigger value="web-crawl" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Live Web Crawl
                  </TabsTrigger>
                  <TabsTrigger value="file-upload" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Files Upload
                  </TabsTrigger>
                  <TabsTrigger value="questionnaire" className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${questionnaireCompleted ? 'text-primary' : ''}`} />
                    Questionnaire
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="web-crawl">
                  <WebCrawlTab />
                </TabsContent>

                <TabsContent value="file-upload">
                  <FileUploadTab />
                </TabsContent>

                <TabsContent value="questionnaire">
                  <QuestionnaireTab
                    onSubmit={handleQuestionnaireSubmit}
                    completed={questionnaireCompleted}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-6">
              <FusionWeightControls
                weights={fusionWeights}
                onWeightsChange={setFusionWeights}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsStartOpen(false)}>
                Cancel
              </Button>
              <a href="/personaextraction">
                <Button disabled={!subject.trim()} className="bg-gradient-to-r from-primary to-accent">
                  Begin Extraction
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </DialogContent>
        </Dialog>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Process Overview */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">End-to-End Processing Pipeline</CardTitle>
            <p className="text-muted-foreground">
              17-step transparent extraction process with full audit trail
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">1-5</span>
                </div>
                <h4 className="font-medium">Discovery</h4>
                <p className="text-sm text-muted-foreground">Source identification and compliance</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">6-11</span>
                </div>
                <h4 className="font-medium">Extraction</h4>
                <p className="text-sm text-muted-foreground">Content normalization and quality scoring</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">12-15</span>
                </div>
                <h4 className="font-medium">Analysis</h4>
                <p className="text-sm text-muted-foreground">Attribute extraction and contradiction detection</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="text-primary font-bold">16-17</span>
                </div>
                <h4 className="font-medium">Verification</h4>
                <p className="text-sm text-muted-foreground">Statistics and validation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
