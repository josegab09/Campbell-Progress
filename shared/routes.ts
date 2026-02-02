import { z } from 'zod';
import { units, chapters, concepts, topics } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  validation: z.object({
    message: z.string(),
  })
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  curriculum: {
    get: {
      method: 'GET' as const,
      path: '/api/curriculum',
      responses: {
        200: z.array(z.custom<any>()), // Recursive types are hard to z.custom fully, using any for the nested tree structure for now
      },
    },
  },
  topics: {
    toggle: {
      method: 'PATCH' as const,
      path: '/api/topics/:id/toggle',
      input: z.object({ completed: z.boolean() }),
      responses: {
        200: z.custom<typeof topics.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
