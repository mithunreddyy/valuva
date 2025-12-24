import { NotFoundError } from "../../utils/error.util";
import { AddressesRepository } from "./addresses.repository";

export class AddressesService {
  private repository: AddressesRepository;

  constructor() {
    this.repository = new AddressesRepository();
  }

  async getUserAddresses(userId: string) {
    return this.repository.getUserAddresses(userId);
  }

  async getAddressById(id: string, userId: string) {
    const address = await this.repository.getAddressById(id, userId);
    if (!address) {
      throw new NotFoundError("Address not found");
    }
    return address;
  }

  async createAddress(userId: string, data: any) {
    return this.repository.createAddress(userId, data);
  }

  async updateAddress(id: string, userId: string, data: any) {
    const address = await this.repository.getAddressById(id, userId);
    if (!address) {
      throw new NotFoundError("Address not found");
    }
    await this.repository.updateAddress(id, userId, data);
    return this.getAddressById(id, userId);
  }

  async deleteAddress(id: string, userId: string) {
    const address = await this.repository.getAddressById(id, userId);
    if (!address) {
      throw new NotFoundError("Address not found");
    }
    await this.repository.deleteAddress(id, userId);
  }
}
