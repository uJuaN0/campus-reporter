import { useState } from 'react';
import { Calendar, Clock, MapPin, BookOpen, Bell, Download, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface Exam {
  id: string;
  subject: string;
  course: string;
  type: 'normal' | 'recurso' | 'especial';
  date: string;
  time: string;
  duration: string;
  location: string;
  professor: string;
  notifications: boolean;
}

export function CronogramaExames() {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      subject: 'Algoritmos e Estruturas de Dados',
      course: 'Engenharia Informática',
      type: 'normal',
      date: '2026-03-15',
      time: '14:00',
      duration: '2h30',
      location: 'Edifício II - Anfiteatro A',
      professor: 'Prof. João Leitão',
      notifications: true,
    },
    {
      id: '2',
      subject: 'Bases de Dados',
      course: 'Engenharia Informática',
      type: 'normal',
      date: '2026-03-18',
      time: '09:30',
      duration: '2h',
      location: 'Edifício I - Sala 105',
      professor: 'Prof. Maria Silva',
      notifications: true,
    },
    {
      id: '3',
      subject: 'Cálculo II',
      course: 'Engenharia Informática',
      type: 'normal',
      date: '2026-03-22',
      time: '14:00',
      duration: '3h',
      location: 'Edifício III - Anfiteatro B',
      professor: 'Prof. Pedro Almeida',
      notifications: false,
    },
    {
      id: '4',
      subject: 'Programação Orientada a Objetos',
      course: 'Engenharia Informática',
      type: 'recurso',
      date: '2026-04-05',
      time: '10:00',
      duration: '2h30',
      location: 'Edifício II - Lab 203',
      professor: 'Prof. Ana Costa',
      notifications: true,
    },
  ]);

  const toggleNotifications = (examId: string) => {
    setExams(
      exams.map((exam) =>
        exam.id === examId ? { ...exam, notifications: !exam.notifications } : exam
      )
    );
    const exam = exams.find((e) => e.id === examId);
    if (exam) {
      toast.success(
        exam.notifications
          ? 'Notificações desativadas'
          : 'Notificações ativadas! Você será avisado 1 dia antes'
      );
    }
  };

  const exportToCalendar = () => {
    toast.success('Cronograma exportado para Google Calendar com sucesso!');
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { label: string; variant: any }> = {
      normal: { label: 'Época Normal', variant: 'default' },
      recurso: { label: 'Época de Recurso', variant: 'secondary' },
      especial: { label: 'Época Especial', variant: 'destructive' },
    };
    return labels[type] || labels.normal;
  };

  const getDaysUntil = (dateString: string) => {
    const examDate = new Date(dateString);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'text-red-600 bg-red-50';
    if (days <= 7) return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  const upcomingExams = exams.filter((exam) => getDaysUntil(exam.date) >= 0).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const examsByType = {
    normal: exams.filter((e) => e.type === 'normal'),
    recurso: exams.filter((e) => e.type === 'recurso'),
    especial: exams.filter((e) => e.type === 'especial'),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cronograma de Exames</h1>
          <p className="text-gray-600">
            Sincronização automática com o calendário oficial do curso
          </p>
        </div>
        <Button onClick={exportToCalendar}>
          <Download className="w-4 h-4 mr-2" />
          Exportar para Calendar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Próximos 7 dias</p>
                <p className="text-3xl font-bold text-blue-900">
                  {upcomingExams.filter((e) => getDaysUntil(e.date) <= 7).length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Total de Exames</p>
                <p className="text-3xl font-bold text-green-900">{exams.length}</p>
              </div>
              <BookOpen className="w-12 h-12 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">Com Notificações</p>
                <p className="text-3xl font-bold text-purple-900">
                  {exams.filter((e) => e.notifications).length}
                </p>
              </div>
              <Bell className="w-12 h-12 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Exams Alert */}
      {upcomingExams.filter((e) => getDaysUntil(e.date) <= 3).length > 0 && (
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-1">Exames Próximos!</h3>
                <p className="text-orange-800 text-sm">
                  Você tem {upcomingExams.filter((e) => getDaysUntil(e.date) <= 3).length} exame(s)
                  nos próximos 3 dias. Boa sorte!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exams Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="normal">Época Normal</TabsTrigger>
          <TabsTrigger value="recurso">Recurso</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingExams.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum exame agendado</p>
              </CardContent>
            </Card>
          ) : (
            upcomingExams.map((exam) => {
              const daysUntil = getDaysUntil(exam.date);
              const typeConfig = getTypeLabel(exam.type);
              return (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-lg font-semibold">{exam.subject}</h3>
                          <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
                          {daysUntil <= 7 && (
                            <Badge className={getUrgencyColor(daysUntil)}>
                              {daysUntil === 0 ? 'Hoje' : daysUntil === 1 ? 'Amanhã' : `${daysUntil} dias`}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(exam.date).toLocaleDateString('pt-PT', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{exam.time} ({exam.duration})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{exam.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{exam.professor}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={exam.notifications ? 'default' : 'outline'}
                        onClick={() => toggleNotifications(exam.id)}
                      >
                        <Bell className={`w-4 h-4 mr-2 ${exam.notifications ? 'fill-current' : ''}`} />
                        {exam.notifications ? 'Notificações On' : 'Ativar Notificações'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="normal" className="space-y-4">
          {examsByType.normal.map((exam) => {
            const daysUntil = getDaysUntil(exam.date);
            return (
              <Card key={exam.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">{exam.subject}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(exam.date).toLocaleDateString('pt-PT')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{exam.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{exam.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={exam.notifications ? 'default' : 'outline'}
                      onClick={() => toggleNotifications(exam.id)}
                    >
                      <Bell className={`w-4 h-4 mr-2 ${exam.notifications ? 'fill-current' : ''}`} />
                      Notificações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="recurso" className="space-y-4">
          {examsByType.recurso.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">Nenhum exame de recurso agendado</p>
              </CardContent>
            </Card>
          ) : (
            examsByType.recurso.map((exam) => (
              <Card key={exam.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">{exam.subject}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(exam.date).toLocaleDateString('pt-PT')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{exam.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{exam.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={exam.notifications ? 'default' : 'outline'}
                      onClick={() => toggleNotifications(exam.id)}
                    >
                      <Bell className={`w-4 h-4 mr-2 ${exam.notifications ? 'fill-current' : ''}`} />
                      Notificações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {exams.map((exam) => {
            const typeConfig = getTypeLabel(exam.type);
            return (
              <Card key={exam.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-lg font-semibold">{exam.subject}</h3>
                        <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(exam.date).toLocaleDateString('pt-PT')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{exam.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{exam.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={exam.notifications ? 'default' : 'outline'}
                      onClick={() => toggleNotifications(exam.id)}
                    >
                      <Bell className={`w-4 h-4 mr-2 ${exam.notifications ? 'fill-current' : ''}`} />
                      Notificações
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
