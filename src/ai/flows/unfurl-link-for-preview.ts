'use server';

/**
 * @fileOverview This file defines a Genkit flow for unfurling links and generating previews using OpenGraph tags.
 *
 * - `unfurlLinkForPreview`: A function that unfurls a given link and generates a preview.
 * - `UnfurlLinkForPreviewInput`: The input type for the `unfurlLinkForPreview` function, containing the URL to unfurl.
 * - `UnfurlLinkForPreviewOutput`: The output type for the `unfurlLinkForPreview` function, containing the unfurled data and a preview, if available.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getOpenGraphData} from '@/services/opengraph';

const UnfurlLinkForPreviewInputSchema = z.object({
  url: z.string().url().describe('The URL to unfurl and generate a preview for.'),
});
export type UnfurlLinkForPreviewInput = z.infer<typeof UnfurlLinkForPreviewInputSchema>;

const UnfurlLinkForPreviewOutputSchema = z.object({
  title: z.string().optional().describe('The title of the link.'),
  description: z.string().optional().describe('A short description of the link content.'),
  imageUrl: z.string().url().optional().describe('An image URL associated with the link.'),
  unfurlDecision: z.string().describe('A decision made by the LLM as to whether or not an unfurled preview is more helpful than the raw link.'),
});
export type UnfurlLinkForPreviewOutput = z.infer<typeof UnfurlLinkForPreviewOutputSchema>;

export async function unfurlLinkForPreview(input: UnfurlLinkForPreviewInput): Promise<UnfurlLinkForPreviewOutput> {
  return unfurlLinkForPreviewFlow(input);
}

const decideIfUnfurlIsHelpful = ai.defineTool({
  name: 'decideIfUnfurlIsHelpful',
  description: 'Decides if an unfurled preview is more helpful to the user than simply showing the raw link.',
  inputSchema: z.object({
    title: z.string().optional().describe('The title of the link.'),
    description: z.string().optional().describe('A short description of the link content.'),
  }),
  outputSchema: z.string().describe('A decision made by the LLM as to whether or not an unfurled preview is more helpful than the raw link.'),
}, async (input) => {
  // Just return a canned string; the real decision-making happens in the prompt.
  return `The LLM has decided whether or not an unfurled preview is more helpful: ${input.title} ${input.description}`;
});

const prompt = ai.definePrompt({
  name: 'unfurlLinkForPreviewPrompt',
  input: {schema: UnfurlLinkForPreviewInputSchema},
  output: {schema: UnfurlLinkForPreviewOutputSchema},
  tools: [decideIfUnfurlIsHelpful],
  prompt: `You are a helpful assistant that unfurls links and generates previews.

  Determine whether an unfurled preview of the content at the provided URL would be more helpful to the user than simply displaying the raw link.

  Use the decideIfUnfurlIsHelpful tool to make this determination.

  URL: {{{url}}}
  Title: {{{title}}}
  Description: {{{description}}}
  ImageUrl: {{{imageUrl}}}

  The decision on whether to unfurl the link is: {{ await decideIfUnfurlIsHelpful title=title description=description }}`,
});

const unfurlLinkForPreviewFlow = ai.defineFlow(
  {
    name: 'unfurlLinkForPreviewFlow',
    inputSchema: UnfurlLinkForPreviewInputSchema,
    outputSchema: UnfurlLinkForPreviewOutputSchema,
  },
  async input => {
    const openGraphData = await getOpenGraphData(input.url);

    const {output} = await prompt({
      ...input,
      title: openGraphData?.title,
      description: openGraphData?.description,
      imageUrl: openGraphData?.imageUrl,
    });
    return output!;
  }
);
