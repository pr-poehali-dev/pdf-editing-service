import { useState, useEffect } from 'react';
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
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  width: number;
  height: number;
}

function Index() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkEditText, setBulkEditText] = useState('');
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      
      await extractTextFromPDF(file);
    }
  };

  const handleBulkEdit = () => {
    if (bulkEditMode) {
      const lines = bulkEditText.split('\n');
      const updatedElements = textElements.map((el, index) => {
        if (lines[index] !== undefined) {
          return { ...el, text: lines[index] };
        }
        return el;
      });
      setTextElements(updatedElements);
      setBulkEditMode(false);
    } else {
      const allText = textElements.map(el => el.text).join('\n');
      setBulkEditText(allText);
      setBulkEditMode(true);
    }
  };

  const handleElementDrag = (id: string, newX: number, newY: number) => {
    setTextElements(prev =>
      prev.map(el => el.id === id ? { ...el, x: newX, y: newY } : el)
    );
  };

  const extractTextFromPDF = async (file: File) => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const extractedElements: TextElement[] = [];
      let elementId = 1;
      
      for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 5); pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const textContent = await page.getTextContent();
        
        textContent.items.forEach((item: any) => {
          if (item.str && item.str.trim()) {
            const transform = item.transform;
            const fontSize = Math.sqrt(transform[0] * transform[0] + transform[1] * transform[1]);
            const fontFamily = item.fontName || 'Arial';
            
            extractedElements.push({
              id: `${elementId++}`,
              text: item.str,
              x: transform[4] * 1.5,
              y: (viewport.height - transform[5] * 1.5) + ((pageNum - 1) * (viewport.height + 20)),
              fontSize: fontSize,
              fontFamily: fontFamily,
              fontWeight: item.fontName?.includes('Bold') ? 'bold' : 'normal',
              width: item.width * 1.5 || 100,
              height: fontSize
            });
          }
        });
      }
      
      if (extractedElements.length > 0) {
        setTextElements(extractedElements);
        const allText = extractedElements.map(el => el.text).join('\n');
        setBulkEditText(allText);
      }
    } catch (error) {
      console.error('Ошибка при чтении PDF:', error);
    }
  };

  const handleTextEdit = (id: string, newText: string) => {
    setTextElements(prev =>
      prev.map(el => el.id === id ? { ...el, text: newText } : el)
    );
  };

  const handleAiEdit = () => {
    if (aiPrompt.trim()) {
      const allText = textElements.map(el => el.text).join(' ');
      const modifiedText = allText + ' ' + aiPrompt;
      
      const words = modifiedText.split(' ');
      const updatedElements = textElements.map((el, index) => {
        if (words[index]) {
          return { ...el, text: words[index] };
        }
        return el;
      });
      
      setTextElements(updatedElements);
      setBulkEditText(updatedElements.map(el => el.text).join('\n'));
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
          bulkEditMode={bulkEditMode}
          bulkEditText={bulkEditText}
          onFileUpload={handleFileUpload}
          onTextEdit={handleTextEdit}
          onSelectElement={setSelectedElement}
          onAiPromptChange={setAiPrompt}
          onAiEdit={handleAiEdit}
          onCloseFile={() => setPdfFile(null)}
          onBulkEdit={handleBulkEdit}
          onBulkEditTextChange={setBulkEditText}
          onElementDrag={handleElementDrag}
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