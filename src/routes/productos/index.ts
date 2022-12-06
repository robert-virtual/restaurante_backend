import { Router } from 'express';
import { IProducto, Producto } from '@libs/Producto';
import { commonValidator, validateInput } from '@server/utils/validator';
import { WithUserRequest } from '@routes/index';
import { jwtValidator } from '@server/middleware/jwtBeaereValidator';
const router = Router();
const productoInstance = new Producto();

router.get('/all', async (req, res) => {
  try {
    const { page, items } = { page: '1', items: '10', ...req.query };
    console.log('Producto');
    res.json(
      await productoInstance.getProductosPaged(Number(page), Number(items)),
    );
  } catch (ex) {
    console.error(ex);
    res.status(503).json({ error: ex });
  }
});
router.get('/', async (req, res) => {
  try {
    const { page, items } = { page: '1', items: '10', ...req.query };
    console.log('Producto');
    res.json(
      await productoInstance.getProductosPaged(Number(page), Number(items)),
    );
  } catch (ex) {
    console.error(ex);
    res.status(503).json({ error: ex });
  }
});

router.get('/summary', jwtValidator, async (req: WithUserRequest, res) => {
  try {
    res.json(await productoInstance.getTypeSumarry(req.user._id));
  } catch (ex) {
    console.error(ex);
    res.status(503).json({ error: ex });
  }
});

router.get('/count', jwtValidator, async (req: WithUserRequest, res) => {
  try {
    res.json({ count: await productoInstance.getCountProducto(req.user._id) });
  } catch (ex) {
    console.error(ex);
    res.status(503).json({ error: ex });
  }
});

router.get('/byindex/:index', jwtValidator, async (req, res) => {
  try {
    const { index: id } = req.params;
    res.json(await productoInstance.getProductoByIndex(id));
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ msg: 'Error al obtener Registro' });
  }
});

router.post('/testvalidator', jwtValidator, async (req, res) => {
  const { email } = req.body;

  const validateEmailSchema = commonValidator.email;
  validateEmailSchema.param = 'email';
  validateEmailSchema.required = true;
  validateEmailSchema.customValidate = (values) => {
    return values.includes('unicah.edu');
  };
  const errors = validateInput({ email }, [validateEmailSchema]);
  if (errors.length > 0) {
    return res.status(400).json(errors);
  }
  return res.json({ email });
});

router.post('/new', jwtValidator, async (req: WithUserRequest, res) => {
  try {
    const { _id: userId } = req.user;
    const newProducto = req.body as unknown as IProducto;
    //VALIDATE

    const newProductoIndex = await productoInstance.addProducto(
      newProducto,
      userId,
    );
    res.json({ newIndex: newProductoIndex });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/update/:index', jwtValidator, async (req, res) => {
  try {
    const { index: id } = req.params;
    const productoFromForm = req.body as IProducto;
    await productoInstance.updateProducto(id, productoFromForm);
    res.status(200).json({ msg: 'Registro Actualizado' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/delete/:index', jwtValidator, (req, res) => {
  try {
    const { index: id } = req.params;
    if (productoInstance.deleteProducto(id)) {
      res.status(200).json({ msg: 'Registro Eliminado' });
    } else {
      res.status(500).json({ msg: 'Error al eliminar Registro' });
    }
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ msg: 'Error al eliminar Registro' });
  }
});

export default router;
