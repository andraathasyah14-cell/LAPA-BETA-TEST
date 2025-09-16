
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  PlusCircle,
  Upload,
  Map,
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
import type { Country, News } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, Timestamp, query, where } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';


const RegisterCountryForm = ({
  onCountryRegistered,
  initialOwnerName,
  children,
}: {
  onCountryRegistered: (country: Country) => void;
  initialOwnerName: string;
  children?: React.ReactNode;
}) => {
  const [countryName, setCountryName] = React.useState('');
  const [ownerName, setOwnerName] = React.useState(initialOwnerName);
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      setOwnerName(initialOwnerName);
    }
  }, [open, initialOwnerName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if country already exists
    const countriesRef = collection(db, 'countries');
    const q = query(countriesRef, where("countryName", "==", countryName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
       toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: `Negara dengan nama "${countryName}" sudah terdaftar.`,
      });
      return;
    }

    const newCountry: Omit<Country, 'id'> = {
      countryName,
      ownerName: ownerName || 'Tidak Diketahui',
      registrationDate: new Date().toISOString(),
    };
    
    try {
      const docRef = await addDoc(collection(db, "countries"), newCountry);
      const finalCountry = { ...newCountry, id: docRef.id };
      onCountryRegistered(finalCountry);

      setCountryName('');
      setOwnerName('');
      setOpen(false);
    } catch(error) {
       console.error("Error registering country:", error);
        toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: "Terjadi kesalahan saat mendaftarkan negara.",
      });
    }
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
  const [countries, setCountries] = React.useState<Country[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const [ownerName, setOwnerName] = React.useState('');
  const [countryId, setCountryId] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState<string | null>(null);
  const [taggedCountryId, setTaggedCountryId] = React.useState('');
  const [isMapUpdate, setIsMapUpdate] = React.useState(false);
  const [newsType, setNewsType] = React.useState<'domestik' | 'internasional'>('domestik');


  React.useEffect(() => {
    const fetchCountries = async () => {
      const countriesCollection = collection(db, 'countries');
      const countrySnapshot = await getDocs(countriesCollection);
      const countryList = countrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Country));
      setCountries(countryList);
    };

    fetchCountries();
  }, []);

  const handleCountryRegistered = (country: Country) => {
    const updatedCountries = [...countries, country].sort((a, b) => a.countryName.localeCompare(b.countryName));
    setCountries(updatedCountries);
    setCountryId(country.id);
     toast({
        title: "Pendaftaran Berhasil",
        description: `Negara "${country.countryName}" telah terdaftar dan dipilih.`,
      })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryId || !title || !description) {
        toast({
            variant: "destructive",
            title: "Gagal Publikasi",
            description: "Harap isi semua kolom yang wajib diisi (Negara, Judul, Deskripsi).",
        });
        return;
    }

    const country = countries.find(c => c.id === countryId);
    if (!country) return;
    
    // Sync owner name if it has changed
    if (country.ownerName !== ownerName && ownerName) {
        country.ownerName = ownerName;
    }

    try {
      const newNews: Omit<News, 'id'> = {
        title,
        description,
        imageUrl: image || undefined,
        imageHint: image ? "custom image" : undefined,
        authorCountry: country,
        taggedCountry: countries.find(c => c.id === taggedCountryId),
        isMapUpdate,
        timestamp: Timestamp.now(),
        likes: 0,
        comments: [],
        newsType: newsType,
      };

      await addDoc(collection(db, "news"), newNews);
      
      toast({
        title: "Berhasil!",
        description: "Berita Anda telah berhasil dipublikasikan.",
      });

      router.push('/');
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Gagal Publikasi",
        description: "Terjadi kesalahan saat menyimpan berita. Coba lagi nanti.",
      });
    }
  }
  
  React.useEffect(() => {
    const selectedCountry = countries.find(c => c.id === countryId);
    if (selectedCountry) {
        setOwnerName(selectedCountry.ownerName);
    } else {
        setOwnerName('');
    }
  }, [countryId, countries]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-header-background px-4 text-header-foreground md:px-6">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Landmark className="h-6 w-6" />
                <h1 className="text-xl font-bold">United Lapa Nations</h1>
            </div>
            <Badge variant="secondary">BETA</Badge>
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
              <form className="space-y-6" onSubmit={handlePublish}>
                <div className="grid gap-3">
                  <Label htmlFor="country">Nama Negara</Label>
                   <Select onValueChange={setCountryId} value={countryId}>
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
                  <RegisterCountryForm 
                    onCountryRegistered={handleCountryRegistered}
                    initialOwnerName={ownerName}
                  >
                     <Button variant="outline" className="w-full justify-start"> <PlusCircle className="mr-2 h-4 w-4"/> Negara belum terdaftar? Klik untuk menambah.</Button>
                  </RegisterCountryForm>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="owner-name">Nama Pemilik</Label>
                  <Input id="owner-name" placeholder="Akan terisi otomatis setelah memilih negara" value={ownerName} onChange={e => setOwnerName(e.target.value)} />
                </div>
                
                 <div className="grid gap-3">
                  <Label htmlFor="title">Judul Berita</Label>
                  <Input id="title" placeholder="Contoh: Negara X Mengubah Konstitusi" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="news-type">Jenis Berita</Label>
                   <Select onValueChange={(value: 'domestik' | 'internasional') => setNewsType(value)} value={newsType}>
                    <SelectTrigger id="news-type">
                      <SelectValue placeholder="Pilih jenis berita..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domestik">Berita Domestik</SelectItem>
                      <SelectItem value="internasional">Berita Internasional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div className="grid gap-3">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Tuliskan isi berita atau update negaramu di sini..."
                    className="min-h-[150px]"
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="picture">Gambar Berita</Label>
                  <div className="flex items-center gap-2">
                    <Input id="picture" type="file" className="file:text-foreground" onChange={handleImageUpload} accept="image/*"/>
                    <Button variant="outline" size="icon"><Upload className="h-4 w-4"/></Button>
                  </div>
                   <p className="text-sm text-muted-foreground">
                    Unggah gambar untuk memperkuat beritamu. (Opsional)
                  </p>
                </div>
                
                <div className="grid gap-3">
                   <Label htmlFor="tag-countries">Tag Negara Lain</Label>
                   <Select onValueChange={setTaggedCountryId} value={taggedCountryId}>
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
                    Sebut negara lain yang terlibat dalam beritamu. (Opsional)
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
                    <Switch id="map-update" checked={isMapUpdate} onCheckedChange={setIsMapUpdate}/>
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
