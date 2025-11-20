import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

type View = 'home' | 'editor' | 'dashboard' | 'pricing' | 'admin';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
}

function Index() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([
    { id: '1', text: 'Образец текста 1', x: 50, y: 100 },
    { id: '2', text: 'Образец текста 2', x: 50, y: 200 },
    { id: '3', text: 'Образец текста 3', x: 50, y: 300 }
  ]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [tariffPrice, setTariffPrice] = useState('29.99');
  const [cryptoWallet, setCryptoWallet] = useState('');

  const handleLogin = (asAdmin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(asAdmin);
    setCurrentView(asAdmin ? 'admin' : 'dashboard');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleTextEdit = (id: string, newText: string) => {
    setTextElements(prev =>
      prev.map(el => el.id === id ? { ...el, text: newText } : el)
    );
  };

  const handleAiEdit = () => {
    if (aiPrompt.trim()) {
      const newElements = textElements.map(el => ({
        ...el,
        text: el.text.replace(/текста/g, aiPrompt)
      }));
      setTextElements(newElements);
      setAiPrompt('');
    }
  };

  const renderNavigation = () => (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={28} className="text-accent" />
            <span className="font-heading font-bold text-2xl">PDF Editor Pro</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentView('home')}
              className="hover:text-accent transition-colors font-medium"
            >
              Главная
            </button>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => setCurrentView('editor')}
                  className="hover:text-accent transition-colors font-medium"
                >
                  Редактор
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="hover:text-accent transition-colors font-medium"
                >
                  Кабинет
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentView('pricing')}
              className="hover:text-accent transition-colors font-medium"
            >
              Тарифы
            </button>
            {isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className="hover:text-accent transition-colors font-medium"
              >
                Админ
              </button>
            )}
            {!isLoggedIn ? (
              <Button
                onClick={() => handleLogin(false)}
                className="bg-accent hover:bg-accent/90"
              >
                Войти
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsLoggedIn(false);
                  setIsAdmin(false);
                  setCurrentView('home');
                }}
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-white"
              >
                Выйти
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderHome = () => (
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
                onClick={() => isLoggedIn ? setCurrentView('editor') : handleLogin(false)}
                className="bg-accent hover:bg-accent/90 text-white text-lg px-8 py-6"
              >
                <Icon name="Upload" size={20} className="mr-2" />
                Загрузить PDF
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentView('pricing')}
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

  const renderEditor = () => (
    <div className="container mx-auto px-6 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-3xl mb-2">PDF Редактор</h1>
        <p className="text-muted-foreground">Загрузите файл и начните редактирование</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            {!pdfFile ? (
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-accent transition-colors">
                <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-heading font-semibold text-xl mb-2">Загрузите PDF-файл</h3>
                <p className="text-muted-foreground mb-4">или перетащите файл сюда</p>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="max-w-xs mx-auto"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <Icon name="FileText" size={24} className="text-accent" />
                    <span className="font-medium">{pdfFile.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPdfFile(null)}
                  >
                    <Icon name="X" size={16} className="mr-1" />
                    Закрыть
                  </Button>
                </div>

                <div className="bg-white border-2 rounded-lg p-8 min-h-[600px] relative">
                  {textElements.map(element => (
                    <div
                      key={element.id}
                      className="absolute cursor-pointer hover:bg-accent/10 p-2 rounded transition-colors"
                      style={{ left: element.x, top: element.y }}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      {selectedElement === element.id ? (
                        <Input
                          value={element.text}
                          onChange={(e) => handleTextEdit(element.id, e.target.value)}
                          onBlur={() => setSelectedElement(null)}
                          autoFocus
                          className="w-auto"
                        />
                      ) : (
                        <span className="text-foreground">{element.text}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button className="bg-accent hover:bg-accent/90">
                    <Icon name="Download" size={16} className="mr-2" />
                    Сохранить PDF
                  </Button>
                  <Button variant="outline">
                    <Icon name="RotateCcw" size={16} className="mr-2" />
                    Отменить
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Sparkles" size={24} className="text-accent" />
              <h3 className="font-heading font-bold text-xl">AI-помощник</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Опишите какой текст нужно заменить
            </p>
            <div className="space-y-4">
              <Textarea
                placeholder="Например: замени 'текста' на 'документа'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleAiEdit}
                className="w-full bg-accent hover:bg-accent/90"
                disabled={!aiPrompt.trim()}
              >
                <Icon name="Wand2" size={16} className="mr-2" />
                Применить изменения
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-3">Быстрые действия</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Icon name="Type" size={16} className="mr-2" />
                  Изменить шрифт
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Icon name="Palette" size={16} className="mr-2" />
                  Изменить цвет
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Icon name="AlignLeft" size={16} className="mr-2" />
                  Выровнять текст
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
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
            onClick={() => setCurrentView('editor')}
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
                  onClick={() => setCurrentView('editor')}
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
          <Button variant="outline" onClick={() => setCurrentView('pricing')}>
            Управление
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderPricing = () => (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="font-heading font-bold text-4xl mb-4">Тарифы</h1>
        <p className="text-xl text-muted-foreground">Профессиональное редактирование PDF без ограничений</p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="p-8 border-2 border-accent shadow-xl">
          <div className="text-center mb-6">
            <Badge className="bg-accent mb-4">Единственный тариф</Badge>
            <div className="font-heading font-bold text-5xl mb-2">
              ${tariffPrice}
              <span className="text-lg text-muted-foreground font-normal">/месяц</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-accent flex-shrink-0 mt-1" />
              <span>Безлимитное редактирование PDF</span>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-accent flex-shrink-0 mt-1" />
              <span>AI-помощник для быстрых правок</span>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-accent flex-shrink-0 mt-1" />
              <span>Хранилище документов</span>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-accent flex-shrink-0 mt-1" />
              <span>Экспорт в высоком качестве</span>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="Check" size={20} className="text-accent flex-shrink-0 mt-1" />
              <span>Приоритетная поддержка</span>
            </div>
          </div>

          <Button
            className="w-full bg-accent hover:bg-accent/90 text-lg py-6"
            onClick={() => {
              if (!isLoggedIn) {
                handleLogin(false);
              }
            }}
          >
            <Icon name="CreditCard" size={20} className="mr-2" />
            Оплатить USDT
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Оплата через криптовалюту USDT</p>
            {cryptoWallet && (
              <p className="text-xs font-mono bg-muted p-2 rounded">{cryptoWallet}</p>
            )}
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <Icon name="Shield" size={16} className="inline mr-1" />
            Безопасная оплата через блокчейн
          </p>
        </div>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="container mx-auto px-6 py-8 animate-fade-in">
      <h1 className="font-heading font-bold text-3xl mb-6">Админ-панель</h1>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pricing">Тарифы</TabsTrigger>
          <TabsTrigger value="payments">Оплата</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <Card className="p-6">
            <h2 className="font-heading font-bold text-xl mb-4">Управление тарифом</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="price">Стоимость тарифа (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={tariffPrice}
                  onChange={(e) => setTariffPrice(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Статус тарифа</p>
                  <p className="text-sm text-muted-foreground">Доступен для покупки</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="bg-accent hover:bg-accent/90">
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить изменения
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="p-6">
            <h2 className="font-heading font-bold text-xl mb-4">Реквизиты USDT</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="wallet">USDT кошелек (TRC20)</Label>
                <Input
                  id="wallet"
                  value={cryptoWallet}
                  onChange={(e) => setCryptoWallet(e.target.value)}
                  placeholder="TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="mt-2 font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Укажите адрес кошелька для приема платежей
                </p>
              </div>

              <Button className="bg-accent hover:bg-accent/90">
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить кошелек
              </Button>
            </div>
          </Card>

          <Card className="p-6 mt-6">
            <h2 className="font-heading font-bold text-xl mb-4">Последние платежи</h2>
            <div className="space-y-3">
              {[
                { user: 'user@example.com', amount: '29.99', date: '20.11.2024' },
                { user: 'client@test.com', amount: '29.99', date: '19.11.2024' },
                { user: 'demo@mail.com', amount: '29.99', date: '18.11.2024' }
              ].map((payment, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{payment.user}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <Badge variant="outline" className="text-accent border-accent">
                    ${payment.amount}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-6 mt-6">
        <h2 className="font-heading font-bold text-xl mb-4">Статистика</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Пользователей</p>
            <p className="font-heading font-bold text-2xl">247</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Активных</p>
            <p className="font-heading font-bold text-2xl">189</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Документов</p>
            <p className="font-heading font-bold text-2xl">1,423</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Доход (мес)</p>
            <p className="font-heading font-bold text-2xl">$5,667</p>
          </div>
        </div>
      </Card>

      <div className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg flex items-start gap-3">
        <Icon name="Key" size={20} className="text-accent flex-shrink-0 mt-1" />
        <div>
          <p className="font-medium text-accent mb-1">Админский вход</p>
          <p className="text-sm">Используйте специальную кнопку "Админ" в навигации для входа в панель управления</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderNavigation()}
      {currentView === 'home' && renderHome()}
      {currentView === 'editor' && renderEditor()}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'pricing' && renderPricing()}
      {currentView === 'admin' && renderAdmin()}
    </div>
  );
}

export default Index;