import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  Wand2, 
  Lightbulb, 
  FileEdit, 
  Tags, 
  Type, 
  BarChart3,
  Sparkles,
  Copy,
  Download,
  Save
} from 'lucide-react';
import { aiService } from '@/services/aiService';
import { categoryService } from '@/services/categoryService';
import { postService } from '@/services/postService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function AIGeneration() {
  // State for blog post generation
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<string>('professional');
  const [length, setLength] = useState<string>('medium');
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  
  // State for content improvement
  const [contentToImprove, setContentToImprove] = useState('');
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>(['readability', 'seo']);
  
  // State for content analysis
  const [contentToAnalyze, setContentToAnalyze] = useState('');
  
  // State for generated content
  const [generatedPost, setGeneratedPost] = useState<any>(null);
  const [postIdeas, setPostIdeas] = useState<any[]>([]);
  const [improvedContent, setImprovedContent] = useState<string>('');
  const [contentAnalysis, setContentAnalysis] = useState<any>(null);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getActiveCategories(),
  });

  // Generate blog post mutation
  const generatePostMutation = useMutation({
    mutationFn: aiService.generateBlogPost,
    onSuccess: (response) => {
      setGeneratedPost(response.data);
      toast.success('Blog post generated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to generate blog post');
      console.error(error);
    },
  });

  // Generate ideas mutation
  const generateIdeasMutation = useMutation({
    mutationFn: ({ category, count }: { category: string; count: number }) => 
      aiService.generatePostIdeas(category, count),
    onSuccess: (response) => {
      setPostIdeas(response.data.ideas);
      toast.success('Post ideas generated successfully!');
    },
    onError: () => {
      toast.error('Failed to generate post ideas');
    },
  });

  // Improve content mutation
  const improveContentMutation = useMutation({
    mutationFn: ({ content, improvements }: { content: string; improvements: string[] }) =>
      aiService.improveContent(content, improvements),
    onSuccess: (response) => {
      setImprovedContent(response.data.improvedContent);
      toast.success('Content improved successfully!');
    },
    onError: () => {
      toast.error('Failed to improve content');
    },
  });

  // Analyze content mutation
  const analyzeContentMutation = useMutation({
    mutationFn: aiService.analyzeContent,
    onSuccess: (response) => {
      setContentAnalysis(response.data.analysis);
      toast.success('Content analyzed successfully!');
    },
    onError: () => {
      toast.error('Failed to analyze content');
    },
  });

  // Create post from generated content
  const savePostMutation = useMutation({
    mutationFn: postService.createPost,
    onSuccess: () => {
      toast.success('Post saved successfully!');
    },
    onError: () => {
      toast.error('Failed to save post');
    },
  });

  const categories = categoriesData?.data.categories || [];

  const handleGeneratePost = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    generatePostMutation.mutate({
      topic,
      tone: tone as any,
      length: length as any,
      targetAudience,
      categoryId: selectedCategoryId ? parseInt(selectedCategoryId) : undefined,
    });
  };

  const handleGenerateIdeas = () => {
    const selectedCategory = selectedCategoryId 
      ? categories.find(c => c.id === parseInt(selectedCategoryId))?.name || 'general'
      : 'general';
    
    generateIdeasMutation.mutate({
      category: selectedCategory,
      count: 5
    });
  };

  const handleImproveContent = () => {
    if (!contentToImprove.trim()) {
      toast.error('Please enter content to improve');
      return;
    }

    improveContentMutation.mutate({
      content: contentToImprove,
      improvements: selectedImprovements
    });
  };

  const handleAnalyzeContent = () => {
    if (!contentToAnalyze.trim()) {
      toast.error('Please enter content to analyze');
      return;
    }

    analyzeContentMutation.mutate(contentToAnalyze);
  };

  const handleSaveGeneratedPost = () => {
    if (!generatedPost) return;

    const postData = {
      title: generatedPost.title,
      content: generatedPost.content,
      slug: generatedPost.slug,
      excerpt: generatedPost.excerpt,
      categoryId: selectedCategoryId ? parseInt(selectedCategoryId) : undefined,
      isPublished: false,
    };

    savePostMutation.mutate(postData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Content Generation</h1>
          </div>
          <p className="text-xl text-gray-600">
            Leverage AI to create, improve, and analyze your blog content
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Generate Post
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Post Ideas
            </TabsTrigger>
            <TabsTrigger value="improve" className="flex items-center gap-2">
              <FileEdit className="w-4 h-4" />
              Improve Content
            </TabsTrigger>
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analyze Content
            </TabsTrigger>
          </TabsList>

          {/* Generate Blog Post */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Generate Blog Post
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="topic">Topic *</Label>
                    <Input
                      id="topic"
                      placeholder="e.g., The Future of AI in Web Development"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="authoritative">Authoritative</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Length</Label>
                      <Select value={length} onValueChange={setLength}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short (500-800 words)</SelectItem>
                          <SelectItem value="medium">Medium (800-1200 words)</SelectItem>
                          <SelectItem value="long">Long (1200-2000 words)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input
                      id="audience"
                      placeholder="e.g., Web developers, beginners"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleGeneratePost}
                    disabled={generatePostMutation.isPending}
                    className="w-full"
                  >
                    {generatePostMutation.isPending ? 'Generating...' : 'Generate Blog Post'}
                  </Button>
                </CardContent>
              </Card>

              {generatedPost && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Generated Content</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(generatedPost.content)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm"
                          onClick={handleSaveGeneratedPost}
                          disabled={savePostMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save as Draft
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{generatedPost.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{generatedPost.excerpt}</p>
                    </div>

                    <div>
                      <Label>SEO Title Suggestions</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {generatedPost.seoTitles?.map((title: string, index: number) => (
                          <Badge key={index} variant="outline" className="cursor-pointer"
                                 onClick={() => copyToClipboard(title)}>
                            {title}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Suggested Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {generatedPost.suggestedTags?.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer"
                                 onClick={() => copyToClipboard(tag)}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />
                    
                    <div className="max-h-64 overflow-y-auto">
                      <Label>Content Preview</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                        {generatedPost.content.substring(0, 500)}...
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Post Ideas */}
          <TabsContent value="ideas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Generate Post Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end mb-6">
                  <div className="flex-1">
                    <Label>Category</Label>
                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">General</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleGenerateIdeas}
                    disabled={generateIdeasMutation.isPending}
                  >
                    {generateIdeasMutation.isPending ? 'Generating...' : 'Generate Ideas'}
                  </Button>
                </div>

                {postIdeas.length > 0 && (
                  <div className="space-y-4">
                    {postIdeas.map((idea, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <h3 className="font-semibold mb-2">{idea.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{idea.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <Label className="text-xs text-gray-500">Keywords:</Label>
                            {idea.keywords?.map((keyword: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Improve Content */}
          <TabsContent value="improve" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileEdit className="w-5 h-5" />
                    Content Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="content-improve">Content to Improve *</Label>
                    <Textarea
                      id="content-improve"
                      placeholder="Paste your content here..."
                      rows={10}
                      value={contentToImprove}
                      onChange={(e) => setContentToImprove(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Improvement Areas</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['readability', 'seo', 'engagement', 'clarity', 'structure'].map((improvement) => (
                        <Badge
                          key={improvement}
                          variant={selectedImprovements.includes(improvement) ? 'default' : 'outline'}
                          className="cursor-pointer capitalize"
                          onClick={() => {
                            setSelectedImprovements(prev =>
                              prev.includes(improvement)
                                ? prev.filter(i => i !== improvement)
                                : [...prev, improvement]
                            );
                          }}
                        >
                          {improvement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleImproveContent}
                    disabled={improveContentMutation.isPending}
                    className="w-full"
                  >
                    {improveContentMutation.isPending ? 'Improving...' : 'Improve Content'}
                  </Button>
                </CardContent>
              </Card>

              {improvedContent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Improved Content</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(improvedContent)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">{improvedContent}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Analyze Content */}
          <TabsContent value="analyze" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Content Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="content-analyze">Content to Analyze *</Label>
                    <Textarea
                      id="content-analyze"
                      placeholder="Paste your content here..."
                      rows={12}
                      value={contentToAnalyze}
                      onChange={(e) => setContentToAnalyze(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={handleAnalyzeContent}
                    disabled={analyzeContentMutation.isPending}
                    className="w-full"
                  >
                    {analyzeContentMutation.isPending ? 'Analyzing...' : 'Analyze Content'}
                  </Button>
                </CardContent>
              </Card>

              {contentAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">{contentAnalysis.wordCount}</div>
                        <div className="text-sm text-gray-600">Words</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">{contentAnalysis.readingTime}</div>
                        <div className="text-sm text-gray-600">Min Read</div>
                      </div>
                    </div>

                    <div>
                      <Label>Suggested Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {contentAnalysis.suggestedTags?.map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Suggested Excerpt</Label>
                      <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded">
                        {contentAnalysis.suggestedExcerpt}
                      </p>
                    </div>

                    <div>
                      <Label>Recommended Improvements</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {contentAnalysis.recommendedImprovements?.map((improvement: string, index: number) => (
                          <Badge key={index} variant="outline" className="capitalize">
                            {improvement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}