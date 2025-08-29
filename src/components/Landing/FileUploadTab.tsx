import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export const FileUploadTab = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFiles = Array.from(selectedFiles).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2 mb-6">
          <Upload className="w-8 h-8 text-primary mx-auto" />
          <h3 className="text-lg font-semibold">File Upload</h3>
          <p className="text-sm text-muted-foreground">
            Upload documents for persona extraction analysis
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileSelect(e.dataTransfer.files);
          }}
        >
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, DOCX, TXT files up to 10MB each
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Uploaded Files ({files.length})</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button className="w-full bg-gradient-to-r from-primary to-accent">
              Process {files.length} File{files.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}

        <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-200/50">
          <h4 className="font-medium text-sm mb-2">Document analysis includes:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Writing style and communication patterns</li>
            <li>• Professional expertise and knowledge areas</li>
            <li>• Personality traits from content analysis</li>
            <li>• Contextual background information</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};