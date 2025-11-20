import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/components/HomePage';
import { EditorPage } from '@/components/EditorPage';
import { DashboardPage } from '@/components/DashboardPage';
import { PricingPage } from '@/components/PricingPage';
import { AdminPage } from '@/components/AdminPage';

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentView('home');
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentView={currentView}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onNavigate={setCurrentView}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      {currentView === 'home' && (
        <HomePage
          isLoggedIn={isLoggedIn}
          onNavigate={setCurrentView}
          onLogin={handleLogin}
        />
      )}
      
      {currentView === 'editor' && (
        <EditorPage
          pdfFile={pdfFile}
          textElements={textElements}
          selectedElement={selectedElement}
          aiPrompt={aiPrompt}
          onFileUpload={handleFileUpload}
          onTextEdit={handleTextEdit}
          onSelectElement={setSelectedElement}
          onAiPromptChange={setAiPrompt}
          onAiEdit={handleAiEdit}
          onCloseFile={() => setPdfFile(null)}
        />
      )}
      
      {currentView === 'dashboard' && (
        <DashboardPage onNavigate={setCurrentView} />
      )}
      
      {currentView === 'pricing' && (
        <PricingPage
          tariffPrice={tariffPrice}
          cryptoWallet={cryptoWallet}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
        />
      )}
      
      {currentView === 'admin' && (
        <AdminPage
          tariffPrice={tariffPrice}
          cryptoWallet={cryptoWallet}
          onTariffPriceChange={setTariffPrice}
          onCryptoWalletChange={setCryptoWallet}
        />
      )}
    </div>
  );
}

export default Index;
