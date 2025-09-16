export interface Country {
  id: string;
  countryName: string;
  ownerName: string;
  registrationDate: string;
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
  timestamp: string;
  likes: number;
  comments: Comment[];
  newsType: 'domestik' | 'internasional';
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}
