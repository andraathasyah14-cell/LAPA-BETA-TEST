'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ListPlus, Loader2 } from 'lucide-react';

import { addLinkAction, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { LinkItem } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AddLinkFormProps {
  onLinkAdded: (link: LinkItem) => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="animate-spin" /> : <ListPlus />}
      <span>{pending ? 'Adding...' : 'Add Link'}</span>
    </Button>
  );
}

export function AddLinkForm({ onLinkAdded }: AddLinkFormProps) {
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const initialState: FormState = { message: '' };
  const [state, formAction] = useFormState(addLinkAction, initialState);

  React.useEffect(() => {
    if (state.message === 'success' && state.link) {
      toast({
        title: 'Link Added',
        description: `Successfully unfurled and added ${state.link.url}`,
      });
      onLinkAdded(state.link);
      formRef.current?.reset();
    } else if (
      state.message &&
      state.message !== 'success' &&
      state.message !== 'Validation failed.'
    ) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, onLinkAdded, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url-input" className="sr-only">New Link URL</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="url-input"
                name="url"
                type="url"
                placeholder="https://example.com"
                required
                className="flex-grow"
              />
              <SubmitButton />
            </div>
          </div>
          {state.errors?.url && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.url[0]}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
