import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FirecrawlService } from "@/utils/FirecrawlService";

interface FirecrawlKeyModalProps {
  trigger?: React.ReactNode;
}

export const FirecrawlKeyModal = ({ trigger }: FirecrawlKeyModalProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>(FirecrawlService.getApiKey() || "");
  const [testing, setTesting] = useState(false);

  const handleSave = async () => {
    if (!apiKey) return;
    setTesting(true);
    const ok = await FirecrawlService.testApiKey(apiKey);
    setTesting(false);
    if (ok) {
      FirecrawlService.saveApiKey(apiKey);
      toast({ title: "API key saved", description: "Firecrawl ready for live discovery." });
      setOpen(false);
    } else {
      toast({ title: "Invalid API key", variant: "destructive", description: "Please check and try again." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Firecrawl API key</DialogTitle>
          <DialogDescription>
            Store your API key locally to enable live web discovery. You can remove it anytime.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="fc_live_..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!apiKey || testing}>{testing ? 'Testing...' : 'Save & Test'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FirecrawlKeyModal;
