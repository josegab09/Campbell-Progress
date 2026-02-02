import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize seed data
  await storage.seedData();

  app.get(api.curriculum.get.path, async (req, res) => {
    const data = await storage.getFullCurriculum();
    res.json(data);
  });

  app.patch(api.topics.toggle.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { completed } = api.topics.toggle.input.parse(req.body);
      const updated = await storage.toggleTopic(id, completed);
      
      if (!updated) {
        return res.status(404).json({ message: "Topic not found" });
      }
      
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return httpServer;
}
