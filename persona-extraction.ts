/**
 * Persona Extraction Pipeline - Workflow Configuration
 * This represents the 17-step process for extracting and verifying persona data
 */

export const personaExtractionWorkflow = {
  name: 'persona-extraction',
  description: 'Complete persona extraction pipeline with evidence-backed analysis',
  version: '1.0.0',
  
  phases: [
    {
      name: 'initialization',
      description: 'Setup and configuration',
      steps: [
        {
          id: 'initialize',
          name: 'Initialize',
          description: 'Set up extraction parameters and validate input',
          estimatedDuration: '10s',
          inputs: ['subject', 'aliases', 'fusionWeights'],
          outputs: ['runId', 'config']
        }
      ]
    },
    
    {
      name: 'discovery',
      description: 'Find and prepare data sources',
      steps: [
        {
          id: 'seed_aliases',
          name: 'Seed & Alias Expansion',
          description: 'Expand search terms and aliases for comprehensive coverage',
          estimatedDuration: '15s',
          inputs: ['subject', 'aliases'],
          outputs: ['expandedTerms', 'aliasCount']
        },
        {
          id: 'query_generation',
          name: 'Query Generation',
          description: 'Generate targeted search queries for data discovery',
          estimatedDuration: '15s',
          inputs: ['expandedTerms'],
          outputs: ['queries', 'queryCount']
        },
        {
          id: 'source_discovery',
          name: 'Source Discovery',
          description: 'Discover and rank potential data sources',
          estimatedDuration: '80s',
          inputs: ['queries'],
          outputs: ['candidateSources', 'discoveredCount']
        }
      ]
    },
    
    {
      name: 'collection',
      description: 'Ethical data collection with compliance',
      steps: [
        {
          id: 'compliance_scheduling',
          name: 'Compliance & Scheduling',
          description: 'Ensure ethical data collection and rate limiting',
          estimatedDuration: '10s',
          inputs: ['candidateSources'],
          outputs: ['scheduledSources', 'complianceReport']
        },
        {
          id: 'fetching_snapshotting',
          name: 'Fetching & Snapshotting',
          description: 'Collect data while maintaining audit trail',
          estimatedDuration: '170s',
          inputs: ['scheduledSources'],
          outputs: ['rawData', 'snapshots', 'fetchedCount']
        }
      ]
    },
    
    {
      name: 'processing',
      description: 'Data cleaning and quality assessment',
      steps: [
        {
          id: 'normalization',
          name: 'Normalization',
          description: 'Standardize and clean collected data',
          estimatedDuration: '20s',
          inputs: ['rawData'],
          outputs: ['normalizedData', 'formatStats']
        },
        {
          id: 'quality_scoring',
          name: 'Quality Scoring',
          description: 'Assess source credibility and content quality',
          estimatedDuration: '20s',
          inputs: ['normalizedData'],
          outputs: ['scoredData', 'qualityStats']
        },
        {
          id: 'deduplication',
          name: 'Deduplication',
          description: 'Remove duplicate content and sources',
          estimatedDuration: '15s',
          inputs: ['scoredData'],
          outputs: ['uniqueData', 'duplicateStats']
        }
      ]
    },
    
    {
      name: 'analysis',
      description: 'Content analysis and persona extraction',
      steps: [
        {
          id: 'segmentation_embedding',
          name: 'Segmentation & Embedding',
          description: 'Break content into chunks and create embeddings',
          estimatedDuration: '25s',
          inputs: ['uniqueData'],
          outputs: ['chunks', 'embeddings', 'chunkStats']
        },
        {
          id: 'targeted_retrieval',
          name: 'Targeted Retrieval',
          description: 'Extract persona-relevant information using embeddings',
          estimatedDuration: '20s',
          inputs: ['chunks', 'embeddings'],
          outputs: ['relevantChunks', 'retrievalStats']
        },
        {
          id: 'attribute_extraction',
          name: 'Attribute Extraction',
          description: 'Extract specific persona attributes with evidence',
          estimatedDuration: '30s',
          inputs: ['relevantChunks'],
          outputs: ['attributes', 'evidence', 'extractionStats']
        },
        {
          id: 'contradictions',
          name: 'Contradictions',
          description: 'Identify and resolve conflicting information',
          estimatedDuration: '25s',
          inputs: ['attributes', 'evidence'],
          outputs: ['resolvedAttributes', 'conflicts', 'agreementIndex']
        }
      ]
    },
    
    {
      name: 'validation',
      description: 'Final validation and assembly',
      steps: [
        {
          id: 'questionnaire_fusion',
          name: 'Questionnaire Fusion (Optional)',
          description: 'Integrate questionnaire responses with extracted data',
          estimatedDuration: '15s',
          inputs: ['resolvedAttributes', 'questionnaireData?'],
          outputs: ['fusedAttributes', 'fusionStats']
        },
        {
          id: 'fusion_confidence',
          name: 'Fusion & Confidence',
          description: 'Calculate confidence scores and final attribute weights',
          estimatedDuration: '20s',
          inputs: ['fusedAttributes', 'evidence'],
          outputs: ['confidenceScores', 'finalAttributes']
        },
        {
          id: 'persona_assembly',
          name: 'Persona Card Assembly',
          description: 'Compile final persona card with all evidence',
          estimatedDuration: '15s',
          inputs: ['finalAttributes', 'evidence', 'confidenceScores'],
          outputs: ['personaCard', 'quotes']
        },
        {
          id: 'statistics_verification',
          name: 'Statistics & Verification',
          description: 'Generate final statistics and verification data',
          estimatedDuration: '10s',
          inputs: ['personaCard', 'allData'],
          outputs: ['stats', 'verificationPack', 'runComplete']
        }
      ]
    }
  ],
  
  // Total estimated duration: ~500 seconds (8+ minutes)
  metadata: {
    totalSteps: 17,
    estimatedDuration: '8-10 minutes',
    complexity: 'high',
    dataTypes: ['web-content', 'documents', 'questionnaire-responses'],
    outputFormats: ['persona-card', 'evidence-pack', 'statistics', 'audit-trail']
  }
};
