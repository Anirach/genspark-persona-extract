import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, Search, Database, Clock, Shield } from "lucide-react";

export const WebCrawlTab = () => {
  const [personName, setPersonName] = useState('');
  const [timePeriod, setTimePeriod] = useState('all-time');
  const [searchContext, setSearchContext] = useState('');

  const reliableSources = [
    'LinkedIn', 'Company Websites', 'News Publications', 'Academic Papers',
    'Professional Blogs', 'Conference Sites', 'Industry Publications', 'Official Bios'
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2 mb-6">
          <Globe className="w-8 h-8 text-primary mx-auto" />
          <h3 className="text-lg font-semibold">Live Web Crawl</h3>
          <p className="text-sm text-muted-foreground">
            Search for persona data from reliable web sources across time periods
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="person-name">Person Name (Auto-filled from subject)</Label>
            <Input
              id="person-name"
              placeholder="e.g., John Doe"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              className="transition-all focus:ring-2 focus:ring-primary/50"
              disabled={true}
            />
            <p className="text-xs text-muted-foreground">
              This field is automatically populated from the subject name entered above
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-period">Search Time Period</Label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="last-year">Last 1 Year</SelectItem>
                <SelectItem value="last-2-years">Last 2 Years</SelectItem>
                <SelectItem value="last-5-years">Last 5 Years</SelectItem>
                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="custom">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search-context">Additional Search Context (Optional)</Label>
            <Input
              id="search-context"
              placeholder="e.g., CEO, Machine Learning, Product Management..."
              value={searchContext}
              onChange={(e) => setSearchContext(e.target.value)}
              className="transition-all focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground">
              Add context to refine search results (job titles, expertise areas, companies)
            </p>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
              <Search className="w-4 h-4 mr-2" />
              Start Smart Search
            </Button>
            <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
              <Database className="w-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-green-50/50 rounded-lg p-4 border border-green-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-sm text-green-800">Reliable Sources Only</h4>
            </div>
            <div className="flex flex-wrap gap-1">
              {reliableSources.map((source, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-green-50 border-green-200">
                  {source}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-sm">What we'll extract:</h4>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Professional background and career history</li>
              <li>• Public statements and published content</li>
              <li>• Leadership style and decision-making patterns</li>
              <li>• Industry expertise and thought leadership</li>
              <li>• Educational background and achievements</li>
              <li>• Network connections and associations</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};