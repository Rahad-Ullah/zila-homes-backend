import { z } from 'zod';
import { UserStatus } from './user.constant';
import { objectId } from '../../../shared/objectIdValidator';

const createUserZodSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
    phone: z.string({ required_error: 'Phone is required' }).optional(),
    image: z.string().optional(),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    image: z.string().optional(),
  }),
});

const updateStatusZodSchema = z.object({
  params: z.object({
    id: objectId('user id'),
  }),
  body: z.object({
    status: z.nativeEnum(UserStatus, { required_error: 'Status is required' }),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  updateStatusZodSchema,
};
