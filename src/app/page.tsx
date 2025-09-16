'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
  ThumbsUp,
  MessageSquare,
  Share2,
  Map,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';


interface Country {
  id: string;
  countryName: string;
  ownerName: string;
  registrationDate: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
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

const NewsCard = ({ countries, userCountry }: { countries: Country[], userCountry: Country | null }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [likes, setLikes] = React.useState(0);
  const [comments, setComments] = React.useState<Comment[]>([
      { id: '1', author: 'Pemimpin Negara Y', text: 'Langkah yang sangat berani dari Negara X. Kami akan mengamati perkembangan ini dengan cermat.', timestamp: '20 menit yang lalu'}
  ]);
  const [newComment, setNewComment] = React.useState('');
  const [showComments, setShowComments] = React.useState(true);

  const fullText = `Dalam sebuah pengumuman bersejarah, pemerintah Negara X mengumumkan adopsi Konstitusi 2025 yang baru, menggantikan undang-undang dasar sebelumnya. Langkah ini dipandang sebagai momen transformatif dalam sejarah bangsa, yang bertujuan untuk memperkuat demokrasi, hak asasi manusia, dan pembangunan berkelanjutan. Konstitusi baru ini mencakup beberapa perubahan fundamental, termasuk pengakuan hak-hak minoritas yang lebih luas, pembentukan lembaga anti-korupsi independen, dan komitmen yang lebih kuat terhadap perlindungan lingkungan. Presiden Negara X menyatakan bahwa konstitusi ini adalah 'fajar baru bagi bangsa kita', sementara kelompok oposisi menyuarakan keprihatinan tentang potensi pemusatan kekuasaan. Debat publik diperkirakan akan terus berlanjut seiring negara ini memasuki babak baru dalam pemerintahannya.`;
  
  const truncatedText = fullText.substring(0, 200) + '...';

  const toggleReadMore = () => setIsExpanded(!isExpanded);
  const handleLike = () => setLikes(prev => prev + 1);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userCountry) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      author: userCountry.countryName,
      text: newComment,
      timestamp: 'Baru saja'
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  }

  const isMapUpdate = true; // Mock data for map update status

  return (
    <Card className="bg-card/90 border-un-blue-dark relative overflow-hidden shadow-lg">
        {isMapUpdate && (
          <Badge variant="destructive" className="absolute top-4 right-4 z-10 flex items-center gap-1">
            <Map className="h-3 w-3" />
            Update Peta
          </Badge>
        )}
        <div className="relative h-60 w-full">
            <Image 
                src="https://picsum.photos/seed/politics/1200/400" 
                alt="News image" 
                fill 
                className="object-cover" 
                data-ai-hint="political assembly" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
        <CardHeader className="relative -mt-16 z-10 text-primary-foreground p-4 md:p-6">
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Negara X Resmi Mengubah Konstitusi 2025
          </CardTitle>
          <div className="text-sm pt-2">
            <span>Diposting oleh: <strong>Negara X</strong> | 1 jam yang lalu</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <p className="whitespace-pre-wrap text-foreground/90">
            {isExpanded ? fullText : truncatedText}
          </p>
          {!isExpanded && (
             <Button variant="link" onClick={toggleReadMore} className="p-0 h-auto text-blue-500 hover:text-blue-400">
               Selanjutnya...
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 p-4 md:p-6 bg-muted/50">
           <div className="flex w-full justify-between items-center text-muted-foreground">
              <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleLike} className="hover:bg-accent/50">
                      <ThumbsUp className="mr-2 h-4 w-4" /> Suka ({likes})
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="hover:bg-accent/50">
                      <MessageSquare className="mr-2 h-4 w-4" /> Komentar ({comments.length})
                  </Button>
                   <Button variant="ghost" size="sm" className="hover:bg-accent/50">
                      <Share2 className="mr-2 h-4 w-4" /> Bagikan
                  </Button>
              </div>
           </div>
           {showComments && (
            <div className="w-full space-y-6 pt-4 border-t">
              <h4 className="font-semibold text-lg">Komentar</h4>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <Label htmlFor="comment-input" className="font-normal">Beri komentar sebagai <span className="font-semibold">{userCountry?.countryName || '...'}</span></Label>
                    <Textarea 
                        id="comment-input"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Tulis komentarmu..."
                        disabled={!userCountry}
                    />
                    <Button type="submit" disabled={!userCountry || !newComment.trim()}>
                        Kirim Komentar
                    </Button>
                     {!userCountry && <p className="text-sm text-destructive">Anda harus mendaftarkan negara untuk berkomentar.</p>}
                </form>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex flex-col gap-1 border-b pb-3 last:border-none">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
  );
};

export default function Home() {
  const [countries, setCountries] = React.useState<Country[]>([
    { id: '1', countryName: 'Republik Lapa', ownerName: 'John Doe', registrationDate: new Date().toISOString() },
    { id: '2', countryName: 'Kerajaan Bikar', ownerName: 'Jane Smith', registrationDate: new Date().toISOString() },
  ]);
  const [userCountry, setUserCountry] = React.useState<Country | null>(null);

  const handleCountryRegistered = (country: Country) => {
    setCountries((prev) => [...prev, country]);
    setUserCountry(country);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
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
            <Link href="/" passHref>
                <DropdownMenuItem>
                <HomeIcon className="mr-2 h-4 w-4" />
                <span>Home</span>
                </DropdownMenuItem>
            </Link>
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
       
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 md:gap-8 md:p-10">
        <main className="col-span-12 md:col-span-8 space-y-8 pb-20">
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

          <NewsCard countries={countries} userCountry={userCountry} />

        </main>

        <aside className="col-span-12 md:col-span-4">
          <Card className="bg-card/80 sticky top-20">
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

    
