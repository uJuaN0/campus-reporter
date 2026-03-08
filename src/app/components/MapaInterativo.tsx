import { useState } from 'react';
import { MapPin, Navigation, Search, Building2, Train } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface Location {
  id: string;
  name: string;
  building: string;
  floor: string;
  category: 'departamento' | 'sala' | 'servico' | 'outro';
  coordinates: { x: number; y: number };
}

export function MapaInterativo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const locations: Location[] = [
    {
      id: '1',
      name: 'Biblioteca',
      building: 'Biblioteca',
      floor: 'Piso 0, 1, 2',
      category: 'servico',
      coordinates: { x: 50, y: 30 },
    },
    {
      id: '2',
      name: 'Departamento de Informática',
      building: 'Edifício II',
      floor: '2º Piso',
      category: 'departamento',
      coordinates: { x: 70, y: 40 },
    },
    {
      id: '3',
      name: 'Cantina',
      building: 'Cantina',
      floor: 'Piso 0',
      category: 'servico',
      coordinates: { x: 30, y: 60 },
    },
    {
      id: '4',
      name: 'Sala 203',
      building: 'Edifício II',
      floor: '2º Piso',
      category: 'sala',
      coordinates: { x: 65, y: 35 },
    },
    {
      id: '5',
      name: 'Divisão Académica',
      building: 'Edifício VII',
      floor: 'Piso 0',
      category: 'servico',
      coordinates: { x: 80, y: 55 },
    },
    {
      id: '6',
      name: 'Laboratório de Química',
      building: 'Edifício V',
      floor: '1º Piso',
      category: 'departamento',
      coordinates: { x: 45, y: 50 },
    },
    {
      id: '7',
      name: 'Associação de Estudantes',
      building: 'Edifício VII',
      floor: 'Piso 0',
      category: 'servico',
      coordinates: { x: 75, y: 60 },
    },
  ];

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGetDirections = (location: Location) => {
    toast.success(`Rota para ${location.name} calculada! Partida: Entrada Principal`);
    setSelectedLocation(location);
  };

  const handleStartFromStation = () => {
    toast.success('Rota calculada a partir da Estação de Monte da Caparica');
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      departamento: 'bg-blue-500',
      sala: 'bg-green-500',
      servico: 'bg-purple-500',
      outro: 'bg-gray-500',
    };
    return colors[category] || colors.outro;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa Interativo FCT</h1>
        <p className="text-gray-600">
          Encontre qualquer sala, departamento ou serviço no campus com rotas de navegação
        </p>
      </div>

      {/* Quick Access */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Train className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Vindo da Estação MST?</h3>
                <p className="text-gray-600 text-sm">
                  Obtenha direções desde a estação de Monte da Caparica
                </p>
              </div>
            </div>
            <Button onClick={handleStartFromStation}>
              <Navigation className="w-4 h-4 mr-2" />
              Rota da Estação
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search and List */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pesquisar Localização</CardTitle>
              <CardDescription>
                Encontre edifícios, salas ou departamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  className="pl-10"
                  placeholder="Ex: Biblioteca, Sala 203..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedLocation?.id === location.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{location.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(location.category)}`} />
                    </div>
                    <p className="text-xs text-gray-600">
                      {location.building} · {location.floor}
                    </p>
                    {selectedLocation?.id === location.id && (
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetDirections(location);
                        }}
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        Como Chegar
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {filteredLocations.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-4">
                  Nenhuma localização encontrada
                </p>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Legenda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-sm">Departamentos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-sm">Salas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  <span className="text-sm">Serviços</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Campus NOVA FCT</CardTitle>
              {selectedLocation && (
                <Badge className="w-fit">
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedLocation.name}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3]">
                {/* Simplified Campus Map */}
                <div className="absolute inset-0 p-8">
                  {/* Buildings */}
                  <div className="absolute top-1/4 left-1/4 w-24 h-32 bg-blue-200 border-2 border-blue-400 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-800">Ed. I</span>
                  </div>
                  <div className="absolute top-1/3 left-1/2 w-28 h-36 bg-blue-200 border-2 border-blue-400 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-800">Ed. II</span>
                  </div>
                  <div className="absolute bottom-1/4 left-1/3 w-32 h-24 bg-green-200 border-2 border-green-400 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-green-800">Cantina</span>
                  </div>
                  <div className="absolute top-1/4 right-1/4 w-28 h-40 bg-purple-200 border-2 border-purple-400 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-purple-800">Biblioteca</span>
                  </div>

                  {/* Location Markers */}
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className={`absolute w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                        selectedLocation?.id === location.id
                          ? 'scale-150 z-10'
                          : 'hover:scale-125'
                      } ${getCategoryColor(location.category)}`}
                      style={{
                        left: `${location.coordinates.x}%`,
                        top: `${location.coordinates.y}%`,
                      }}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                  ))}

                  {/* Entrance Marker */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      Entrada Principal
                    </div>
                  </div>

                  {/* Path to selected location */}
                  {selectedLocation && (
                    <svg className="absolute inset-0 pointer-events-none">
                      <line
                        x1="50%"
                        y1="90%"
                        x2={`${selectedLocation.coordinates.x}%`}
                        y2={`${selectedLocation.coordinates.y}%`}
                        stroke="#3B82F6"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {selectedLocation && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Rota para {selectedLocation.name}
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>1. Sair da Entrada Principal</p>
                    <p>2. Seguir em direção ao {selectedLocation.building}</p>
                    <p>3. {selectedLocation.floor}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
