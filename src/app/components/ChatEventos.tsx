import { useState } from 'react';
import { MessageSquare, Calendar, Users, Send, Pin, Hash, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';

interface Channel {
  id: string;
  name: string;
  description: string;
  members: number;
  unread: number;
  type: 'course' | 'general' | 'club';
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  category: 'academic' | 'social' | 'sports' | 'cultural';
}

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
  pinned?: boolean;
}

export function ChatEventos() {
  const [selectedChannel, setSelectedChannel] = useState<string>('ei-geral');
  const [message, setMessage] = useState('');

  const channels: Channel[] = [
    {
      id: 'ei-geral',
      name: 'Eng. Informática - Geral',
      description: 'Discussões gerais do curso',
      members: 245,
      unread: 3,
      type: 'course',
    },
    {
      id: 'ei-1ano',
      name: 'Eng. Informática - 1º Ano',
      description: 'Apoio aos caloiros',
      members: 89,
      unread: 0,
      type: 'course',
    },
    {
      id: 'ajuda-estudos',
      name: 'Ajuda nos Estudos',
      description: 'Dúvidas e partilha de materiais',
      members: 312,
      unread: 7,
      type: 'general',
    },
    {
      id: 'internacionais',
      name: 'Estudantes Internacionais',
      description: 'Comunidade internacional',
      members: 78,
      unread: 0,
      type: 'general',
    },
    {
      id: 'innov',
      name: 'Associação InNov',
      description: 'Eventos e atividades da associação',
      members: 520,
      unread: 2,
      type: 'club',
    },
  ];

  const messages: Record<string, Message[]> = {
    'ei-geral': [
      {
        id: '1',
        author: 'João Silva',
        content: 'Alguém tem os slides da última aula de AED?',
        timestamp: '10:30',
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100',
      },
      {
        id: '2',
        author: 'Maria Santos',
        content: 'Sim! Vou enviar no Moodle',
        timestamp: '10:32',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      {
        id: '3',
        author: 'Pedro Almeida',
        content: 'Aviso importante: O exame de BD foi adiado para dia 20',
        timestamp: '11:15',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
        pinned: true,
      },
      {
        id: '4',
        author: 'Ana Costa',
        content: 'Obrigada pela info! Isso dá mais tempo para estudar 🎉',
        timestamp: '11:20',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      },
    ],
  };

  const events: Event[] = [
    {
      id: '1',
      title: 'Innovation Week 2026',
      description: 'Semana de inovação e empreendedorismo com palestras, workshops e hackathon',
      date: '2026-03-20',
      time: '09:00',
      location: 'Campus NOVA FCT',
      organizer: 'Associação InNov',
      attendees: 234,
      maxAttendees: 500,
      category: 'academic',
    },
    {
      id: '2',
      title: 'Torneio de Futebol Inter-Cursos',
      description: 'Competição de futebol entre os diferentes cursos da FCT',
      date: '2026-03-15',
      time: '15:00',
      location: 'Campo Desportivo',
      organizer: 'Núcleo de Desporto',
      attendees: 89,
      category: 'sports',
    },
    {
      id: '3',
      title: 'Workshop: Introdução ao Machine Learning',
      description: 'Workshop prático sobre ML com Python e scikit-learn',
      date: '2026-03-12',
      time: '18:00',
      location: 'Edifício II - Lab 203',
      organizer: 'Núcleo de Informática',
      attendees: 45,
      maxAttendees: 50,
      category: 'academic',
    },
    {
      id: '4',
      title: 'Noite Cultural PALOP',
      description: 'Celebração das culturas dos Países Africanos de Língua Oficial Portuguesa',
      date: '2026-03-25',
      time: '20:00',
      location: 'Cantina',
      organizer: 'Associação de Estudantes',
      attendees: 112,
      category: 'cultural',
    },
    {
      id: '5',
      title: 'Career Fair 2026',
      description: 'Feira de emprego com empresas tech de referência',
      date: '2026-04-10',
      time: '10:00',
      location: 'Edifício VII',
      organizer: 'Career Office',
      attendees: 178,
      category: 'academic',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      academic: 'bg-blue-100 text-blue-700',
      social: 'bg-green-100 text-green-700',
      sports: 'bg-orange-100 text-orange-700',
      cultural: 'bg-purple-100 text-purple-700',
    };
    return colors[category] || colors.academic;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      academic: 'Académico',
      social: 'Social',
      sports: 'Desporto',
      cultural: 'Cultural',
    };
    return labels[category] || category;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    toast.success('Mensagem enviada!');
    setMessage('');
  };

  const handleJoinEvent = (event: Event) => {
    toast.success(`Inscrito no evento: ${event.title}`);
  };

  const currentMessages = messages[selectedChannel] || [];
  const currentChannel = channels.find((c) => c.id === selectedChannel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat & Eventos</h1>
        <p className="text-gray-600">
          Fóruns de discussão por curso e calendário de eventos do campus
        </p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat & Fóruns
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="w-4 h-4 mr-2" />
            Eventos
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Channels Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Canais</CardTitle>
                  <Button size="sm" className="w-full mt-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Canal
                  </Button>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {channels.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => setSelectedChannel(channel.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedChannel === channel.id
                              ? 'bg-blue-50 border-2 border-blue-200'
                              : 'hover:bg-gray-50 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-sm truncate">{channel.name}</span>
                            </div>
                            {channel.unread > 0 && (
                              <Badge variant="destructive" className="h-5 min-w-5 text-xs">
                                {channel.unread}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{channel.description}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                            <Users className="w-3 h-3" />
                            <span>{channel.members}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{currentChannel?.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4" />
                        {currentChannel?.members} membros
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[450px] p-6">
                    <div className="space-y-4">
                      {currentMessages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.pinned ? 'bg-yellow-50 -mx-6 px-6 py-3' : ''}`}>
                          {msg.pinned && (
                            <div className="absolute -ml-6 mt-1">
                              <Pin className="w-4 h-4 text-yellow-600" />
                            </div>
                          )}
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={msg.avatar} alt={msg.author} />
                            <AvatarFallback>{msg.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-semibold text-sm">{msg.author}</span>
                              <span className="text-xs text-gray-500">{msg.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-700">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Escrever mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Próximo Evento</h3>
                  <p className="text-2xl font-bold text-blue-900 mb-1">Innovation Week 2026</p>
                  <p className="text-sm text-gray-600">20 de Março · 09:00</p>
                </div>
                <Button>Ver Detalhes</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge className={getCategoryColor(event.category)}>
                      {getCategoryLabel(event.category)}
                    </Badge>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('pt-PT')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.attendees}
                          {event.maxAttendees && ` / ${event.maxAttendees}`} inscritos
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Hora:</strong> {event.time}
                      </p>
                      <p>
                        <strong>Local:</strong> {event.location}
                      </p>
                      <p>
                        <strong>Organizador:</strong> {event.organizer}
                      </p>
                    </div>

                    {event.maxAttendees && (
                      <div className="pt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${(event.attendees / event.maxAttendees) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      disabled={event.maxAttendees ? event.attendees >= event.maxAttendees : false}
                      onClick={() => handleJoinEvent(event)}
                    >
                      {event.maxAttendees && event.attendees >= event.maxAttendees
                        ? 'Lotado'
                        : 'Inscrever-me'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
