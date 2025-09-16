import type { UnfurlLinkForPreviewOutput } from '@/ai/flows/unfurl-link-for-preview';

export interface LinkItem {
  id: string;
  url: string;
  notes: string;
  unfurlData: UnfurlLinkForPreviewOutput;
}
