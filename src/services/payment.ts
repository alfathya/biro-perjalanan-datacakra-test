import { prisma } from "../utils/prisma";
import { CreatePaymentRequest, UpdatePaymentRequest, PaymentResponse } from "../types/payment";
import { ApiError } from "../utils/apiError";

export class PaymentService {
  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const existingTrip = await prisma.trip.findUnique({
        where: { id: data.tripId },
        include: { payment: true }
      });

      if (!existingTrip) {
        throw new ApiError("Trip tidak ditemukan", 404);
      }

      if (existingTrip.payment) {
        throw new ApiError("Trip ini sudah memiliki payment", 400);
      }

      if(existingTrip.totalPrice !== data.amount) {
        throw new ApiError("Jumlah pembayaran tidak sesuai dengan total harga", 400);
      }

        const payment = await prisma.payment.create({
          data: {
            tripId: data.tripId,
            amount: data.amount,
            method: data.method,
            transactionId: data.transactionId,
            notes: data.notes,
            status: "pending",
          },
          include: {
            trip: {
              include: {
                tourist: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                      },
                    },
                  },
                },
                destination: {
                  select: {
                    id: true,
                    name: true,
                    country: true,
                    city: true,
                  },
                },
              },
            },
          },
        });

      return payment;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Gagal membuat payment", 500);
    }
  }

  async getAllPayments(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          skip,
          take: limit,
          include: {
            trip: {
              include: {
                tourist: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                      }
                    }
                  }
                },
                destination: {
                  select: {
                    id: true,
                    name: true,
                    country: true,
                    city: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.payment.count()
      ]);

      return {
        data: payments,
        meta: {
          current: page,
          pages: Math.ceil(total / limit),
          total: total,
          limit: limit,
        },
      };
    } catch (error) {
      throw new ApiError("Gagal mengambil data payments", 500);
    }
  }

  async getPaymentById(id: string): Promise<PaymentResponse> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
          trip: {
            include: {
              tourist: {
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true
                    }
                  }
                }
              },
              destination: {
                select: {
                  id: true,
                  name: true,
                  country: true,
                  city: true
                }
              }
            }
          }
        }
      });

      if (!payment) {
        throw new ApiError("Payment tidak ditemukan", 404);
      }

      return payment;
    } catch (error) {
      throw new ApiError("Gagal mengambil data payment", 500);
    }
  }

  async getPaymentByTripId(tripId: string): Promise<PaymentResponse | null> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { tripId },
        include: {
          trip: {
            include: {
              tourist: {
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true
                    }
                  }
                }
              },
              destination: {
                select: {
                  id: true,
                  name: true,
                  country: true,
                  city: true
                }
              }
            }
          }
        }
      });

      return payment;
    } catch (error) {
      throw new ApiError("Gagal mengambil data payment", 500);
    }
  }

  async updatePayment(id: string, data: UpdatePaymentRequest): Promise<PaymentResponse> {
    try {
      const existingPayment = await prisma.payment.findUnique({
        where: { id }
      });

      if (!existingPayment) {
        throw new ApiError("Payment tidak ditemukan", 404);
      }

      const payment = await prisma.payment.update({
        where: { id },
        data: {
          amount: data.amount,
          method: data.method,
          transactionId: data.transactionId,
          notes: data.notes,
        },
        include: {
          trip: {
            include: {
              tourist: {
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true
                    }
                  }
                }
              },
              destination: {
                select: {
                  id: true,
                  name: true,
                  country: true,
                  city: true
                }
              }
            }
          }
        }
      });

      return payment;
    } catch (error) {
      throw new ApiError("Gagal mengupdate payment", 500);
    }
  }

  async deletePayment(id: string): Promise<void> {
    try {
      const existingPayment = await prisma.payment.findUnique({
        where: { id }
      });

      if (!existingPayment) {
        throw new ApiError("Payment tidak ditemukan", 404);
      }

      await prisma.payment.delete({
        where: { id }
      });
    } catch (error) {
      throw new ApiError("Gagal menghapus payment", 500);
    }
  }

  async getPaymentsByTouristId(touristId: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where: {
            trip: {
              touristId: touristId
            }
          },
          skip,
          take: limit,
          include: {
            trip: {
              include: {
                tourist: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                      }
                    }
                  }
                },
                destination: {
                  select: {
                    id: true,
                    name: true,
                    country: true,
                    city: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.payment.count({
          where: {
            trip: {
              touristId: touristId
            }
          }
        })
      ]);

      return {
        data: payments,
        meta: {
          current: page,
          pages: Math.ceil(total / limit),
          total: total,
          limit: limit,
        },
      };
    } catch (error) {
      throw new ApiError("Gagal mengambil data payments tourist", 500);
    }
  }

  async confirmPayment(id: string, transactionId?: string): Promise<PaymentResponse> {
    try {
      const existingPayment = await prisma.payment.findUnique({
        where: { id },
        include: { trip: true }
      });

      if (!existingPayment) {
        throw new ApiError("Payment tidak ditemukan", 404);
      }

      if (existingPayment.status === 'paid') {
        throw new ApiError("Payment sudah dikonfirmasi sebelumnya", 400);
      }

      if(existingPayment.status !== 'pending') {
        throw new ApiError("Trip ini sudah dikonfirmasi atau dibatalkan", 400);
      }

      const [payment] = await prisma.$transaction([
        prisma.payment.update({
          where: { id },
          data: {
            status: 'paid',
            paymentDate: new Date(),
            transactionId: transactionId || existingPayment.transactionId,
          },
          include: {
            trip: {
              include: {
                tourist: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                      }
                    }
                  }
                },
                destination: {
                  select: {
                    id: true,
                    name: true,
                    country: true,
                    city: true
                  }
                }
              }
            }
          }
        }),
        prisma.trip.update({
          where: { id: existingPayment.tripId },
          data: { status: 'confirmed' }
        })
      ]);

      return payment;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Gagal mengkonfirmasi payment", 500);
    }
  }

  async cancelPayment(id: string, touristId: string): Promise<PaymentResponse> {
    try {
      const existingPayment = await prisma.payment.findUnique({
        where: { id },
        include: { 
          trip: {
            select: {
              id: true,
              touristId: true,
              status: true
            }
          }
        }
      });

      if (!existingPayment) {
        throw new ApiError("Payment tidak ditemukan", 404);
      }

      if (existingPayment.trip.touristId !== touristId) {
        throw new ApiError("Anda tidak memiliki akses untuk membatalkan payment ini", 403);
      }

      if (existingPayment.status === 'paid') {
        throw new ApiError("Payment yang sudah dibayar tidak dapat dibatalkan", 400);
      }

      if (existingPayment.status === 'refunded') {
        throw new ApiError("Payment sudah dibatalkan sebelumnya", 400);
      }

      const [payment] = await prisma.$transaction([
        prisma.payment.update({
          where: { id },
          data: {
            status: "refunded",
            notes: existingPayment.notes
              ? `${
                  existingPayment.notes
                } - Dibatalkan oleh tourist pada ${new Date().toISOString()}`
              : `Dibatalkan oleh tourist pada ${new Date().toISOString()}`,
          },
          include: {
            trip: {
              include: {
                tourist: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                      },
                    },
                  },
                },
                destination: {
                  select: {
                    id: true,
                    name: true,
                    country: true,
                    city: true,
                  },
                },
              },
            },
          },
        }),
        prisma.trip.update({
          where: { id: existingPayment.tripId },
          data: { status: "cancelled" },
        }),
      ]);

      return payment;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Gagal membatalkan payment", 500);
    }
  }
}

export const paymentService = new PaymentService();