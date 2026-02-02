import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  color: text("color").default("blue"),
  symbol: text("symbol"),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
});

export const concepts = pgTable("concepts", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  summary: text("summary"),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  conceptId: integer("concept_id").notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  completed: boolean("completed").default(false).notNull(),
});

// === RELATIONS ===
export const unitsRelations = relations(units, ({ many }) => ({
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  unit: one(units, {
    fields: [chapters.unitId],
    references: [units.id],
  }),
  concepts: many(concepts),
}));

export const conceptsRelations = relations(concepts, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [concepts.chapterId],
    references: [chapters.id],
  }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one }) => ({
  concept: one(concepts, {
    fields: [topics.conceptId],
    references: [concepts.id],
  }),
}));

// === BASE SCHEMAS ===
export const insertUnitSchema = createInsertSchema(units).omit({ id: true });
export const insertChapterSchema = createInsertSchema(chapters).omit({ id: true });
export const insertConceptSchema = createInsertSchema(concepts).omit({ id: true });
export const insertTopicSchema = createInsertSchema(topics).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Unit = typeof units.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Concept = typeof concepts.$inferSelect;
export type Topic = typeof topics.$inferSelect;

export type FullTopic = Topic;
export type FullConcept = Concept & { topics: FullTopic[] };
export type FullChapter = Chapter & { concepts: FullConcept[] };
export type FullUnit = Unit & { chapters: FullChapter[] };

export type TopicToggleRequest = { completed: boolean };
