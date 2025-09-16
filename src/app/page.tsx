'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Link, LayoutGrid } from 'lucide-react';
import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { AddLinkForm } from '@/components/add-link-form';
import { LinkCard } from '@/components/link-card';
import type { LinkItem } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [links, setLinks] = React.useState<LinkItem[]>([]);

  const handleAddLink = (newLink: LinkItem) => {
    setLinks((prevLinks) => [newLink, ...prevLinks]);
  };

  const handleDeleteLink = (id: string) => {
    setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
  };

  const handleUpdateNote = (id: string, notes: string) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) => (link.id === id ? { ...link, notes } : link))
    );
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-4">
            <Link className="size-7 text-primary" />
            <h1 className="text-xl font-semibold">StudioLink</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <LayoutGrid />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <DarkModeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:pt-6">
          <SidebarTrigger className="sm:hidden" />
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </header>
        <main className="p-4 sm:px-6 sm:pb-6">
          <div className="mx-auto max-w-5xl">
            <p className="text-muted-foreground">
              Add, view, and manage your links.
            </p>
            <div className="my-8">
              <AddLinkForm onLinkAdded={handleAddLink} />
            </div>
            <Separator />
            <div className="mt-8">
              {links.length > 0 ? (
                 <div className="space-y-6">
                  {links.map((link) => (
                    <LinkCard
                      key={link.id}
                      linkItem={link}
                      onDelete={handleDeleteLink}
                      onNoteChange={handleUpdateNote}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card py-24 text-center">
                  <div className="mb-4 rounded-full border bg-secondary p-4">
                    <Link className="size-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">No links yet</h3>
                  <p className="mt-2 text-muted-foreground">
                    Add a link above to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
