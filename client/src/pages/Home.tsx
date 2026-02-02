import { useCurriculum } from "@/hooks/use-curriculum";
import { Sidebar } from "@/components/Sidebar";
import { ConceptSection } from "@/components/TopicCard";
import { useParams, Redirect } from "wouter";
import { useMemo } from "react";
import { Loader2, PartyPopper } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const { data: curriculum, isLoading, error } = useCurriculum();
  const params = useParams<{ chapterId?: string }>();
  
  const allChapters = useMemo(() => {
    if (!curriculum) return [];
    return curriculum.flatMap(unit => unit.chapters);
  }, [curriculum]);

  const selectedChapterIdStr = params.chapterId;
  const selectedChapterId = selectedChapterIdStr 
    ? parseInt(selectedChapterIdStr) 
    : allChapters[0]?.id;

  const selectedChapter = allChapters.find(c => c.id === selectedChapterId);
  const selectedUnit = curriculum?.find(u => u.chapters.some(c => c.id === (selectedChapterId ?? -1)));

  const unitColorMap: Record<string, string> = {
    'blue': 'bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100',
    'emerald': 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100',
    'purple': 'bg-purple-50/50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-100',
    'orange': 'bg-orange-50/50 dark:bg-orange-950/20 text-orange-900 dark:text-orange-100',
    'teal': 'bg-teal-50/50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-100',
    'lime': 'bg-lime-50/50 dark:bg-lime-950/20 text-lime-900 dark:text-lime-100',
    'indigo': 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-100',
    'rose': 'bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-100',
  };

  const currentThemeClasses = selectedUnit ? unitColorMap[selectedUnit.color] : 'bg-slate-50/50 dark:bg-slate-950/20';

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <aside className="w-80 border-r" />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Carregando currículo...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !curriculum) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8 bg-card rounded-2xl border border-border shadow-lg">
          <h2 className="text-2xl font-bold text-destructive mb-2">Erro ao carregar</h2>
          <p className="text-muted-foreground mb-4">
            Não foi possível buscar o currículo. Tente novamente mais tarde.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!params.chapterId && allChapters.length > 0) {
    return <Redirect to={`/chapter/${allChapters[0].id}`} />;
  }

  if (!selectedChapter) {
    return <div className="p-8">Capítulo não encontrado</div>;
  }

  const totalTopics = selectedChapter.concepts.reduce((acc, c) => acc + c.topics.length, 0);
  const completedTopics = selectedChapter.concepts.reduce((acc, c) => 
    acc + c.topics.filter(t => t.completed).length, 0
  );
  const progress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel 
          defaultSize={20} 
          minSize={15} 
          maxSize={40}
          className="min-w-[320px]"
        >
          <Sidebar units={curriculum} isLoading={false} />
        </ResizablePanel>
        
        <ResizableHandle withHandle className="w-1.5 hover:bg-primary/20 transition-colors" />
        
        <ResizablePanel defaultSize={80}>
          <main className={cn("h-full overflow-y-auto transition-colors duration-500", currentThemeClasses)}>
            <div className="max-w-4xl mx-auto px-8 py-12">
              <div className="flex items-center gap-2 text-sm opacity-70 mb-8 font-medium">
                <span>Unidade {selectedUnit?.order}</span>
                <span className="opacity-30">/</span>
                <span className="font-bold">Capítulo {selectedChapter.order}</span>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedChapter.id}
                className="mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
                  {selectedChapter.title}
                </h1>
                
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex-1 h-3 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        progress === 100 ? "bg-green-500" : "bg-primary"
                      )}
                    />
                  </div>
                  <span className="text-sm font-semibold opacity-70 whitespace-nowrap w-16 text-right">
                    {progress}%
                  </span>
                </div>
              </motion.div>

              {progress === 100 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-10 p-6 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <PartyPopper className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-700">Capítulo Concluído!</h3>
                    <p className="text-green-600/80">Bom trabalho ao dominar esses conceitos. Pronto para o próximo?</p>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                {selectedChapter.concepts.map((concept, idx) => (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <ConceptSection concept={concept} />
                  </motion.div>
                ))}
              </div>
            </div>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
