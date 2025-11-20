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



  const extractTextFromPDF = async (file: File) => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const extractedElements: TextElement[] = [];
      let elementId = 1;
      const scale = 1.5;
      
      for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 5); pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        const textContent = await page.getTextContent();
        
        const pageGap = 20;
        const pageOffsetY = (pageNum - 1) * (viewport.height + pageGap);
        
        textContent.items.forEach((item: any) => {
          if (item.str && item.str.trim()) {
            const tx = item.transform;
            
            const x = tx[4] * scale;
            const y = (viewport.height - (tx[5] * scale)) + pageOffsetY;
            
            const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
            const fontSize = fontHeight * scale;
            
            extractedElements.push({
              id: `${elementId++}`,
              text: item.str,
              x: x,
              y: y - fontSize,
              fontSize: fontSize,
              fontFamily: item.fontName || 'sans-serif',
              fontWeight: (item.fontName?.toLowerCase().includes('bold')) ? 'bold' : 'normal',
              width: item.width * scale,
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
      const lines = aiPrompt.toLowerCase().split(/заменить|замени|поменять|измени/);
      
      if (lines.length >= 2) {
        const parts = lines[1].split(/на/);
        if (parts.length >= 2) {
          const searchText = parts[0].trim().replace(/["'«»]/g, '');
          const replaceText = parts[1].trim().replace(/["'«»]/g, '');
          
          const updatedElements = textElements.map(el => ({
            ...el,
            text: el.text.replace(new RegExp(searchText, 'gi'), replaceText)
          }));
          
          setTextElements(updatedElements);
          setBulkEditText(updatedElements.map(el => el.text).join('\n'));
        }
      }
      
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