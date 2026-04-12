import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Tymczasowa strona - backend w budowie
  res.status(200).json({ 
    message: 'Backend w budowie - wkrótce będzie działać!',
    code: req.query.code 
  });
}