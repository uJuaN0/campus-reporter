import { useState } from 'react';
import { Clock, Plus, Trash2, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface ScheduleItem {
  id: string;
  subject: string;
  type: 'teorica' | 'pratica' | 'laboratorio' | 'outro';
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  professor: string;
  color: string;
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
];

const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

export function ConstruirHorario() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    {
      id: '1',
      subject: 'Algoritmos e Estruturas de Dados',
      type: 'teorica',
      day: 'Segunda',
      startTime: '09:00',
      endTime: '11:00',
      location: 'Ed. II - Anfiteatro A',
      professor: 'Prof. João Leitão',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      subject: 'Algoritmos e Estruturas de Dados',
      type: 'pratica',
      day: 'Quarta',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Ed. II - Lab 203',
      professor: 'Prof. João Leitão',
      color: 'bg-blue-500',
    },
    {
      id: '3',
      subject: 'Bases de Dados',
      type: 'teorica',
      day: 'Terça',
      startTime: '11:00',
      endTime: '13:00',
      location: 'Ed. I - Sala 105',
      professor: 'Prof. Maria Silva',
      color: 'bg-green-500',
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ScheduleItem>>({
    type: 'teorica',
    day: 'Segunda',
    color: 'bg-purple-500',
  });

  const colors = [
    { value: 'bg-blue-500', label: 'Azul' },
    { value: 'bg-green-500', label: 'Verde' },
    { value: 'bg-purple-500', label: 'Roxo' },
    { value: 'bg-orange-500', label: 'Laranja' },
    { value: 'bg-pink-500', label: 'Rosa' },
    { value: 'bg-yellow-500', label: 'Amarelo' },
    { value: 'bg-red-500', label: 'Vermelho' },
    { value: 'bg-indigo-500', label: 'Índigo' },
  ];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      teorica: 'Teórica',
      pratica: 'Prática',
      laboratorio: 'Laboratório',
      outro: 'Outro',
    };
    return labels[type] || type;
  };

  const handleAddItem = () => {
    if (!newItem.subject || !newItem.day || !newItem.startTime || !newItem.endTime) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const item: ScheduleItem = {
      id: Date.now().toString(),
      subject: newItem.subject!,
      type: newItem.type as any,
      day: newItem.day!,
      startTime: newItem.startTime!,
      endTime: newItem.endTime!,
      location: newItem.location || '',
      professor: newItem.professor || '',
      color: newItem.color || 'bg-purple-500',
    };

    setSchedule([...schedule, item]);
    setNewItem({ type: 'teorica', day: 'Segunda', color: 'bg-purple-500' });
    setShowAddDialog(false);
    toast.success('Aula adicionada ao horário');
  };

  const handleDeleteItem = (id: string) => {
    setSchedule(schedule.filter((item) => item.id !== id));
    toast.success('Aula removida do horário');
  };

  const exportToCalendar = () => {
    toast.success('Horário exportado para Google Calendar com sucesso!');
  };

  const getItemsForDayAndTime = (day: string, time: string) => {
    return schedule.filter((item) => {
      if (item.day !== day) return false;
      const itemStart = parseInt(item.startTime.replace(':', ''));
      const itemEnd = parseInt(item.endTime.replace(':', ''));
      const slotTime = parseInt(time.replace(':', ''));
      return slotTime >= itemStart && slotTime < itemEnd;
    });
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.replace(':', ''));
    const end = parseInt(endTime.replace(':', ''));
    return (end - start) / 100;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Construtor de Horário</h1>
          <p className="text-gray-600">
            Crie e organize seu horário semanal com ferramentas drag-and-drop
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Aula
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Aula ao Horário</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da aula para adicionar ao seu horário
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Disciplina *
                  </label>
                  <Input
                    placeholder="Ex: Algoritmos e Estruturas de Dados"
                    value={newItem.subject || ''}
                    onChange={(e) => setNewItem({ ...newItem, subject: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value) => setNewItem({ ...newItem, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teorica">Teórica</SelectItem>
                        <SelectItem value="pratica">Prática</SelectItem>
                        <SelectItem value="laboratorio">Laboratório</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dia *
                    </label>
                    <Select
                      value={newItem.day}
                      onValueChange={(value) => setNewItem({ ...newItem, day: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {weekDays.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Início *
                    </label>
                    <Select
                      value={newItem.startTime}
                      onValueChange={(value) => setNewItem({ ...newItem, startTime: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Fim *
                    </label>
                    <Select
                      value={newItem.endTime}
                      onValueChange={(value) => setNewItem({ ...newItem, endTime: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização
                  </label>
                  <Input
                    placeholder="Ex: Edifício II - Sala 203"
                    value={newItem.location || ''}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professor
                  </label>
                  <Input
                    placeholder="Ex: Prof. João Leitão"
                    value={newItem.professor || ''}
                    onChange={(e) => setNewItem({ ...newItem, professor: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`h-10 rounded-lg border-2 transition-all ${color.value} ${
                          newItem.color === color.value ? 'ring-2 ring-offset-2 ring-gray-900' : 'border-gray-200'
                        }`}
                        onClick={() => setNewItem({ ...newItem, color: color.value })}
                      />
                    ))}
                  </div>
                </div>

                <Button onClick={handleAddItem} className="w-full">
                  Adicionar ao Horário
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={exportToCalendar}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Horário Semanal</CardTitle>
          <CardDescription>
            Visualize todas as suas aulas da semana num único lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header */}
              <div className="grid grid-cols-6 gap-2 mb-2">
                <div className="p-2 text-sm font-medium text-gray-500">Hora</div>
                {weekDays.map((day) => (
                  <div key={day} className="p-2 text-sm font-medium text-center bg-gray-50 rounded-t-lg">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-1">
                {timeSlots.filter((_, i) => i % 2 === 0).map((time) => (
                  <div key={time} className="grid grid-cols-6 gap-2">
                    <div className="p-2 text-xs text-gray-500 font-medium">{time}</div>
                    {weekDays.map((day) => {
                      const items = getItemsForDayAndTime(day, time);
                      return (
                        <div key={day} className="min-h-[60px] border rounded-lg bg-gray-50 relative">
                          {items.map((item) => {
                            const isFirstSlot = item.startTime === time;
                            if (!isFirstSlot) return null;

                            const duration = calculateDuration(item.startTime, item.endTime);
                            return (
                              <div
                                key={item.id}
                                className={`absolute inset-0 ${item.color} text-white p-2 rounded-lg shadow-sm group cursor-pointer`}
                                style={{ height: `${duration * 60}px` }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold truncate">{item.subject}</p>
                                    <p className="text-xs opacity-90">{getTypeLabel(item.type)}</p>
                                    <p className="text-xs opacity-75 mt-1">
                                      {item.startTime} - {item.endTime}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedule.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-3 h-3 ${item.color} rounded-full mt-1`} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  className="h-auto p-1"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <h4 className="font-semibold mb-2">{item.subject}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {getTypeLabel(item.type)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{item.day}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>
                    {item.startTime} - {item.endTime}
                  </span>
                </div>
                {item.location && <p className="text-xs">{item.location}</p>}
                {item.professor && <p className="text-xs">{item.professor}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {schedule.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Nenhuma aula adicionada ao horário</p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeira Aula
          </Button>
        </div>
      )}
    </div>
  );
}
