export type Device = {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  imageURL?: string;
  serialNumber: string;
  price: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  manufacturer: {
    id: string;
    name: string;
  };
};
