import { mockShop } from 'src/shop/mock/shop.mock';

export const mockDiscounts = [
  {
    id: 0,
    name: 'Test discount',
    uuid: 'test-discount',
    max: 5,
    parts: 1,
    shop: mockShop,
    shopId: mockShop.id,
    validFrom: new Date(),
    validTo: new Date(),
  },
  {
    id: 1,
    name: 'Another test discount',
    uuid: 'another-test-discount',
    max: 10,
    parts: 3,
    shop: mockShop,
    shopId: mockShop.id,
    validFrom: new Date(),
    validTo: new Date(),
  },
  {
    id: 2,
    name: 'Last test discount',
    uuid: 'last-test-discount',
    max: 1,
    parts: 10,
    shop: mockShop,
    shopId: mockShop.id,
    validFrom: new Date(),
    validTo: new Date(),
  },
];

export const mockDiscount = mockDiscounts[0];
