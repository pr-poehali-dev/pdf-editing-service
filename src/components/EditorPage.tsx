import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

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

interface EditorPageProps {
  pdfFile: File | null;
  textElements: TextElement[];
  selectedElement: string | null;
  aiPrompt: string;
  bulkEditMode: boolean;
  bulkEditText: string;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextEdit: (id: string, newText: string) => void;
  onSelectElement: (id: string | null) => void;
  onAiPromptChange: (prompt: string) => void;
  onAiEdit: () => void;
  onCloseFile: () => void;
  onBulkEdit: () => void;
  onBulkEditTextChange: (text: string) => void;
  onSavePDF: () => void;
}

export function EditorPage({
  pdfFile,
  textElements,
  selectedElement,
  aiPrompt,
  bulkEditMode,
  bulkEditText,
  onFileUpload,
  onTextEdit,
  onSelectElement,
  onAiPromptChange,
  onAiEdit,
  onCloseFile,
  onBulkEdit,
  onBulkEditTextChange,
  onSavePDF
}: EditorPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (pdfFile && canvasRef.current) {
      renderPDF();
    }
  }, [pdfFile]);

  const renderPDF = async () => {
    if (!pdfFile || !canvasRef.current) return;

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        let totalHeight = 0;
        const scale = 1.5;
        const pageGap = 20;
        
        const numPages = Math.min(pdf.numPages, 5);
        
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          totalHeight += viewport.height + (i < numPages ? pageGap : 0);
        }
        
        const firstPage = await pdf.getPage(1);
        const firstViewport = firstPage.getViewport({ scale });
        
        canvas.height = totalHeight;
        canvas.width = firstViewport.width;
        
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        let yOffset = 0;
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });
          
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = viewport.width;
          tempCanvas.height = viewport.height;
          const tempContext = tempCanvas.getContext('2d');
          
          if (tempContext) {
            await page.render({
              canvasContext: tempContext,
              viewport: viewport,
              intent: 'display'
            }).promise;
            
            const imageData = tempContext.getImageData(0, 0, viewport.width, viewport.height);
            const data = imageData.data;
            
            for (let j = 0; j < data.length; j += 4) {
              const r = data[j];
              const g = data[j + 1];
              const b = data[j + 2];
              const brightness = (r + g + b) / 3;
              
              if (brightness < 250 && (r < 50 && g < 50 && b < 50)) {
                data[j] = 255;
                data[j + 1] = 255;
                data[j + 2] = 255;
              }
            }
            
            tempContext.putImageData(imageData, 0, 0);
            context.drawImage(tempCanvas, 0, yOffset);
          }
          
          yOffset += viewport.height + pageGap;
        }
      }
    } catch (error) {
      console.error('Ошибка рендеринга PDF:', error);
    }
  };


  return (
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
                  onChange={onFileUpload}
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
                    onClick={onCloseFile}
                  >
                    <Icon name="X" size={16} className="mr-1" />
                    Закрыть
                  </Button>
                </div>

                {bulkEditMode ? (
                  <div className="bg-white border-2 rounded-lg p-4">
                    <Textarea
                      value={bulkEditText}
                      onChange={(e) => onBulkEditTextChange(e.target.value)}
                      className="w-full h-[600px] font-mono text-sm"
                      placeholder="Редактируйте весь текст документа построчно..."
                    />
                  </div>
                ) : (
                  <div className="bg-white border-2 rounded-lg overflow-auto max-h-[700px] relative">
                    <canvas ref={canvasRef} className="w-full" />
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                      {textElements.map(element => (
                        <div
                          key={element.id}
                          className="absolute cursor-pointer hover:bg-blue-100/20 pointer-events-auto"
                          style={{ 
                            left: `${element.x}px`, 
                            top: `${element.y}px`,
                            fontSize: `${element.fontSize}px`,
                            fontFamily: element.fontFamily,
                            fontWeight: element.fontWeight,
                            color: '#000000',
                            whiteSpace: 'pre',
                            lineHeight: '1'
                          }}
                          onClick={() => onSelectElement(element.id)}
                        >
                          {selectedElement === element.id ? (
                            <input
                              value={element.text}
                              onChange={(e) => onTextEdit(element.id, e.target.value)}
                              onBlur={() => onSelectElement(null)}
                              autoFocus
                              className="bg-yellow-50 border-2 border-blue-500 outline-none"
                              style={{
                                fontSize: `${element.fontSize}px`,
                                fontFamily: element.fontFamily,
                                fontWeight: element.fontWeight,
                                width: `${Math.max(element.width, element.text.length * element.fontSize * 0.55)}px`,
                                color: '#000000',
                                padding: '0',
                                lineHeight: '1'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="select-none">{element.text}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button 
                    onClick={onBulkEdit}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Icon name={bulkEditMode ? "Check" : "Edit"} size={16} className="mr-2" />
                    {bulkEditMode ? 'Применить изменения' : 'Редактировать весь текст'}
                  </Button>
                  <Button 
                    onClick={onSavePDF}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-white"
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать PDF
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
              AI прочитал весь текст из PDF. Попросите заменить любую фразу.
            </p>
            <div className="space-y-4">
              <Textarea
                placeholder="Замени 'старый текст' на 'новый текст'"
                value={aiPrompt}
                onChange={(e) => onAiPromptChange(e.target.value)}
                rows={4}
              />
              <Button
                onClick={onAiEdit}
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
}