import { getConnection as getMongoDBConn } from '@models/mongodb/MongoDBConn';
import { ProductoDao as ProductoMongoDbDao } from '@models/mongodb/ProductoDao';
export interface IProducto {
  nombre: string;
  imagenes: string[];
  precio: number;
  description: string;
  categoria: string;
  createdAt: Date;
  updatedAt: Date;
}
export class Producto {
  private dao: ProductoMongoDbDao;
  public constructor() {
    const getConnection = getMongoDBConn;
    const ProductoDao = ProductoMongoDbDao;
    getConnection()
      .then((conn) => {
        this.dao = new ProductoDao(conn);
      })
      .catch((ex) => console.error(ex));
  }
  // Consultas
  public getAllProductos() {
    return this.dao.getProductos();
  }
  public getAllProductosFromUser(id: string) {
    return this.dao.getProductosByUser(id);
  }
  public getProductosPaged(page: number, items: number) {
    return this.dao.getProductosPaged(page, items);
  }
  public getProductosByUserPaged(userId: string, page: number, items: number) {
    return this.dao.getProductosByUserPaged(userId, page, items);
  }
  public getProductoByIndex(index: string) {
    return this.dao.getProductoById(index);
  }

  public getCountProducto(userId: string) {
    return this.dao.getCountProducto(userId);
  }

  public getTypeSumarry(userId: string) {
    return this.dao.getTypeSumarry(userId);
  }

  public addProducto(producto: IProducto, userId: string) {
    const { nombre, createdAt, imagenes, precio, categoria, description } =
      producto;
    return this.dao.insertNewProducto(
      {
        nombre,
        imagenes,
        precio: Number(precio),
        categoria,
        updatedAt: new Date(),
        createdAt: new Date(createdAt),
        description,
      },
      userId,
    );
  }
  public updateProducto(index: number | string, producto: IProducto) {
    return (this.dao as ProductoMongoDbDao).updateProducto({
      ...producto,
      _id: index,
    });
  }
  public deleteProducto(index: string) {
    return this.dao.deleteProducto({ _id: index });
  }
}
