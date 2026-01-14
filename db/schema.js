import { pgTable, serial, varchar, text, integer, timestamp, } from 'drizzle-orm/pg-core';

export const users = pgTable('users_my_task', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 256 }).notNull().unique(),
    password: varchar('password', { length: 256 }).notNull(),
});

export const todos = pgTable('todos_my_task', {
    id: serial('id').primaryKey(),
    note: text('note').notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    status: varchar('status', { length: 50 }).default('pending').notNull(),
    createAt: timestamp('create_at', { mode: 'string' }).defaultNow().notNull(),
    completeAt: timestamp('complete_at', { mode: 'string' }),
    deadline: timestamp('deadline', { mode: 'string'})
});