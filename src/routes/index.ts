import { Request, Response, Router } from 'express';
import AuthRouter from './Auth';
import TouristRouter from './tourist';
import DestinationRouter from './destination';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Mlaka mulu server running!');
});

router.use('/auth', AuthRouter);
router.use('/tourist', TouristRouter);
router.use('/destination', DestinationRouter);

export default router;
