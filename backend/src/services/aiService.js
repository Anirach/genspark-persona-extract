import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  // Helper method to clean JSON from markdown formatting
  cleanJsonResponse(response) {
    try {
      // Remove markdown code blocks and backticks
      let cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to parse as JSON
      return JSON.parse(cleaned);
    } catch (error) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('Failed to parse extracted JSON:', e);
          throw new Error('Invalid JSON response from AI');
        }
      }
      throw new Error('No valid JSON found in response');
    }
  }
  async generateBlogPost(topic, options = {}) {
    const {
      tone = 'professional',
      length = 'medium',
      includeImages = false,
      category = 'general',
      targetAudience = 'general'
    } = options;

    try {
      const prompt = this.buildBlogPostPrompt(topic, { tone, length, category, targetAudience });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional blog writer. Generate high-quality, engaging blog posts with proper structure including title, introduction, main content with headers, and conclusion. Format the content in markdown."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: this.getLengthTokens(length),
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;
      return this.parseBlogContent(content);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate blog post content');
    }
  }

  async generatePostIdeas(category, count = 5) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a content strategist. Generate engaging blog post ideas with titles and brief descriptions."
          },
          {
            role: "user",
            content: `Generate ${count} blog post ideas for the ${category} category. For each idea, provide:
            1. A compelling title
            2. A brief description (2-3 sentences)
            3. Target keywords
            
            Format as JSON array with objects containing: title, description, keywords`
          }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      });

      const content = completion.choices[0].message.content;
      return this.cleanJsonResponse(content);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate blog post ideas');
    }
  }

  async improveContent(content, improvements = []) {
    const improvementTypes = {
      'readability': 'Make the content more readable and accessible',
      'seo': 'Optimize for SEO with better keywords and structure',
      'engagement': 'Make the content more engaging and interactive',
      'clarity': 'Improve clarity and remove ambiguous language',
      'structure': 'Improve the overall structure and flow'
    };

    const selectedImprovements = improvements.map(type => improvementTypes[type]).join(', ');

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional editor. Improve the given content while maintaining its core message and style."
          },
          {
            role: "user",
            content: `Please improve this content with focus on: ${selectedImprovements}

Original content:
${content}

Return the improved version maintaining the same format and structure.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.5,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to improve content');
    }
  }

  async generateTags(content, maxTags = 5) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a content analyst. Generate relevant tags for blog content."
          },
          {
            role: "user",
            content: `Analyze this blog content and generate up to ${maxTags} relevant tags:

${content.substring(0, 1000)}...

Return only the tags as a JSON array of strings.`
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      const tagsResponse = completion.choices[0].message.content;
      return this.cleanJsonResponse(tagsResponse);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate tags');
    }
  }

  async generateExcerpt(content, maxLength = 150) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a content editor. Create compelling excerpts from blog content."
          },
          {
            role: "user",
            content: `Create an engaging excerpt (max ${maxLength} characters) for this blog content:

${content.substring(0, 800)}...

Return only the excerpt text.`
          }
        ],
        max_tokens: 100,
        temperature: 0.5,
      });

      return completion.choices[0].message.content.trim().replace(/^"|"$/g, '');
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate excerpt');
    }
  }

  async generateSEOTitle(content, originalTitle) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert. Create SEO-optimized titles that are compelling and keyword-rich."
          },
          {
            role: "user",
            content: `Based on this content and original title, suggest 3 SEO-optimized title alternatives:

Original title: ${originalTitle}
Content preview: ${content.substring(0, 500)}...

Return as JSON array of strings.`
          }
        ],
        max_tokens: 200,
        temperature: 0.6,
      });

      const titles = completion.choices[0].message.content;
      return this.cleanJsonResponse(titles);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate SEO titles');
    }
  }

  // Helper methods
  buildBlogPostPrompt(topic, options) {
    const lengthGuide = {
      'short': '500-800 words',
      'medium': '800-1200 words',
      'long': '1200-2000 words'
    };

    return `Write a comprehensive blog post about "${topic}".

Requirements:
- Length: ${lengthGuide[options.length]}
- Tone: ${options.tone}
- Category: ${options.category}
- Target audience: ${options.targetAudience}
- Include relevant examples and actionable insights
- Use proper markdown formatting with headers (##, ###)
- Include a compelling introduction and conclusion
- Add bullet points or numbered lists where appropriate

Please structure the post with:
1. Compelling title
2. Introduction (hook the reader)
3. Main content with 3-5 sections
4. Conclusion with call-to-action

Format the response as JSON with: title, content, suggestedTags`;
  }

  getLengthTokens(length) {
    const tokenMap = {
      'short': 800,
      'medium': 1500,
      'long': 2500
    };
    return tokenMap[length] || 1500;
  }

  parseBlogContent(content) {
    try {
      // Try to parse as JSON first
      const parsed = this.cleanJsonResponse(content);
      return parsed;
    } catch (error) {
      // If not JSON, parse manually
      const lines = content.split('\n');
      const title = lines[0].replace(/^#\s*/, '').trim();
      const contentBody = lines.slice(1).join('\n').trim();
      
      return {
        title,
        content: contentBody,
        suggestedTags: []
      };
    }
  }
}

export const aiService = new AIService();