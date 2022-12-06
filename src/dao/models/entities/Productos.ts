
export interface IProducto {
  nombre:string
  imagenes: string[];
  precio: number;
  description: string;
  categoria: string;
  createdAt: Date;
  updatedAt: Date;
  _id?: unknown;
  userId?: unknown;
};
