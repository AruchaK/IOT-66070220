import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { students } from './schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { D1Database } from '@cloudflare/workers-types';
import { bearerAuth } from 'hono/bearer-auth';

type Bindings = {
  DB: D1Database;
  API_TOKEN: string
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', (c, next) =>
  bearerAuth({ token: c.env.API_TOKEN })(c, next)
);

const StudentInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  studentCode: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  gender: z.enum(['M', 'F', 'O']),
});

app.post('/students', async (c) => {
  const body = await c.req.json();
  const parsed = StudentInput.safeParse(body);
  if (!parsed.success) return c.json({ errors: parsed.error.flatten() }, 400);

  const db = drizzle(c.env.DB);
  const { firstName, lastName, studentCode, birthDate, gender } = parsed.data;
  const id = crypto.randomUUID();

  await db.insert(students).values({ id, firstName, lastName, studentCode, birthDate, gender });
  return c.json({ id });
});

app.get('/students', async (c) => {
  const db = drizzle(c.env.DB);
  const rows = await db.select().from(students).all();
  return c.json(rows);
});


app.get('/students/:id', async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param('id');
  const row = await db.select().from(students).where(eq(students.id, id)).get();
  if (!row) return c.json({ message: 'Not found' }, 404);
  return c.json(row);
});


app.put('/students/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const parsed = StudentInput.partial().safeParse(body);
  if (!parsed.success) return c.json({ errors: parsed.error.flatten() }, 400);

  const db = drizzle(c.env.DB);
  const updated = await db.update(students).set(parsed.data).where(eq(students.id, id)).run();
  if (updated.changes === 0) return c.json({ message: 'Not found' }, 404);
  return c.json({ updated: true });
});

app.delete('/students/:id', async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param('id');
  const deleted = await db.delete(students).where(eq(students.id, id)).run();
  if (deleted.changes === 0) return c.json({ message: 'Not found' }, 404);
  return c.json({ deleted: true });
});

export default app;
