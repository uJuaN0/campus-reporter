import { useMemo, useState } from "react";
import {
  Globe,
  Video,
  FileText,
  MessageCircle,
  Plane,
  Home,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { toast } from "sonner";

type IntroVideo = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  url: string;
};

type DocumentItem = {
  title: string;
  description: string;
  type: string;
};

type Buddy = {
  name: string;
  country: string;
  course: string;
  languages: string[];
  specialty: string;
};

type ResourceItem = {
  title: string;
  description: string;
  contact: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
};

type FAQGroup = {
  category: string;
  questions: {
    question: string;
    answer: string;
  }[];
};

type Language = "pt" | "en";

export function HubInternacional() {
  const [language, setLanguage] = useState<Language>("pt");

  const content = useMemo(() => {
    const pt = {
      pageTitle: "Hub Internacional",
      pageSubtitle:
        "Suporte completo para estudantes internacionais antes e durante a chegada a Portugal.",

      heroTitle: "Bem-vindo à Comunidade NOVA FCT",
      heroDescription:
        "Este espaço foi criado especialmente para estudantes internacionais. Aqui encontrará vídeos introdutórios, documentos importantes e respostas a dúvidas frequentes antes de chegar a Portugal.",
      heroBadges: [
        "+300 Estudantes Internacionais",
        "40+ Países Representados",
        "Comunidade PALOP Forte",
      ],

      tabs: {
        videos: "Vídeos",
        documents: "Documentos",
        faqs: "FAQs",
        buddies: "Buddies",
      },

      watchVideo: "Assistir Vídeo",
      download: "Descarregar",
      contactBuddy: "Contactar",

      noTranslateToastDoc: "Documento selecionado",
      noTranslateToastBuddy: "Pedido de contacto enviado para",

      sectionTips: [
        {
          title: "Antes da chegada",
          description:
            "Trata do visto, alojamento e documentos com antecedência.",
          color: "blue",
          icon: Plane,
        },
        {
          title: "Alojamento",
          description:
            "Encontra dicas para procurar quarto ou residência perto do campus.",
          color: "green",
          icon: Home,
        },
        {
          title: "Custos e burocracias",
          description:
            "Consulta informação útil sobre custos de vida e processos administrativos.",
          color: "purple",
          icon: CreditCard,
        },
      ],

      introVideos: [
        {
          id: "1",
          title: "Bem-vindo à NOVA FCT",
          description: "Vídeo de apresentação do campus e instalações",
          duration: "8:32",
          category: "Geral",
          url: "https://youtu.be/uuQPi6IL8-M",
        },
        {
          id: "2",
          title: "Sistema Académico e CLIP",
          description: "Como usar o portal académico CLIP",
          duration: "5:15",
          category: "Académico",
          url: "https://youtu.be/aE701Wnhytk?t=1",
        },
        {
          id: "3",
          title: "Viver em Portugal",
          description: "Dicas sobre cultura, transporte e vida quotidiana",
          duration: "12:40",
          category: "Vida em Portugal",
          url: "https://www.youtube.com/watch?v=uOQqOjKxH-o",
        },
        {
          id: "4",
          title: "Processo de Visto para Estudantes",
          description: "Passo a passo para obter visto de estudante",
          duration: "10:20",
          category: "Burocracias",
          url: "https://youtu.be/ZpsdBYgYfCw?t=494",
        },
      ] as IntroVideo[],

      documents: [
        {
          title: "Guia de Acolhimento Internacional",
          description: "Manual completo para estudantes internacionais",
          type: "PDF",
        },
        {
          title: "Checklist: Documentos Necessários",
          description: "Lista de documentos para matrícula e visto",
          type: "PDF",
        },
        {
          title: "Guia de Alojamento em Lisboa",
          description: "Opções de alojamento e dicas para procurar casa",
          type: "PDF",
        },
        {
          title: "Transportes em Lisboa",
          description: "Como usar metro, comboio e autocarro",
          type: "PDF",
        },
      ] as DocumentItem[],

      faqs: [
        {
          category: "Visto e Documentos",
          questions: [
            {
              question: "Preciso de visto para estudar em Portugal?",
              answer:
                "Cidadãos de países PALOP podem necessitar de visto dependendo da duração do curso. Para cursos superiores a 90 dias, é necessário visto de estudante. Entre em contacto com o consulado português no seu país.",
            },
            {
              question: "Quanto tempo demora o processo de visto?",
              answer:
                "O processo pode demorar entre 2 a 6 meses. Recomendamos iniciar o processo assim que receber a carta de aceitação da universidade.",
            },
            {
              question: "Que documentos preciso para o visto de estudante?",
              answer:
                "Necessita de: carta de aceitação da universidade, comprovativo de recursos financeiros, seguro de saúde, passaporte válido, certificado de antecedentes criminais, e comprovativo de alojamento.",
            },
          ],
        },
        {
          category: "Alojamento",
          questions: [
            {
              question: "A universidade oferece alojamento?",
              answer:
                "A NOVA FCT não tem residências próprias, mas pode indicar residências parceiras. A maioria dos estudantes procura apartamentos partilhados em zonas próximas ao campus.",
            },
            {
              question: "Quanto custa em média um quarto em Lisboa?",
              answer:
                "O preço varia entre €300-600/mês para quartos partilhados, dependendo da localização e condições. Zonas próximas ao campus tendem a ser mais acessíveis.",
            },
          ],
        },
        {
          category: "Vida Académica",
          questions: [
            {
              question: "As aulas são em português ou inglês?",
              answer:
                "A maioria dos cursos de licenciatura são em português. Alguns mestrados têm opções em inglês. Recomendamos verificar com o departamento específico do seu curso.",
            },
            {
              question: "Existem aulas de português para estrangeiros?",
              answer:
                "Sim. A NOVA oferece cursos de português como língua estrangeira. Consulte o International Office para mais informações.",
            },
          ],
        },
        {
          category: "Custo de Vida",
          questions: [
            {
              question: "Quanto preciso por mês para viver em Lisboa?",
              answer:
                "Estima-se entre €700-1000/mês incluindo alojamento, alimentação, transporte e despesas básicas. Estudantes com estilo de vida mais económico podem gastar menos.",
            },
            {
              question: "Posso trabalhar enquanto estudo?",
              answer:
                "Sim, estudantes com visto podem trabalhar até 20h/semana durante as aulas e full-time nas férias. Pode ser necessário tratar da situação junto das entidades competentes.",
            },
          ],
        },
      ] as FAQGroup[],

      buddies: [
        {
          name: "Carlos Mendes",
          country: "Angola",
          course: "Engenharia Informática - 3º Ano",
          languages: ["Português", "Inglês", "Crioulo"],
          specialty: "Apoio PALOP, Burocracias",
        },
        {
          name: "Maria Silva",
          country: "Portugal",
          course: "Engenharia Informática - 2º Ano",
          languages: ["Português", "Inglês", "Francês"],
          specialty: "Integração Cultural, Campus",
        },
        {
          name: "João Santos",
          country: "Cabo Verde",
          course: "Engenharia Eletrotécnica - 4º Ano",
          languages: ["Português", "Crioulo", "Inglês"],
          specialty: "Alojamento, Visto",
        },
      ] as Buddy[],

      resources: [
        {
          title: "International Office",
          description: "Gabinete de apoio a estudantes internacionais",
          contact: "international@fct.unl.pt",
          icon: Globe,
        },
        {
          title: "AIMA",
          description: "Agência para questões de imigração e vistos",
          contact: "www.aima.gov.pt",
          link: "https://www.aima.gov.pt",
          icon: FileText,
        },
        {
          title: "Embassy Network",
          description: "Contactos de embaixadas e consulados",
          contact: "Vários contactos disponíveis",
          link: "https://www.embassypages.com/",
          icon: MapPin,
        },
      ] as ResourceItem[],
    };

    const en = {
      pageTitle: "International Hub",
      pageSubtitle:
        "Full support for international students before and after arriving in Portugal.",

      heroTitle: "Welcome to the NOVA FCT Community",
      heroDescription:
        "This space was created especially for international students. Here you will find introductory videos, important documents, and answers to common questions before arriving in Portugal.",
      heroBadges: [
        "+300 International Students",
        "40+ Countries Represented",
        "Strong PALOP Community",
      ],

      tabs: {
        videos: "Videos",
        documents: "Documents",
        faqs: "FAQs",
        buddies: "Buddies",
      },

      watchVideo: "Watch Video",
      download: "Download",
      contactBuddy: "Contact",

      noTranslateToastDoc: "Selected document",
      noTranslateToastBuddy: "Contact request sent to",

      sectionTips: [
        {
          title: "Before arrival",
          description:
            "Take care of your visa, accommodation, and documents in advance.",
          color: "blue",
          icon: Plane,
        },
        {
          title: "Accommodation",
          description:
            "Find tips to search for a room or residence near campus.",
          color: "green",
          icon: Home,
        },
        {
          title: "Costs and bureaucracy",
          description:
            "Check useful information about cost of living and administrative processes.",
          color: "purple",
          icon: CreditCard,
        },
      ],

      introVideos: [
        {
          id: "1",
          title: "Welcome to NOVA FCT",
          description: "Campus and facilities introduction video",
          duration: "8:32",
          category: "General",
          url: "https://youtu.be/uuQPi6IL8-M",
        },
        {
          id: "2",
          title: "Academic System and CLIP",
          description: "How to use the academic portal CLIP",
          duration: "5:15",
          category: "Academic",
          url: "https://youtu.be/aE701Wnhytk?t=1",
        },
        {
          id: "3",
          title: "Living in Portugal",
          description: "Tips about culture, transportation, and daily life",
          duration: "12:40",
          category: "Life in Portugal",
          url: "https://www.youtube.com/watch?v=uOQqOjKxH-o",
        },
        {
          id: "4",
          title: "Student Visa Process",
          description: "Step-by-step guide to getting a student visa",
          duration: "10:20",
          category: "Bureaucracy",
          url: "https://youtu.be/ZpsdBYgYfCw?t=494",
        },
      ] as IntroVideo[],

      documents: [
        {
          title: "International Welcome Guide",
          description: "Complete handbook for international students",
          type: "PDF",
        },
        {
          title: "Checklist: Required Documents",
          description: "List of documents for enrollment and visa",
          type: "PDF",
        },
        {
          title: "Accommodation Guide in Lisbon",
          description: "Housing options and tips for finding a place",
          type: "PDF",
        },
        {
          title: "Transportation in Lisbon",
          description: "How to use metro, train, and bus",
          type: "PDF",
        },
      ] as DocumentItem[],

      faqs: [
        {
          category: "Visa and Documents",
          questions: [
            {
              question: "Do I need a visa to study in Portugal?",
              answer:
                "Students from PALOP countries may need a visa depending on the duration of the course. For courses longer than 90 days, a student visa is required. Please contact the Portuguese consulate in your country.",
            },
            {
              question: "How long does the visa process take?",
              answer:
                "The process may take between 2 and 6 months. We recommend starting as soon as you receive your university acceptance letter.",
            },
            {
              question: "Which documents do I need for a student visa?",
              answer:
                "You need: university acceptance letter, proof of financial means, health insurance, valid passport, criminal record certificate, and accommodation proof.",
            },
          ],
        },
        {
          category: "Accommodation",
          questions: [
            {
              question: "Does the university provide accommodation?",
              answer:
                "NOVA FCT does not have its own residences, but it may suggest partner residences. Most students look for shared apartments in areas close to campus.",
            },
            {
              question: "How much does a room in Lisbon cost on average?",
              answer:
                "Prices usually range from €300-600/month for shared rooms, depending on location and conditions. Areas near campus tend to be more affordable.",
            },
          ],
        },
        {
          category: "Academic Life",
          questions: [
            {
              question: "Are classes in Portuguese or English?",
              answer:
                "Most undergraduate programs are taught in Portuguese. Some master's programs offer options in English. We recommend checking with your specific department.",
            },
            {
              question: "Are there Portuguese classes for foreigners?",
              answer:
                "Yes. NOVA offers Portuguese as a foreign language courses. Contact the International Office for more information.",
            },
          ],
        },
        {
          category: "Cost of Living",
          questions: [
            {
              question: "How much do I need per month to live in Lisbon?",
              answer:
                "It is estimated at around €700-1000/month including accommodation, food, transport, and basic expenses. Students with a more economical lifestyle may spend less.",
            },
            {
              question: "Can I work while studying?",
              answer:
                "Yes, students with a visa may work up to 20h/week during classes and full-time during holidays. You may need to regularize your situation with the appropriate authorities.",
            },
          ],
        },
      ] as FAQGroup[],

      buddies: [
        {
          name: "Carlos Mendes",
          country: "Angola",
          course: "Computer Engineering - 3rd Year",
          languages: ["Portuguese", "English", "Creole"],
          specialty: "PALOP support, Bureaucracy",
        },
        {
          name: "Maria Silva",
          country: "Portugal",
          course: "Computer Engineering - 2nd Year",
          languages: ["Portuguese", "English", "French"],
          specialty: "Cultural Integration, Campus",
        },
        {
          name: "João Santos",
          country: "Cape Verde",
          course: "Electrical Engineering - 4th Year",
          languages: ["Portuguese", "Creole", "English"],
          specialty: "Accommodation, Visa",
        },
      ] as Buddy[],

      resources: [
        {
          title: "International Office",
          description: "Support office for international students",
          contact: "international@fct.unl.pt",
          link: "mailto:international@fct.unl.pt",
          icon: Globe,
        },
        {
          title: "AIMA",
          description: "Agency for immigration and visa matters",
          contact: "www.aima.gov.pt",
          link: "https://www.aima.gov.pt",
          icon: FileText,
        },
        {
          title: "Embassy Network",
          description: "Embassy and consulate contacts",
          contact: "Various contacts available",
          link: "https://embassies.net/",
          icon: MapPin,
        },
      ] as ResourceItem[],
    };

    return language === "pt" ? pt : en;
  }, [language]);

  function handleWatchVideo(video: IntroVideo) {
    window.open(video.url, "_blank", "noopener,noreferrer");
  }

  function handleDownloadDocument(doc: DocumentItem) {
    toast.success(`${content.noTranslateToastDoc}: ${doc.title}`);
  }

  function handleContactBuddy(buddy: Buddy) {
    toast.success(`${content.noTranslateToastBuddy} ${buddy.name}`);
  }

  function getThumbnailUrl(url: string): string {
    const videoIdMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/videos\/|.*\/embed\/|.*\/v\/))([^&\n?#]+)/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      return "https://placehold.co/800x450?text=Video";
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  function getTipClasses(color: string) {
    if (color === "blue") {
      return {
        card: "bg-blue-50 border-blue-200",
        box: "bg-blue-100",
        title: "text-blue-900",
        text: "text-blue-800",
        icon: "text-blue-600",
      };
    }

    if (color === "green") {
      return {
        card: "bg-green-50 border-green-200",
        box: "bg-green-100",
        title: "text-green-900",
        text: "text-green-800",
        icon: "text-green-600",
      };
    }

    return {
      card: "bg-purple-50 border-purple-200",
      box: "bg-purple-100",
      title: "text-purple-900",
      text: "text-purple-800",
      icon: "text-purple-600",
    };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.pageTitle}</h1>
          <p className="text-gray-600">{content.pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Button
            variant={language === "pt" ? "default" : "outline"}
            onClick={() => setLanguage("pt")}
          >
            PT
          </Button>
          <Button
            variant={language === "en" ? "default" : "outline"}
            onClick={() => setLanguage("en")}
          >
            EN
          </Button>
        </div>
      </div>

      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <Globe className="w-12 h-12 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{content.heroTitle}</h2>
              <p className="text-blue-100 mb-4">{content.heroDescription}</p>

              <div className="flex flex-wrap gap-3">
                {content.heroBadges.map((badge, index) => (
                  <Badge key={index} className="bg-white text-blue-600">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger value="videos">
            <Video className="w-4 h-4 mr-2" />
            {content.tabs.videos}
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            {content.tabs.documents}
          </TabsTrigger>
          <TabsTrigger value="faqs">
            <MessageCircle className="w-4 h-4 mr-2" />
            {content.tabs.faqs}
          </TabsTrigger>
          <TabsTrigger value="buddies">
            <Globe className="w-4 h-4 mr-2" />
            {content.tabs.buddies}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.introVideos.map((video) => (
              <Card key={video.id} className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2 gap-3">
                    <Badge variant="secondary">{video.category}</Badge>
                    <span className="text-sm text-gray-500">{video.duration}</span>
                  </div>
                  <CardTitle className="text-lg text-gray-900">{video.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {video.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={getThumbnailUrl(video.url)}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleWatchVideo(video)}>
                    <Video className="w-4 h-4 mr-2" />
                    {content.watchVideo}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.documents.map((doc, index) => (
              <Card key={index} className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <CardTitle className="text-lg text-gray-900">{doc.title}</CardTitle>
                        <Badge variant="outline">{doc.type}</Badge>
                      </div>
                      <CardDescription className="text-gray-600">
                        {doc.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => handleDownloadDocument(doc)}>
                    <FileText className="w-4 h-4 mr-2" />
                    {content.download}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-6">
          <Accordion type="single" collapsible className="space-y-4">
            {content.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border rounded-xl bg-white px-4">
                <AccordionTrigger className="text-left">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {faq.category}
                    </Badge>
                    <h3 className="font-semibold text-gray-900">{faq.category}</h3>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {faq.questions.map((q, qIndex) => (
                      <div key={qIndex} className="border-t pt-4 first:border-t-0 first:pt-0">
                        <h4 className="font-medium text-gray-900 mb-2">{q.question}</h4>
                        <p className="text-sm text-gray-600">{q.answer}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="buddies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.buddies.map((buddy, index) => (
              <Card key={index} className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{buddy.name}</CardTitle>
                  <CardDescription>{buddy.course}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Plane className="w-4 h-4" />
                    <span>{buddy.country}</span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      {language === "pt" ? "Línguas" : "Languages"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {buddy.languages.map((lang, langIndex) => (
                        <Badge key={langIndex} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {language === "pt" ? "Especialidade" : "Specialty"}
                    </p>
                    <p className="text-sm text-gray-600">{buddy.specialty}</p>
                  </div>

                  <Button className="w-full" onClick={() => handleContactBuddy(buddy)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {content.contactBuddy}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.resources.map((resource, index) => {
          const Icon = resource.icon;

          return (
            <Card key={index} className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {resource.contact}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {content.sectionTips.map((tip, index) => {
          const Icon = tip.icon;
          const classes = getTipClasses(tip.color);

          return (
            <Card key={index} className={classes.card}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${classes.box}`}>
                    <Icon className={`w-6 h-6 ${classes.icon}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${classes.title}`}>{tip.title}</h3>
                    <p className={`text-sm ${classes.text}`}>{tip.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}