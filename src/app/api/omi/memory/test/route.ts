import { NextRequest, NextResponse } from 'next/server';
import { MemoryCreation } from '@/lib/omi/memory-types';

// Generate sample Memory Creation data for testing
function generateSampleMemory(language: 'en' | 'es' = 'en'): MemoryCreation {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
  const memoryId = `test_mem_${Date.now()}`;

  const sampleData = {
    en: {
      title: 'AI Product Development Meeting',
      overview: 'Discussion about implementing AI features in our product with focus on user experience and scalability.',
      category: 'meeting',
      segments: [
        {
          text: 'We need to implement artificial intelligence features in our product to improve user experience.',
          speaker: 'Speaker 0',
          speakerId: 0,
          is_user: true,
          start: 0,
          end: 5.2
        },
        {
          text: 'Yes, I agree. We should focus on natural language processing and machine learning algorithms.',
          speaker: 'Speaker 1',
          speakerId: 1,
          is_user: false,
          start: 5.5,
          end: 10.1
        },
        {
          text: 'The architecture needs to be scalable and maintainable. We should consider microservices.',
          speaker: 'Speaker 0',
          speakerId: 0,
          is_user: true,
          start: 10.5,
          end: 15.8
        },
        {
          text: 'Great point. Let\'s also think about security and data privacy when processing user information.',
          speaker: 'Speaker 2',
          speakerId: 2,
          is_user: false,
          start: 16.0,
          end: 21.3
        },
        {
          text: 'Performance optimization will be crucial. We need to ensure fast response times.',
          speaker: 'Speaker 1',
          speakerId: 1,
          is_user: false,
          start: 21.5,
          end: 26.0
        }
      ],
      action_items: [
        { description: 'Research natural language processing libraries', completed: false },
        { description: 'Design microservices architecture', completed: false },
        { description: 'Implement security protocols for user data', completed: false }
      ]
    },
    es: {
      title: 'Reunión de Desarrollo de IA',
      overview: 'Discusión sobre implementar funcionalidades de inteligencia artificial en nuestro producto.',
      category: 'reunion',
      segments: [
        {
          text: 'Necesitamos implementar funciones de inteligencia artificial en nuestro producto para mejorar la experiencia del usuario.',
          speaker: 'Hablante 0',
          speakerId: 0,
          is_user: true,
          start: 0,
          end: 6.2
        },
        {
          text: 'Sí, estoy de acuerdo. Debemos enfocarnos en procesamiento de lenguaje natural y algoritmos de aprendizaje automático.',
          speaker: 'Hablante 1',
          speakerId: 1,
          is_user: false,
          start: 6.5,
          end: 12.8
        },
        {
          text: 'La arquitectura necesita ser escalable y mantenible. Deberíamos considerar microservicios.',
          speaker: 'Hablante 0',
          speakerId: 0,
          is_user: true,
          start: 13.0,
          end: 18.5
        },
        {
          text: 'Excelente punto. También pensemos en seguridad y privacidad de datos al procesar información de usuarios.',
          speaker: 'Hablante 2',
          speakerId: 2,
          is_user: false,
          start: 18.8,
          end: 25.1
        }
      ],
      action_items: [
        { description: 'Investigar librerías de procesamiento de lenguaje natural', completed: false },
        { description: 'Diseñar arquitectura de microservicios', completed: false }
      ]
    }
  };

  const data = sampleData[language];

  return {
    id: memoryId,
    created_at: now.toISOString(),
    started_at: thirtyMinutesAgo.toISOString(),
    finished_at: now.toISOString(),
    source: 'test',
    language: language,
    structured: {
      title: data.title,
      overview: data.overview,
      emoji: '💡',
      category: data.category,
      action_items: data.action_items,
      events: []
    },
    transcript_segments: data.segments,
    geolocation: {
      address: 'Test Location, Test City',
      latitude: 40.7128,
      longitude: -74.0060,
      location_type: 'office'
    },
    photos: [],
    plugins_results: [],
    external_data: null,
    discarded: false,
    deleted: false,
    visibility: 'private',
    processing_memory_id: null,
    status: 'completed'
  };
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid') || 'test_user';
    const language = (searchParams.get('lang') as 'en' | 'es') || 'en';

    console.log('=== MEMORY CREATION TEST WEBHOOK ===');
    console.log('Test User:', uid);
    console.log('Language:', language);

    // Generate sample memory
    const sampleMemory = generateSampleMemory(language);

    // Send to main webhook endpoint
    const webhookUrl = new URL('/api/omi/memory', request.url);
    webhookUrl.searchParams.set('uid', uid);

    console.log('Forwarding to webhook:', webhookUrl.toString());

    const webhookResponse = await fetch(webhookUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleMemory)
    });

    const result = await webhookResponse.json();

    console.log('Webhook response status:', webhookResponse.status);
    console.log('Webhook result:', result);

    return NextResponse.json({
      success: true,
      message: 'Test Memory Creation sent successfully',
      test_data: {
        user_id: uid,
        memory_id: sampleMemory.id,
        language: language,
        segments_count: sampleMemory.transcript_segments.length,
        title: sampleMemory.structured.title
      },
      webhook_response: result
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test Memory Creation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const uid = searchParams.get('uid') || 'test_user';
  const language = searchParams.get('lang') || 'en';

  return NextResponse.json({
    success: true,
    message: 'Memory Creation Test Endpoint',
    usage: {
      test_english: `POST /api/omi/memory/test?uid=${uid}&lang=en`,
      test_spanish: `POST /api/omi/memory/test?uid=${uid}&lang=es`,
      custom_user: 'POST /api/omi/memory/test?uid=YOUR_USER_ID'
    },
    sample_users: [
      'mel_twitter',
      'carlos_instagram', 
      'test_user',
      '@frutero_hacker'
    ],
    supported_languages: ['en', 'es'],
    example_memory_structure: generateSampleMemory(language as 'en' | 'es')
  });
}