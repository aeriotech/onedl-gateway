import { mockShop } from 'src/shop/mock/shop.mock';

export const mockDiscounts = [
  {
    id: 0,
    uuid: 'test-discount',
    max: 5,
    parts: 1,
    shop: mockShop,
    validFrom: new Date(),
    validTo: new Date(),
  },
  {
    id: 1,
    uuid: 'another-test-discount',
    max: 10,
    parts: 3,
    shop: mockShop,
    validFrom: new Date(),
    validTo: new Date(),
  },
  {
    id: 2,
    uuid: 'last-test-discount',
    max: 1,
    parts: 10,
    shop: mockShop,
    validFrom: new Date(),
    validTo: new Date(),
  },
];

export const mockDiscount = mockDiscounts[0];
