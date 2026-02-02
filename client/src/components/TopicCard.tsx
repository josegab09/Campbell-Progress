import React from 'react';
import { FullConcept } from "@shared/schema";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleTopic } from "@/hooks/use-curriculum";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ConceptSectionProps {
  concept: FullConcept;
}

export function ConceptSection({ concept }: ConceptSectionProps) {
  const toggleMutation = useToggleTopic();

  // Check if all topics in this concept are completed
  const allCompleted = concept.topics.length > 0 && concept.topics.every(t => t.completed);

  return (
    <div className="mb-6 group">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
          allCompleted ? "bg-green-100 text-green-700" : "bg-primary/10 text-primary"
        )}>
          {allCompleted ? <Check className="w-5 h-5" /> : <span className="font-mono font-bold text-sm">{concept.order}</span>}
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground">
          {concept.title}
        </h3>
      </div>
      
      <div className="pl-3 border-l-2 border-border ml-4 space-y-3">
        {concept.topics.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => toggleMutation.mutate({ id: topic.id, completed: !topic.completed })}
            className={cn(
              "relative flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200",
              topic.completed 
                ? "bg-green-50/50 border-green-100 hover:border-green-200" 
                : "bg-card border-border/50 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
              topic.completed 
                ? "bg-green-500 border-green-500 scale-110" 
                : "border-muted-foreground/30 group-hover:border-primary/50"
            )}>
              {topic.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
            
            <div className="flex-1">
              <span className={cn(
                "font-medium transition-colors",
                topic.completed ? "text-muted-foreground line-through decoration-green-500/30" : "text-foreground"
              )}>
                {topic.title}
              </span>
            </div>

            {toggleMutation.isPending && (
              <div className="absolute right-4 w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
