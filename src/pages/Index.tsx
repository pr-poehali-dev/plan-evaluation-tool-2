import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface AdditionalMetric {
  id: string;
  name: string;
  plan: number;
  fact: number;
}

const Index = () => {
  const [mainPlan, setMainPlan] = useState<number>(80000);
  const [mainFact, setMainFact] = useState<number>(30000);
  const [employeeCount, setEmployeeCount] = useState<number>(1);
  const [additionalMetrics, setAdditionalMetrics] = useState<AdditionalMetric[]>([
    { id: '1', name: 'Показатель 1', plan: 100, fact: 75 },
    { id: '2', name: 'Показатель 2', plan: 200, fact: 180 },
    { id: '3', name: 'Показатель 3', plan: 150, fact: 120 }
  ]);

  const calculatePercentage = (fact: number, plan: number): number => {
    if (plan === 0) return 0;
    return (fact / plan) * 100;
  };

  const calculateGrade = (percentage: number): number => {
    if (percentage >= 0 && percentage <= 10) return 0;
    if (percentage >= 11 && percentage <= 35) return 1;
    if (percentage >= 36 && percentage <= 50) return 2;
    if (percentage >= 51 && percentage <= 65) return 3;
    if (percentage >= 66 && percentage <= 79) return 4;
    if (percentage >= 80 && percentage <= 100) return 5;
    return 5;
  };

  const mainPercentage = calculatePercentage(mainFact, mainPlan);
  const mainGrade = calculateGrade(mainPercentage);

  const additionalPercentages = additionalMetrics.map(metric => 
    calculatePercentage(metric.fact, metric.plan)
  );
  const avgAdditionalPercentage = additionalPercentages.reduce((acc, val) => acc + val, 0) / additionalPercentages.length;
  const bonusPercentagePerEmployee = employeeCount > 0 ? avgAdditionalPercentage / employeeCount : 0;

  const finalPercentage = Math.min(mainPercentage + bonusPercentagePerEmployee, 100);
  const finalGrade = calculateGrade(finalPercentage);

  const getGradeColor = (grade: number): string => {
    const colors = [
      'text-red-500',
      'text-orange-500',
      'text-yellow-500',
      'text-lime-500',
      'text-green-500',
      'text-emerald-500'
    ];
    return colors[grade] || colors[5];
  };

  const updateAdditionalMetric = (id: string, field: 'plan' | 'fact', value: number) => {
    setAdditionalMetrics(prev => 
      prev.map(metric => 
        metric.id === id ? { ...metric, [field]: value } : metric
      )
    );
  };

  const addMetric = () => {
    const newId = (additionalMetrics.length + 1).toString();
    setAdditionalMetrics([
      ...additionalMetrics,
      { id: newId, name: `Показатель ${newId}`, plan: 0, fact: 0 }
    ]);
  };

  const removeMetric = (id: string) => {
    setAdditionalMetrics(prev => prev.filter(metric => metric.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Панель управления
            </h1>
            <p className="text-muted-foreground">
              Автоматический расчет выполнения плана
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-primary">
            <Icon name="Activity" size={32} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all animate-scale-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Target" size={16} />
                Основная оценка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-5xl font-bold ${getGradeColor(mainGrade)}`}>
                {mainGrade}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {mainPercentage.toFixed(1)}% выполнения
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-secondary/20 hover:border-secondary/40 transition-all animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="TrendingUp" size={16} />
                Итоговая оценка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-5xl font-bold ${getGradeColor(finalGrade)}`}>
                {finalGrade}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {finalPercentage.toFixed(1)}% с бонусом
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-accent/20 hover:border-accent/40 transition-all animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Users" size={16} />
                Бонус на сотрудника
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-accent">
                +{bonusPercentagePerEmployee.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Из {avgAdditionalPercentage.toFixed(1)}% общих
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Calculator" size={20} />
                Основной расчет
              </CardTitle>
              <CardDescription>
                Сравнение плана и факта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mainPlan">План</Label>
                  <Input
                    id="mainPlan"
                    type="number"
                    value={mainPlan}
                    onChange={(e) => setMainPlan(Number(e.target.value))}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mainFact">Факт</Label>
                  <Input
                    id="mainFact"
                    type="number"
                    value={mainFact}
                    onChange={(e) => setMainFact(Number(e.target.value))}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Процент выполнения</span>
                  <span className="text-2xl font-bold text-primary">{mainPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={Math.min(mainPercentage, 100)} 
                  className="h-3"
                />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">Оценка</span>
                  <span className={`text-3xl font-bold ${getGradeColor(mainGrade)}`}>
                    {mainGrade}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeCount">Количество сотрудников</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  min="1"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Math.max(1, Number(e.target.value)))}
                  className="text-lg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-secondary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart3" size={20} />
                    Дополнительные показатели
                  </CardTitle>
                  <CardDescription>
                    Расчет бонусного процента
                  </CardDescription>
                </div>
                <Button onClick={addMetric} size="sm" variant="outline">
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {additionalMetrics.map((metric) => (
                <div key={metric.id} className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{metric.name}</span>
                    {additionalMetrics.length > 1 && (
                      <Button 
                        onClick={() => removeMetric(metric.id)} 
                        size="sm" 
                        variant="ghost"
                        className="h-6 w-6 p-0"
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">План</Label>
                      <Input
                        type="number"
                        value={metric.plan}
                        onChange={(e) => updateAdditionalMetric(metric.id, 'plan', Number(e.target.value))}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Факт</Label>
                      <Input
                        type="number"
                        value={metric.fact}
                        onChange={(e) => updateAdditionalMetric(metric.id, 'fact', Number(e.target.value))}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Выполнение</span>
                    <span className="font-bold text-primary">
                      {calculatePercentage(metric.fact, metric.plan).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(calculatePercentage(metric.fact, metric.plan), 100)} 
                    className="h-2"
                  />
                </div>
              ))}

              <div className="space-y-3 p-4 bg-accent/10 rounded-lg border-2 border-accent/30 mt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Средний процент</span>
                  <span className="text-2xl font-bold text-accent">
                    {avgAdditionalPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Бонус на 1 сотрудника</span>
                  <span className="text-xl font-bold text-accent">
                    +{bonusPercentagePerEmployee.toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Award" size={24} />
              Итоговый результат
            </CardTitle>
            <CardDescription>
              Финальная оценка с учетом всех показателей
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground">Основной процент</span>
                  <span className="text-xl font-bold">{mainPercentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-muted-foreground">Бонусный процент</span>
                  <span className="text-xl font-bold text-accent">+{bonusPercentagePerEmployee.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary/30">
                  <span className="font-bold text-lg">Итоговый процент</span>
                  <span className="text-3xl font-bold text-primary">{finalPercentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-8 bg-background/50 rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground mb-3">Финальная оценка</p>
                  <div className={`text-8xl font-bold ${getGradeColor(finalGrade)} mb-3`}>
                    {finalGrade}
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full">
                    <Icon name="TrendingUp" size={20} className="text-accent" />
                    <span className="font-medium text-accent">
                      {finalGrade >= mainGrade ? 'Улучшено' : 'Базовая оценка'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
