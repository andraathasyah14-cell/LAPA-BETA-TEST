'use server';

import { unfurlLinkForPreview } from '@/ai/flows/unfurl-link-for-preview';
import type { LinkItem } from '@/lib/types';
import { z } from 'zod';

const FormSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export type FormState = {
  message: string;
  link?: LinkItem;
  errors?: {
    url?: string[];
  };
};

export async function addLinkAction(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const url = validatedFields.data.url;

  try {
    const unfurlData = await unfurlLinkForPreview({ url });

    const newLink: LinkItem = {
      id: crypto.randomUUID(),
      url,
      notes: `# ${unfurlData.title || url}\n\nEnter your notes here...`,
      unfurlData,
    };

    return { message: 'success', link: newLink };
  } catch (error) {
    console.error('Error unfurling link:', error);
    return { message: 'Could not unfurl link. Please check the URL and try again.' };
  }
}
