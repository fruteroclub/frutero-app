# Omi Memory Prompt Integration Guide

## Overview

This guide provides instructions for integrating Omi Memory Prompts to display the most frequently used words from conversations in various settings (conferences, mentorship sessions, job meetings, etc.). The Omi wearable device captures and transcribes conversations, which can be processed through Memory Prompts to extract meaningful insights.

## Integration Architecture

```
[Omi Wearable] → [Transcription] → [Memory Prompt] → [Your Webhook] → [Word Frequency Analysis]
```

## Prerequisites

1. **Omi Developer Account**: Register as a developer on the Omi platform
2. **Omi Mobile App**: Download for testing and app configuration
3. **Webhook Endpoint**: A publicly accessible HTTPS endpoint to receive transcription data
4. **Backend Service**: Server to process and analyze word frequencies

## Step 1: Enable Developer Mode

1. Download the Omi mobile app
2. Navigate to Settings → Developer Settings
3. Enable Developer Mode
4. Access the Developer Tools section

## Step 2: Create Memory Prompt App

### Define Your Memory Prompt

Create a prompt that extracts conversation data for word frequency analysis:

```yaml
name: "Conversation Word Frequency Analyzer"
type: "memory_prompt"
prompt: |
  Analyze the following conversation transcript and extract:
  1. Complete transcript text
  2. Conversation context (meeting type, participants if mentioned)
  3. Timestamp information
  4. Key topics discussed
  
  Return the data in a structured format that includes:
  - raw_transcript: full conversation text
  - context: meeting type or setting
  - duration: conversation length
  - timestamp: when the conversation occurred
```

### Test Your Prompt

1. Open the Omi app
2. Navigate to a recorded memory
3. Access Developer Tools
4. Run your memory prompt against the memory
5. Verify the output structure

## Step 3: Implement Webhook Endpoint

### Basic Webhook Structure (Node.js/Express Example)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Webhook endpoint for Omi Memory Prompts
app.post('/api/omi/memory-webhook', async (req, res) => {
  try {
    // Extract memory data from request
    const {
      memory_id,
      transcript,
      context,
      timestamp,
      user_id,
      prompt_result
    } = req.body;

    // Process the transcript for word frequency
    const wordFrequency = analyzeWordFrequency(transcript);
    
    // Store or process the results
    await processConversationData({
      memoryId: memory_id,
      wordFrequency,
      context,
      timestamp
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Memory processed successfully',
      top_words: wordFrequency.slice(0, 10)
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process memory'
    });
  }
});

// Word frequency analysis function
function analyzeWordFrequency(transcript) {
  // Remove common stop words
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 
    'as', 'are', 'was', 'were', 'have', 'has', 'had', 
    'do', 'does', 'did', 'will', 'would', 'could', 'should'
  ]);

  // Process transcript
  const words = transcript
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Count word frequencies
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Sort by frequency
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));
}

async function processConversationData(data) {
  // Store in database or forward to analytics service
  console.log('Processing conversation data:', data);
  // Implementation depends on your storage solution
}

app.listen(3000, () => {
  console.log('Omi webhook server running on port 3000');
});
```

### Python/FastAPI Example

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from collections import Counter
import re

app = FastAPI()

class MemoryWebhookRequest(BaseModel):
    memory_id: str
    transcript: str
    context: Optional[str]
    timestamp: str
    user_id: str
    prompt_result: Optional[Dict]

class WordFrequencyResponse(BaseModel):
    success: bool
    message: str
    top_words: List[Dict[str, int]]

@app.post("/api/omi/memory-webhook", response_model=WordFrequencyResponse)
async def process_memory_webhook(request: MemoryWebhookRequest):
    try:
        # Analyze word frequency
        word_frequency = analyze_word_frequency(request.transcript)
        
        # Process and store the data
        await process_conversation_data({
            "memory_id": request.memory_id,
            "word_frequency": word_frequency,
            "context": request.context,
            "timestamp": request.timestamp
        })
        
        # Return top 10 words
        return WordFrequencyResponse(
            success=True,
            message="Memory processed successfully",
            top_words=word_frequency[:10]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def analyze_word_frequency(transcript: str) -> List[Dict[str, int]]:
    # Stop words to filter out
    stop_words = {
        'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an',
        'as', 'are', 'was', 'were', 'have', 'has', 'had',
        'do', 'does', 'did', 'will', 'would', 'could', 'should'
    }
    
    # Clean and tokenize
    words = re.findall(r'\b[a-z]+\b', transcript.lower())
    
    # Filter words
    meaningful_words = [
        word for word in words 
        if len(word) > 2 and word not in stop_words
    ]
    
    # Count frequencies
    word_counts = Counter(meaningful_words)
    
    # Return sorted list
    return [
        {"word": word, "count": count}
        for word, count in word_counts.most_common()
    ]

async def process_conversation_data(data: Dict):
    # Implement your storage logic here
    print(f"Processing conversation data: {data}")
    # Example: Store in database, send to analytics service, etc.
```

## Step 4: Configure Webhook in Omi App

1. Navigate to your app settings in the Omi developer portal
2. Set your webhook URL: `https://your-domain.com/api/omi/memory-webhook`
3. Configure authentication if required (API key, OAuth, etc.)
4. Set up retry logic and timeout settings

## Step 5: Display Word Frequency Results

### Frontend Component (React Example)

```jsx
import React, { useState, useEffect } from 'react';

const WordFrequencyDisplay = ({ memoryId }) => {
  const [wordCloud, setWordCloud] = useState([]);
  const [context, setContext] = useState('');

  useEffect(() => {
    fetchWordFrequency(memoryId);
  }, [memoryId]);

  const fetchWordFrequency = async (id) => {
    try {
      const response = await fetch(`/api/conversations/${id}/word-frequency`);
      const data = await response.json();
      setWordCloud(data.top_words);
      setContext(data.context);
    } catch (error) {
      console.error('Error fetching word frequency:', error);
    }
  };

  return (
    <div className="word-frequency-container">
      <h2>Most Used Words - {context}</h2>
      <div className="word-cloud">
        {wordCloud.map((item, index) => (
          <div 
            key={item.word}
            className="word-item"
            style={{ 
              fontSize: `${Math.max(36 - index * 3, 14)}px`,
              opacity: Math.max(1 - index * 0.08, 0.3)
            }}
          >
            <span className="word">{item.word}</span>
            <span className="count">({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordFrequencyDisplay;
```

## Step 6: Advanced Features

### Context-Aware Filtering

Implement different stop word lists based on conversation context:

```javascript
const contextualStopWords = {
  conference: ['presentation', 'slide', 'question', 'thank'],
  mentorship: ['think', 'maybe', 'probably', 'suggest'],
  job_meeting: ['position', 'company', 'experience', 'skills']
};

function getStopWords(context) {
  const baseStopWords = [...commonStopWords];
  if (contextualStopWords[context]) {
    return new Set([...baseStopWords, ...contextualStopWords[context]]);
  }
  return new Set(baseStopWords);
}
```

### Real-time Updates

Implement WebSocket connection for live word frequency updates during ongoing conversations:

```javascript
// WebSocket connection for real-time updates
const ws = new WebSocket('wss://your-domain.com/ws/omi-stream');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'word_update') {
    updateWordFrequency(data.words);
  }
};
```

## Step 7: Testing & Deployment

### Testing Checklist

- [ ] Test webhook endpoint with sample Omi memory data
- [ ] Verify word frequency calculation accuracy
- [ ] Test different conversation contexts
- [ ] Validate error handling for malformed requests
- [ ] Test webhook authentication (if implemented)
- [ ] Verify data persistence and retrieval
- [ ] Test frontend display with various word counts

### Deployment Considerations

1. **Security**:
   - Use HTTPS for webhook endpoint
   - Implement request signature verification
   - Add rate limiting to prevent abuse

2. **Scalability**:
   - Implement queue system for processing large transcripts
   - Use caching for frequently accessed word frequencies
   - Consider database indexing for memory IDs

3. **Monitoring**:
   - Log all webhook requests and responses
   - Monitor processing times for large transcripts
   - Set up alerts for webhook failures

## LLM-Assisted Development Tips

When using AI assistants (ChatGPT, Claude, etc.) to help with this integration:

### Prompt Templates

**For webhook implementation:**
```
"Create a webhook endpoint in [language/framework] that:
1. Receives Omi memory transcript data
2. Analyzes word frequency excluding stop words
3. Stores results with context (conference/meeting type)
4. Returns top N most frequent words
Include error handling and logging."
```

**For frontend visualization:**
```
"Create a React component that:
1. Fetches word frequency data from an API
2. Displays words as a cloud/list with size based on frequency
3. Shows conversation context (meeting type)
4. Updates in real-time if new data arrives
Use [Tailwind/CSS framework] for styling."
```

**For optimization:**
```
"Optimize this word frequency analysis function to:
1. Handle transcripts over 10,000 words efficiently
2. Support multiple languages
3. Filter context-specific stop words
4. Return results sorted by frequency
Consider memory and processing efficiency."
```

### Code Review Prompts

```
"Review this Omi webhook integration code for:
1. Security vulnerabilities
2. Performance bottlenecks
3. Error handling completeness
4. Scalability concerns
Suggest improvements with code examples."
```

## Troubleshooting

### Common Issues

1. **Webhook not receiving data**:
   - Verify webhook URL is publicly accessible
   - Check firewall/security group settings
   - Confirm SSL certificate is valid

2. **Word frequency inaccurate**:
   - Review stop word list
   - Check text preprocessing (punctuation, case)
   - Verify language detection

3. **Performance issues with large transcripts**:
   - Implement streaming processing
   - Use worker threads/processes
   - Add caching layer

## Resources

- [Omi Developer Documentation](https://docs.omi.me)
- [Omi Mobile App](https://omi.me/download)
- [Webhook Best Practices](https://webhooks.dev)
- [Natural Language Processing Libraries](https://nlp.resources)

## Support

For integration support:
- Omi Developer Forum: [community.omi.me]
- GitHub Issues: [github.com/omi-ai/developer-docs]
- Email: developers@omi.me

---

**Last Updated**: December 2024
**Version**: 1.0.0