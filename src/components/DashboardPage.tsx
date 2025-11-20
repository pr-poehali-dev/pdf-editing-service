import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type View = 'home' | 'editor' | 'dashboard' | 'pricing' | 'admin';

interface DashboardPageProps {
  onNavigate: (view: View) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div className="container mx-auto px-6 py-8 animate-fade-in">
      <h1 className="font-heading font-bold text-3xl mb-6">Личный кабинет</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-accent/10 p-3 rounded-lg">
              <Icon name="FileText" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Документов</p>
              <p className="font-heading font-bold text-2xl">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-accent/10 p-3 rounded-lg">
              <Icon name="Clock" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Дней осталось</p>
              <p className="font-heading font-bold text-2xl">23</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-accent/10 p-3 rounded-lg">
              <Icon name="Zap" size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI запросов</p>
              <p className="font-heading font-bold text-2xl">47</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-xl">Мои документы</h2>
          <Button
            onClick={() => onNavigate('editor')}
            className="bg-accent hover:bg-accent/90"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Новый документ
          </Button>
        </div>

        <div className="space-y-3">
          {['Договор_2024.pdf', 'Презентация.pdf', 'Отчет_Q4.pdf'].map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border rounded-lg hover:border-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon name="FileText" size={20} className="text-accent" />
                <div>
                  <p className="font-medium">{doc}</p>
                  <p className="text-sm text-muted-foreground">Изменено 2 часа назад</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('editor')}
                >
                  <Icon name="Edit" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="Download" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="Trash2" size={16} className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading font-bold text-xl mb-4">Подписка</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent">Активна</Badge>
              <span className="font-medium">Стандартный тариф</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Следующее списание: 15 декабря 2024
            </p>
          </div>
          <Button variant="outline" onClick={() => onNavigate('pricing')}>
            Управление
          </Button>
        </div>
      </Card>
    </div>
  );
}
