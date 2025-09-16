import type { Timestamp } from 'firebase/firestore';

export interface Country {
  id: string;
  countryName: string;
  ownerName: string;
  registrationDate: string; // Keep as ISO string for simplicity
}

export interface News {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageHint?: string;
  authorCountry: Country;
  taggedCountry?: Country;
  isMapUpdate: boolean;
  timestamp: Timestamp; // Use Firestore Timestamp
  likes: number;
  comments: Comment[];
  newsType: 'domestik' | 'internasional';
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Timestamp; // Use Firestore Timestamp
}
