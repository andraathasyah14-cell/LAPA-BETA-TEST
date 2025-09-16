export interface Country {
  id: string;
  countryName: string;
  ownerName: string;
  registrationDate: string;
}

export interface Update {
  id: string;
  countryId: string;
  title: string;
  content: string;
  year: number;
  date: string;
  author: string;
}

export interface Comment {
  id: string;
  updateId: string;
  content: string;
  author: string;
  date: string;
}
