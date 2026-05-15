import { z } from 'zod';

// create wishlist validation
const createWishlistValidation = z.object({
  body: z.object({
    property: z.string().min(1, 'Property is required'),
  }),
});

// delete wishlist validation
const deleteWishlistValidation = z.object({
  params: z.object({
    id: z.string().min(1, 'Wishlist ID is required'),
  }),
});

// get wishlist by user id validation
const getWishlistByUserIdValidation = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
});

export const WishlistValidations = {
  createWishlistValidation,
  getWishlistByUserIdValidation,
  deleteWishlistValidation,
};