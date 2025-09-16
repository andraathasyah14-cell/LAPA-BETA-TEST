
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Country } from '@/lib/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';

export default function ListNegaraPage() {
  const [countries, setCountries] = React.useState<Country[]>([]);

  React.useEffect(() => {
    const fetchCountries = async () => {
      const countriesCollection = collection(db, 'countries');
      const q = query(countriesCollection, orderBy('registrationDate', 'asc'));
      const countrySnapshot = await getDocs(q);
      const countryList = countrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Country));
      setCountries(countryList);
    };

    fetchCountries();
  }, []);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Tanggal tidak diketahui';
    return format(new Date(dateString), "d MMMM yyyy", { locale: id });
  }

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
        <div className="w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Daftar Negara</CardTitle>
              <CardDescription>
                Berikut adalah daftar semua negara yang telah terdaftar di United Lapa Nations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Nama Negara</TableHead>
                    <TableHead>Nama Pemilik</TableHead>
                    <TableHead className="text-right">Tanggal Registrasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countries.length > 0 ? (
                    countries.map((country, index) => (
                      <TableRow key={country.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{country.countryName}</TableCell>
                        <TableCell>{country.ownerName}</TableCell>
                        <TableCell className="text-right">{formatDate(country.registrationDate)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Belum ada negara yang terdaftar.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
