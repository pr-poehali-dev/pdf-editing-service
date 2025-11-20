import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface PricingPageProps {
  tariffPrice: string;
  cryptoWallet: string;
  isLoggedIn: boolean;
  onLogin: (asAdmin?: boolean) => void;
}

export function PricingPage({ tariffPrice, cryptoWallet, isLoggedIn, onLogin }: PricingPageProps) {
  return (
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
                onLogin(false);
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
}
