import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type View = 'home' | 'editor' | 'dashboard' | 'pricing' | 'admin';

interface NavigationProps {
  currentView: View;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onNavigate: (view: View) => void;
  onLogin: (asAdmin?: boolean) => void;
  onLogout: () => void;
}

export function Navigation({ currentView, isLoggedIn, isAdmin, onNavigate, onLogin, onLogout }: NavigationProps) {
  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={28} className="text-accent" />
            <span className="font-heading font-bold text-2xl">PDF Editor Pro</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-accent transition-colors font-medium"
            >
              Главная
            </button>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => onNavigate('editor')}
                  className="hover:text-accent transition-colors font-medium"
                >
                  Редактор
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-accent transition-colors font-medium"
                >
                  Кабинет
                </button>
              </>
            )}
            <button
              onClick={() => onNavigate('pricing')}
              className="hover:text-accent transition-colors font-medium"
            >
              Тарифы
            </button>
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="hover:text-accent transition-colors font-medium"
              >
                Админ
              </button>
            )}
            {!isLoggedIn ? (
              <Button
                onClick={() => onLogin(false)}
                className="bg-accent hover:bg-accent/90"
              >
                Войти
              </Button>
            ) : (
              <Button
                onClick={onLogout}
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
}
