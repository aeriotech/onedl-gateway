import { Test, TestingModule } from '@nestjs/testing'
import { DiscountController } from './discount.controller'

jest.mock('@prisma/client')

// jest.mock('@primsa/client', () => {
//   return {
//     PrismaClient: jest.fn().mockImplementation(() => {
//       const mockDiscountCreate = jest.fn().mockReturnValue({})
//       return {
//         discount: {
//           create: {
//             mockDiscountCreate,
//           },
//         },
//       }
//     }),
//   }
// })

describe('DiscountController', () => {
  let controller: DiscountController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountController],
    }).compile()

    controller = module.get<DiscountController>(DiscountController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  // describe('create', () => {
  //   it('should create entry in db and return the object', () => {})
  // })
})
