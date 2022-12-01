
export interface IProducto {
  nombre:string
  imagen: string;
  precio: number;
  description: string;
  categoria: string;
  createdAt: Date;
  updatedAt: Date;
  _id?: unknown;
  userId?: unknown;
};
