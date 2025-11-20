import { useEffect, useRef } from 'react';
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
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextEdit: (id: string, newText: string) => void;
  onSelectElement: (id: string | null) => void;
  onAiPromptChange: (prompt: string) => void;
  onAiEdit: () => void;
  onCloseFile: () => void;
}

export function EditorPage({
  pdfFile,
  textElements,
  selectedElement,
  aiPrompt,
  onFileUpload,
  onTextEdit,
  onSelectElement,
  onAiPromptChange,
  onAiEdit,
  onCloseFile
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
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
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

                <div className="bg-white border-2 rounded-lg overflow-auto max-h-[700px] relative">
                  <canvas ref={canvasRef} className="w-full" />
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {textElements.map(element => (
                      <div
                        key={element.id}
                        className="absolute cursor-pointer hover:bg-accent/10 rounded transition-colors pointer-events-auto"
                        style={{ 
                          left: element.x, 
                          top: element.y,
                          fontSize: `${element.fontSize * 1.5}px`,
                          fontFamily: element.fontFamily,
                          fontWeight: element.fontWeight,
                          minWidth: `${element.width}px`
                        }}
                        onClick={() => onSelectElement(element.id)}
                      >
                        {selectedElement === element.id ? (
                          <input
                            value={element.text}
                            onChange={(e) => onTextEdit(element.id, e.target.value)}
                            onBlur={() => onSelectElement(null)}
                            autoFocus
                            className="bg-white border-2 border-accent rounded px-1 outline-none"
                            style={{
                              fontSize: `${element.fontSize * 1.5}px`,
                              fontFamily: element.fontFamily,
                              fontWeight: element.fontWeight,
                              width: `${Math.max(element.width, element.text.length * element.fontSize)}px`
                            }}
                          />
                        ) : (
                          <span className="bg-yellow-100/60 hover:bg-yellow-200/80 px-1 rounded">{element.text}</span>
                        )}
                      </div>
                    ))}
                  </div>
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