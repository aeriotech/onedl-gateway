import { Shop } from '@prisma/client';

export const mockShop: Shop = {
  id: 0,
  uuid: 'test-shop',
  name: 'Test shop',
  public: true,
  logoId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
