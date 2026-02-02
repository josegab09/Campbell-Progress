import React from 'react';
import { cn } from "@/lib/utils";
import { FullUnit, FullChapter } from "@shared/schema";
import { ChevronRight, BookOpen, CircleCheck, Atom, Box, Dna, TrendingUp, TreePine, Leaf, PawPrint, Globe, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import * as Accordion from "@radix-ui/react-accordion";

const unitIcons: Record<string, any> = {
  Atom, Box, Dna, TrendingUp, TreePine, Leaf, PawPrint, Globe
};

interface SidebarProps {
  units: FullUnit[];
  isLoading: boolean;
  className?: string;
}

export function Sidebar({ units, isLoading, className }: SidebarProps) {
  const [location] = useLocation();
  
  const getUnitProgress = (unit: FullUnit) => {
    let totalTopics = 0;
    let completedTopics = 0;
    unit.chapters.forEach(chapter => {
      chapter.concepts.forEach(concept => {
        concept.topics.forEach(topic => {
          totalTopics++;
          if (topic.completed) completedTopics++;
        });
      });
    });
    return totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
  };

  const stats = React.useMemo(() => {
    let completedConceptsCount = 0;
    const targetTotal = 256;

    units.forEach(unit => {
      unit.chapters.forEach(chapter => {
        chapter.concepts.forEach(concept => {
          const isComplete = concept.topics.length > 0 && concept.topics.every(t => t.completed);
          if (isComplete) completedConceptsCount++;
        });
      });
    });

    const percent = Math.round((completedConceptsCount / targetTotal) * 100);
    return { completed: completedConceptsCount, total: targetTotal, percent };
  }, [units]);

  if (isLoading) {
    return (
      <aside className={cn("w-full h-screen border-r border-border bg-card/30 p-6 flex flex-col gap-4", className)}>
        <div className="h-8 bg-muted rounded-md animate-pulse w-3/4 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 bg-muted rounded animate-pulse w-full" />
          </div>
        ))}
      </aside>
    );
  }

  return (
    <aside className={cn("w-full h-screen bg-background flex flex-col", className)}>
      <div className="p-6 border-b border-border/50">
        <h1 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Biologia Campbell
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Guia de Estudo</p>
      </div>

      <div className="p-6 border-b border-border/30 bg-primary/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Progresso Total</span>
          </div>
          <span className="text-xs font-bold text-primary">{stats.percent}%</span>
        </div>
        <Progress value={stats.percent} className="h-2 mb-2" />
        <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium">
          <span>{stats.completed} de {stats.total} conceitos</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
        <Accordion.Root type="multiple" className="space-y-2">
          {units.map((unit) => {
            const IconComponent = unitIcons[unit.symbol || 'BookOpen'] || BookOpen;
            const unitActive = location.includes(`/chapter/`) && unit.chapters.some(c => location === `/chapter/${c.id}`);

            return (
              <Accordion.Item key={unit.id} value={`unit-${unit.id}`} className="border-none">
                <Accordion.Header>
                  <Accordion.Trigger className="w-full group">
                    <div className={cn(
                      "flex items-center justify-between p-2 rounded-lg transition-all duration-300",
                      unitActive ? "bg-primary/10 shadow-sm" : "hover:bg-muted/50"
                    )}>
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={cn(
                          "p-2 rounded-md transition-colors duration-300", 
                          `bg-${unit.color}-500/10 text-${unit.color}-500`,
                          unitActive && `bg-${unit.color}-500 text-white shadow-sm`
                        )}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className={cn(
                          "text-sm font-semibold text-left truncate",
                          unitActive ? "text-primary" : "text-foreground"
                        )}>
                          U{unit.order}: {unit.title.replace(/UNIDADE \d+: /, '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-muted-foreground">{getUnitProgress(unit)}%</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      </div>
                    </div>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="pt-1 pb-2 pl-9 space-y-1 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  {unit.chapters.map((chapter) => (
                    <ChapterItem 
                      key={chapter.id} 
                      chapter={chapter} 
                      isActive={location === `/chapter/${chapter.id}`}
                      unitColor={unit.color}
                    />
                  ))}
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>
      </div>
      
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
            JG
          </div>
          <div>
            <p className="text-sm font-medium">José Gabriel</p>
            <p className="text-xs text-muted-foreground">Estudante</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ChapterItem({ chapter, isActive, unitColor }: { chapter: FullChapter; isActive: boolean, unitColor: string }) {
  let total = 0;
  let completed = 0;
  chapter.concepts.forEach(c => c.topics.forEach(t => {
    total++;
    if (t.completed) completed++;
  }));
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Link href={`/chapter/${chapter.id}`}>
      <div 
        className={cn(
          "group flex flex-col gap-1.5 p-2 rounded-lg cursor-pointer transition-all duration-200 border border-transparent",
          isActive 
            ? "bg-white dark:bg-slate-900 shadow-sm border-border/50" 
            : "hover:bg-muted/30"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={cn(
            "text-xs font-medium transition-colors truncate",
            isActive ? `text-${unitColor}-600 dark:text-${unitColor}-400` : "text-muted-foreground group-hover:text-foreground"
          )}>
            {chapter.title}
          </span>
          {progress === 100 ? (
            <CircleCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
          ) : (
            <span className="text-[10px] text-muted-foreground shrink-0">{progress}%</span>
          )}
        </div>
        <Progress value={progress} className="h-0.5" />
      </div>
    </Link>
  );
}
