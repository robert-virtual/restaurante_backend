import { AbstractDao } from "./AbstractDao";
import {Db, ObjectId} from "mongodb";
import { IProducto } from "../entities/Productos";

export class ProductoDao extends AbstractDao<IProducto> {
  public constructor(db: Db) {
    super('productos', db );
  }
  public getProductos() {
    return super.findAll()
  }
  public getProductosByUser(id:string){
    return super.findByFilter({userId: new ObjectId(id)},{sort:{'type': -1}});
  }

  public async getProductosByUserPaged(userId: string, page:number = 1, itemsPerPage: number = 10){
    try {
      const total = await super.getCollection().countDocuments({userId: new ObjectId(userId)});
      const totalPages = Math.ceil(total / itemsPerPage);
      const items = await super.findByFilter(
        { userId: new ObjectId(userId)},
        { sort:{'type': -1},
          skip:((page-1) * itemsPerPage),
          limit:itemsPerPage
          }
        );
        return {
          total,
          totalPages,
          page,
          itemsPerPage,
          items
        };
    } catch (ex) {
      console.log("productosDao mongodb:", (ex as Error).message);
      throw ex;
    }
  }

  public getTypeSumarry(userId:string){
    const match = {$match: {userId: new ObjectId(userId)}};
    const group = {$group: {_id: "$type", item: {$sum: 1}}};
    return this.aggregate([match, group], {});
  }

  public async getProductoById( identifier : string ){
    try{
      const result = await super.findByID(identifier);
      return result;
    } catch( ex: unknown) {
      console.log("productosDao mongodb:", (ex as Error).message);
      throw ex;
    }
  }

  public async insertNewProducto( newProducto: IProducto, userId: string) {
    try {
      const {_id, ...newObject} = newProducto;
      newObject.userId = new ObjectId(userId);
      const result = await super.createOne(newObject);
      return result;
    } catch( ex: unknown) {
      console.log("productosDao mongodb:", (ex as Error).message);
      throw ex;
    }
  }

  public async updateProducto( updateProducto: IProducto) {
    try {
      const {_id, ...updateObject} = updateProducto;
      const result = await super.update(_id as string, updateObject);
      return result;
    } catch( ex: unknown) {
      console.log("productosDao mongodb:", (ex as Error).message);
      throw ex;
    }
  }

  public async getCountProducto(userId:string) {
    try {
      return await super.getCollection().countDocuments({userId: new ObjectId(userId)});
    } catch( ex: unknown) {
      console.log("productosDao mongodb:", (ex as Error).message);
      throw ex;
    }
  }

  public async deleteProducto( deleteProducto: Partial<IProducto>) {
    try {
      const {_id } = deleteProducto;
      const result = await super.delete(_id as string);
      return result;
    } catch( ex: unknown) {
      console.log("productosDao mongodb:", (ex as Error).message);
      throw ex;
    }
  }
}
