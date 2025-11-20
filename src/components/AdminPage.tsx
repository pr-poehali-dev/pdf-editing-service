import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface AdminPageProps {
  tariffPrice: string;
  cryptoWallet: string;
  onTariffPriceChange: (price: string) => void;
  onCryptoWalletChange: (wallet: string) => void;
}

export function AdminPage({ tariffPrice, cryptoWallet, onTariffPriceChange, onCryptoWalletChange }: AdminPageProps) {
  return (
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
                  onChange={(e) => onTariffPriceChange(e.target.value)}
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
                  onChange={(e) => onCryptoWalletChange(e.target.value)}
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
}
