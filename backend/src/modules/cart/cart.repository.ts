import { CartItem, Prisma } from "@prisma/client";
import { prisma } from "../../config/database";

type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export class CartRepository {
  async findOrCreateCart(userId: string): Promise<CartWithItems> {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    include: {
                      images: {
                        where: { isPrimary: true },
                        take: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async getCart(userId: string): Promise<CartWithItems | null> {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    }) as unknown as CartWithItems | null;
  }

  async addCartItem(
    cartId: string,
    variantId: string,
    quantity: number
  ): Promise<CartItem> {
    return prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId,
          variantId,
        },
      },
      create: {
        cartId,
        variantId,
        quantity,
      },
      update: {
        quantity: { increment: quantity },
      },
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        variant: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  }

  async removeCartItem(itemId: string): Promise<void> {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async getCartItemById(itemId: string) {
    return prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { variant: true },
    });
  }

  async getVariantById(variantId: string) {
    return prisma.productVariant.findUnique({
      where: { id: variantId },
    });
  }
}
