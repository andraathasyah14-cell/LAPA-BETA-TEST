'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  PlusCircle,
  Upload,
  Map,
  Tags,
  Landmark,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { Country } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';


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
        {children || <Button variant="outline"> <PlusCircle className="mr-2"/> Tambah Negara Baru</Button>}
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


export default function AddNewsPage() {
  const [countries, setCountries] = React.useState<Country[]>([
    { id: '1', countryName: 'Republik Lapa', ownerName: 'John Doe', registrationDate: '' },
    { id: '2', countryName: 'Kerajaan Bikar', ownerName: 'Jane Smith', registrationDate: '' },
  ]);
  const [selectedCountry, setSelectedCountry] = React.useState<string>('');
  const { toast } = useToast();

  const handleCountryRegistered = (country: Country) => {
    if (countries.some(c => c.countryName.toLowerCase() === country.countryName.toLowerCase())) {
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: `Negara dengan nama "${country.countryName}" sudah terdaftar.`,
      })
      return;
    }
    setCountries(prev => [...prev, country]);
    setSelectedCountry(country.id);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-header-background px-4 text-header-foreground md:px-6">
        <div className="flex items-center gap-2">
          <Landmark className="h-6 w-6" />
          <h1 className="text-xl font-bold">United Lapa National</h1>
        </div>
        <Link href="/" passHref>
          <Button variant="ghost">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali ke Home
          </Button>
        </Link>
      </header>
      <main className="flex flex-1 justify-center p-4 md:p-10">
        <div className="w-full max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Tambah Berita Baru</CardTitle>
              <CardDescription>
                Publikasikan update terbaru dari negaramu untuk dilihat semua anggota.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="owner-name">Nama Pemilik</Label>
                  <Input id="owner-name" placeholder="John Doe" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="country">Nama Negara</Label>
                   <Select onValueChange={setSelectedCountry} value={selectedCountry}>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Pilih negara Anda..." />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.countryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <RegisterCountryForm onCountryRegistered={handleCountryRegistered}>
                     <Button variant="outline" className="w-full justify-start"> <PlusCircle className="mr-2 h-4 w-4"/> Negara belum terdaftar? Klik untuk menambah.</Button>
                  </RegisterCountryForm>
                </div>
                
                 <div className="grid gap-3">
                  <Label htmlFor="title">Judul Berita</Label>
                  <Input id="title" placeholder="Contoh: Negara X Mengubah Konstitusi" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Tuliskan isi berita atau update negaramu di sini..."
                    className="min-h-[150px]"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="picture">Gambar Berita</Label>
                  <div className="flex items-center gap-2">
                    <Input id="picture" type="file" className="file:text-foreground"/>
                    <Button variant="outline" size="icon"><Upload className="h-4 w-4"/></Button>
                  </div>
                   <p className="text-sm text-muted-foreground">
                    Unggah gambar untuk memperkuat beritamu.
                  </p>
                </div>
                
                <div className="grid gap-3">
                   <Label htmlFor="tag-countries">Tag Negara Lain</Label>
                   <Select>
                    <SelectTrigger id="tag-countries">
                      <SelectValue placeholder="Pilih negara untuk di-tag..." />
                    </SelectTrigger>
                    <SelectContent>
                       {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.countryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Sebut negara lain yang terlibat dalam beritamu.
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="map-update" className="text-base flex items-center">
                        <Map className="mr-2 h-4 w-4" />
                        Update Peta?
                        </Label>
                        <p className="text-sm text-muted-foreground">
                        Aktifkan jika berita ini menyebabkan perubahan pada peta global.
                        </p>
                    </div>
                    <Switch id="map-update" />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Publikasikan Berita
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
