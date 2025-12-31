import { AddressesRepository } from "../../modules/addresses/addresses.repository";
import { AddressesService } from "../../modules/addresses/addresses.service";

// Mock the repository
jest.mock("../../modules/addresses/addresses.repository");


describe("AddressesService", () => {
  let service: AddressesService;
  let mockRepository: jest.Mocked<AddressesRepository>;

  beforeEach(() => {
    mockRepository = {
      getUserAddresses: jest.fn(),
      getAddressById: jest.fn(),
      createAddress: jest.fn(),
      updateAddress: jest.fn(),
      deleteAddress: jest.fn(),
    } as any;

    (AddressesRepository as jest.Mock).mockImplementation(() => mockRepository);
    service = new AddressesService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserAddresses", () => {
    it("should return all user addresses", async () => {
      const userId = "1";
      const mockAddresses = [
        {
          id: "1",
          userId,
          street: "123 Main St",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
          isDefault: true,
        },
        {
          id: "2",
          userId,
          street: "456 Park Ave",
          city: "Delhi",
          state: "Delhi",
          pincode: "110001",
          isDefault: false,
        },
      ];

      mockRepository.getUserAddresses.mockResolvedValue(mockAddresses as any);

      const result = await service.getUserAddresses(userId);

      expect(result).toEqual(mockAddresses);
      expect(mockRepository.getUserAddresses).toHaveBeenCalledWith(userId);
    });

    it("should return empty array if no addresses", async () => {
      const userId = "1";
      mockRepository.getUserAddresses.mockResolvedValue([]);

      const result = await service.getUserAddresses(userId);

      expect(result).toEqual([]);
    });
  });

  describe("getAddressById", () => {
    it("should return address when found", async () => {
      const addressId = "1";
      const userId = "1";
      const mockAddress = {
        id: addressId,
        userId,
        street: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
      };

      mockRepository.getAddressById.mockResolvedValue(mockAddress as any);

      const result = await service.getAddressById(addressId, userId);

      expect(result).toEqual(mockAddress);
      expect(mockRepository.getAddressById).toHaveBeenCalledWith(addressId, userId);
    });

    it("should throw NotFoundError when address not found", async () => {
      mockRepository.getAddressById.mockResolvedValue(null);

      await expect(service.getAddressById("nonexistent", "userId")).rejects.toThrow(
        "Address not found"
      );
    });
  });

  describe("createAddress", () => {
    it("should create address successfully", async () => {
      const userId = "1";
      const addressData = {
        street: "123 Main St",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        isDefault: true,
      };

      const mockAddress = {
        id: "1",
        userId,
        ...addressData,
      };

      mockRepository.createAddress.mockResolvedValue(mockAddress as any);

      const result = await service.createAddress(userId, addressData);

      expect(result).toEqual(mockAddress);
      expect(mockRepository.createAddress).toHaveBeenCalledWith(userId, addressData);
    });
  });

  describe("updateAddress", () => {
    it("should update address successfully", async () => {
      const addressId = "1";
      const userId = "1";
      const updateData = {
        street: "456 Updated St",
        city: "Pune",
      };

      const existingAddress = {
        id: addressId,
        userId,
        street: "123 Main St",
        city: "Mumbai",
      };

      const updatedAddress = {
        ...existingAddress,
        ...updateData,
      };

      mockRepository.getAddressById
        .mockResolvedValueOnce(existingAddress as any)
        .mockResolvedValueOnce(updatedAddress as any);
      mockRepository.updateAddress.mockResolvedValue(undefined as any);

      const result = await service.updateAddress(addressId, userId, updateData);

      expect(result).toEqual(updatedAddress);
      expect(mockRepository.updateAddress).toHaveBeenCalledWith(
        addressId,
        userId,
        updateData
      );
    });

    it("should throw NotFoundError when address not found", async () => {
      mockRepository.getAddressById.mockResolvedValue(null);

      await expect(
        service.updateAddress("nonexistent", "userId", {})
      ).rejects.toThrow("Address not found");
    });
  });

  describe("deleteAddress", () => {
    it("should delete address successfully", async () => {
      const addressId = "1";
      const userId = "1";
      const mockAddress = {
        id: addressId,
        userId,
        street: "123 Main St",
      };

      mockRepository.getAddressById.mockResolvedValue(mockAddress as any);
      mockRepository.deleteAddress.mockResolvedValue(undefined as any);

      await service.deleteAddress(addressId, userId);

      expect(mockRepository.deleteAddress).toHaveBeenCalledWith(addressId, userId);
    });

    it("should throw NotFoundError when address not found", async () => {
      mockRepository.getAddressById.mockResolvedValue(null);

      await expect(service.deleteAddress("nonexistent", "userId")).rejects.toThrow(
        "Address not found"
      );
    });
  });
});

