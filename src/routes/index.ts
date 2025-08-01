import { Request, Response, Router } from 'express';
import AuthRouter from './Auth';
import TouristRouter from './tourist';
import DestinationRouter from './destination';
import TripRouter from './trip';
import PaymentRouter from './payment';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Mlaka mulu server running!');
});

router.use('/auth', AuthRouter);
router.use('/tourist', TouristRouter);
router.use('/destination', DestinationRouter);
router.use('/trip', TripRouter);
router.use('/payment', PaymentRouter);

export default router;
