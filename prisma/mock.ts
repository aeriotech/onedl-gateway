jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      const mockPostFindMany = jest.fn().mockReturnValue([])
      return {
        post: {
          findMany: {},
        },
      }
    }),
  }
})
