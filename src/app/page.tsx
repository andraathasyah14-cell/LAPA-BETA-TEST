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
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Landmark,
  BookUser,
  Newspaper,
  Home as HomeIcon,
  PlusCircle,
  ThumbsUp,
  MessageSquare,
  Share2,
  X,
  Menu,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Country, News, Comment } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const TermsOfServiceModal = ({ isOpen, onAccept }: { isOpen: boolean; onAccept: () => void }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onAccept()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Terms and Services
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto pr-4 text-sm space-y-4">
            <p className="font-bold">SINCE 2017 IRL!🏅</p>
            <p>Selamat datang di ULN, organisasi mapgame yang menggunakan latar planet Lapa. Mapgame kami memadukan permainan simulasi interaktif dengan worldbuilding yang dalam.</p>
            <div>
                <h3 className="font-bold mb-2">Rules:</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>No 18+, spam, etc.</li>
                    <li>Refrensi negara asli disarankan, tapi jangan sepenuhnya jiplak</li>
                    <li>Alutsista boleh ambil Google tapi harus realistis.</li>
                    <li>Agama asli diganti sebutannya, misalnya Islam= "Dinhaq" Katolik= "Romansky"</li>
                    <li>No bid'ah² club (terlalu futuristik, ga masuk akal, dsb)</li>
                </ul>
            </div>
             <div>
                <h3 className="font-bold mb-2">Info Penting:</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>1 tahun Lapa= 1 Bulan Bumi (September 2025 = 2080)</li>
                    <li>$ = 1 ULD = 1 USD</li>
                    <li>IG: @unitedlapanations (hangus rek)</li>
                </ul>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={onAccept} className="w-full">Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


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
  const { toast } = useToast();

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

const NewsCard = ({ news, userCountry, onNewsUpdate }: { news: News, userCountry: Country | null, onNewsUpdate: (updatedNews: News) => void }) => {
  const [showComments, setShowComments] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');
  
  const handleLike = () => {
      const updatedNews = { ...news, likes: news.likes + 1 };
      onNewsUpdate(updatedNews);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      author: userCountry?.countryName || 'Pengguna Anonim',
      text: newComment,
      timestamp: new Date().toISOString()
    };
    
    const updatedNews = { ...news, comments: [comment, ...news.comments] };
    onNewsUpdate(updatedNews);
    setNewComment('');
  }
  
  const timeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: id });
  }

  return (
    <>
      <Card 
        onClick={() => setIsDialogOpen(true)}
        className="w-[190px] bg-card p-1.5 rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        <CardHeader className="p-0 relative">
          {news.isMapUpdate && (
            <Badge variant="destructive" className="absolute top-2 right-2 z-10 text-xs px-2 py-1">
              Update Peta
            </Badge>
          )}
          <div className="relative h-[100px] w-full">
            <Image 
              src={news.imageUrl} 
              alt="News image" 
              fill 
              className="object-cover rounded-t-md" 
              data-ai-hint={news.imageHint} 
            />
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <p className="text-xs font-semibold text-blue-500 uppercase">
             {news.newsType === 'internasional' ? 'Berita Internasional' : 'Berita Domestik'}
          </p>
          <h3 className="font-bold text-sm leading-tight mt-1 text-card-foreground">
            {news.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-3">
            Oleh <span className="font-semibold text-foreground/80">{news.authorCountry.countryName}</span>
          </p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent className="max-w-4xl w-full p-0 max-h-[90vh] grid grid-rows-[auto_1fr] bg-card rounded-lg">
             <div className="overflow-y-auto">
                <DialogHeader className="p-4 md:p-6 pb-0 sticky top-0 bg-card/95 backdrop-blur-sm z-10">
                    <DialogTitle className="text-xl md:text-2xl font-bold">
                        {news.title}
                    </DialogTitle>
                    <div className="text-xs md:text-sm text-muted-foreground pt-1">
                        <span>Diposting oleh: <strong>{news.authorCountry.countryName}</strong> | {timeAgo(news.timestamp)}</span>
                    </div>
                </DialogHeader>
                <div className="px-4 md:px-6">
                  <div className="relative h-48 md:h-60 w-full my-4 rounded-lg overflow-hidden">
                      <Image 
                          src={news.imageUrl} 
                          alt="News image" 
                          fill 
                          className="object-cover" 
                          data-ai-hint={news.imageHint} 
                      />
                  </div>
                  <p className="whitespace-pre-wrap text-sm md:text-base text-foreground/90">
                    {news.description}
                  </p>
                </div>
                <CardFooter className="flex flex-col items-start gap-3 p-4 md:p-6 bg-muted/50 mt-4 rounded-b-lg">
                  <div className="flex w-full justify-between items-center text-muted-foreground">
                      <div className="flex gap-1 md:gap-2">
                          <Button variant="ghost" size="sm" onClick={handleLike} className="hover:bg-accent/50 text-xs md:text-sm">
                              <ThumbsUp className="mr-1 md:mr-2 h-4 w-4" /> Suka ({news.likes})
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="hover:bg-accent/50 text-xs md:text-sm">
                              <MessageSquare className="mr-1 md:mr-2 h-4 w-4" /> Komentar ({news.comments.length})
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-accent/50 text-xs md:text-sm">
                              <Share2 className="mr-1 md:mr-2 h-4 w-4" /> Bagikan
                          </Button>
                      </div>
                  </div>
                  {showComments && (
                    <div className="w-full space-y-4 pt-4 border-t">
                      <h4 className="font-semibold text-base md:text-lg">Komentar</h4>
                        <form onSubmit={handleCommentSubmit} className="space-y-3">
                            <Label htmlFor="comment-input-dialog" className="font-normal text-xs md:text-sm">Beri komentar sebagai <span className="font-semibold">{userCountry?.countryName || 'Pengguna Anonim'}</span></Label>
                            <Textarea 
                                id="comment-input-dialog"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Tulis komentarmu..."
                            />
                            <Button type="submit" size="sm" disabled={!newComment.trim()}>
                                Kirim Komentar
                            </Button>
                        </form>
                      <div className="space-y-4">
                        {news.comments.map((comment) => (
                          <div key={comment.id} className="flex flex-col gap-1 border-b pb-3 last:border-none">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm md:text-base">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">{timeAgo(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm md:text-base">{comment.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardFooter>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function Home() {
  const [countries, setCountries] = React.useState<Country[]>([]);
  const [newsList, setNewsList] = React.useState<News[]>([]);
  const [userCountry, setUserCountry] = React.useState<Country | null>(null);
  const { toast } = useToast();
  const [isAlertDismissed, setIsAlertDismissed] = React.useState(false);
  const [showDevInfoModal, setShowDevInfoModal] = React.useState(false);
  const [globalComments, setGlobalComments] = React.useState<Comment[]>([]);
  const [newGlobalComment, setNewGlobalComment] = React.useState('');
  const [showTermsModal, setShowTermsModal] = React.useState(false);


  React.useEffect(() => {
    // Terms of Service Modal
    const termsAccepted = localStorage.getItem('termsAccepted');
    if (!termsAccepted) {
      setShowTermsModal(true);
    }
    
    // Dev info modal
    const devInfoDismissed = sessionStorage.getItem('devInfoDismissed');
    if (!devInfoDismissed) {
      setShowDevInfoModal(true);
    }

    // Load countries from localStorage
    const storedCountries = localStorage.getItem('countries');
    const initialCountries = storedCountries ? JSON.parse(storedCountries) : [
      { id: '1', countryName: 'Republik Lapa', ownerName: 'John Doe', registrationDate: new Date().toISOString() },
      { id: '2', countryName: 'Kerajaan Bikar', ownerName: 'Jane Smith', registrationDate: new Date().toISOString() },
    ];
    setCountries(initialCountries);
    if (!storedCountries) {
      localStorage.setItem('countries', JSON.stringify(initialCountries));
    }

    // Load global comments from localStorage
    const storedGlobalComments = localStorage.getItem('globalComments');
    if (storedGlobalComments) {
      setGlobalComments(JSON.parse(storedGlobalComments));
    }


    // Load news from localStorage
    const storedNews = localStorage.getItem('news');
    const initialNews: News[] = storedNews ? JSON.parse(storedNews) : [
       { 
         id: '1', 
         title: 'Negara X Resmi Mengubah Konstitusi 2025', 
         description: `Dalam sebuah pengumuman bersejarah, pemerintah Negara X mengumumkan adopsi Konstitusi 2025 yang baru, menggantikan undang-undang dasar sebelumnya. Langkah ini dipandang sebagai momen transformatif dalam sejarah bangsa, yang bertujuan untuk memperkuat demokrasi, hak asasi manusia, dan pembangunan berkelanjutan. Konstitusi baru ini mencakup beberapa perubahan fundamental, termasuk pengakuan hak-hak minoritas yang lebih luas, pembentukan lembaga anti-korupsi independen, dan komitmen yang lebih kuat terhadap perlindungan lingkungan. Presiden Negara X menyatakan bahwa konstitusi ini adalah 'fajar baru bagi bangsa kita', sementara kelompok oposisi menyuarakan keprihatinan tentang potensi pemusatan kekuasaan. Debat publik diperkirakan akan terus berlanjut seiring negara ini memasuki babak baru dalam pemerintahannya.`,
         imageUrl: 'https://picsum.photos/seed/politics/1200/400',
         imageHint: 'political assembly',
         authorCountry: initialCountries[0],
         taggedCountry: undefined,
         isMapUpdate: true,
         timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
         likes: 12,
         comments: [
            { id: '1', author: 'Pemimpin Negara Y', text: 'Langkah yang sangat berani dari Negara X. Kami akan mengamati perkembangan ini dengan cermat.', timestamp: new Date(Date.now() - 1200 * 1000).toISOString()}
         ],
         newsType: 'domestik',
       }
    ];
    setNewsList(initialNews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
     if (!storedNews) {
      localStorage.setItem('news', JSON.stringify(initialNews));
    }

  }, []);

  const handleDismissDevInfo = () => {
    sessionStorage.setItem('devInfoDismissed', 'true');
    setShowDevInfoModal(false);
  };
  
  const handleAcceptTerms = () => {
    localStorage.setItem('termsAccepted', 'true');
    setShowTermsModal(false);
  };
  
  const handleNewsUpdate = (updatedNews: News) => {
    const updatedList = newsList.map(news => news.id === updatedNews.id ? updatedNews : news);
    setNewsList(updatedList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    localStorage.setItem('news', JSON.stringify(updatedList));
  };


  const handleCountryRegistered = (country: Country) => {
    if (countries.some(c => c.countryName.toLowerCase() === country.countryName.toLowerCase())) {
        toast({
            variant: "destructive",
            title: "Pendaftaran Gagal",
            description: `Negara dengan nama "${country.countryName}" sudah terdaftar.`,
        })
        return;
    }
    const updatedCountries = [...countries, country];
    setCountries(updatedCountries);
    localStorage.setItem('countries', JSON.stringify(updatedCountries));
    setUserCountry(country);
  };

  const handleGlobalCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGlobalComment.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      author: userCountry?.countryName || 'Pengguna Anonim',
      text: newGlobalComment,
      timestamp: new Date().toISOString()
    };

    const updatedComments = [comment, ...globalComments];
    setGlobalComments(updatedComments);
    localStorage.setItem('globalComments', JSON.stringify(updatedComments));
    setNewGlobalComment('');
  }
  
  const timeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: id });
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
       <TermsOfServiceModal isOpen={showTermsModal} onAccept={handleAcceptTerms} />
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-header-background px-4 text-header-foreground md:px-6">
        <div className="flex items-center gap-2">
          <Landmark className="h-6 w-6" />
          <h1 className="text-xl font-bold">United Lapa Nations</h1>
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
            <Link href="/list-negara" passHref>
              <DropdownMenuItem>
                <BookUser className="mr-2 h-4 w-4" />
                <span>List Negara</span>
              </DropdownMenuItem>
            </Link>
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
             <DropdownMenuSeparator />
             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <ThemeToggle />
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
       
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 md:gap-8 md:p-10">
        <main className="col-span-12 md:col-span-8 space-y-8 pb-20">
         {!userCountry && !isAlertDismissed && (
            <Alert variant="destructive" className="mb-6 relative pr-10">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Peringatan</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                    <span>Negara Anda belum terdaftar. Segera lakukan registrasi.</span>
                     <RegisterCountryForm onCountryRegistered={handleCountryRegistered} />
                </AlertDescription>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => setIsAlertDismissed(true)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Tutup</span>
                </Button>
            </Alert>
          )}

          <div className="flex flex-wrap gap-4">
             {newsList.length > 0 ? (
                newsList.map(news => (
                    <NewsCard 
                        key={news.id} 
                        news={news} 
                        userCountry={userCountry} 
                        onNewsUpdate={handleNewsUpdate} 
                    />
                ))
             ) : (
                <p>Belum ada berita yang dipublikasikan.</p>
             )}
          </div>

        </main>

        <aside className="col-span-12 md:col-span-4 space-y-6">
           <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare />
                <span>Komentar Global</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGlobalCommentSubmit} className="space-y-3 mb-4">
                <Label htmlFor="global-comment-input" className="font-normal text-sm">
                  Beri komentar sebagai <span className="font-semibold">{userCountry?.countryName || 'Pengguna Anonim'}</span>
                </Label>
                <Textarea
                  id="global-comment-input"
                  value={newGlobalComment}
                  onChange={(e) => setNewGlobalComment(e.target.value)}
                  placeholder="Tulis komentar global di sini..."
                  className="min-h-[60px]"
                />
                <Button type="submit" size="sm" disabled={!newGlobalComment.trim()}>Kirim</Button>
              </form>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {globalComments.length > 0 ? (
                  globalComments.map((comment) => (
                    <div key={comment.id} className="flex flex-col gap-1 border-b pb-3 last:border-none">
                       <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{timeAgo(comment.timestamp)}</span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Belum ada komentar global.</p>
                )}
              </div>
            </CardContent>
          </Card>

        </aside>
      </div>
      
       <Dialog open={showDevInfoModal} onOpenChange={setShowDevInfoModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Informasi Developer</DialogTitle>
              <DialogDescription>
                Website ini dibuat oleh Andra.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={handleDismissDevInfo} variant="outline">Tutup</Button>
          </DialogContent>
        </Dialog>

    </div>
  );
}
