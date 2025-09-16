'use client';

import * as React from 'react';
import Image from 'next/image';
import { Globe, Link2, Notebook, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { LinkItem } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { placeholderImages } from '@/lib/placeholder-images';

interface LinkCardProps {
  linkItem: LinkItem;
  onDelete: (id: string) => void;
  onNoteChange: (id: string, notes: string) => void;
}

export function LinkCard({ linkItem, onDelete, onNoteChange }: LinkCardProps) {
  const [showPreview, setShowPreview] = React.useState(true);
  const [notes, setNotes] = React.useState(linkItem.notes);

  const handleNoteBlur = () => {
    if (notes !== linkItem.notes) {
      onNoteChange(linkItem.id, notes);
    }
  };

  const { title, description, unfurlDecision } = linkItem.unfurlData;
  const hasContent = title || description || linkItem.unfurlData.imageUrl;
  const isHelpful = unfurlDecision ? !unfurlDecision.toLowerCase().includes('not helpful') : !!hasContent;

  const fallbackImage = placeholderImages.find(p => p.id === 'link-preview-fallback');
  const displayImageUrl = linkItem.unfurlData.imageUrl || fallbackImage?.imageUrl;

  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div className="flex-1 overflow-hidden">
          <CardTitle className="truncate text-lg font-semibold leading-tight">
            {title || linkItem.url}
          </CardTitle>
          <CardDescription className="mt-1 flex items-center gap-2 text-sm">
            <Link2 className="size-3 flex-shrink-0" />
            <a href={linkItem.url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">
              {linkItem.url}
            </a>
          </CardDescription>
        </div>
        <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" asChild>
                <a href={linkItem.url} target="_blank" rel="noopener noreferrer" aria-label="Open link in new tab">
                    <ExternalLink className="size-4" />
                </a>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(linkItem.id)} aria-label="Delete link">
                <Trash2 className="size-4 text-destructive" />
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview"><Globe className="mr-2 h-4 w-4"/>Preview</TabsTrigger>
            <TabsTrigger value="iframe"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><rect width="18" height="12" x="3" y="9" rx="2"/><path d="M8 9v1a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2Z"/></svg>Iframe</TabsTrigger>
            <TabsTrigger value="notes"><Notebook className="mr-2 h-4 w-4"/>Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Switch id={`show-preview-${linkItem.id}`} checked={showPreview} onCheckedChange={setShowPreview} />
                    <Label htmlFor={`show-preview-${linkItem.id}`}>Show unfurled preview</Label>
                </div>
                {isHelpful ? <Badge variant="secondary">Preview Recommended</Badge> : <Badge variant="outline">Raw Link Recommended</Badge>}
            </div>
            <Separator className="mb-4"/>
            {showPreview && isHelpful ? (
                <div className="space-y-4">
                    {displayImageUrl && (
                        <div className="relative aspect-[1.91/1] w-full overflow-hidden rounded-lg border">
                          <Image 
                            src={displayImageUrl} 
                            alt={title || 'Link preview image'} 
                            fill 
                            className="object-cover" 
                            data-ai-hint={linkItem.unfurlData.imageUrl ? 'website screenshot' : (fallbackImage?.imageHint || 'abstract')}
                          />
                        </div>
                    )}
                    <p className="text-muted-foreground">{description || "No description available."}</p>
                </div>
            ) : (
                <Alert>
                    <AlertTitle>{showPreview ? "Preview not available or not recommended" : "Preview hidden"}</AlertTitle>
                    <AlertDescription>
                        {showPreview ? "The AI determined that a raw link might be more useful, or no preview data could be found." : "You've chosen to hide the preview."}
                        <br/>
                        You can still view the content in the Iframe tab or open it in a new window.
                    </AlertDescription>
                </Alert>
            )}
          </TabsContent>

          <TabsContent value="iframe" className="mt-4 border-t pt-4">
            <div className="aspect-video w-full">
              <iframe
                src={linkItem.url}
                title={title || linkItem.url}
                className="h-full w-full rounded-lg border bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
             <p className="text-xs text-muted-foreground mt-2">Note: Some websites may not allow being embedded due to security policies.</p>
          </TabsContent>

          <TabsContent value="notes" className="mt-4 border-t pt-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNoteBlur}
              placeholder="Take notes here... Markdown is supported."
              className="min-h-[200px] text-base"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
