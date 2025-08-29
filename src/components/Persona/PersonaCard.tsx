import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PersonaCardData } from "@/types/run";

interface PersonaCardProps {
  data: PersonaCardData;
}

export const PersonaCard = ({ data }: PersonaCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <CardTitle className="text-2xl">Persona Card</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="text-lg font-medium">{data.role}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Expertise</p>
            <p className="text-lg font-medium">{data.expertise}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mindset</p>
            <p className="text-lg font-medium">{data.mindset}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Personality</p>
            <p className="text-lg font-medium">{data.personality}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Description</p>
          <p className="leading-relaxed">{data.description}</p>
        </div>
        <Separator />
        <div>
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm text-muted-foreground">Confidence</p>
            <Badge variant="secondary">{(data.confidence * 100).toFixed(0)}% ({data.confidenceBand})</Badge>
          </div>
          <div className="space-y-3">
            {data.quotes.slice(0, 6).map((q, i) => (
              <div key={i} className="rounded-md border p-3">
                <p className="text-sm">“{q.quote}”</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {q.title ? `${q.title} — ` : ''}{q.url ? <a href={q.url} target="_blank" rel="noreferrer" className="underline">{q.url}</a> : null}{q.date ? ` • ${q.date}` : ''}{q.chunk_id ? ` • ${q.chunk_id}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonaCard;
