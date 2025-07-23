import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const students = sqliteTable('students', {
  id: text('id').primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  studentCode: text('student_code').notNull().unique(),
  birthDate: text('birth_date').notNull(),
  gender: text('gender').notNull(),
});
