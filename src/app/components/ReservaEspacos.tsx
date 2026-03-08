import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface Space {
  id: string;
  name: string;
  type: 'study_room' | 'lab' | 'club_space' | 'library';
  building: string;
  capacity: number;
  available: boolean;
  currentOccupancy: number;
  amenities: string[];
}

export function ReservaEspacos() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const spaces: Space[] = [
    {
      id: '1',
      name: 'Sala de Estudo A1',
      type: 'study_room',
      building: 'Edifício I',
      capacity: 6,
      available: true,
      currentOccupancy: 2,
      amenities: ['WiFi', 'Quadro Branco', 'Tomadas'],
    },
    {
      id: '2',
      name: 'Biblioteca - Zona Silenciosa',
      type: 'library',
      building: 'Biblioteca',
      capacity: 40,
      available: true,
      currentOccupancy: 28,
      amenities: ['WiFi', 'Silêncio Total', 'Tomadas'],
    },
    {
      id: '3',
      name: 'Laboratório de Informática 203',
      type: 'lab',
      building: 'Edifício II',
      capacity: 30,
      available: false,
      currentOccupancy: 30,
      amenities: ['Computadores', 'WiFi', 'Projetor'],
    },
    {
      id: '4',
      name: 'Espaço Núcleo de Informática',
      type: 'club_space',
      building: 'Edifício VII',
      capacity: 15,
      available: true,
      currentOccupancy: 5,
      amenities: ['WiFi', 'Sofás', 'Cozinha'],
    },
    {
      id: '5',
      name: 'Sala de Estudo B2',
      type: 'study_room',
      building: 'Edifício I',
      capacity: 8,
      available: true,
      currentOccupancy: 0,
      amenities: ['WiFi', 'Quadro Branco', 'Ar Condicionado', 'Tomadas'],
    },
    {
      id: '6',
      name: 'Biblioteca - Sala de Grupo',
      type: 'library',
      building: 'Biblioteca',
      capacity: 12,
      available: true,
      currentOccupancy: 8,
      amenities: ['WiFi', 'Quadro Branco', 'Monitor', 'Tomadas'],
    },
  ];

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      study_room: 'Sala de Estudo',
      lab: 'Laboratório',
      club_space: 'Espaço de Núcleo',
      library: 'Biblioteca',
    };
    return labels[type] || type;
  };

  const getOccupancyColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch = space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         space.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || space.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleReserve = (space: Space) => {
    if (!space.available) {
      toast.error('Este espaço está atualmente ocupado');
      return;
    }
    toast.success(`Reserva confirmada para ${space.name} em ${selectedDate} às ${selectedTime}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reserva de Espaços</h1>
        <p className="text-gray-600">
          Reserve salas de estudo, laboratórios e espaços de núcleos em tempo real
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Data
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Hora
              </label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Tipo de Espaço
              </label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="study_room">Salas de Estudo</SelectItem>
                  <SelectItem value="lab">Laboratórios</SelectItem>
                  <SelectItem value="club_space">Espaços de Núcleos</SelectItem>
                  <SelectItem value="library">Biblioteca</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline w-4 h-4 mr-1" />
                Pesquisar
              </label>
              <Input
                placeholder="Nome ou edifício..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpaces.map((space) => (
          <Card key={space.id} className={`${!space.available ? 'opacity-75' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant={space.available ? 'default' : 'secondary'}>
                  {space.available ? 'Disponível' : 'Ocupado'}
                </Badge>
                <Badge variant="outline">{getTypeLabel(space.type)}</Badge>
              </div>
              <CardTitle className="text-lg">{space.name}</CardTitle>
              <CardDescription>
                <MapPin className="inline w-4 h-4 mr-1" />
                {space.building}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Occupancy Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      <Users className="inline w-4 h-4 mr-1" />
                      Ocupação
                    </span>
                    <span className="font-medium">
                      {space.currentOccupancy}/{space.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getOccupancyColor(
                        space.currentOccupancy,
                        space.capacity
                      )}`}
                      style={{
                        width: `${(space.currentOccupancy / space.capacity) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Comodidades:</p>
                  <div className="flex flex-wrap gap-2">
                    {space.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Reserve Button */}
                <Button
                  className="w-full"
                  disabled={!space.available}
                  onClick={() => handleReserve(space)}
                >
                  {space.available ? 'Reservar Agora' : 'Indisponível'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSpaces.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum espaço encontrado com os filtros selecionados</p>
        </div>
      )}
    </div>
  );
}
