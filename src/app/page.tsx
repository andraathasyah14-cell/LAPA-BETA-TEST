'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Globe,
  Landmark,
  User,
  Menu,
  AlertTriangle,
  BookUser,
  Newspaper,
  Home as HomeIcon,
  PlusCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Country {
  id: string;
  countryName: string;
  ownerName: string;
  registrationDate: string;
}

const RegisterCountryForm = ({
  onCountryRegistered,
  children,
}: {
  onCountryRegistered: (country: Country) => void;
  children?: React.ReactNode;
}) => {
  const [countryName, setCountryName] = React.useState('');
  const [ownerName, setOwnerName] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCountry: Country = {
      id: crypto.randomUUID(),
      countryName,
      ownerName,
      registrationDate: new Date().toISOString(),
    };
    onCountryRegistered(newCountry);
    setCountryName('');
    setOwnerName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Registrasi Negara</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrasi Negara Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country-name">Nama Negara</Label>
            <Input
              id="country-name"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              placeholder="Contoh: Republik Lapa"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner-name">Nama Pemilik</Label>
            <Input
              id="owner-name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Contoh: John Doe"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Daftar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default function Home() {
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [userCountry, setUserCountry] = React.useState<Country | null>(null);

  const handleCountryRegistered = (country: Country) => {
    setCountries((prev) => [...prev, country]);
    setUserCountry(country);
  };

  return (
    <div className="flex min-h-screen w-full flex-col pb-20">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-header-background px-4 text-header-foreground md:px-6">
        <div className="flex items-center gap-2">
          <Landmark className="h-6 w-6" />
          <h1 className="text-xl font-bold">United Lapa National</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <HomeIcon className="mr-2 h-4 w-4" />
              <span>Home</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookUser className="mr-2 h-4 w-4" />
              <span>List Negara</span>
            </DropdownMenuItem>
            <Link href="/add-news" passHref>
               <DropdownMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Tambah Berita</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
             <RegisterCountryForm onCountryRegistered={handleCountryRegistered}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Newspaper className="mr-2 h-4 w-4" />
                    <span>Registrasi Negara</span>
                </DropdownMenuItem>
            </RegisterCountryForm>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
       
      <div className="flex flex-1 flex-col gap-4 p-4 md:grid md:grid-cols-12 md:gap-8 md:p-10">
        <main className="md:col-span-9">
          {!userCountry && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Peringatan</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>Negara Anda belum terdaftar. Segera lakukan registrasi.</span>
                <RegisterCountryForm
                  onCountryRegistered={handleCountryRegistered}
                />
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-8">
            <Card className="bg-un-blue-light/80 border-un-blue-dark">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  Negara X Resmi Mengubah Konstitusi 2025
                </CardTitle>
                <div className="text-sm text-muted-foreground pt-2">
                  <span>Diposting oleh: Negara X | 1 jam yang lalu</span>
                </div>
              </CardHeader>
              <CardContent>
                <p>
                  Dalam sebuah pengumuman bersejarah, pemerintah Negara X
                  mengumumkan adopsi Konstitusi 2025 yang baru, menggantikan
                  undang-undang dasar sebelumnya. Langkah ini dipandang sebagai
                  momen transformatif dalam sejarah bangsa, yang bertujuan untuk
                  memperkuat demokrasi, hak asasi manusia, dan pembangunan
                  berkelanjutan...
                </p>
              </CardContent>
            </Card>

            <h2 className="text-2xl font-bold">Komentar Pembaca</h2>
            <div className="space-y-4">
              <Card className="bg-card/80">
                <CardHeader className="flex flex-row items-center gap-4">
                  <User className="h-8 w-8" />
                  <div>
                    <p className="font-semibold">Pemimpin Negara Y</p>
                    <p className="text-xs text-muted-foreground">20 menit yang lalu</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>Langkah yang sangat berani dari Negara X. Kami akan mengamati perkembangan ini dengan cermat.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <aside className="md:col-span-3">
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe />
                <span>Negara Terdaftar</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {countries.length > 0 ? (
                <ul className="space-y-4">
                  {countries.map((c) => (
                    <li key={c.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{c.countryName}</p>
                        <p className="text-sm text-muted-foreground">{c.ownerName}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.registrationDate).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada negara yang terdaftar.</p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

       <div className="fixed bottom-0 left-0 right-0 z-50">
          <Alert variant="destructive" className="rounded-none border-x-0 border-b-0">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>
              Website ini masih dalam tahap pengembangan. Jika ada bug, harap lapor di grup Lapa.
            </AlertDescription>
          </Alert>
        </div>
    </div>
  );
}
