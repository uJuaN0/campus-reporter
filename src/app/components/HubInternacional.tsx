import { Globe, Video, FileText, MessageCircle, Plane, Home, CreditCard, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { toast } from 'sonner';

export function HubInternacional() {
  const introVideos = [
    {
      id: '1',
      title: 'Bem-vindo à NOVA FCT',
      description: 'Vídeo de apresentação do campus e instalações',
      duration: '8:32',
      category: 'Geral',
    },
    {
      id: '2',
      title: 'Sistema Académico e CLIP',
      description: 'Como usar o portal académico CLIP',
      duration: '5:15',
      category: 'Académico',
    },
    {
      id: '3',
      title: 'Viver em Portugal',
      description: 'Dicas sobre cultura, transporte e vida quotidiana',
      duration: '12:40',
      category: 'Vida em Portugal',
    },
    {
      id: '4',
      title: 'Processo de Visto para Estudantes',
      description: 'Passo a passo para obter visto de estudante',
      duration: '10:20',
      category: 'Burocracias',
    },
  ];

  const documents = [
    {
      title: 'Guia de Acolhimento Internacional',
      description: 'Manual completo para estudantes internacionais',
      type: 'PDF',
    },
    {
      title: 'Checklist: Documentos Necessários',
      description: 'Lista de documentos para matrícula e visto',
      type: 'PDF',
    },
    {
      title: 'Guia de Alojamento em Lisboa',
      description: 'Opções de alojamento e dicas para procurar casa',
      type: 'PDF',
    },
    {
      title: 'Transportes em Lisboa',
      description: 'Como usar metro, comboio e autocarro',
      type: 'PDF',
    },
  ];

  const faqs = [
    {
      category: 'Visto e Documentos',
      questions: [
        {
          question: 'Preciso de visto para estudar em Portugal?',
          answer: 'Cidadãos de países PALOP podem necessitar de visto dependendo da duração do curso. Para cursos superiores a 90 dias, é necessário visto de estudante. Entre em contacto com o consulado português no seu país.',
        },
        {
          question: 'Quanto tempo demora o processo de visto?',
          answer: 'O processo pode demorar entre 2 a 6 meses. Recomendamos iniciar o processo assim que receber a carta de aceitação da universidade.',
        },
        {
          question: 'Que documentos preciso para o visto de estudante?',
          answer: 'Necessita de: carta de aceitação da universidade, comprovativo de recursos financeiros, seguro de saúde, passaporte válido, certificado de antecedentes criminais, e comprovativo de alojamento.',
        },
      ],
    },
    {
      category: 'Alojamento',
      questions: [
        {
          question: 'A universidade oferece alojamento?',
          answer: 'A NOVA FCT não tem residências próprias, mas pode indicar residências parceiras. A maioria dos estudantes procura apartamentos partilhados em zonas próximas ao campus.',
        },
        {
          question: 'Quanto custa em média um quarto em Lisboa?',
          answer: 'O preço varia entre €300-600/mês para quartos partilhados, dependendo da localização e condições. Zonas próximas ao campus (Caparica, Almada) tendem a ser mais acessíveis.',
        },
      ],
    },
    {
      category: 'Vida Académica',
      questions: [
        {
          question: 'As aulas são em português ou inglês?',
          answer: 'A maioria dos cursos de licenciatura são em português. Alguns mestrados têm opções em inglês. Recomendamos verificar com o departamento específico do seu curso.',
        },
        {
          question: 'Existem aulas de português para estrangeiros?',
          answer: 'Sim! A NOVA oferece cursos de português como língua estrangeira. Consulte o International Office para mais informações.',
        },
      ],
    },
    {
      category: 'Custo de Vida',
      questions: [
        {
          question: 'Quanto preciso por mês para viver em Lisboa?',
          answer: 'Estima-se entre €700-1000/mês incluindo alojamento, alimentação, transporte e despesas básicas. Estudantes com estilo de vida mais económico podem gastar menos.',
        },
        {
          question: 'Posso trabalhar enquanto estudo?',
          answer: 'Sim, estudantes com visto podem trabalhar até 20h/semana durante as aulas e full-time nas férias. Necessita de autorização da AIMA (Agência para Integração, Migrações e Asilo).',
        },
      ],
    },
  ];

  const buddies = [
    {
      name: 'Carlos Mendes',
      country: 'Angola',
      course: 'Engenharia Informática - 3º Ano',
      languages: ['Português', 'Inglês', 'Crioulo'],
      specialty: 'Apoio PALOP, Burocracias',
    },
    {
      name: 'Maria Silva',
      country: 'Portugal',
      course: 'Engenharia Informática - 2º Ano',
      languages: ['Português', 'Inglês', 'Francês'],
      specialty: 'Integração Cultural, Campus',
    },
    {
      name: 'João Santos',
      country: 'Cabo Verde',
      course: 'Engenharia Eletrotécnica - 4º Ano',
      languages: ['Português', 'Crioulo', 'Inglês'],
      specialty: 'Alojamento, Visto',
    },
  ];

  const resources = [
    {
      title: 'International Office',
      description: 'Gabinete de apoio a estudantes internacionais',
      contact: 'international@fct.unl.pt',
      icon: Globe,
    },
    {
      title: 'AIMA (Agência de Integração)',
      description: 'Agência para questões de imigração e vistos',
      contact: 'www.imigrante.pt',
      icon: FileText,
    },
    {
      title: 'Embassy Network',
      description: 'Contactos de embaixadas e consulados',
      contact: 'Vários contactos disponíveis',
      icon: MapPin,
    },
  ];

  const handleWatchVideo = (video: any) => {
    toast.success(`A reproduzir: ${video.title}`);
  };

  const handleDownloadDocument = (doc: any) => {
    toast.success(`A descarregar: ${doc.title}`);
  };

  const handleContactBuddy = (buddy: any) => {
    toast.success(`Pedido de contacto enviado para ${buddy.name}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hub Internacional</h1>
        <p className="text-gray-600">
          Suporte completo para estudantes internacionais antes e durante a chegada a Portugal
        </p>
      </div>

      {/* Welcome Banner */}
      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <Globe className="w-12 h-12 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Bem-vindo à Comunidade NOVA FCT!</h2>
              <p className="text-blue-100 mb-4">
                Este espaço foi criado especialmente para estudantes internacionais. Aqui encontrará
                vídeos introdutórios, documentos importantes e pode tirar dúvidas mesmo antes de chegar
                a Portugal.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white text-blue-600">+300 Estudantes Internacionais</Badge>
                <Badge className="bg-white text-blue-600">40+ Países Representados</Badge>
                <Badge className="bg-white text-blue-600">Comunidade PALOP Forte</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="videos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="videos">
            <Video className="w-4 h-4 mr-2" />
            Vídeos
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="faqs">
            <MessageCircle className="w-4 h-4 mr-2" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="buddies">
            <Globe className="w-4 h-4 mr-2" />
            Buddies
          </TabsTrigger>
        </TabsList>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {introVideos.map((video) => (
              <Card key={video.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{video.category}</Badge>
                    <span className="text-sm text-gray-500">{video.duration}</span>
                  </div>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <Video className="w-16 h-16 text-gray-400" />
                  </div>
                  <Button className="w-full" onClick={() => handleWatchVideo(video)}>
                    <Video className="w-4 h-4 mr-2" />
                    Assistir Vídeo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <Badge variant="outline">{doc.type}</Badge>
                      </div>
                      <CardDescription>{doc.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={() => handleDownloadDocument(doc)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Descarregar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Important Resources */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recursos Importantes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-1">{resource.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          <p className="text-xs text-blue-600 break-words">{resource.contact}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>
                Respostas às dúvidas mais comuns de estudantes internacionais
              </CardDescription>
            </CardHeader>
            <CardContent>
              {faqs.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    {section.category}
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {section.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${sectionIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buddies Tab */}
        <TabsContent value="buddies" className="space-y-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Programa de Buddies</h3>
                  <p className="text-green-800 text-sm">
                    Os buddies são estudantes veteranos que ajudam na integração. Muitos são também
                    estudantes internacionais e entendem os desafios que você enfrentará.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {buddies.map((buddy, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                      {buddy.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="font-semibold text-lg">{buddy.name}</h3>
                    <p className="text-sm text-gray-600">{buddy.country}</p>
                    <p className="text-xs text-gray-500 mt-1">{buddy.course}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Idiomas:</p>
                      <div className="flex flex-wrap gap-1">
                        {buddy.languages.map((lang) => (
                          <Badge key={lang} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Especialidade:</p>
                      <p className="text-sm text-gray-700">{buddy.specialty}</p>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => handleContactBuddy(buddy)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contactar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Ainda não chegou?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Assista aos vídeos introdutórios e prepare-se para a chegada
                </p>
                <Button variant="outline" size="sm">Ver Vídeos de Preparação</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Já chegou a Portugal?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Conecte-se com buddies e outros estudantes internacionais
                </p>
                <Button variant="outline" size="sm">Encontrar Buddies</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
