import { useState } from 'react';
import { Award, TrendingUp, Gift, ShoppingBag, Users, AlertCircle, CheckCircle, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'earned' | 'spent';
  action: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'food' | 'merchandise' | 'services' | 'events';
  available: number;
  icon: any;
}

export function FCTTokens() {
  const [userTokens] = useState(450);
  const [tokenGoal] = useState(500);

  const earnMethods = [
    {
      action: 'Reportar Problema Validado',
      tokens: 20,
      icon: AlertCircle,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      action: 'Devolver Item (Achados & Perdidos)',
      tokens: 15,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
    {
      action: 'Ajudar Caloiro no Chat',
      tokens: 10,
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      action: 'Sessão de Mentoria',
      tokens: 10,
      icon: Star,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'earned',
      action: 'Reportação validada - AC avariado Ed. II',
      amount: 20,
      date: '2026-03-06',
      status: 'completed',
    },
    {
      id: '2',
      type: 'spent',
      action: 'Desconto 10% Cantina',
      amount: -50,
      date: '2026-03-05',
      status: 'completed',
    },
    {
      id: '3',
      type: 'earned',
      action: 'Item devolvido - Carteira preta',
      amount: 15,
      date: '2026-03-04',
      status: 'completed',
    },
    {
      id: '4',
      type: 'earned',
      action: 'Ajuda no chat - dúvida sobre CLIP',
      amount: 10,
      date: '2026-03-03',
      status: 'pending',
    },
    {
      id: '5',
      type: 'earned',
      action: 'Sessão de mentoria Python',
      amount: 10,
      date: '2026-03-02',
      status: 'completed',
    },
  ];

  const rewards: Reward[] = [
    {
      id: '1',
      title: 'Desconto 10% Cantina',
      description: 'Válido por 1 semana em qualquer refeição',
      cost: 50,
      category: 'food',
      available: 100,
      icon: ShoppingBag,
    },
    {
      id: '2',
      title: 'T-Shirt NOVA FCT',
      description: 'T-shirt oficial da faculdade',
      cost: 150,
      category: 'merchandise',
      available: 25,
      icon: Gift,
    },
    {
      id: '3',
      title: 'Acesso Prioritário Biblioteca',
      description: 'Reserva prioritária de salas de estudo por 1 mês',
      cost: 100,
      category: 'services',
      available: 50,
      icon: Star,
    },
    {
      id: '4',
      title: 'Desconto 20% Cantina',
      description: 'Válido por 2 semanas em qualquer refeição',
      cost: 80,
      category: 'food',
      available: 75,
      icon: ShoppingBag,
    },
    {
      id: '5',
      title: 'Entrada Grátis Innovation Week',
      description: 'Acesso VIP a todos os eventos da Innovation Week',
      cost: 200,
      category: 'events',
      available: 30,
      icon: Award,
    },
    {
      id: '6',
      title: 'Hoodie Associação InNov',
      description: 'Hoodie oficial da associação de estudantes',
      cost: 250,
      category: 'merchandise',
      available: 15,
      icon: Gift,
    },
    {
      id: '7',
      title: 'Café Grátis (5x)',
      description: 'Vale para 5 cafés nas máquinas do campus',
      cost: 30,
      category: 'food',
      available: 200,
      icon: ShoppingBag,
    },
    {
      id: '8',
      title: 'Acesso Sala VIP (1 dia)',
      description: 'Acesso à sala VIP com sofás e snacks',
      cost: 120,
      category: 'services',
      available: 10,
      icon: Star,
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Ana Costa', tokens: 850, avatar: 'AC' },
    { rank: 2, name: 'Pedro Almeida', tokens: 720, avatar: 'PA' },
    { rank: 3, name: 'Você', tokens: 450, avatar: 'VC', isUser: true },
    { rank: 4, name: 'Maria Silva', tokens: 380, avatar: 'MS' },
    { rank: 5, name: 'João Santos', tokens: 320, avatar: 'JS' },
  ];

  const handleRedeem = (reward: Reward) => {
    if (userTokens < reward.cost) {
      toast.error('Tokens insuficientes para esta recompensa');
      return;
    }
    toast.success(`Recompensa resgatada: ${reward.title}! -${reward.cost} tokens`);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-orange-100 text-orange-700',
      merchandise: 'bg-blue-100 text-blue-700',
      services: 'bg-purple-100 text-purple-700',
      events: 'bg-green-100 text-green-700',
    };
    return colors[category] || colors.food;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      food: 'Alimentação',
      merchandise: 'Merchandising',
      services: 'Serviços',
      events: 'Eventos',
    };
    return labels[category] || category;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">FCT Tokens</h1>
        <p className="text-gray-600">
          Sistema de recompensa por comportamento cívico e apoio mútuo
        </p>
      </div>

      {/* Token Balance Card */}
      <Card className="mb-8 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white border-0">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Award className="w-10 h-10" />
              </div>
              <div>
                <p className="text-white/90 mb-1">Seus Tokens</p>
                <p className="text-5xl font-bold">{userTokens}</p>
                <p className="text-white/90 text-sm mt-1">+50 esta semana</p>
              </div>
            </div>
            <div className="w-full md:w-64">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Próxima meta</span>
                <span className="text-sm font-semibold">{tokenGoal} tokens</span>
              </div>
              <Progress value={(userTokens / tokenGoal) * 100} className="h-3 bg-white/20" />
              <p className="text-xs text-white/80 mt-2">
                Faltam {tokenGoal - userTokens} tokens para a próxima recompensa especial
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="earn" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="earn">
            <TrendingUp className="w-4 h-4 mr-2" />
            Como Ganhar
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Gift className="w-4 h-4 mr-2" />
            Recompensas
          </TabsTrigger>
          <TabsTrigger value="history">
            <Award className="w-4 h-4 mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Users className="w-4 h-4 mr-2" />
            Ranking
          </TabsTrigger>
        </TabsList>

        {/* Earn Tab */}
        <TabsContent value="earn" className="space-y-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Como Funciona</h3>
                  <p className="text-blue-800 text-sm">
                    Ganhe FCT Tokens ajudando a comunidade estudantil! Cada ação positiva é
                    recompensada. Use seus tokens para obter descontos e benefícios no campus.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {earnMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.action}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${method.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">+{method.tokens}</div>
                        <div className="text-xs text-gray-500">tokens</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{method.action}</h3>
                    <p className="text-sm text-gray-600">
                      Contribua para a comunidade e ganhe {method.tokens} FCT Tokens
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dicas para Ganhar Mais Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Seja ativo na reportação de problemas - cada reportação validada rende 20 tokens
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Ajude colegas no chat - respostas úteis são recompensadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Devolva itens perdidos - ajude outros estudantes a recuperar seus pertences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Participe do programa de mentoria - ganhe tokens ajudando outros</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const Icon = reward.icon;
              const canAfford = userTokens >= reward.cost;
              return (
                <Card key={reward.id} className={!canAfford ? 'opacity-75' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge className={getCategoryColor(reward.category)}>
                        {getCategoryLabel(reward.category)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Custo:</span>
                        <span className="text-2xl font-bold text-orange-600">{reward.cost}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Disponíveis:</span>
                        <span>{reward.available} unidades</span>
                      </div>
                      <Button
                        className="w-full"
                        disabled={!canAfford}
                        onClick={() => handleRedeem(reward)}
                      >
                        {canAfford ? 'Resgatar' : 'Tokens Insuficientes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>
                Todas as suas transações de FCT Tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`p-2 rounded-lg ${
                          transaction.type === 'earned'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{transaction.action}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('pt-PT')}
                          </span>
                          <Badge
                            variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-xl font-bold ${
                        transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      {transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ranking FCT Tokens</CardTitle>
              <CardDescription>
                Top estudantes com mais tokens este mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      entry.isUser
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        entry.rank === 1
                          ? 'bg-yellow-400 text-yellow-900'
                          : entry.rank === 2
                          ? 'bg-gray-300 text-gray-700'
                          : entry.rank === 3
                          ? 'bg-orange-400 text-orange-900'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {entry.avatar}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${entry.isUser ? 'text-blue-900' : ''}`}>
                        {entry.name}
                      </p>
                      <p className="text-sm text-gray-600">{entry.tokens} tokens</p>
                    </div>
                    {entry.rank <= 3 && (
                      <Award
                        className={`w-6 h-6 ${
                          entry.rank === 1
                            ? 'text-yellow-500'
                            : entry.rank === 2
                            ? 'text-gray-400'
                            : 'text-orange-500'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Compete e Ganhe Prémios!
              </h3>
              <p className="text-gray-600 mb-4">
                Os top 3 estudantes do mês recebem prémios especiais da Associação InNov
              </p>
              <div className="flex justify-center gap-4">
                <Badge className="bg-yellow-400 text-yellow-900">1º - 500 tokens bónus</Badge>
                <Badge className="bg-gray-300 text-gray-700">2º - 300 tokens bónus</Badge>
                <Badge className="bg-orange-400 text-orange-900">3º - 150 tokens bónus</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
