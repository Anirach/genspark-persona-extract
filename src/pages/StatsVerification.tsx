import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StatsCharts from "@/components/Persona/StatsCharts";
import { downloadCSV, downloadJSON } from "@/utils/download";
import type { RunRecord, RunStats, QuoteEvidence } from "@/types/run";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const loadLatestRun = (): RunRecord | null => {
  try {
    const all = JSON.parse(localStorage.getItem("persona_runs") || "[]") as RunRecord[];
    return all[0] || null;
  } catch {
    return null;
  }
};

const fallbackQuotes: QuoteEvidence[] = [
  { attribute: "role", quote: "Led cross-functional teams to ship ML features.", url: "https://news.example.com/interview", title: "Leadership Interview", date: "2024-05-03", chunk_id: "doc12#c7", weight: 0.9 },
  { attribute: "expertise", quote: "Deep expertise in ML systems and product strategy.", url: "https://blog.example.com/keynote", title: "Keynote Recap", date: "2024-09-12", chunk_id: "doc2#c3", weight: 0.86 },
];

const fallbackStats: RunStats = {
  coverage: { discovered: 120, fetched: 96, kept: 42, uniqueDomains: 28, documents: 42, chunks: 1048, tokens: 98000, languages: { en: 36, es: 4, fr: 2 } },
  qualityRecency: { qualityMedian: 0.72, firstPersonRatio: 0.31, freshnessDaysMedian: 210 },
  evidenceStrength: { quotesPerAttribute: { role: 3, expertise: 4, mindset: 3, personality: 2, description: 4 }, uniqueSources: 18, domainDiversity: 0.86 },
  agreementConflicts: { agreementIndex: 0.78, conflicts: 2 },
  confidence: 0.78,
};

const StatsVerification = () => {
  const run = loadLatestRun();
  const stats = run?.stats || fallbackStats;
  const subject = run?.subject || "Sample Subject";

  const exportVerification = () => {
    const quotes = run?.persona?.quotes?.length ? run.persona.quotes : fallbackQuotes;
    const rows = quotes.map((q) => [q.attribute, q.quote, q.url, q.title, q.date, q.chunk_id, q.weight]);
    downloadCSV(`verification_${run?.id || "sample"}.csv`, ["attribute", "quote", "url", "title", "date", "chunk_id", "weight"], rows);
    downloadJSON(`stats_${run?.id || "sample"}.json`, stats);
    if (run) {
      downloadJSON(`trace_${run.id}.json`, run.steps);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="h-12 flex items-center border-b px-4">
            <SidebarTrigger className="mr-2" />
            <span className="text-sm text-muted-foreground">Reviewer & Admin</span>
          </header>
          <div className="min-h-screen">
            <SEO title="Persona Stats & Verification" description="Coverage, quality, agreement, conflicts, and verification exports for persona runs." canonical={location.origin + "/stats"} />
            <header className="container pt-10 pb-6">
              <h1 className="text-3xl font-bold tracking-tight">Persona Stats & Verification</h1>
              <p className="text-muted-foreground">Review evidence strength, coverage, agreement, conflicts, and export the verification pack.</p>
            </header>
            <main className="container space-y-8">
              <section aria-labelledby="run-context">
                <Card>
                  <CardHeader>
                    <CardTitle id="run-context">Run Context</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Subject</div>
                      <div className="font-medium">{subject}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Created</div>
                      <div className="font-medium">{run ? new Date(run.createdAt).toLocaleString() : "—"}</div>
                    </div>
                    <div className="flex items-center md:justify-end gap-3">
                      <Button variant="secondary" asChild>
                        <a href="/personaextraction">Back to Dashboard</a>
                      </Button>
                      <Button onClick={exportVerification}>Download Verification Pack</Button>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section aria-labelledby="charts">
                <h2 id="charts" className="sr-only">Charts</h2>
                <StatsCharts stats={stats} />
              </section>

              <section aria-labelledby="metrics" className="space-y-4">
                <h2 id="metrics" className="sr-only">Metrics</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader><CardTitle>Coverage</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Discovered</span><span className="font-medium">{stats.coverage.discovered}</span></div>
                      <div className="flex justify-between"><span>Fetched</span><span className="font-medium">{stats.coverage.fetched}</span></div>
                      <div className="flex justify-between"><span>Kept</span><span className="font-medium">{stats.coverage.kept}</span></div>
                      <Separator />
                      <div className="flex justify-between"><span>Unique domains</span><span className="font-medium">{stats.coverage.uniqueDomains}</span></div>
                      <div className="flex justify-between"><span>Documents</span><span className="font-medium">{stats.coverage.documents}</span></div>
                      <div className="flex justify-between"><span>Chunks</span><span className="font-medium">{stats.coverage.chunks}</span></div>
                      <div className="flex justify-between"><span>Tokens</span><span className="font-medium">{stats.coverage.tokens.toLocaleString()}</span></div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Quality & Recency</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Quality (median)</span><span className="font-medium">{(stats.qualityRecency.qualityMedian * 100).toFixed(0)}%</span></div>
                      <div className="flex justify-between"><span>First-person ratio</span><span className="font-medium">{(stats.qualityRecency.firstPersonRatio * 100).toFixed(0)}%</span></div>
                      <div className="flex justify-between"><span>Freshness (median days)</span><span className="font-medium">{stats.qualityRecency.freshnessDaysMedian}</span></div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Agreement & Conflicts</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Agreement index</span><span className="font-medium">{(stats.agreementConflicts.agreementIndex * 100).toFixed(0)}%</span></div>
                      <div className="flex justify-between"><span>Conflicts</span><span className="font-medium">{stats.agreementConflicts.conflicts}</span></div>
                      <Separator />
                      <div className="flex justify-between"><span>Confidence</span><span className="font-medium">{(stats.confidence * 100).toFixed(0)}%</span></div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StatsVerification;
