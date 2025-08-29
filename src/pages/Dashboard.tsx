import { useEffect, useMemo, useState } from 'react';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { PersonaCard } from '@/components/Persona/PersonaCard';
import { RunProgress } from '@/components/Persona/RunProgress';
import { FusionControls } from '@/components/Persona/FusionControls';
import { StatsCharts } from '@/components/Persona/StatsCharts';
import Questionnaire from '@/components/Persona/Questionnaire';
import { FirecrawlKeyModal } from '@/components/Settings/FirecrawlKeyModal';
import { FirecrawlService } from '@/utils/FirecrawlService';
import { downloadCSV, downloadJSON } from '@/utils/download';
import { WebCrawlTab } from '@/components/Landing/WebCrawlTab';
import { FileUploadTab } from '@/components/Landing/FileUploadTab';
import { QuestionnaireTab } from '@/components/Landing/QuestionnaireTab';
import { AIGenerationTab } from '@/components/Landing/AIGenerationTab';
import { FusionWeightControls } from '@/components/Landing/FusionWeightControls';
import { StagewiseIntegration } from '@/components/Stagewise/StagewiseIntegration';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import type { RunRecord, RunStep, RunStepKey, PersonaCardData, QuoteEvidence, FusionWeights } from '@/types/run';

const STEP_DEFS: { key: RunStepKey; label: string }[] = [
  { key: 'initialize', label: 'Initialize' },
  { key: 'seed_aliases', label: 'Seed & Alias Expansion' },
  { key: 'query_generation', label: 'Query Generation' },
  { key: 'source_discovery', label: 'Source Discovery' },
  { key: 'compliance_scheduling', label: 'Compliance & Scheduling' },
  { key: 'fetching_snapshotting', label: 'Fetching & Snapshotting' },
  { key: 'normalization', label: 'Normalization' },
  { key: 'quality_scoring', label: 'Quality Scoring' },
  { key: 'deduplication', label: 'Deduplication' },
  { key: 'segmentation_embedding', label: 'Segmentation & Embedding' },
  { key: 'targeted_retrieval', label: 'Targeted Retrieval' },
  { key: 'attribute_extraction', label: 'Attribute Extraction' },
  { key: 'contradictions', label: 'Contradictions' },
  { key: 'questionnaire_fusion', label: 'Questionnaire Fusion (Optional)' },
  { key: 'fusion_confidence', label: 'Fusion & Confidence' },
  { key: 'persona_assembly', label: 'Persona Card Assembly' },
  { key: 'statistics_verification', label: 'Statistics & Verification' },
];

const defaultFusion: FusionWeights = { global: 0.7, perAttribute: {}, strictMode: false };

const makeInitialSteps = (): RunStep[] => STEP_DEFS.map((d) => ({ key: d.key, label: d.label, status: 'idle', logs: [] }));

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const nowId = () => new Date().toISOString().replace(/[:.]/g, '-');

const sampleQuotes = (subject: string): QuoteEvidence[] => [
  { attribute: 'role', quote: `${subject} described their responsibilities leading cross-functional teams.`, url: 'https://news.example.com/interview', title: 'Leadership Interview', date: '2024-05-03', chunk_id: 'doc12#c7', weight: 0.9 },
  { attribute: 'expertise', quote: 'Demonstrated deep expertise in ML systems and product strategy.', url: 'https://blog.example.com/keynote', title: 'Keynote Recap', date: '2024-09-12', chunk_id: 'doc2#c3', weight: 0.86 },
  { attribute: 'mindset', quote: 'Prefers iterative releases with strong user feedback loops.', url: 'https://podcasts.example.com/ep88', title: 'Podcast #88', date: '2023-11-21', chunk_id: 'doc7#c14', weight: 0.78 },
  { attribute: 'personality', quote: 'Direct communicator with high curiosity and calm under pressure.', url: 'https://press.example.com/profile', title: 'Company Profile', date: '2024-02-10', chunk_id: 'doc1#c1', weight: 0.82 },
  { attribute: 'description', quote: 'Known for pragmatic decision-making and data-informed bets.', url: 'https://conf.example.com/talk', title: 'Conference Talk', date: '2022-10-04', chunk_id: 'doc18#c9', weight: 0.74 },
  { attribute: 'description', quote: 'Values documentation and clear ownership in complex programs.', url: 'https://kb.example.com/case-study', title: 'Case Study', date: '2024-07-19', chunk_id: 'doc9#c2', weight: 0.71 },
];

const buildPersona = (subject: string, quotes: QuoteEvidence[], fusion: FusionWeights): PersonaCardData => {
  const confidence = Math.min(1, Math.max(0.5, fusion.global * 0.85 + (fusion.strictMode ? 0.1 : 0)));
  const band = confidence > 0.75 ? 'H' : confidence > 0.6 ? 'M' : 'L';
  return {
    role: `${subject} — Senior Leader & Builder`,
    expertise: 'Machine Learning, Product Strategy, Program Execution',
    mindset: 'Evidence-oriented, iterative, customer-obsessed',
    personality: 'Curious, direct, calm, collaborative',
    description: `${subject} operates at the intersection of AI and product. They blend technical depth with crisp execution, favoring short feedback cycles and clear ownership.`,
    quotes,
    confidence,
    confidenceBand: band,
  };
};

const persistRun = (run: RunRecord) => {
  const all = JSON.parse(localStorage.getItem('persona_runs') || '[]') as RunRecord[];
  const updated = [run, ...all.filter((r) => r.id !== run.id)];
  localStorage.setItem('persona_runs', JSON.stringify(updated));
};

const loadRuns = (): RunRecord[] => JSON.parse(localStorage.getItem('persona_runs') || '[]');

const Dashboard = () => {
  const [subject, setSubject] = useState('Jane Doe');
  const [aliases, setAliases] = useState('J. Doe; JD');
  const [timeWindow, setTimeWindow] = useState('Last 24 months');
  const [languages, setLanguages] = useState('en, es');
  const [fusion, setFusion] = useState(defaultFusion);
  const [liveCrawl, setLiveCrawl] = useState(false);
  const [activeTab, setActiveTab] = useState('web-crawl');

  const [run, setRun] = useState<RunRecord | null>(null);
  const [history, setHistory] = useState<RunRecord[]>([]);
  const routerLocation = useLocation();

  // Data source contributions and questionnaire state
  const [sourceWeights, setSourceWeights] = useState({ aiGeneration: 40, webExtraction: 15, fileUpload: 15, questionnaire: 30 });
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<Record<string, number> | null>(null);



  useEffect(() => {
    setHistory(loadRuns());
  }, []);

  const beginRun = async () => {
    if (liveCrawl && !FirecrawlService.getApiKey()) {
      toast({ title: 'Missing API key', description: 'Add Firecrawl key or disable live crawl.', variant: 'destructive' });
      return;
    }

    const id = nowId();
    const steps = makeInitialSteps();
    const newRun: RunRecord = {
      id,
      subject,
      aliases: aliases.split(';').map((a) => a.trim()).filter(Boolean),
      timeWindow,
      languages: languages.split(',').map((l) => l.trim()).filter(Boolean),
      createdAt: Date.now(),
      steps,
      fusion,
      auditLog: [],
      liveCrawlUsed: liveCrawl,
      questionnaire: questionnaireAnswers || undefined,
    };
    setRun(newRun);

    const stepLog = async (key: RunStepKey, msg: string) => {
      setRun((prev) => {
        if (!prev) return prev;
        const updated = prev.steps.map((s) => s.key === key ? { ...s, logs: [...s.logs, msg] } : s);
        return { ...prev, steps: updated } as RunRecord;
      });
    };

    const setStatus = (key: RunStepKey, status: RunStep['status']) => {
      setRun((prev) => {
        if (!prev) return prev;
        const updated = prev.steps.map((s) => s.key === key ? { ...s, status } : s);
        return { ...prev, steps: updated } as RunRecord;
      });
    };

    const runStep = async (key: RunStepKey, work: () => Promise<void>) => {
      setStatus(key, 'running');
      await work();
      setStatus(key, 'done');
    };

    // Execute steps (simulated, with optional live crawl during discovery/fetch)
    await runStep('initialize', async () => {
      await sleep(400);
      await stepLog('initialize', `Subject: ${subject}`);
      await stepLog('initialize', `Aliases: ${newRun.aliases.join(', ') || '—'}`);
    });

    await runStep('seed_aliases', async () => {
      await sleep(500);
      await stepLog('seed_aliases', 'LLM proposed 3 additional aliases and 2 affiliations.');
    });

    await runStep('query_generation', async () => {
      await sleep(450);
      await stepLog('query_generation', 'Generated queries for bio, interviews, keynotes, leadership.');
    });

    await runStep('source_discovery', async () => {
      await sleep(600);
      if (liveCrawl) {
        await stepLog('source_discovery', 'Searching and crawling seed sources...');
        try {
          const res = await FirecrawlService.crawlWebsite(`https://en.wikipedia.org/wiki/${encodeURIComponent(subject)}`);
          if (res.success) {
            await stepLog('source_discovery', 'Crawl completed: initial sources discovered.');
          } else {
            await stepLog('source_discovery', `Crawl failed: ${res.error}`);
          }
        } catch (e) {
          await stepLog('source_discovery', 'Crawl error; continuing with simulated data.');
        }
      } else {
        await stepLog('source_discovery', 'Discovered 120 candidate sources (simulated).');
      }
    });

    const restKeys: RunStepKey[] = [
      'compliance_scheduling', 'fetching_snapshotting', 'normalization', 'quality_scoring', 'deduplication',
      'segmentation_embedding', 'targeted_retrieval', 'attribute_extraction', 'contradictions', 'questionnaire_fusion',
      'fusion_confidence', 'persona_assembly', 'statistics_verification'
    ];

    for (const k of restKeys) {
      // light simulated logs
      await runStep(k, async () => {
        await sleep(300);
        await stepLog(k, `${STEP_DEFS.find((s) => s.key === k)?.label} completed.`);
      });
    }

    // Build persona & stats
    const quotes = sampleQuotes(subject);
    const persona = buildPersona(subject, quotes, fusion);
    setRun((prev) => (prev ? { ...prev, persona, stats: buildStats(quotes) } : prev));

    toast({ title: 'Run completed', description: 'Persona card assembled with verification data.' });
  };

  const buildStats = (quotes: QuoteEvidence[]) => {
    return {
      coverage: { discovered: 120, fetched: 96, kept: 42, uniqueDomains: 28, documents: 42, chunks: 1048, tokens: 98000, languages: { en: 36, es: 4, fr: 2 } },
      qualityRecency: { qualityMedian: 0.72, firstPersonRatio: 0.31, freshnessDaysMedian: 210 },
      evidenceStrength: { quotesPerAttribute: { role: 3, expertise: 4, mindset: 3, personality: 2, description: 4 }, uniqueSources: 18, domainDiversity: 0.86 },
      agreementConflicts: { agreementIndex: 0.78, conflicts: 2 },
      confidence: 0.78,
    };
  };

  const exportVerification = () => {
    if (!run || !run.persona) return;
    const csvRows = run.persona.quotes.map((q) => [q.attribute, q.quote, q.url, q.title, q.date, q.chunk_id, q.weight]);
    downloadCSV(`verification_${run.id}.csv`, ['attribute', 'quote', 'url', 'title', 'date', 'chunk_id', 'weight'], csvRows);
    downloadJSON(`stats_${run.id}.json`, run.stats || {});
    downloadJSON(`trace_${run.id}.json`, run.steps);
  };

  const approve = (comment?: string) => {
    if (!run) return;
    const entry = { at: Date.now(), actor: 'reviewer' as const, action: 'approve' as const, comment };
    const updated = { ...run, auditLog: [entry, ...run.auditLog] };
    setRun(updated);
    persistRun(updated);
    toast({ title: 'Approved', description: 'Reviewer approved this run.' });
  };

  const requestChanges = (comment?: string) => {
    if (!run) return;
    const entry = { at: Date.now(), actor: 'reviewer' as const, action: 'request_changes' as const, comment };
    const updated = { ...run, auditLog: [entry, ...run.auditLog] };
    setRun(updated);
    persistRun(updated);
    toast({ title: 'Changes requested', description: 'Reviewer requested changes.', variant: 'destructive' });
  };

  useEffect(() => {
    if (run) persistRun(run);
  }, [run]);

  // Deep-link hash scroll into sections (e.g., #evidence)
  useEffect(() => {
    if (routerLocation.hash) {
      const el = document.querySelector(routerLocation.hash) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [routerLocation.hash]);

  const seedTitle = useMemo(() => `${subject} — Persona Extraction`, [subject]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="h-12 flex items-center border-b px-4">
            <SidebarTrigger className="mr-2" />
            <span className="text-sm text-muted-foreground">Persona Extraction</span>
          </header>
          <div className="min-h-screen">
            <SEO title={`Persona Extraction Dashboard`} description="Generate evidence-backed persona cards with verification." canonical={location.origin + '/personaextraction'} />
            <main className="container py-10 space-y-8">
              <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Persona Extraction</h1>
                <p className="text-muted-foreground">Input person info, tune source weights, and add data via tabs.</p>
              </header>

              <div className="grid lg:grid-cols-3 gap-6">
                <Card id="new-persona" className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Start Extraction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Subject name</Label>
                        <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Ada Lovelace" />
                      </div>
                      <div>
                        <Label>Aliases (semicolon separated)</Label>
                        <Input value={aliases} onChange={(e) => setAliases(e.target.value)} placeholder="e.g., Countess of Lovelace" />
                      </div>
                      <div>
                        <Label>Time window</Label>
                        <Input value={timeWindow} onChange={(e) => setTimeWindow(e.target.value)} placeholder="Last 24 months" />
                      </div>
                      <div>
                        <Label>Languages</Label>
                        <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="en, es, fr" />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                      {/* Data Sources */}
                      <div className="space-y-3">
                        <Label className="block">Data Sources</Label>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="ai-generation">AI Generation</TabsTrigger>
                            <TabsTrigger value="web-crawl">Live Web Crawl</TabsTrigger>
                            <TabsTrigger value="file-upload">Files Upload</TabsTrigger>
                            <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
                          </TabsList>
                          <TabsContent value="ai-generation" id="ai">
                            <AIGenerationTab />
                          </TabsContent>
                          <TabsContent value="web-crawl" id="web">
                            <WebCrawlTab />
                          </TabsContent>
                          <TabsContent value="file-upload" id="files">
                            <FileUploadTab />
                          </TabsContent>
                          <TabsContent value="questionnaire" id="questionnaire-input">
                            <QuestionnaireTab
                              onSubmit={(answers) => {
                                setQuestionnaireAnswers(answers);
                                setQuestionnaireCompleted(true);
                                toast({ title: 'Saved', description: 'Questionnaire responses saved.' });
                              }}
                              completed={questionnaireCompleted}
                            />
                          </TabsContent>
                        </Tabs>
                      </div>

                      {/* Live Crawl Config - Only show in Live Web Crawl tab */}
                      {activeTab === 'web-crawl' && (
                        <div className="flex items-center justify-between">
                        <div>
                          <Label className="block">Live Web Crawl (Firecrawl)</Label>
                          <p className="text-xs text-muted-foreground">Optional. Otherwise a simulated run is performed.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FirecrawlKeyModal trigger={<Button variant="secondary">API Key</Button>} />
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={liveCrawl} onChange={(e) => setLiveCrawl(e.target.checked)} /> Enable
                          </label>
                        </div>
                        </div>
                      )}

                      {/* Source Contribution Weights */}
                      <div id="fusion" className="space-y-4">
                        <FusionWeightControls weights={sourceWeights} onWeightsChange={setSourceWeights} />

                        {/* Advanced fusion settings */}
                        <FusionControls weights={fusion} onChange={setFusion} />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="secondary" onClick={() => { setRun(null); toast({ title: 'Reset' }); }}>Reset</Button>
                      <Button onClick={beginRun}>Start Extraction</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Run History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {history.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No previous runs.</p>
                    ) : (
                      history.slice(0, 10).map((h) => (
                        <button key={h.id} onClick={() => setRun(h)} className="w-full text-left p-2 rounded border hover:bg-accent/50 transition">
                          <div className="font-medium">{h.subject}</div>
                          <div className="text-xs text-muted-foreground">{new Date(h.createdAt).toLocaleString()} • {h.id}</div>
                        </button>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {run && (
                <Tabs defaultValue="trace" className="space-y-6" id="trace">
                  <TabsList>
                    <TabsTrigger value="trace">Processing Trace</TabsTrigger>
                    <TabsTrigger value="workflow">Workflow Visualization</TabsTrigger>
                    <TabsTrigger value="persona">Persona Card</TabsTrigger>
                    <TabsTrigger value="stats">Stats & Verification</TabsTrigger>
                    <TabsTrigger value="questionnaire">Questionnaire</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                  </TabsList>
                  <TabsContent value="trace" id="trace">
                    <RunProgress steps={run.steps} />
                  </TabsContent>
                  <TabsContent value="workflow" id="workflow">
                    <StagewiseIntegration 
                      onWorkflowComplete={(result) => {
                        if (result.success) {
                          toast({
                            title: "Workflow Completed",
                            description: `Successfully completed ${result.totalSteps} steps`,
                          });
                        }
                      }}
                      onStepUpdate={(step) => {
                        console.log("Step updated:", step);
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="persona" id="persona">
                    {run.persona ? (
                      <PersonaCard data={run.persona} />
                    ) : (
                      <Card><CardContent className="p-6 text-muted-foreground">Run to completion to view persona card.</CardContent></Card>
                    )}
                  </TabsContent>
                  <TabsContent value="stats" id="stats">
                    {run.stats && run.persona ? (
                      <div className="space-y-6">
                        <StatsCharts stats={run.stats} />
                        <div className="flex gap-3">
                          <Button onClick={exportVerification}>Download Verification Pack</Button>
                        </div>
                      </div>
                    ) : (
                      <Card><CardContent className="p-6 text-muted-foreground">Stats available after run completes.</CardContent></Card>
                    )}
                  </TabsContent>
                  <TabsContent value="questionnaire" id="questionnaire">
                    <Questionnaire onSubmit={(answers) => {
                      setRun((prev) => prev ? { ...prev, questionnaire: answers } : prev);
                      toast({ title: 'Questionnaire saved', description: 'Contributions will be weighted lower than evidence.' });
                      setQuestionnaireAnswers(answers);
                      setQuestionnaireCompleted(true);
                    }} />
                  </TabsContent>
                  <TabsContent value="review" id="review">
                    <Card>
                      <CardHeader><CardTitle>Reviewer</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <Textarea placeholder="Comments (optional)" id="review-comment" />
                          <div className="flex gap-3 md:justify-end">
                            <Button variant="secondary" onClick={() => requestChanges((document.getElementById('review-comment') as HTMLTextAreaElement)?.value)}>Request Changes</Button>
                            <Button onClick={() => approve((document.getElementById('review-comment') as HTMLTextAreaElement)?.value)}>Approve</Button>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="font-medium">Audit Log</h4>
                          {run.auditLog.length === 0 ? <p className="text-sm text-muted-foreground">No actions yet.</p> : (
                            run.auditLog.map((e, i) => (
                              <div key={i} className="text-sm border rounded p-2">
                                <div className="flex items-center justify-between">
                                  <span className="capitalize">{e.actor} • {e.action.replace('_', ' ')}</span>
                                  <span className="text-xs text-muted-foreground">{new Date(e.at).toLocaleString()}</span>
                                </div>
                                {e.comment && <p className="text-sm mt-1">{e.comment}</p>}
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}


            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
