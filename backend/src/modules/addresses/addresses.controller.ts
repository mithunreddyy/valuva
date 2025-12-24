import { Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { AddressesService } from "./addresses.service";

export class AddressesController {
  private service: AddressesService;

  constructor() {
    this.service = new AddressesService();
  }

  getUserAddresses = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const addresses = await this.service.getUserAddresses(req.user!.userId);
    return ResponseUtil.success(res, addresses);
  };

  getAddressById = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const address = await this.service.getAddressById(
      req.params.id,
      req.user!.userId
    );
    return ResponseUtil.success(res, address);
  };

  createAddress = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const address = await this.service.createAddress(
      req.user!.userId,
      req.body
    );
    return ResponseUtil.success(
      res,
      address,
      SUCCESS_MESSAGES.CREATED,
      HTTP_STATUS.CREATED
    );
  };

  updateAddress = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    const address = await this.service.updateAddress(
      req.params.id,
      req.user!.userId,
      req.body
    );
    return ResponseUtil.success(res, address, SUCCESS_MESSAGES.UPDATED);
  };

  deleteAddress = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {
    await this.service.deleteAddress(req.params.id, req.user!.userId);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.DELETED);
  };
}
