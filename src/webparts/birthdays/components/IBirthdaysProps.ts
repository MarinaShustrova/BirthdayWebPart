export interface IBirthdaysProps {
  data: IBDZUPList[];
  defaultImage: string;
  title:string;
}

export interface IBDZUPList {
  Surname: string;
  Name: string;
  MiddleName: string;
  Post: string;
  Division: string;
  Place: string;
  Focus: boolean;
  Foto: string;
}

