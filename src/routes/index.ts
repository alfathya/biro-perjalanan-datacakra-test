import { Request, Response, Router } from 'express';
import AuthRouter from './Auth';
import TouristRouter from './tourist';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Mlaka mulu server running!');
});

router.use('/auth', AuthRouter);
router.use('/tourist', TouristRouter);

export default router;
