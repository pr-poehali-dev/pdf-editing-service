import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type View = 'home' | 'editor' | 'dashboard' | 'pricing' | 'admin';

interface HomePageProps {
  isLoggedIn: boolean;
  onNavigate: (view: View) => void;
  onLogin: (asAdmin?: boolean) => void;
}

export function HomePage({ isLoggedIn, onNavigate, onLogin }: HomePageProps) {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading font-bold text-6xl mb-6 leading-tight">
              Профессиональное<br />редактирование PDF
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Редактируйте текст в PDF-файлах в реальном времени. Используйте AI-помощник для быстрых правок.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => isLoggedIn ? onNavigate('editor') : onLogin(false)}
                className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6"
              >
                <Icon name="Upload" size={20} className="mr-2" />
                Загрузить PDF
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('pricing')}
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6"
              >
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="font-heading font-bold text-4xl text-center mb-12">Возможности редактора</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-shadow border-2">
              <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Icon name="MousePointer" size={32} className="text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Клик и редактирование</h3>
              <p className="text-muted-foreground">
                Кликните на любой текст в PDF и редактируйте его прямо в документе
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow border-2">
              <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Icon name="Sparkles" size={32} className="text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">AI-помощник</h3>
              <p className="text-muted-foreground">
                Замените текст через чат с AI — просто опишите нужные изменения
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow border-2">
              <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Icon name="Download" size={32} className="text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3">Сохранение</h3>
              <p className="text-muted-foreground">
                Сохраните отредактированный PDF в исходном качестве
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="font-heading font-bold text-4xl text-center mb-12">Как это работает</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6 flex items-start gap-4 border-l-4 border-l-accent">
              <div className="bg-accent text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-2">Загрузите PDF-файл</h3>
                <p className="text-muted-foreground">Выберите документ с вашего компьютера</p>
              </div>
            </Card>

            <Card className="p-6 flex items-start gap-4 border-l-4 border-l-accent">
              <div className="bg-accent text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-2">Редактируйте текст</h3>
                <p className="text-muted-foreground">Кликните на текст и измените его, или используйте AI-чат</p>
              </div>
            </Card>

            <Card className="p-6 flex items-start gap-4 border-l-4 border-l-accent">
              <div className="bg-accent text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-2">Сохраните результат</h3>
                <p className="text-muted-foreground">Скачайте готовый PDF с изменениями</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
