import { db } from "./db";
import {
  units, chapters, concepts, topics,
  type FullUnit,
  type Topic
} from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getFullCurriculum(): Promise<FullUnit[]>;
  toggleTopic(id: number, completed: boolean): Promise<Topic | undefined>;
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getFullCurriculum(): Promise<FullUnit[]> {
    const allUnits = await db.query.units.findMany({
      orderBy: [asc(units.order)],
      with: {
        chapters: {
          orderBy: [asc(chapters.order)],
          with: {
            concepts: {
              orderBy: [asc(concepts.order)],
              with: {
                topics: {
                  orderBy: [asc(topics.order)],
                }
              }
            }
          }
        }
      }
    });
    return allUnits;
  }

  async toggleTopic(id: number, completed: boolean): Promise<Topic | undefined> {
    const [updated] = await db.update(topics)
      .set({ completed })
      .where(eq(topics.id, id))
      .returning();
    return updated;
  }

  async seedData(): Promise<void> {
    const CAMPBELL_DATA = [
      {
        title: 'UNIDADE 1: A QUÍMICA DA VIDA',
        color: 'blue',
        symbol: 'Atom',
        chapters: [
          { title: 'Capítulo 1: Evolução, os Temas da Biologia e a Pesquisa Científica', concepts: [
            { text: 'CONCEITO 1.1: O estudo da vida revela temas comuns', tasks: ['Tema: Novas propriedades emergem em cada nível da hierarquia biológica', 'Tema: os processos da vida envolvem a expressão e a transmissão de informação genética', 'Tema: a vida requer a transferência e transformação de energia e matéria', 'Tema: de ecossistemas a moléculas, as interações são fundamentais nos sistemas biológicos', 'Evolução, o tema central da biologia'] },
            { text: 'CONCEITO 1.2: O tema central: a evolução é responsável pela uniformidade e diversidade da vida', tasks: ['Classificando a diversidade da vida', 'Charles Darwin e a teoria da seleção natural', 'A árvore da vida'] },
            { text: 'CONCEITO 1.3: Ao estudar a natureza, os cientistas fazem observações, formulam e testam hipóteses', tasks: ['Fazendo observações', 'Formulando e testando hipóteses', 'A flexibilidade do processo científico', 'Um estudo de caso em pesquisa científica', 'Variáveis experimentais e controles', 'Teoria na ciência'] },
            { text: 'CONCEITO 1.4: A ciência faz uso de uma abordagem cooperativa e de diversos pontos de vista', tasks: ['Aprimorando o trabalho de outros', 'Ciência, tecnologia e sociedade', 'O valor de pontos de vista diversificados'] }
          ]},
          { title: 'Capítulo 2: O Contexto Químico da Vida', concepts: [
            { text: 'CONCEITO 2.1: A matéria consiste em elementos químicos na forma simples e em combinações denominadas compostos', tasks: ['Elementos e compostos', 'Os elementos da vida', 'Estudo de caso: evolução da tolerância a elementos tóxicos'] },
            { text: 'CONCEITO 2.2: As propriedades de um elemento dependem da estrutura de seus átomos', tasks: ['Partículas subatômicas', 'Número atômico e massa atômica', 'Isótopos', 'Os níveis de energia dos elétrons', 'Distribuição eletrônica', 'Orbitais eletrônicos'] },
            { text: 'CONCEITO 2.3: A formação e a função das moléculas dependem das ligações químicas entre os átomos', tasks: ['Ligações covalentes', 'Ligações iônicas', 'Ligações químicas fracas', 'Forma e função moleculares'] },
            { text: 'CONCEITO 2.4: As reações químicas formam e rompem ligações químicas', tasks: ['Reações químicas'] }
          ]},
          { title: 'Capítulo 3: Água e Vida', concepts: [
            { text: 'CONCEITO 3.1: As ligações covalentes polares nas moléculas de água promovem ligações de hidrogênio', tasks: ['A molécula que sustenta toda a vida'] },
            { text: 'CONCEITO 3.2: Quatro propriedades emergentes da água contribuem para a adequação da Terra à vida', tasks: ['Coesão das moléculas de água', 'Moderação da temperatura pela água', 'Flutuação do gelo sobre a água líquida', 'Água: o solvente da vida', 'Possível evolução de vida em outros planetas'] },
            { text: 'CONCEITO 3.3: Condições ácidas e básicas afetam os organismos vivos', tasks: ['Ácidos e bases', 'A escala do pH', 'Tampões', 'Acidificação: ameaças à qualidade da água'] }
          ]},
          { title: 'Capítulo 4: O Carbono e a Diversidade Molecular da Vida', concepts: [
            { text: 'CONCEITO 4.1: A química orgânica é o estudo dos compostos de carbono', tasks: ['Moléculas orgânicas e a origem da vida na Terra'] },
            { text: 'CONCEITO 4.2: Os átomos de carbono podem formar diversas moléculas ligando-se a outros foram átomos', tasks: ['A formação de ligações com o carbono', 'A diversidade molecular'] },
            { text: 'CONCEITO 4.3: Alguns grupos químicos são essenciais para a função molecular', tasks: ['Os grupos químicos mais importantes', 'ATP: importante fonte de energia', 'Os elementos químicos da vida: uma revisão'] }
          ]},
          { title: 'Capítulo 5: Estrutura e Função de Grandes Moléculas Biológicas', concepts: [
            { text: 'CONCEITO 5.1: Macromoléculas são polímeros compostos por monômeros', tasks: ['A síntese e a clivagem de polímeros', 'A diversidade dos polímeros'] },
            { text: 'CONCEITO 5.2: Carboidratos servem como combustível e material de construção', tasks: ['Açúcares', 'Polissacarídeos'] },
            { text: 'CONCEITO 5.3: Os lipídeos são um grupo diversificado de moléculas hidrofóbicas', tasks: ['Gorduras', 'Fosfolipídeos', 'Esteroides'] },
            { text: 'CONCEITO 5.4: As proteínas apresentam grande variedade de estruturas', tasks: ['Monômeros de aminoácidos', 'Polipeptídeos', 'A estrutura e a função das proteínas'] },
            { text: 'CONCEITO 5.5: Os ácidos nucleicos armazenam, transmitem e ajudam a expressar a informação hereditária', tasks: ['Os papéis dos ácidos nucleicos', 'Os componentes dos ácidos nucleicos', 'Polímeros de nucleotídeos', 'As estruturas das moléculas de DNA e RNA'] },
            { text: 'CONCEITO 5.6: A genômica e a proteômica transformaram a pesquisa biológica', tasks: ['DNA e proteínas: novas fitas métricas da evolução'] }
          ]}
        ]
      },
      {
        title: 'UNIDADE 2: A CÉLULA',
        color: 'emerald',
        symbol: 'Box',
        chapters: [
          { title: 'Capítulo 6: Uma Viagem pela Célula', concepts: [
            { text: 'CONCEITO 6.1: Para estudar as células, os biólogos utilizam microscópios e ferramentas da bioquímica', tasks: ['Microscopia', 'Fracionamento celular'] },
            { text: 'CONCEITO 6.2: Células eucarióticas possuem membranas internas que compartimentalizam suas funções', tasks: ['Comparação entre células procarióticas e eucarióticas', 'Uma visão panorâmica da célula eucariótica'] },
            { text: 'CONCEITO 6.3: As instruções genéticas das células eucarióticas são guardadas no núcleo e executadas pelos ribossomos', tasks: ['O núcleo: central de informações', 'Ribossomos: fábricas de proteínas'] },
            { text: 'CONCEITO 6.4: O sistema de endomembranas regula o tráfego de proteínas e realiza as funções metabólicas na célula', tasks: ['O retículo endoplasmático: fábrica biossintética', 'O aparelho de Golgi: centro de remessa e recepção', 'Lisossomos: compartimentos de digestão', 'Vacúolos: diversos compartimentos de manutenção', 'O sistema de endomembranas: uma revisão'] },
            { text: 'CONCEITO 6.5: As mitocôndrias e os cloroplastos mudam a energia de uma forma para outra', tasks: ['As origens evolutivas de mitocôndrias e cloroplastos', 'Mitocôndrias: conversão de energia química', 'Cloroplastos: captura de energia livre', 'Peroxissomos: oxidação'] },
            { text: 'CONCEITO 6.6: O citoesqueleto é uma rede de fibras que organiza estruturas e atividades na célula', tasks: ['Funções do citoesqueleto: suporte e motilidade', 'Componentes do citoesqueleto'] },
            { text: 'CONCEITO 6.7: Os componentes extracelulares e as conexões entre as células ajudam a coordenar as atividades celulares', tasks: ['Paredes celulares de plantas', 'A matriz extracelular (MEC) de células animais', 'Junções intercelulares', 'A célula: unidade viva maior do que a soma das partes'] }
          ]},
          { title: 'Capítulo 7: Estrutura e Função da Membrana', concepts: [
            { text: 'CONCEITO 7.1: As membranas celulares são mosaicos fluidos de lipídeos e de proteínas', tasks: ['A fluidez das membranas', 'Evolução das diferenças na composição lipídica das membranas', 'Proteínas de membrana e suas funções', 'O papel dos carboidratos da membrana no reconhecimento célula-célula', 'Síntese e lateralidade das membranas'] },
            { text: 'CONCEITO 7.2: A estrutura da membrana resulta em permeabilidade seletiva', tasks: ['A permeabilidade da bicamada lipídica', 'Proteínas de transporte'] },
            { text: 'CONCEITO 7.3: O transporte passivo é a difusão de uma substância através da membrana sem gasto de energia', tasks: ['Efeitos da osmose no balanço hídrico', 'Difusão facilitada: transporte passivo auxiliado por proteínas'] },
            { text: 'CONCEITO 7.4: O transporte ativo usa energia para mover os solutos contra seus gradientes', tasks: ['A necessidade de energia no transporte ativo', 'Como a bomba de íons mantém o potencial da membrana', 'Cotransporte: transporte acoplado a uma proteína de membrana'] },
            { text: 'CONCEITO 7.5: O transporte em massa através da membrana plasmática ocorre por exocitose e endocitose', tasks: ['Exocitose', 'Endocitose'] }
          ]},
          { title: 'Capítulo 8: Introdução ao Metabolismo', concepts: [
            { text: 'CONCEITO 8.1: O metabolismo de um organismo transforma matéria e energia de acordo com as leis da termodinâmica', tasks: ['Organização da química da vida em rotas metabólicas', 'Formas de energia', 'As leis da transformação de energia'] },
            { text: 'CONCEITO 8.2: A variação de energia livre nos diz se a reação ocorre ou não espontaneamente', tasks: ['Variação de energia livre, ΔG', 'Energia livre, estabilidade e equilíbrio', 'Energia livre e metabolismo'] },
            { text: 'CONCEITO 8.3: A molécula de ATP fornece energia para o trabalho celular acoplando reações exergônicas com reações endergônicas', tasks: ['Estrutura e hidrólise do ATP', 'Como a hidrólise do ATP realiza trabalho', 'A regeneração do ATP'] },
            { text: 'CONCEITO 8.4: As enzimas aceleram as reações do metabolismo diminuindo as barreiras de energia', tasks: ['A barreira de energia de ativação', 'Como as enzimas aceleram reações', 'Especificidade de substrato das enzimas', 'Catálise no sítio ativo da enzima', 'Efeito das condições locais na atividade enzimática', 'Evolução das enzimas'] },
            { text: 'CONCEITO 8.5: A regulação da atividade enzimática ajuda o controle do metabolismo', tasks: ['Regulação alostérica das enzimas', 'Localização das enzimas no interior da célula'] }
          ]},
          { title: 'Capítulo 9: Respiração Celular e Fermentação', concepts: [
            { text: 'CONCEITO 9.1: Rotas catabólicas produzem energia oxidando combustíveis orgânicos', tasks: ['Rotas catabólicas e produção de ATP', 'Reações redox: oxidação e redução', 'As fases da respiração celular: uma prévia'] },
            { text: 'CONCEITO 9.2: A glicólise obtém energia química oxidando glicose a piruvato', tasks: ['Glicólise'] },
            { text: 'CONCEITO 9.3: Após a oxidação do piruvato, o ciclo do ácido cítrico completa a oxidação que produz energia a partir de moléculas orgânicas', tasks: ['Oxidação do piruvato a aceti-CoA', 'O ciclo do ácido cítrico'] },
            { text: 'CONCEITO 9.4: Durante a fosforilação oxidativa, a quimiosmose acopla o transporte de elétrons à síntese de ATP', tasks: ['A rota do transporte de elétrons', 'Quimiosmose: o mecanismo acoplado de energia', 'Um balanço da produção de ATP pela respiração celular'] },
            { text: 'CONCEITO 9.5: Fermentação e respiração anaeróbia capacitam as células a produzir ATP sem o uso de oxigênio', tasks: ['Tipos de fermentação', 'Comparação entre fermentação e respiração aeróbia e anaeróbia', 'O significado evolutivo da glicólise'] },
            { text: 'CONCEITO 9.6: A glicólise e o ciclo do ácido cítrico conectam-se a diversas outras rotas metabólicas', tasks: ['A versatilidade do catabolismo', 'Biossíntese (rotas anabólicas)', 'Regulação da respiração celular via mecanismos de retroalimentação'] }
          ]},
          { title: 'Capítulo 10: Fotossíntese', concepts: [
            { text: 'CONCEITO 10.1: A fotossíntese converte a energia luminosa na energia química dos alimentos', tasks: ['Cloroplastos: os locais da fotossíntese nos vegetais', 'Rastreando átomos ao longo da fotossíntese: uma pesquisa científica', 'As duas fases da fotossíntese: uma prévia'] },
            { text: 'CONCEITO 10.2: As reações luminosas convertem a energia solar na energia química do ATP e do NADPH', tasks: ['A natureza da luz solar', 'Pigmentos fotossintéticos: os receptores de luz', 'Excitação da clorofila pela luz', 'O fotossistema: um complexo do centro de reação associado aos complexos dos coletores de luz', 'Fluxo linear de elétrons', 'Fluxo cíclico de elétrons', 'Comparação entre a quimiosmose nos cloroplastos e nas mitocôndrias'] },
            { text: 'CONCEITO 10.3: O ciclo de Calvin utiliza a energia química do ATP e do NADPH para reduzir CO2 em açúcar', tasks: ['Ciclo de Calvin'] },
            { text: 'CONCEITO 10.4: Mecanismos alternativos de fixação do carbono evoluíram em climas áridos e quentes', tasks: ['Fotorrespiração: um relicto evolutivo?', 'Plantas C4', 'Plantas MAC', 'A importância da fotossíntese: uma revisão'] }
          ]},
          { title: 'Capítulo 11: Comunicação Celular', concepts: [
            { text: 'CONCEITO 11.1: Sinais externos são convertidos em respostas dentro da célula', tasks: ['Evolução da sinalização celular', 'Sinalização local e de longa distância', 'Os três estágios da sinalização celular: uma prévia'] },
            { text: 'CONCEITO 11.2: Recepção: uma molécula sinalizadora liga-se a uma proteína receptora, causando mudança na sua forma', tasks: ['Os receptores na membrana plasmática', 'Receptores intracelulares'] },
            { text: 'CONCEITO 11.3: Transdução: cascatas de interações moleculares transmitem sinais a partir dos receptores para moléculas-alvo na célula', tasks: ['Rotas de transdução de sinal', 'Fosforilação e desfosforilação proteica', 'Pequenas moléculas e íons como segundos mensageiros'] },
            { text: 'CONCEITO 11.4: Resposta: a sinalização celular induz regulação da transcrição ou atividades citoplasmáticas', tasks: ['Respostas nuclear e citoplasmáticas', 'Regulação da resposta'] },
            { text: 'CONCEITO 11.5: Apoptose (morte celular programada) integra múltiplas rotas de sinalização celular', tasks: ['Apoptose no verme de solo Caenorhabditis elegans', 'Rotas apoptóticas e os sinais que as desencadeiam'] }
          ]},
          { title: 'Capítulo 12: O Ciclo Celular', concepts: [
            { text: 'CONCEITO 12.1: A maioria das divisões celulares resulta em células-filhas geneticamente idênticas', tasks: ['Organização celular do material genético', 'Distribuição dos cromossomos durante a divisão da célula eucariótica'] },
            { text: 'CONCEITO 12.2: A fase mitótica alterna-se com a interfase no ciclo celular', tasks: ['Fases do ciclo celular', 'O fuso mitótico: uma visão mais próxima', 'Citocinese: uma visão mais detalhada', 'Fissão binária', 'A evolução da mitose'] },
            { text: 'CONCEITO 12.3: O ciclo celular eucariótico é regulado por um sistema de controle molecular', tasks: ['O sistema de controle do ciclo celular', 'Perda dos controlos do ciclo celular nas células cancerígenas'] }
          ]}
        ]
      },
      {
        title: 'UNIDADE 3: GENÉTICA',
        color: 'purple',
        symbol: 'Dna',
        chapters: [
          { title: 'Capítulo 13: Meiose e Ciclos de Vida Sexuada', concepts: [
            { text: 'CONCEITO 13.1: A prole adquire os genes dos pais por herança cromossômica', tasks: ['Herança de genes', 'Comparação entre reprodução assexuada e sexuada'] },
            { text: 'CONCEITO 13.2: A fertilização e a meiose se alternam durante os ciclos de vida sexuada', tasks: ['Conjuntos de cromossomos em células humanas', 'Comportamento dos conjuntos de cromossomos no ciclo de vida humano', 'A variedade dos ciclos de vida sexuada'] },
            { text: 'CONCEITO 13.3: A meiose reduz o número de conjuntos de cromossomos de diploide para haploide', tasks: ['Os estágios da meiose', 'Crossing over e sinapse durante a Prófase I', 'Comparação entre mitose e meiose'] },
            { text: 'CONCEITO 13.4: A variação genética produzida nos ciclos de vida sexuada contribui para a evolução', tasks: ['Origens da variação genética da prole', 'A importância evolutiva da variação genética entre populações'] }
          ]},
          { title: 'Capítulo 14: Mendel e a Ideia de Gene', concepts: [
            { text: 'CONCEITO 14.1: Mendel utilizou a abordagem científica para identificar duas leis de hereditariedade', tasks: ['A abordagem experimental quantitativa de Mendel', 'A lei da segregação', 'A lei da segregação independente'] },
            { text: 'CONCEITO 14.2: As leis da probabilidade governam a herança mendeliana', tasks: ['As regras da multiplicação e da adição aplicadas a cruzamentos mono-híbridos', 'Resolvendo problemas genéticos complexos com as regras da probabilidade'] },
            { text: 'CONCEITO 14.3: Padrões de hereditariedade muitas vezes são mais complexos do que os previstos pela genética mendeliana simples', tasks: ['Estendendo a genética mendeliana para um único gene', 'Estendendo a genética mendeliana para dois ou mais genes', 'Natureza e ambiente: o impacto do meio ambiente sobre o fenótipo', 'Visão mendeliana sobre hereditariedade e variação'] },
            { text: 'CONCEITO 14.4: Muitas características humanas seguem os padrões mendelianos de hereditariedade', tasks: ['Análise da genealogia (pedigree)', 'Distúrbios herdados de forma recessiva', 'Distúrbios herdados de forma dominante', 'Doenças multifatoriais', 'Testes e aconselhamento genéticos'] }
          ]},
          { title: 'Capítulo 15: A Base Cromossômica da Herança', concepts: [
            { text: 'CONCEITO 15.1: Morgan mostrou que a herança mendeliana tem sua base física no comportamento dos cromossomos: pesquisa científica', tasks: ['Organismo experimental escolhido por Morgan', 'Correlacionando comportamento dos alelos de um gene com comportamento de um par de cromossomos'] },
            { text: 'CONCEITO 15.2: Genes ligados ao sexo exibem padrões únicos de herança', tasks: ['A base cromossômica do sexo', 'Herança de genes ligados ao X', 'Inativação do X em fêmeas de mamíferos'] },
            { text: 'CONCEITO 15.3: Genes ligados tendem a ser herdados juntos, pois estão localizados próximos uns aos outros no mesmo cromossomo', tasks: ['Como a ligação afeta a herança', 'Recombinação gênica e ligação', 'Mapeamento da distância entre os genes usando dados de recombinação: pesquisa científica'] },
            { text: 'CONCEITO 15.4: Alterações no número ou na estrutura dos cromossomos causam alguns distúrbios genéticos', tasks: ['Número cromossômico anormal', 'Alterações da estrutura cromossômica', 'Distúrbios humanos devido a alterações cromossômicas'] },
            { text: 'CONCEITO 15.5: Alguns padrões de herança são exceções para a herança mendeliana padrão', tasks: ['Impressão (imprinting) genômica', 'Herança de genes de organelas'] }
          ]},
          { title: 'Capítulo 16: A Base Molecular da Hereditariedade', concepts: [
            { text: 'CONCEITO 16.1: O DNA é o material genético', tasks: ['A procura pelo material genético: pesquisa científica', 'Construindo um modelo estrutural para o DNA: pesquisa científica'] },
            { text: 'CONCEITO 16.2: Diversas proteínas atuam juntas na replicação e no reparo do DNA', tasks: ['O princípio básico: pareamento de bases com fita-molde', 'A replicação do DNA: uma visão mais detalhada', 'Verificação e reparo do DNA', 'Significado evolutivo de alterações de nucleotídeos do DNA', 'Replicando as extremidades das moléculas de DNA'] },
            { text: 'CONCEITO 16.3: Um cromossomo consiste em uma molécula de DNA empacotada com proteínas', tasks: ['Empacotamento do DNA'] }
          ]},
          { title: 'Capítulo 17: Expressão Gênica: Do Gene à Proteína', concepts: [
            { text: 'CONCEITO 17.1: Os genes especificam proteínas por meio da transcrição e da tradução', tasks: ['Evidências obtidas a partir do estudo de defeitos metabólicos', 'Princípios básicos da transcrição e da tradução', 'O código genético'] },
            { text: 'CONCEITO 17.2: A transcrição é a síntese de RNA controlada pelo DNA: uma visão mais detalhada', tasks: ['Os componentes moleculares da transcrição', 'Síntese do transcrito de RNA'] },
            { text: 'CONCEITO 17.3: As células eucarióticas modificam o RNA após a transcrição', tasks: ['Alterações nas extremidades do RNAm', 'Clivagem de genes e processamento do RNA'] },
            { text: 'CONCEITO 17.4: A tradução é a síntese de polipeptídeos controlada pelo RNA: uma visão mais detalhada', tasks: ['Os componentes moleculares da tradução', 'Construindo um polipeptídeo', 'Finalização e direcionamento das proteínas funcionais', 'Síntese de múltiplos polipeptídeos em bactérias e eucariotos'] },
            { text: 'CONCEITO 17.5: Mutações de um ou poucos nucleotídeos podem afetar a estrutura e a função da proteína', tasks: ['Tipos de mutações de pequena escala', 'Novas mutações e mutagênicos', 'O que é um gene? Revisitando a questão'] }
          ]},
          { title: 'Capítulo 18: Regulação da Expressão Gênica', concepts: [
            { text: 'CONCEITO 18.1: As bactérias frequentemente respondem a alterações ambientais regulando a transcrição', tasks: ['Óperons: o conceito básico', 'Óperons reprimíveis e induzíveis: dois tipos de regulação gênica negativa', 'Regulação gênica positiva'] },
            { text: 'CONCEITO 18.2: A expressão gênica eucariótica é regulada em muitos estágios', tasks: ['Expressão gênica diferencial', 'Regulação da estrutura da cromatina', 'Regulação do início da transcrição', 'Mecanismos de regulação pós-transcricional'] },
            { text: 'CONCEITO 18.3: O RNA não codificante exerce múltiplos papéis no controle da expressão gênica', tasks: ['Efeitos dos microRNA e pequenos RNA de interferência nos RNAm', 'Remodelamento da cromatina por RNAnc', 'O significado evolutivo dos pequenos RNAnc'] },
            { text: 'CONCEITO 18.4: Um programa de expressão gênica diferencial leva aos diferentes tipos celulares nos organismos multicelulares', tasks: ['Um programa genético para o desenvolvimento embrionário', 'Determinantes citoplasmáticos e sinais induzíveis', 'Regulação sequencial da expressão gênica durante a diferenciação celular', 'Formação de padrão: determinação do plano corporal'] },
            { text: 'CONCEITO 18.5: O câncer decorre de alterações genéticas que afetam o controle do ciclo celular', tasks: ['Tipos de genes associados ao câncer', 'Interferência com rotas normais de sinalização celular', 'O modelo de múltiplas etapas do desenvolvimento do câncer', 'Predisposição herdada e fatores ambientais que contribuem para o câncer', 'O papel dos vírus no câncer'] }
          ]},
          { title: 'Capítulo 19: Vírus', concepts: [
            { text: 'CONCEITO 19.1: O vírus consiste em um ácido nucleico circundado por uma capa proteica', tasks: ['A descoberta dos vírus: pesquisa científica', 'Estrutura dos vírus'] },
            { text: 'CONCEITO 19.2: Os vírus somente se reproduzem nas células hospedeiras', tasks: ['Características gerais dos ciclos replicativos virais', 'Ciclos reprodutivos dos fagos', 'Ciclos replicativos dos vírus de animais', 'Evolução dos vírus'] },
            { text: 'CONCEITO 19.3: Vírus, viroides e príons são patógenos formidáveis de animais e plantas', tasks: ['Doenças virais em animais', 'Vírus emergentes', 'Doenças virais em plantas', 'Viroides e príons: os agentes infecciosos mais simples'] }
          ]},
          { title: 'Capítulo 20: Ferramentas do DNA e Biotecnologia', concepts: [
            { text: 'CONCEITO 20.1: O sequenciamento do DNA e a clonagem do DNA são ferramentas valiosas para a engenharia genética e as pesquisas biológicas', tasks: ['Sequenciamento de DNA', 'Produzindo múltiplas cópias de um gene ou outros segmentos de DNA', 'Uso de enzimas de restrição para produzir DNA plasmidial recombinante', 'Amplificação de DNA: a reação em cadeia da polimerase (PCR) e seu uso na clonagem do DNA', 'Expressão de genes eucarióticos clonados'] },
            { text: 'CONCEITO 20.2: Os biólogos utilizam a tecnologia do DNA para estudar a expressão e a função de um gene', tasks: ['Análise da expressão gênica', 'Determinando a função gênica'] },
            { text: 'CONCEITO 20.3: Organismos clonados e células-tronco são úteis para pesquisa básica e outras aplicações', tasks: ['Clonagem de plantas: culturas unicelulares', 'Clonagem de animais: transplante nuclear', 'Células-tronco de animais'] },
            { text: 'CONCEITO 20.4: As aplicações práticas da biotecnologia com base em DNA afetam nossas vidas de várias formas', tasks: ['Aplicações médicas', 'Evidência forense e perfis genéticos', 'Limpeza do meio ambiente', 'Aplicações na agricultura', 'Questões de ética e segurança suscitadas pela tecnologia do DNA'] }
          ]},
          { title: 'Capítulo 21: Genomas e Sua Evolução', concepts: [
            { text: 'CONCEITO 21.1: O Projeto Genoma Humano promoveu o desenvolvimento de técnicas de sequenciamento mais rápidas e mais baratas', tasks: ['Projeto Genoma Humano'] },
            { text: 'CONCEITO 21.2: Os cientistas utilizam a bioinformática para analisar genomas e suas funções', tasks: ['Centralização de recursos para a análise de sequências genômicas', 'Identificação de genes que codificam proteínas e estudo das suas funções', 'Compreendendo os genes e seus produtos no nível de sistema'] },
            { text: 'CONCEITO 21.3: Os genomas variam em tamanho, número de genes e densidade gênica', tasks: ['Tamanho do genoma', 'Número de genes', 'Densidade gênica e DNA não codificante'] },
            { text: 'CONCEITO 21.4: Eucariotos multicelulares têm grande quantidade de DNA não codificante e diversas famílias multigênicas', tasks: ['Elementos de transposição e sequências relacionadas', 'Outros DNA repetitivos, incluindo sequências simples de DNA', 'Genes e famílias multigênicas'] },
            { text: 'CONCEITO 21.5: Duplicação, rearranjo e mutação do DNA contribuem para a evolução dos genomas', tasks: ['Duplicação de todo um conjunto de cromossomos', 'Alterações na estrutura dos cromossomos', 'Duplicação e divergência das regiões do DNA que contêm os genes', 'Rearranjo de segmentos dos genes: duplicação e embaralhamento de éxons', 'Como os elementos de transposição contribuem para a evolução do genoma'] },
            { text: 'CONCEITO 21.6: A comparação de sequências de genomas fornece evidências sobre a evolução e o desenvolvimento', tasks: ['Comparação de genomas', 'A grande conservação dos genes de desenvolvimento entre os animais'] }
          ]}
        ]
      },
      {
        title: 'UNIDADE 4: MECANISMOS DA EVOLUÇÃO',
        color: 'orange',
        symbol: 'TrendingUp',
        chapters: [
          { title: 'Capítulo 22: Descendência com Modificação: Uma Visão Darwiniana da Vida', concepts: [
            { text: 'CONCEITO 22.1: A revolução darwiniana contestou visões tradicionais de uma Terra jovem habitada por espécies imutáveis', tasks: ['Scala naturae e a classificação das espécies', 'Ideias sobre mudança ao longo do tempo', 'A hipótese evolutiva de Lamarck'] },
            { text: 'CONCEITO 22.2: A descendência com modificação por seleção natural explica as adaptações dos organismos, bem como a uniformidade e a diversidade da vida', tasks: ['A pesquisa de Darwin', 'A origem das espécies'] },
            { text: 'CONCEITO 22.3: A evolução é sustentada por uma quantidade expressiva de evidências científicas', tasks: ['Observações diretas de mudança evolutiva', 'Homologia', 'O registro fóssil', 'Biogeografia', 'O que é teórico no ponto de vista de Darwin sobre a vida?'] }
          ]},
          { title: 'Capítulo 23: A Evolução das Populações', concepts: [
            { text: 'CONCEITO 23.1: A variação genética torna a evolução possível', tasks: ['Variação genética'] },
            { text: 'CONCEITO 23.2: A equação de Hardy-Weinberg pode ser utilizada para testar se uma população está evoluindo', tasks: ['Hardy-Weinberg'] },
            { text: 'CONCEITO 23.3: Seleção natural, deriva genética e fluxo gênico podem alterar as frequências alélicas de uma população', tasks: ['Seleção natural', 'Deriva genética', 'Fluxo gênico'] },
            { text: 'CONCEITO 23.4: A seleção natural é o único mecanismo que causa evolução adaptativa de forma consistente', tasks: ['Evolução adaptativa'] }
          ]},
          { title: 'Capítulo 24: A Origem das Espécies', concepts: [
            { text: 'CONCEITO 24.1: O conceito biológico de espécie enfatiza o isolamento reprodutivo', tasks: ['Isolamento reprodutivo'] },
            { text: 'CONCEITO 24.2: A especiação pode ocorrer com ou sem separação geográfica', tasks: ['Especiação'] },
            { text: 'CONCEITO 24.3: As zonas híbridas revelam os fatores que causam o isolamento reprodutivo', tasks: ['Zonas híbridas'] },
            { text: 'CONCEITO 24.4: A especiação pode ocorrer rápida ou lentamente e pode resultar de alterações em poucos ou em muitos genes', tasks: ['Ritmo da especiação'] }
          ]},
          { title: 'Capítulo 25: A História da Vida na Terra', concepts: [
            { text: 'CONCEITO 25.1: Condições na Terra primitiva possibilitaram a origem da vida', tasks: ['Origem da vida'] },
            { text: 'CONCEITO 25.2: O registro fóssil documenta a história da vida', tasks: ['Registro fóssil'] },
            { text: 'CONCEITO 25.3: Eventos fundamentais na história da vida incluem a origem dos organismos unicelulares e multicelulares e a colonização da terra', tasks: ['Eventos fundamentais'] },
            { text: 'CONCEITO 25.4: A ascensão e a queda de grupos de organismos refletem as diferenças nas taxas de especiação e de extinção', tasks: ['Ascensão e queda de grupos'] },
            { text: 'CONCEITO 25.5: Grandes mudanças na organização corporal podem resultar de modificações nos genes que controlam o desenvolvimento', tasks: ['Mudanças na organização corporal'] },
            { text: 'CONCEITO 25.6: A evolução não é orientada para uma meta', tasks: ['Evolução não orientada'] }
          ]}
        ]
      },
      {
        title: 'UNIDADE 5: HISTÓRIA EVOLUTIVA DA DIVERSIDADE',
        color: 'teal',
        symbol: 'TreePine',
        chapters: [
          { title: 'Capítulo 26: Filogenia e Árvore da Vida', concepts: [
            { text: 'CONCEITO 26.1: As filogenias mostram as relações evolutivas', tasks: ['Relações evolutivas'] },
            { text: 'CONCEITO 26.2: As filogenias são inferidas de dados morfológicos e moleculares', tasks: ['Dados morfológicos e moleculares'] },
            { text: 'CONCEITO 26.3: Os ancestrais comuns são a base da classificação filogenética', tasks: ['Classificação filogenética'] },
            { text: 'CONCEITO 26.4: O tempo evolutivo de um organismo é documentado em seu genoma', tasks: ['Tempo evolutivo'] },
            { text: 'CONCEITO 26.5: Os relógios moleculares nos ajudam a rastrear o tempo evolutivo', tasks: ['Relógios moleculares'] },
            { text: 'CONCEITO 26.6: Nossa compreensão da árvore da vida continua a mudar com base em novos dados', tasks: ['Compreensão da árvore da vida'] }
          ]}
        ]
      },
      {
        title: 'UNIDADE 6: FORMA E FUNÇÃO DAS PLANTAS',
        color: 'lime',
        symbol: 'Leaf',
        chapters: [
          { title: 'Capítulo 35: Estrutura, Crescimento e Desenvolvimento das Plantas', concepts: [
            { text: 'CONCEITO 35.1: As plantas têm organização hierárquica constituída de órgãos, tecidos e células', tasks: ['Órgãos, tecidos e células'] },
            { text: 'CONCEITO 35.2: Os meristemas geram células para o crescimento primário e secundário', tasks: ['Meristemas'] },
            { text: 'CONCEITO 35.3: O crescimento primário alonga as raízes e os caules', tasks: ['Crescimento primário'] },
            { text: 'CONCEITO 35.4: O crescimento secundário aumenta o diâmetro dos caules e das raízes em plantas lenhosas', tasks: ['Crescimento secundário'] },
            { text: 'CONCEITO 35.5: O crescimento, a morfogênese e a diferenciação celular produzem o corpo da planta', tasks: ['Crescimento, morfogênese e diferenciação'] }
          ]}
        ]
      },
      {
        title: 'UNIDADE 7: FORMA E FUNÇÃO DOS ANIMAIS',
        color: 'indigo',
        symbol: 'PawPrint',
        chapters: [
          { title: 'Capítulo 40: Princípios Básicos da Forma e Função Animal', concepts: [
            { text: 'CONCEITO 40.1: O tamanho e a forma dos animais afetam as trocas com o ambiente', tasks: ['Tamanho e forma'] },
            { text: 'CONCEITO 40.2: O controle por retroalimentação mantém o ambiente interno em muitos animais', tasks: ['Controle por retroalimentação'] },
            { text: 'CONCEITO 40.3: O processo homeostático para a termorregulação envolve forma, função e comportamento', tasks: ['Termorregulação'] },
            { text: 'CONCEITO 40.4: A alocação e o uso de energia estão relacionados ao tamanho do animal, à atividade e ao ambiente', tasks: ['Alocação e uso de energia'] }
          ]}
        ]
      },
      {
        title: 'UNIDADE 8: ECOLOGIA',
        color: 'rose',
        symbol: 'Globe',
        chapters: [
          { title: 'Capítulo 52: Introdução à Ecologia e à Biosfera', concepts: [
            { text: 'CONCEITO 52.1: O clima da Terra varia com a latitude e as estações do ano e está mudando rapidamente', tasks: ['Clima da Terra'] },
            { text: 'CONCEITO 52.2: A estrutura e a distribuição dos biomas terrestres são controladas pelo clima e pelos distúrbios', tasks: ['Biomas terrestres'] },
            { text: 'CONCEITO 52.3: Os biomas aquáticos são sistemas diversos e dinâmicos que cobrem a maior parte da Terra', tasks: ['Biomas aquáticos'] },
            { text: 'CONCEITO 52.4: As interações entre os organismos e o ambiente limitam a distribuição das espécies', tasks: ['Distribuição das espécies'] },
            { text: 'CONCEITO 52.5: Fatores ecológicos e evolutivos influenciam a distribuição das espécies', tasks: ['Fatores ecológicos e evolutivos'] }
          ]},
          { title: 'Capítulo 53: Ecologia de Populações', concepts: [
            { text: 'CONCEITO 53.1: Processos biológicos influenciam a densidade populacional, a dispersão e a demografia', tasks: ['Densidade populacional, dispersão e demografia'] },
            { text: 'CONCEITO 53.2: O modelo exponencial descreve o crescimento populacional em um ambiente idealizado e ilimitado', tasks: ['Modelo exponencial'] },
            { text: 'CONCEITO 53.3: O modelo logístico descreve como uma população cresce mais lentamente à medida que se aproxima de sua capacidade de suporte', tasks: ['Modelo logístico'] },
            { text: 'CONCEITO 53.4: As características da história de vida são produtos da seleção natural', tasks: ['História de vida'] },
            { text: 'CONCEITO 53.5: Muitos fatores que regulam o crescimento populacional são dependentes da densidade', tasks: ['Regulação do crescimento'] },
            { text: 'CONCEITO 53.6: A população humana não cresce mais exponencialmente, mas ainda está aumentando', tasks: ['População humana'] }
          ]},
          { title: 'Capítulo 54: Ecologia de Comunidades', concepts: [
            { text: 'CONCEITO 54.1: As interações das comunidades são classificadas de acordo com o fato de ajudarem, prejudicarem ou não terem efeito sobre as espécies envolvidas', tasks: ['Interações das comunidades'] },
            { text: 'CONCEITO 54.2: A diversidade e a estrutura trófica caracterizam as comunidades biológicas', tasks: ['Diversidade e estrutura trófica'] },
            { text: 'CONCEITO 54.3: O distúrbio influencia a diversidade de espécies e a composição das comunidades', tasks: ['Distúrbio e diversidade'] },
            { text: 'CONCEITO 54.4: Fatores biogeográficos influenciam a diversidade de espécies das comunidades', tasks: ['Fatores biogeográficos'] },
            { text: 'CONCEITO 54.5: Os patógenos alteram a estrutura das comunidades local e globalmente', tasks: ['Patógenos e estrutura'] }
          ]}
        ]
      }
    ];

    const existing = await db.select().from(units).limit(1);
    if (existing.length > 0) return;

    for (let i = 0; i < CAMPBELL_DATA.length; i++) {
      const u = CAMPBELL_DATA[i];
      const [newUnit] = await db.insert(units).values({
        title: u.title,
        order: i + 1,
        color: u.color,
        symbol: u.symbol
      }).returning();

      for (let j = 0; j < u.chapters.length; j++) {
        const c = u.chapters[j];
        const [newChapter] = await db.insert(chapters).values({
          unitId: newUnit.id,
          title: c.title,
          order: j + 1
        }).returning();

        for (let k = 0; k < c.concepts.length; k++) {
          const con = c.concepts[k] as any;
          const [newConcept] = await db.insert(concepts).values({
            chapterId: newChapter.id,
            title: con.text,
            order: k + 1,
            summary: con.summary || null
          }).returning();

          for (let l = 0; l < con.tasks.length; l++) {
            const task = con.tasks[l];
            await db.insert(topics).values({
              conceptId: newConcept.id,
              title: task,
              order: l + 1
            });
          }
        }
      }
    }
  }
}

export const storage = new DatabaseStorage();
