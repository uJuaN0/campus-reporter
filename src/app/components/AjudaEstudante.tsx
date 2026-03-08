import { Phone, Mail, MapPin, Heart, DollarSign, FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function AjudaEstudante() {
  const emergencyContacts = [
    {
      title: 'Emergência 112',
      phone: '112',
      description: 'Emergências médicas, bombeiros e polícia',
      icon: AlertCircle,
      color: 'text-red-600 bg-red-50',
    },
    {
      title: 'Segurança Campus',
      phone: '+351 212 948 300',
      description: 'Segurança e vigilância do campus NOVA FCT',
      icon: Phone,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Apoio Psicológico',
      phone: '+351 212 948 536',
      email: 'apoio.psicologico@fct.unl.pt',
      description: 'Gabinete de Apoio Psicológico e Aconselhamento',
      icon: Heart,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  const services = [
    {
      title: 'Divisão Académica',
      description: 'Matrículas, certidões, inscrições e questões académicas',
      phone: '+351 212 948 596',
      email: 'da@fct.unl.pt',
      location: 'Edifício VII - Piso 0',
      hours: 'Segunda a Sexta: 09:00 - 17:00',
      icon: FileText,
    },
    {
      title: 'Bolsas e Apoios Sociais',
      description: 'Informações sobre bolsas de estudo e apoios financeiros',
      phone: '+351 212 948 300',
      email: 'sas@fct.unl.pt',
      location: 'Serviços de Ação Social',
      hours: 'Segunda a Sexta: 09:00 - 18:00',
      icon: DollarSign,
    },
    {
      title: 'Biblioteca',
      description: 'Empréstimo de livros, bases de dados e espaços de estudo',
      phone: '+351 212 948 543',
      email: 'biblioteca@fct.unl.pt',
      location: 'Biblioteca Campus',
      hours: 'Segunda a Sexta: 08:30 - 22:00 | Sábado: 09:00 - 18:00',
      icon: MapPin,
    },
  ];

  const scholarships = [
    {
      title: 'Bolsa de Estudo DGES',
      description: 'Bolsa de estudo atribuída pela Direção-Geral do Ensino Superior para estudantes com necessidades económicas',
      deadline: 'Agosto - Setembro (anual)',
      link: 'https://www.dges.gov.pt',
    },
    {
      title: 'Bolsa de Mérito',
      description: 'Atribuída aos melhores alunos de cada curso com base na média final',
      deadline: 'Novembro (anual)',
      link: '#',
    },
    {
      title: 'Programa Erasmus+',
      description: 'Bolsas de mobilidade para estudar ou fazer estágio no estrangeiro',
      deadline: 'Janeiro - Março (anual)',
      link: '#',
    },
    {
      title: 'Fundação Calouste Gulbenkian',
      description: 'Apoios para investigação e projetos de mérito',
      deadline: 'Vários períodos',
      link: 'https://gulbenkian.pt',
    },
  ];

  const faqs = [
    {
      question: 'Como posso pedir uma certidão de matrícula?',
      answer: 'As certidões podem ser pedidas online através do portal académico ou presencialmente na Divisão Académica (Ed. VII). O processamento demora cerca de 2-3 dias úteis.',
    },
    {
      question: 'Quais são os prazos de inscrição em exames?',
      answer: 'Os prazos de inscrição em exames são normalmente 10 dias antes da data do exame. Consulte o calendário académico e o portal CLIP para datas específicas.',
    },
    {
      question: 'Como posso alterar o meu horário?',
      answer: 'As alterações de turno podem ser feitas através do portal CLIP durante o período de alterações definido no início de cada semestre.',
    },
    {
      question: 'Onde posso obter apoio psicológico?',
      answer: 'O Gabinete de Apoio Psicológico oferece consultas gratuitas e confidenciais. Agende através do email apoio.psicologico@fct.unl.pt ou telefone +351 212 948 536.',
    },
    {
      question: 'Como funciona o cartão de estudante?',
      answer: 'O cartão de estudante serve para acesso ao campus, cantina, biblioteca e descontos em transportes. Pode ser carregado online ou nas máquinas no campus.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajuda ao Estudante</h1>
        <p className="text-gray-600">
          Contactos de emergência, serviços académicos, bolsas e respostas a dúvidas frequentes
        </p>
      </div>

      {/* Emergency Contacts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contactos de Emergência</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <Card key={contact.title} className="border-2">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${contact.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle>{contact.title}</CardTitle>
                  <CardDescription>{contact.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </a>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700"
                    >
                      <Mail className="w-4 h-4" />
                      {contact.email}
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Serviços Académicos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title}>
                <CardHeader>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <a
                      href={`tel:${service.phone}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <Phone className="w-4 h-4" />
                      {service.phone}
                    </a>
                    <a
                      href={`mailto:${service.email}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                    >
                      <Mail className="w-4 h-4" />
                      {service.email}
                    </a>
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      <strong>Horário:</strong> {service.hours}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Scholarships */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bolsas de Estudo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.title}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{scholarship.title}</CardTitle>
                  <Badge variant="secondary">{scholarship.deadline}</Badge>
                </div>
                <CardDescription>{scholarship.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Mais Informações
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Links Úteis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href="https://clip.fct.unl.pt" target="_blank" rel="noopener noreferrer">
                Portal CLIP
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.fct.unl.pt" target="_blank" rel="noopener noreferrer">
                Site FCT
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://moodle.fct.unl.pt" target="_blank" rel="noopener noreferrer">
                Moodle
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.innov.pt" target="_blank" rel="noopener noreferrer">
                Associação InNov
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
