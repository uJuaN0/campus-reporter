import { useState } from 'react';
import { Users, MessageCircle, Star, BookOpen, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Mentor {
  id: string;
  name: string;
  role: 'buddy' | 'technical' | 'professor';
  course: string;
  year: string;
  specialties: string[];
  languages: string[];
  rating: number;
  studentsHelped: number;
  bio: string;
  imageUrl: string;
  available: boolean;
}

export function Mentoria() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterCourse, setFilterCourse] = useState<string>('all');

  const mentors: Mentor[] = [
    {
      id: '1',
      name: 'João Leitão',
      role: 'professor',
      course: 'Engenharia Informática',
      year: 'Professor',
      specialties: ['Algoritmos', 'Sistemas Distribuídos', 'Cloud Computing'],
      languages: ['Português', 'Inglês'],
      rating: 4.9,
      studentsHelped: 150,
      bio: 'Professor de Sistemas Distribuídos com experiência em investigação e ensino',
      imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400',
      available: true,
    },
    {
      id: '2',
      name: 'Pedro Almeida',
      role: 'technical',
      course: 'Engenharia Informática',
      year: '3º Ano',
      specialties: ['Python', 'Machine Learning', 'Data Science'],
      languages: ['Português', 'Inglês'],
      rating: 4.8,
      studentsHelped: 45,
      bio: 'Mentor técnico especializado em ML e Python. Participante em hackathons e projetos de investigação',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      available: true,
    },
    {
      id: '3',
      name: 'Maria Silva',
      role: 'buddy',
      course: 'Engenharia Informática',
      year: '2º Ano',
      specialties: ['Integração', 'Adaptação ao Campus', 'Vida Estudantil'],
      languages: ['Português', 'Inglês', 'Francês'],
      rating: 4.7,
      studentsHelped: 28,
      bio: 'Buddy com experiência em ajudar estudantes internacionais e caloiros na adaptação',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      available: true,
    },
    {
      id: '4',
      name: 'Ana Costa',
      role: 'technical',
      course: 'Engenharia Informática',
      year: '4º Ano',
      specialties: ['Web Development', 'React', 'Node.js', 'DevOps'],
      languages: ['Português', 'Inglês'],
      rating: 4.9,
      studentsHelped: 62,
      bio: 'Especialista em desenvolvimento web full-stack. Trabalhei em várias startups',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      available: false,
    },
    {
      id: '5',
      name: 'Carlos Mendes',
      role: 'buddy',
      course: 'Engenharia Informática',
      year: '3º Ano',
      specialties: ['Apoio a PALOP', 'Integração Cultural', 'Burocracias'],
      languages: ['Português', 'Inglês', 'Crioulo'],
      rating: 4.8,
      studentsHelped: 35,
      bio: 'Estudante de Angola. Ajudo principalmente alunos internacionais de PALOP',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      available: true,
    },
    {
      id: '6',
      name: 'Sofia Rodrigues',
      role: 'technical',
      course: 'Engenharia Informática',
      year: '3º Ano',
      specialties: ['Mobile Development', 'Flutter', 'UI/UX Design'],
      languages: ['Português', 'Inglês', 'Espanhol'],
      rating: 4.7,
      studentsHelped: 41,
      bio: 'Desenvolvedora mobile com foco em Flutter e design de interfaces',
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      available: true,
    },
  ];

  const getRoleLabel = (role: string) => {
    const labels: Record<string, { label: string; variant: any }> = {
      buddy: { label: 'Buddy', variant: 'secondary' },
      technical: { label: 'Mentor Técnico', variant: 'default' },
      professor: { label: 'Professor', variant: 'destructive' },
    };
    return labels[role] || labels.buddy;
  };

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || mentor.role === filterRole;
    const matchesCourse = filterCourse === 'all' || mentor.course === filterCourse;
    return matchesSearch && matchesRole && matchesCourse;
  });

  const handleContactMentor = (mentor: Mentor) => {
    if (!mentor.available) {
      toast.error(`${mentor.name} não está disponível no momento`);
      return;
    }
    toast.success(`Pedido de mentoria enviado para ${mentor.name}! Você receberá uma resposta em breve.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentoria & Networking</h1>
        <p className="text-gray-600">
          Conecte-se com buddies, mentores técnicos e professores para apoio académico e integração
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Buddies</h3>
                <p className="text-sm text-blue-700">Veteranos que ajudam na integração</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Mentores Técnicos</h3>
                <p className="text-sm text-green-700">Apoio em tecnologias e projetos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Professores</h3>
                <p className="text-sm text-purple-700">Orientação académica e carreira</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline w-4 h-4 mr-1" />
                Pesquisar
              </label>
              <Input
                placeholder="Nome, especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Tipo de Mentor
              </label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="buddy">Buddies</SelectItem>
                  <SelectItem value="technical">Mentores Técnicos</SelectItem>
                  <SelectItem value="professor">Professores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <Select value={filterCourse} onValueChange={setFilterCourse}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Cursos</SelectItem>
                  <SelectItem value="Engenharia Informática">Engenharia Informática</SelectItem>
                  <SelectItem value="Engenharia Eletrotécnica">Engenharia Eletrotécnica</SelectItem>
                  <SelectItem value="Engenharia Civil">Engenharia Civil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMentors.map((mentor) => {
          const roleConfig = getRoleLabel(mentor.role);
          return (
            <Card key={mentor.id} className={`${!mentor.available ? 'opacity-75' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">
                          {mentor.course} · {mentor.year}
                        </p>
                      </div>
                      <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{mentor.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{mentor.studentsHelped} ajudados</span>
                      </div>
                      {mentor.available ? (
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          Disponível
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          Indisponível
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{mentor.bio}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Especialidades:</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Idiomas:</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.languages.map((language) => (
                        <Badge key={language} variant="secondary" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    disabled={!mentor.available}
                    onClick={() => handleContactMentor(mentor)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {mentor.available ? 'Contactar Mentor' : 'Indisponível'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum mentor encontrado com os filtros selecionados</p>
        </div>
      )}

      {/* Become a Mentor CTA */}
      <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Quer ser um Mentor?</h3>
          <p className="text-gray-600 mb-6">
            Ajude outros estudantes e ganhe <strong>+10 FCT Tokens</strong> por cada sessão de mentoria validada
          </p>
          <Button size="lg">
            <Users className="w-5 h-5 mr-2" />
            Tornar-me Mentor
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
