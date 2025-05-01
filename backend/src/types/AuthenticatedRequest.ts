// types/AuthenticatedRequest.ts
import { Request } from 'express';
import { IUser } from '../models/User'; // Make sure to adjust this import

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
