import { prisma } from "../../config/database";

export class AddressesRepository {
  async getUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  async getAddressById(id: string, userId: string) {
    return prisma.address.findFirst({
      where: { id, userId },
    });
  }

  async createAddress(userId: string, data: any) {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          ...data,
        },
      });
    });
  }

  async updateAddress(id: string, userId: string, data: any) {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.updateMany({
        where: { id, userId },
        data,
      });
    });
  }

  async deleteAddress(id: string, userId: string) {
    await prisma.address.deleteMany({
      where: { id, userId },
    });
  }
}
