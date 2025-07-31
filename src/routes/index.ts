import { Request, Response, Router } from 'express';
import AuthRouter from './Auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Mlaka mulu server running!');
});

router.use('/auth', AuthRouter);

export default router;
