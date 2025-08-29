import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { RunStep } from "@/types/run";

interface RunProgressProps {
  steps: RunStep[];
}

const statusToPercent = (status: RunStep["status"]) => {
  if (status === 'idle') return 0;
  if (status === 'running') return 50;
  if (status === 'done') return 100;
  return 100;
};

export const RunProgress = ({ steps }: RunProgressProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {steps.map((s) => (
        <AccordionItem key={s.key} value={s.key}>
          <AccordionTrigger>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{s.label}</span>
                <span className="text-xs text-muted-foreground capitalize">{s.status}</span>
              </div>
              <Progress className="mt-2" value={statusToPercent(s.status)} />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 text-sm">
              {s.logs.length === 0 ? (
                <p className="text-muted-foreground">No logs yet</p>
              ) : (
                s.logs.map((l, i) => (
                  <div key={i} className="rounded border p-2 bg-background">{l}</div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default RunProgress;
