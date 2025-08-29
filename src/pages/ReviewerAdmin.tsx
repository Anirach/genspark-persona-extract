import { useState } from 'react';
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PersonaCard } from "@/components/Persona/PersonaCard";
import StatsCharts from "@/components/Persona/StatsCharts";
import { downloadCSV, downloadJSON } from "@/utils/download";
import type { RunRecord, RunStats, QuoteEvidence, PersonaCardData, RunStep } from "@/types/run";
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  GitBranch,
  MessageSquare,
  ShieldCheck,
  Eye,
  Download,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Edit,
  Trash2,
  ExternalLink,
  User,
  Calendar,
  Hash,
  Link,
  BarChart3
} from "lucide-react";

// Mock data - in a real app this would come from an API
const loadLatestRun = (): RunRecord | null => {
  try {
    const all = JSON.parse(localStorage.getItem("persona_runs") || "[]") as RunRecord[];
    return all[0] || null;
  } catch {
    return null;
  }
};

// Mock subjects data for selection
const mockSubjects = [
  {
    id: "john-doe",
    name: "John Doe",
    role: "Senior Product Manager",
    company: "TechCorp",
    lastUpdated: "2024-12-01"
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "VP of Engineering",
    company: "StartupLabs",
    lastUpdated: "2024-11-28"
  },
  {
    id: "mike-rodriguez",
    name: "Mike Rodriguez",
    role: "Chief Data Scientist",
    company: "DataFlow Inc",
    lastUpdated: "2024-11-25"
  },
  {
    id: "emma-watson",
    name: "Emma Watson",
    role: "Head of AI Research",
    company: "InnovateAI",
    lastUpdated: "2024-11-30"
  }
];

// Mock persona data for different subjects
const mockPersonaDataMap: Record<string, PersonaCardData> = {
  "john-doe": {
    role: "Senior Product Manager",
    expertise: "ML Systems & Product Strategy",
    mindset: "Data-driven, pragmatic decision maker",
    personality: "Direct communicator with high curiosity",
    description: "Experienced product leader with deep technical background in machine learning systems. Known for bridging engineering and business needs effectively.",
    confidence: 0.82,
    confidenceBand: "H" as const,
    quotes: [
      { attribute: "role", quote: "Led cross-functional teams to ship ML features.", url: "https://news.example.com/interview", title: "Leadership Interview", date: "2024-05-03", chunk_id: "doc12#c7", weight: 0.9 },
      { attribute: "expertise", quote: "Deep expertise in ML systems and product strategy.", url: "https://blog.example.com/keynote", title: "Keynote Recap", date: "2024-09-12", chunk_id: "doc2#c3", weight: 0.86 },
      { attribute: "mindset", quote: "Always start with data before making product decisions.", url: "https://podcast.example.com/ep42", title: "Product Podcast", date: "2024-03-15", chunk_id: "doc5#c1", weight: 0.78 },
      { attribute: "personality", quote: "I prefer direct communication over diplomatic dancing.", url: "https://interview.example.com/candid", title: "Candid Interview", date: "2024-01-20", chunk_id: "doc8#c4", weight: 0.85 }
    ]
  },
  "sarah-chen": {
    role: "VP of Engineering",
    expertise: "Distributed Systems & Team Leadership",
    mindset: "Scaling technology and people simultaneously",
    personality: "Collaborative leader with technical depth",
    description: "Engineering executive with strong track record of building and scaling high-performance engineering teams. Expert in distributed systems architecture.",
    confidence: 0.89,
    confidenceBand: "H" as const,
    quotes: [
      { attribute: "role", quote: "Built engineering organization from 15 to 150+ engineers.", url: "https://techcrunch.com/sarah-interview", title: "Tech Leadership", date: "2024-06-15", chunk_id: "doc3#c2", weight: 0.92 },
      { attribute: "expertise", quote: "Deep experience in microservices and distributed systems.", url: "https://blog.sarahchen.com/systems", title: "Personal Blog", date: "2024-04-20", chunk_id: "doc7#c1", weight: 0.88 },
      { attribute: "mindset", quote: "You can't scale technology without scaling people.", url: "https://podcast.engineering.com/ep15", title: "Engineering Podcast", date: "2024-02-10", chunk_id: "doc4#c3", weight: 0.85 },
      { attribute: "personality", quote: "I believe in leading through influence, not authority.", url: "https://medium.com/@sarahc/leadership", title: "Leadership Article", date: "2024-01-25", chunk_id: "doc9#c2", weight: 0.87 }
    ]
  },
  "mike-rodriguez": {
    role: "Chief Data Scientist",
    expertise: "Machine Learning & Statistical Modeling",
    mindset: "Evidence-based decision making advocate",
    personality: "Analytical thinker with strong communication skills",
    description: "Senior data science leader with expertise in ML model development and deployment. Known for translating complex analytics into business insights.",
    confidence: 0.76,
    confidenceBand: "M" as const,
    quotes: [
      { attribute: "role", quote: "Leading data science initiatives across multiple product lines.", url: "https://datascience.today/mike-profile", title: "DS Profile", date: "2024-07-12", chunk_id: "doc6#c4", weight: 0.83 },
      { attribute: "expertise", quote: "Specialized in deep learning and predictive analytics.", url: "https://mlconf.com/speakers/mike", title: "Conference Bio", date: "2024-05-18", chunk_id: "doc11#c1", weight: 0.79 },
      { attribute: "mindset", quote: "Every business decision should be backed by data.", url: "https://businessanalytics.com/interview", title: "Analytics Interview", date: "2024-03-22", chunk_id: "doc13#c5", weight: 0.74 },
      { attribute: "personality", quote: "I enjoy making complex data stories accessible to everyone.", url: "https://linkedin.com/in/mike-r/posts", title: "LinkedIn Post", date: "2024-02-14", chunk_id: "doc15#c2", weight: 0.71 }
    ]
  },
  "emma-watson": {
    role: "Head of AI Research",
    expertise: "Neural Networks & Computer Vision",
    mindset: "Pushing boundaries of AI capabilities",
    personality: "Visionary researcher with practical focus",
    description: "AI research leader with publications in top-tier conferences. Focuses on bridging academic research with practical AI applications.",
    confidence: 0.94,
    confidenceBand: "H" as const,
    quotes: [
      { attribute: "role", quote: "Leading breakthrough research in computer vision applications.", url: "https://arxiv.org/papers/emma-cv", title: "Research Paper", date: "2024-08-30", chunk_id: "doc18#c1", weight: 0.96 },
      { attribute: "expertise", quote: "Expert in convolutional neural networks and transformer architectures.", url: "https://neurips.cc/speakers/emma", title: "NeurIPS Bio", date: "2024-06-05", chunk_id: "doc20#c3", weight: 0.93 },
      { attribute: "mindset", quote: "Research without real-world impact is just academic exercise.", url: "https://airesearch.blog/emma-interview", title: "AI Blog Interview", date: "2024-04-18", chunk_id: "doc22#c2", weight: 0.91 },
      { attribute: "personality", quote: "I believe in making AI accessible and understandable.", url: "https://tedx.com/talks/emma-ai", title: "TEDx Talk", date: "2024-03-08", chunk_id: "doc24#c4", weight: 0.89 }
    ]
  }
};

const mockDocuments = [
  {
    id: "doc1",
    title: "LinkedIn Profile",
    url: "https://linkedin.com/in/example",
    type: "Social Media",
    dateScraped: "2024-12-01",
    quality: 0.89,
    chunks: 12,
    tokens: 2847,
    status: "processed"
  },
  {
    id: "doc2",
    title: "Company Blog Post",
    url: "https://company.com/blog/ml-strategy",
    type: "Blog Post",
    dateScraped: "2024-12-01",
    quality: 0.94,
    chunks: 8,
    tokens: 3421,
    status: "processed"
  },
  {
    id: "doc3",
    title: "Conference Presentation",
    url: "https://conf.example.com/2024/presentations",
    type: "Presentation",
    dateScraped: "2024-12-01",
    quality: 0.76,
    chunks: 15,
    tokens: 4256,
    status: "processed"
  }
];

const mockProcessingSteps = [
  { key: "initialize", label: "Initialize", status: "done", startedAt: 1700000000, finishedAt: 1700000010, logs: ["Run initialized with subject: John Doe", "Configuration validated"] },
  { key: "seed_aliases", label: "Seed & Alias Expansion", status: "done", startedAt: 1700000010, finishedAt: 1700000025, logs: ["Found 3 aliases", "Expanded search terms"] },
  { key: "query_generation", label: "Query Generation", status: "done", startedAt: 1700000025, finishedAt: 1700000040, logs: ["Generated 12 search queries", "Queries optimized for relevance"] },
  { key: "source_discovery", label: "Source Discovery", status: "done", startedAt: 1700000040, finishedAt: 1700000120, logs: ["Discovered 120 candidate sources", "Filtered to 96 high-quality sources"] },
  { key: "compliance_scheduling", label: "Compliance & Scheduling", status: "done", startedAt: 1700000120, finishedAt: 1700000130, logs: ["Respect robots.txt policies", "Rate limiting configured"] },
  { key: "fetching_snapshotting", label: "Fetching & Snapshotting", status: "done", startedAt: 1700000130, finishedAt: 1700000300, logs: ["Fetched 96 sources", "Created snapshots for archival"] },
  { key: "normalization", label: "Normalization", status: "done", startedAt: 1700000300, finishedAt: 1700000320, logs: ["Normalized content format", "Extracted structured data"] },
  { key: "quality_scoring", label: "Quality Scoring", status: "done", startedAt: 1700000320, finishedAt: 1700000340, logs: ["Scored source credibility", "Quality median: 0.72"] },
] as RunStep[];

const mockComments = [
  {
    id: "1",
    author: "Sarah Johnson",
    role: "Senior Reviewer",
    timestamp: "2024-12-01T10:30:00Z",
    type: "approval" as const,
    content: "The evidence quality is excellent. All quotes are well-sourced and the confidence metrics align with my assessment.",
    targetSection: "persona-card"
  },
  {
    id: "2",
    author: "Mike Chen",
    role: "Data Analyst",
    timestamp: "2024-12-01T09:15:00Z",
    type: "concern" as const,
    content: "The sample size for personality traits seems limited. Consider gathering more behavioral evidence.",
    targetSection: "evidence"
  },
  {
    id: "3",
    author: "Alex Rivera",
    role: "Compliance Officer",
    timestamp: "2024-12-01T08:45:00Z",
    type: "info" as const,
    content: "All sources comply with data collection policies. No privacy concerns identified.",
    targetSection: "governance"
  }
];

const mockStats: RunStats = {
  coverage: { discovered: 120, fetched: 96, kept: 42, uniqueDomains: 28, documents: 42, chunks: 1048, tokens: 98000, languages: { en: 36, es: 4, fr: 2 } },
  qualityRecency: { qualityMedian: 0.72, firstPersonRatio: 0.31, freshnessDaysMedian: 210 },
  evidenceStrength: { quotesPerAttribute: { role: 3, expertise: 4, mindset: 3, personality: 2, description: 4 }, uniqueSources: 18, domainDiversity: 0.86 },
  agreementConflicts: { agreementIndex: 0.78, conflicts: 2 },
  confidence: 0.78,
};

// Mock stats data for individual subjects
const mockStatsMap: Record<string, RunStats> = {
  "john-doe": {
    coverage: { discovered: 120, fetched: 96, kept: 42, uniqueDomains: 28, documents: 42, chunks: 1048, tokens: 98000, languages: { en: 36, es: 4, fr: 2 } },
    qualityRecency: { qualityMedian: 0.72, firstPersonRatio: 0.31, freshnessDaysMedian: 210 },
    evidenceStrength: { quotesPerAttribute: { role: 3, expertise: 4, mindset: 3, personality: 2, description: 4 }, uniqueSources: 18, domainDiversity: 0.86 },
    agreementConflicts: { agreementIndex: 0.78, conflicts: 2 },
    confidence: 0.78,
  },
  "sarah-chen": {
    coverage: { discovered: 156, fetched: 134, kept: 67, uniqueDomains: 35, documents: 67, chunks: 1523, tokens: 142000, languages: { en: 58, es: 6, fr: 3 } },
    qualityRecency: { qualityMedian: 0.84, firstPersonRatio: 0.42, freshnessDaysMedian: 145 },
    evidenceStrength: { quotesPerAttribute: { role: 5, expertise: 6, mindset: 4, personality: 4, description: 5 }, uniqueSources: 28, domainDiversity: 0.91 },
    agreementConflicts: { agreementIndex: 0.89, conflicts: 1 },
    confidence: 0.89,
  },
  "mike-rodriguez": {
    coverage: { discovered: 89, fetched: 71, kept: 31, uniqueDomains: 19, documents: 31, chunks: 756, tokens: 67000, languages: { en: 27, es: 3, fr: 1 } },
    qualityRecency: { qualityMedian: 0.68, firstPersonRatio: 0.24, freshnessDaysMedian: 285 },
    evidenceStrength: { quotesPerAttribute: { role: 2, expertise: 3, mindset: 2, personality: 2, description: 3 }, uniqueSources: 14, domainDiversity: 0.73 },
    agreementConflicts: { agreementIndex: 0.71, conflicts: 3 },
    confidence: 0.76,
  },
  "emma-watson": {
    coverage: { discovered: 203, fetched: 187, kept: 89, uniqueDomains: 42, documents: 89, chunks: 2134, tokens: 198000, languages: { en: 78, es: 7, fr: 4 } },
    qualityRecency: { qualityMedian: 0.91, firstPersonRatio: 0.56, freshnessDaysMedian: 78 },
    evidenceStrength: { quotesPerAttribute: { role: 7, expertise: 8, mindset: 6, personality: 5, description: 7 }, uniqueSources: 35, domainDiversity: 0.94 },
    agreementConflicts: { agreementIndex: 0.94, conflicts: 0 },
    confidence: 0.94,
  }
};

// Aggregated stats for all subjects view
const mockAggregatedStats: RunStats = {
  coverage: { 
    discovered: 568, 
    fetched: 488, 
    kept: 229, 
    uniqueDomains: 124, 
    documents: 229, 
    chunks: 5461, 
    tokens: 505000, 
    languages: { en: 199, es: 20, fr: 10 } 
  },
  qualityRecency: { qualityMedian: 0.79, firstPersonRatio: 0.38, freshnessDaysMedian: 180 },
  evidenceStrength: { 
    quotesPerAttribute: { role: 17, expertise: 21, mindset: 15, personality: 13, description: 19 }, 
    uniqueSources: 95, 
    domainDiversity: 0.86 
  },
  agreementConflicts: { agreementIndex: 0.83, conflicts: 6 },
  confidence: 0.84,
};

const ReviewerAdmin = () => {
  const [activeTab, setActiveTab] = useState("persona-card");
  const [newComment, setNewComment] = useState("");
  const [commentType, setCommentType] = useState<"approval" | "concern" | "info">("info");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [selectedSubject, setSelectedSubject] = useState("john-doe");
  const [statsViewMode, setStatsViewMode] = useState<"current" | "all">("current");

  const run = loadLatestRun();
  const currentSubject = mockSubjects.find(s => s.id === selectedSubject) || mockSubjects[0];
  const currentPersonaData = mockPersonaDataMap[selectedSubject] || mockPersonaDataMap["john-doe"];
  const currentStats = statsViewMode === "all" ? mockAggregatedStats : (mockStatsMap[selectedSubject] || mockStatsMap["john-doe"]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // In a real app, this would make an API call
    console.log("Adding comment:", {
      content: newComment,
      type: commentType,
      targetSection: activeTab
    });
    
    setNewComment("");
    setIsAddingComment(false);
  };

  const handleApprovePersona = () => {
    setReviewStatus("approved");
    // In a real app, this would make an API call
    console.log("Persona approved");
  };

  const handleRejectPersona = () => {
    setReviewStatus("rejected");
    // In a real app, this would make an API call
    console.log("Persona rejected");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "running": return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case "error": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCommentTypeIcon = (type: string) => {
    switch (type) {
      case "approval": return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case "concern": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <MessageSquare className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="h-12 flex items-center justify-between border-b px-4">
            <div className="flex items-center">
              <SidebarTrigger className="mr-2" />
              <span className="text-sm text-muted-foreground">Reviewer & Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={reviewStatus === "approved" ? "default" : reviewStatus === "rejected" ? "destructive" : "secondary"}>
                {reviewStatus === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                {reviewStatus === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                {reviewStatus === "pending" && <Clock className="h-3 w-3 mr-1" />}
                {reviewStatus.charAt(0).toUpperCase() + reviewStatus.slice(1)}
              </Badge>
              {reviewStatus === "pending" && (
                <>
                  <Button size="sm" variant="outline" onClick={handleRejectPersona}>
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" onClick={handleApprovePersona}>
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </>
              )}
            </div>
          </header>

          <div className="min-h-screen bg-gray-50/50">
            <SEO 
              title="Reviewer & Admin Dashboard" 
              description="Review persona extraction results, evidence, processing trace, and manage approval workflow." 
              canonical={location.origin + "/reviewer-admin"} 
            />
            
            <header className="bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold tracking-tight">Reviewer & Admin Dashboard</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="subject-select" className="text-sm font-medium text-muted-foreground">Subject:</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger id="subject-select" className="w-[280px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSubjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              <div className="flex items-center justify-between w-full">
                                <span className="font-medium">{subject.name}</span>
                                <span className="text-xs text-muted-foreground ml-4">
                                  {new Date(subject.lastUpdated).toLocaleDateString()}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator orientation="vertical" className="h-6" />
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Role:</span> {currentSubject.role}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Company:</span> {currentSubject.company}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export All
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
            </header>

            <main className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 bg-white">
                  <TabsTrigger value="persona-card" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Persona Card
                  </TabsTrigger>
                  <TabsTrigger value="evidence" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Evidence
                  </TabsTrigger>
                  <TabsTrigger value="processing" className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Processing Trace
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Stats & Verification
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments & Actions
                  </TabsTrigger>
                  <TabsTrigger value="governance" className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Governance
                  </TabsTrigger>
                </TabsList>

                {/* Subject Summary Bar */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-900">{currentSubject.name}</span>
                        </div>
                        <div className="text-sm text-blue-700">
                          <span className="font-medium">Role:</span> {currentPersonaData.role}
                        </div>
                        <div className="text-sm text-blue-700">
                          <span className="font-medium">Expertise:</span> {currentPersonaData.expertise}
                        </div>
                        <div className="text-sm text-blue-700">
                          <span className="font-medium">Company:</span> {currentSubject.company}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white">
                          Confidence: {Math.round(currentPersonaData.confidence * 100)}%
                        </Badge>
                        <Badge variant={currentPersonaData.confidenceBand === "H" ? "default" : currentPersonaData.confidenceBand === "M" ? "secondary" : "destructive"}>
                          {currentPersonaData.confidenceBand === "H" ? "High Quality" : currentPersonaData.confidenceBand === "M" ? "Medium Quality" : "Low Quality"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Persona Card Tab */}
                <TabsContent value="persona-card" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Generated Persona Card
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Confidence: {Math.round(currentPersonaData.confidence * 100)}%</Badge>
                          <Badge variant={currentPersonaData.confidenceBand === "H" ? "default" : "secondary"}>
                            {currentPersonaData.confidenceBand === "H" ? "High" : currentPersonaData.confidenceBand === "M" ? "Medium" : "Low"}
                          </Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PersonaCard data={currentPersonaData} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Evidence Tab */}
                <TabsContent value="evidence" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Source Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Document</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Quality Score</TableHead>
                            <TableHead>Chunks</TableHead>
                            <TableHead>Tokens</TableHead>
                            <TableHead>Date Scraped</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockDocuments.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{doc.title}</div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Link className="h-3 w-3" />
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                      {doc.url}
                                    </a>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{doc.type}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={doc.quality * 100} className="w-16" />
                                  <span className="text-sm">{Math.round(doc.quality * 100)}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{doc.chunks}</TableCell>
                              <TableCell>{doc.tokens.toLocaleString()}</TableCell>
                              <TableCell>{new Date(doc.dateScraped).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quote Evidence Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {currentPersonaData.quotes.map((quote, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{quote.attribute}</Badge>
                                  <Badge variant="outline">Weight: {Math.round((quote.weight || 0) * 100)}%</Badge>
                                </div>
                                <blockquote className="text-lg border-l-4 border-primary pl-4">
                                  "{quote.quote}"
                                </blockquote>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {quote.title}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {quote.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    {quote.chunk_id}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Flag className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Processing Trace Tab */}
                <TabsContent value="processing" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Processing Pipeline Trace</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockProcessingSteps.map((step, index) => (
                          <div key={step.key} className="flex gap-4 p-4 border rounded-lg">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <span className="text-sm font-medium">{index + 1}</span>
                              </div>
                              {index < mockProcessingSteps.length - 1 && (
                                <div className="w-px h-12 bg-border mt-2" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(step.status)}
                                  <h3 className="font-medium">{step.label}</h3>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {step.startedAt && step.finishedAt && (
                                    <span>{((step.finishedAt - step.startedAt) / 1000).toFixed(1)}s</span>
                                  )}
                                </div>
                              </div>
                              {step.logs && step.logs.length > 0 && (
                                <div className="bg-gray-50 rounded p-3 space-y-1">
                                  {step.logs.map((log, logIndex) => (
                                    <div key={logIndex} className="text-sm text-muted-foreground">
                                      {log}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Stats & Verification Tab */}
                <TabsContent value="stats" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Stats & Verification
                        <div className="flex items-center gap-2">
                          <Label htmlFor="stats-view" className="text-sm font-medium">View:</Label>
                          <Select value={statsViewMode} onValueChange={(value: "current" | "all") => setStatsViewMode(value)}>
                            <SelectTrigger id="stats-view" className="w-[180px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="current">
                                Current Subject Only
                              </SelectItem>
                              <SelectItem value="all">
                                All Subjects Combined
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {statsViewMode === "current" 
                          ? `Showing statistics for ${currentSubject.name}` 
                          : `Showing aggregated statistics for all ${mockSubjects.length} subjects`
                        }
                      </div>
                    </CardHeader>
                  </Card>

                  <StatsCharts stats={currentStats} />
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Coverage Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Sources Discovered</span>
                          <span className="font-medium">{currentStats.coverage.discovered}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sources Fetched</span>
                          <span className="font-medium">{currentStats.coverage.fetched}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Unique Domains</span>
                          <span className="font-medium">{currentStats.coverage.uniqueDomains}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Tokens</span>
                          <span className="font-medium">{currentStats.coverage.tokens.toLocaleString()}</span>
                        </div>
                        {statsViewMode === "all" && (
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="font-medium">Total Documents</span>
                            <span className="font-medium">{currentStats.coverage.documents}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quality Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Quality Median</span>
                          <span className="font-medium">{Math.round(currentStats.qualityRecency.qualityMedian * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Agreement Index</span>
                          <span className="font-medium">{Math.round(currentStats.agreementConflicts.agreementIndex * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conflicts Detected</span>
                          <span className="font-medium">{currentStats.agreementConflicts.conflicts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overall Confidence</span>
                          <span className="font-medium">{Math.round(currentStats.confidence * 100)}%</span>
                        </div>
                        {statsViewMode === "all" && (
                          <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="font-medium">Total Sources</span>
                            <span className="font-medium">{currentStats.evidenceStrength.uniqueSources}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {statsViewMode === "all" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Subject Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {mockSubjects.map((subject) => {
                            const subjectStats = mockStatsMap[subject.id];
                            return (
                              <div key={subject.id} className="p-4 border rounded-lg space-y-2">
                                <div className="font-medium">{subject.name}</div>
                                <div className="text-sm text-muted-foreground">{subject.company}</div>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between">
                                    <span>Documents:</span>
                                    <span>{subjectStats.coverage.documents}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Confidence:</span>
                                    <span>{Math.round(subjectStats.confidence * 100)}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Quality:</span>
                                    <span>{Math.round(subjectStats.qualityRecency.qualityMedian * 100)}%</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Comments & Actions Tab */}
                <TabsContent value="comments" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Review Comments & Actions
                        <Dialog open={isAddingComment} onOpenChange={setIsAddingComment}>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Add Comment
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Review Comment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="comment-type">Comment Type</Label>
                                <Select value={commentType} onValueChange={(value: "approval" | "concern" | "info") => setCommentType(value)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="info">Information</SelectItem>
                                    <SelectItem value="concern">Concern</SelectItem>
                                    <SelectItem value="approval">Approval</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="comment-content">Comment</Label>
                                <Textarea
                                  id="comment-content"
                                  placeholder="Enter your review comment..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsAddingComment(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAddComment}>
                                  Add Comment
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockComments.map((comment) => (
                          <div key={comment.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                {getCommentTypeIcon(comment.type)}
                                <div>
                                  <div className="font-medium">{comment.author}</div>
                                  <div className="text-sm text-muted-foreground">{comment.role}</div>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                Section: {comment.targetSection}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Governance Tab */}
                <TabsContent value="governance" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Compliance Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Data Privacy Compliance</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Compliant</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Source Attribution</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Complete</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Rate Limiting Respected</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Yes</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Robots.txt Compliance</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Verified</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Audit Trail</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <div className="font-medium">Extraction Started</div>
                          <div className="text-muted-foreground">2024-12-01 10:00:00 UTC</div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Sources Accessed</div>
                          <div className="text-muted-foreground">96 websites, all public</div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Data Retention Policy</div>
                          <div className="text-muted-foreground">90 days, auto-purge enabled</div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Review Required By</div>
                          <div className="text-muted-foreground">2024-12-08 (7 days)</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Data Handling & Privacy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Alert>
                        <ShieldCheck className="h-4 w-4" />
                        <AlertDescription>
                          All extracted data is processed according to our privacy policy. Only publicly available information 
                          is collected, and all sources are properly attributed. Personal identifiable information is anonymized 
                          where possible, and sensitive data is excluded from processing.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="mt-4 space-y-3">
                        <div>
                          <h4 className="font-medium">Source Verification</h4>
                          <p className="text-sm text-muted-foreground">
                            All {mockStats.coverage.uniqueDomains} domains have been verified for public accessibility and compliance with terms of service.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">Data Minimization</h4>
                          <p className="text-sm text-muted-foreground">
                            Only relevant persona-related content is extracted and processed. Irrelevant personal details are filtered out.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">Retention Period</h4>
                          <p className="text-sm text-muted-foreground">
                            Raw source data is retained for 90 days for verification purposes, then automatically deleted.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ReviewerAdmin;
