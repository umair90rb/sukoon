import { Op, Sequelize } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import _orderService from "../services/OrderService";

const { Order } = model;

const ORDER_TYPE = {
  unassigned: {
    [Op.and]: [{ user_id: null }, { status: "Received" }],
  },
  assigned_not_confirmed: {
    [Op.and]: [{ user_id: { [Op.ne]: null } }, { status: "Assigned" }],
  },
  previous_no_pick: {
    [Op.and]: [{ user_id: { [Op.ne]: null } }, { status: "No Pick" }],
  },
};

export default {
  async orderFiltered(req, res) {
    try {
      const { chanel, brand, startPeriod, endPeriod, users, type } = req.body;

      let query = {
        attributes: ["id"],
        where: {},
      };
      if (chanel && chanel.length) {
        query.where["chanel_id"] = { [Op.in]: chanel };
      }
      if (users && users.length) {
        query.where["user_id"] = { [Op.in]: users };
      }
      if (brand && brand.length) {
        query.where["brand_id"] = { [Op.in]: brand };
      }
      if (startPeriod) {
        query.where["createdAt"] = { [Op.gte]: startPeriod };
      }
      if (endPeriod) {
        query.where["createdAt"] = {
          ...query.where["createdAt"],
          [Op.lte]: endPeriod,
        };
      }
      if (type && type !== "All") {
        query.where = { ...query.where, ...ORDER_TYPE[type] };
      }
      const orders = await Order.findAll(query);
      if (orders) {
        return sendSuccessResponse(
          res,
          200,
          {
            orders: orders && orders.map((order) => order.id),
          },
          "Filtered orders"
        );
      }
      return sendErrorResponse(res, 404, "No data found!");
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },
};
