import { Request, Response } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../config/constants";
import { AuthRequest } from "../../middleware/auth.middleware";
import { ResponseUtil } from "../../utils/response.util";
import { AddressesService } from "./addresses.service";

export class AddressesController {
  private service: AddressesService;

  constructor() {
    this.service = new AddressesService();
  }

  getUserAddresses = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const addresses = await this.service.getUserAddresses(authReq.user!.userId);
    return ResponseUtil.success(res, addresses);
  };

  getAddressById = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const address = await this.service.getAddressById(
      req.params.id,
      authReq.user!.userId
    );
    return ResponseUtil.success(res, address);
  };

  createAddress = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const address = await this.service.createAddress(
      authReq.user!.userId,
      req.body
    );
    return ResponseUtil.success(
      res,
      address,
      SUCCESS_MESSAGES.CREATED,
      HTTP_STATUS.CREATED
    );
  };

  updateAddress = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    const address = await this.service.updateAddress(
      req.params.id,
      authReq.user!.userId,
      req.body
    );
    return ResponseUtil.success(res, address, SUCCESS_MESSAGES.UPDATED);
  };

  deleteAddress = async (req: Request, res: Response): Promise<Response> => {
    const authReq = req as AuthRequest;
    await this.service.deleteAddress(req.params.id, authReq.user!.userId);
    return ResponseUtil.success(res, null, SUCCESS_MESSAGES.DELETED);
  };
}
