import { useState } from 'react';
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import StatsCharts from "@/components/Persona/StatsCharts";
import type { RunStats } from "@/types/run";
import {
  BarChart3,
  Users,
  Globe,
  Database,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Download,
  RefreshCw,
  Server,
  Eye,
  FileText,
  Shield,
  Target
} from "lucide-react";

// Mock system data
const systemStats = {
  totalExtractions: 847,
  activeUsers: 23,
  totalSubjects: 156,
  successRate: 0.94,
  avgProcessingTime: 142, // seconds
  totalDataProcessed: 2.4, // TB
  uptime: 99.7, // percentage
  apiCalls: 45683,
  storageUsed: 1.8, // TB
  storageTotal: 5.0 // TB
};

const recentExtractions = [
  { id: 1, subject: "Alice Johnson", status: "completed", duration: 138, confidence: 0.89, timestamp: "2024-12-01T10:30:00Z" },
  { id: 2, subject: "Bob Smith", status: "processing", duration: 45, confidence: null, timestamp: "2024-12-01T10:25:00Z" },
  { id: 3, subject: "Carol Davis", status: "completed", duration: 156, confidence: 0.92, timestamp: "2024-12-01T10:15:00Z" },
  { id: 4, subject: "David Wilson", status: "failed", duration: 89, confidence: null, timestamp: "2024-12-01T10:10:00Z" },
  { id: 5, subject: "Eve Brown", status: "completed", duration: 203, confidence: 0.76, timestamp: "2024-12-01T10:05:00Z" }
];

const systemHealth = [
  { component: "API Gateway", status: "healthy", uptime: 99.9, lastCheck: "1 min ago" },
  { component: "Database", status: "healthy", uptime: 99.8, lastCheck: "1 min ago" },
  { component: "Web Crawler", status: "degraded", uptime: 97.2, lastCheck: "2 min ago" },
  { component: "ML Pipeline", status: "healthy", uptime: 99.5, lastCheck: "1 min ago" },
  { component: "Storage", status: "healthy", uptime: 99.9, lastCheck: "30 sec ago" }
];

const resourceUsage = {
  cpu: 67,
  memory: 84,
  disk: 36,
  network: 45
};

// Overall system stats for verification
const overallStats: RunStats = {
  coverage: { 
    discovered: 2847, 
    fetched: 2456, 
    kept: 1234, 
    uniqueDomains: 487, 
    documents: 1234, 
    chunks: 28947, 
    tokens: 2850000, 
    languages: { en: 1089, es: 98, fr: 47 } 
  },
  qualityRecency: { qualityMedian: 0.81, firstPersonRatio: 0.42, freshnessDaysMedian: 165 },
  evidenceStrength: { 
    quotesPerAttribute: { role: 89, expertise: 134, mindset: 76, personality: 92, description: 118 }, 
    uniqueSources: 487, 
    domainDiversity: 0.88 
  },
  agreementConflicts: { agreementIndex: 0.85, conflicts: 23 },
  confidence: 0.83,
};

const qualityDistribution = [
  { band: "High (80-100%)", count: 78, percentage: 50 },
  { band: "Medium (60-79%)", count: 54, percentage: 35 },
  { band: "Low (40-59%)", count: 20, percentage: 13 },
  { band: "Very Low (<40%)", count: 4, percentage: 2 }
];

const verificationMetrics = [
  { metric: "Sources Verified", value: 1189, total: 1234, percentage: 96.4 },
  { metric: "Quotes Validated", value: 498, total: 509, percentage: 97.8 },
  { metric: "Conflicts Resolved", value: 21, total: 23, percentage: 91.3 },
  { metric: "Manual Reviews", value: 45, total: 156, percentage: 28.8 }
];

const confidenceTrends = [
  { period: "Last 7 days", avgConfidence: 0.86, extractions: 23 },
  { period: "Last 30 days", avgConfidence: 0.83, extractions: 94 },
  { period: "Last 90 days", avgConfidence: 0.81, extractions: 156 },
  { period: "All time", avgConfidence: 0.80, extractions: 847 }
];

const SystemDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "processing": return "text-blue-600";
      case "failed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "processing": return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case "failed": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getHealthStatus = (status: string) => {
    switch (status) {
      case "healthy": return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
      case "degraded": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Degraded</Badge>;
      case "down": return <Badge variant="destructive">Down</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
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
              <span className="text-sm text-muted-foreground">System Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </header>

          <div className="min-h-screen bg-gray-50/50">
            <SEO 
              title="System Dashboard" 
              description="Monitor system performance, health, and overall statistics for the persona extraction platform." 
              canonical={location.origin + "/system-dashboard"} 
            />
            
            <header className="bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">System Dashboard</h1>
                  <p className="text-muted-foreground">Monitor platform performance and system health</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">System Uptime</div>
                    <div className="text-lg font-semibold text-green-600">{systemStats.uptime}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                    <div className="text-lg font-semibold text-green-600">{Math.round(systemStats.successRate * 100)}%</div>
                  </div>
                </div>
              </div>
            </header>

            <main className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 bg-white">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="extractions" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Extractions
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Stats & Verification
                  </TabsTrigger>
                  <TabsTrigger value="health" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    System Health
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Resources
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Extractions</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{systemStats.totalExtractions.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3 inline mr-1" />
                          +12% from last month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{systemStats.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">
                          Currently online
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{systemStats.totalSubjects}</div>
                        <p className="text-xs text-muted-foreground">
                          Personas created
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{systemStats.avgProcessingTime}s</div>
                        <p className="text-xs text-muted-foreground">
                          Per extraction
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Data Processing Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Data Processed</span>
                          <span className="font-medium">{systemStats.totalDataProcessed} TB</span>
                        </div>
                        <div className="flex justify-between">
                          <span>API Calls</span>
                          <span className="font-medium">{systemStats.apiCalls.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Storage Used</span>
                          <span className="font-medium">{systemStats.storageUsed} TB / {systemStats.storageTotal} TB</span>
                        </div>
                        <Progress value={(systemStats.storageUsed / systemStats.storageTotal) * 100} className="w-full" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>System Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            All systems operational. Performance is within normal parameters.
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>System Uptime</span>
                            <span className="font-medium text-green-600">{systemStats.uptime}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Success Rate</span>
                            <span className="font-medium text-green-600">{Math.round(systemStats.successRate * 100)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Extractions Tab */}
                <TabsContent value="extractions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Extractions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Confidence</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentExtractions.map((extraction) => (
                            <TableRow key={extraction.id}>
                              <TableCell className="font-medium">{extraction.subject}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(extraction.status)}
                                  <span className={getStatusColor(extraction.status)}>
                                    {extraction.status.charAt(0).toUpperCase() + extraction.status.slice(1)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{extraction.duration}s</TableCell>
                              <TableCell>
                                {extraction.confidence ? `${Math.round(extraction.confidence * 100)}%` : "—"}
                              </TableCell>
                              <TableCell>{new Date(extraction.timestamp).toLocaleString()}</TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Stats & Verification Tab */}
                <TabsContent value="stats" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Overall Statistics & Verification
                        <Badge variant="outline" className="text-sm">
                          {systemStats.totalSubjects} Total Subjects
                        </Badge>
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        Aggregated statistics across all persona extractions and verification metrics
                      </div>
                    </CardHeader>
                  </Card>

                  <StatsCharts stats={overallStats} />

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quality Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {qualityDistribution.map((band, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span>{band.band}</span>
                              <span className="font-medium">{band.count} subjects ({band.percentage}%)</span>
                            </div>
                            <Progress value={band.percentage} className="w-full" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Verification Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {verificationMetrics.map((metric, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between">
                              <span>{metric.metric}</span>
                              <span className="font-medium">{metric.value}/{metric.total} ({metric.percentage.toFixed(1)}%)</span>
                            </div>
                            <Progress value={metric.percentage} className="w-full" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Coverage Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Sources Discovered</span>
                          <span className="font-medium">{overallStats.coverage.discovered.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sources Successfully Fetched</span>
                          <span className="font-medium">{overallStats.coverage.fetched.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Unique Domains</span>
                          <span className="font-medium">{overallStats.coverage.uniqueDomains}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Documents</span>
                          <span className="font-medium">{overallStats.coverage.documents.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Tokens Processed</span>
                          <span className="font-medium">{(overallStats.coverage.tokens / 1000000).toFixed(1)}M</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quality Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Quality Median</span>
                          <span className="font-medium">{Math.round(overallStats.qualityRecency.qualityMedian * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>First Person Ratio</span>
                          <span className="font-medium">{Math.round(overallStats.qualityRecency.firstPersonRatio * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Agreement Index</span>
                          <span className="font-medium">{Math.round(overallStats.agreementConflicts.agreementIndex * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Conflicts</span>
                          <span className="font-medium">{overallStats.agreementConflicts.conflicts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overall Confidence</span>
                          <span className="font-medium">{Math.round(overallStats.confidence * 100)}%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Evidence Strength</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Role Quotes</span>
                          <span className="font-medium">{overallStats.evidenceStrength.quotesPerAttribute.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expertise Quotes</span>
                          <span className="font-medium">{overallStats.evidenceStrength.quotesPerAttribute.expertise}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mindset Quotes</span>
                          <span className="font-medium">{overallStats.evidenceStrength.quotesPerAttribute.mindset}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Personality Quotes</span>
                          <span className="font-medium">{overallStats.evidenceStrength.quotesPerAttribute.personality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Domain Diversity</span>
                          <span className="font-medium">{Math.round(overallStats.evidenceStrength.domainDiversity * 100)}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Confidence Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time Period</TableHead>
                            <TableHead>Extractions</TableHead>
                            <TableHead>Avg Confidence</TableHead>
                            <TableHead>Trend</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {confidenceTrends.map((trend, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{trend.period}</TableCell>
                              <TableCell>{trend.extractions}</TableCell>
                              <TableCell>{Math.round(trend.avgConfidence * 100)}%</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={trend.avgConfidence * 100} className="w-16" />
                                  {index < confidenceTrends.length - 1 && trend.avgConfidence > confidenceTrends[index + 1].avgConfidence && (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Language Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>English</span>
                          <span className="font-medium">{overallStats.coverage.languages.en} docs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spanish</span>
                          <span className="font-medium">{overallStats.coverage.languages.es} docs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>French</span>
                          <span className="font-medium">{overallStats.coverage.languages.fr} docs</span>
                        </div>
                        <div className="text-sm text-muted-foreground pt-2 border-t">
                          Total: {overallStats.coverage.languages.en + overallStats.coverage.languages.es + overallStats.coverage.languages.fr} documents
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Data Freshness</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Median Freshness</span>
                          <span className="font-medium">{overallStats.qualityRecency.freshnessDaysMedian} days</span>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Data Age Distribution:</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>0-30 days</span>
                              <span>25%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>31-180 days</span>
                              <span>45%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>181-365 days</span>
                              <span>22%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Over 1 year</span>
                              <span>8%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* System Health Tab */}
                <TabsContent value="health" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Component Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {systemHealth.map((component, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="font-medium">{component.component}</div>
                              {getHealthStatus(component.status)}
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">{component.uptime}% uptime</div>
                              <div className="text-xs text-muted-foreground">Last check: {component.lastCheck}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Resource Usage</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Cpu className="h-4 w-4" />
                              <span>CPU Usage</span>
                            </div>
                            <span className="font-medium">{resourceUsage.cpu}%</span>
                          </div>
                          <Progress value={resourceUsage.cpu} className="w-full" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <MemoryStick className="h-4 w-4" />
                              <span>Memory Usage</span>
                            </div>
                            <span className="font-medium">{resourceUsage.memory}%</span>
                          </div>
                          <Progress value={resourceUsage.memory} className="w-full" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <HardDrive className="h-4 w-4" />
                              <span>Disk Usage</span>
                            </div>
                            <span className="font-medium">{resourceUsage.disk}%</span>
                          </div>
                          <Progress value={resourceUsage.disk} className="w-full" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Network className="h-4 w-4" />
                              <span>Network Usage</span>
                            </div>
                            <span className="font-medium">{resourceUsage.network}%</span>
                          </div>
                          <Progress value={resourceUsage.network} className="w-full" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Storage Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{systemStats.storageUsed} TB</div>
                          <div className="text-sm text-muted-foreground">of {systemStats.storageTotal} TB used</div>
                        </div>
                        <Progress value={(systemStats.storageUsed / systemStats.storageTotal) * 100} className="w-full h-3" />
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Documents</span>
                            <span>0.8 TB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Processed Data</span>
                            <span>0.6 TB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Backups</span>
                            <span>0.3 TB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Logs</span>
                            <span>0.1 TB</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SystemDashboard;
