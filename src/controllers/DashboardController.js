import { Sequelize, Op, QueryTypes } from 'sequelize';
import { sequelize } from '../models';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';

const { Order } = model;

export default {
  async stats(req, res) {
    try {
      const { startPeriod, endPeriod } = req.query;
      console.log(startPeriod, endPeriod, 'startPeriod, endPeriod');
      const result = await Order.findAll({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalOrders'],
          [
            Sequelize.fn('SUM', Sequelize.col('total_price')),
            'totalSalesValue',
          ],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                "CASE WHEN status IN ('Confirmed', 'Booked') THEN 1 ELSE 0 END"
              )
            ),
            'confirmedOrders',
          ],
          [
            Sequelize.fn(
              'COUNT',
              Sequelize.literal(
                "CASE WHEN status IN ('Confirmed', 'Booked') THEN (SELECT count(*) FROM \"OrderItems\" oi WHERE oi.order_id = id) ELSE 0 END"
              )
            ),
            'confirmedOrdersUnits',
          ],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                "CASE WHEN status IN ('Confirmed', 'Booked') THEN total_price ELSE 0 END"
              )
            ),
            'confirmedOrdersSalesValue',
          ],
          [
            Sequelize.fn(
              'ROUND',
              Sequelize.cast(
                Sequelize.fn(
                  'AVG',
                  Sequelize.literal(
                    "CASE WHEN status IN ('Confirmed', 'Booked') THEN total_price ELSE 0 END"
                  )
                ),
                'numeric'
              ),
              0
            ),
            'confirmedOrdersAverageValue',
          ],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                "CASE WHEN status = 'No Pick' OR status = 'Payment Pending' THEN 1 ELSE 0 END"
              )
            ),
            'noPickOrders',
          ],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal("CASE WHEN status = 'Cancel' THEN 1 ELSE 0 END")
            ),
            'cancelOrders',
          ],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal(
                "CASE WHEN status = 'Assigned' THEN 1 ELSE 0 END"
              )
            ),
            'assignedOrders',
          ],
          [
            Sequelize.fn(
              'SUM',
              Sequelize.literal("CASE WHEN status = 'Booked' THEN 1 ELSE 0 END")
            ),
            'bookedOrders',
          ],
        ],
        where: {
          assignedAt: {
            [Op.gte]: startPeriod,
            [Op.lte]: endPeriod,
          },
        },
      });

      const topChannels = await sequelize.query(
        `SELECT c.name AS "chanel", COUNT(*) AS "orders" FROM "Orders" AS o LEFT OUTER JOIN "Chanels" AS c ON o.chanel_id = c.id WHERE (o.deleted_at IS NULL AND (o.status IN ('Confirmed', 'Booked') AND (o.assigned_at >= :startPeriod AND o.assigned_at <= :endPeriod))) GROUP BY c.name ORDER BY orders DESC LIMIT 10`,
        { replacements: { startPeriod, endPeriod }, type: QueryTypes.SELECT }
      );
      const topItems = await sequelize.query(
        `SELECT COUNT(*) AS "sold", "oi"."name" AS "item" FROM "Orders" o JOIN "OrderItems" oi ON o.id = oi.order_id WHERE (o.deleted_at IS NULL AND (o.status IN ('Confirmed', 'Booked') AND (o.assigned_at >= :startPeriod AND o.assigned_at <= :endPeriod))) GROUP BY oi.name ORDER BY sold DESC LIMIT 10`,
        { replacements: { startPeriod, endPeriod }, type: QueryTypes.SELECT }
      );

      const topCities = await sequelize.query(
        `SELECT COUNT(*) AS "orders", "a"."city" AS "city" FROM "Orders" o JOIN "Addresses" a ON o.id = a.order_id WHERE (o.deleted_at IS NULL AND (o.status IN ('Confirmed', 'Booked') AND (o.assigned_at >= :startPeriod AND o.assigned_at <= :endPeriod))) GROUP BY a.city ORDER BY orders DESC LIMIT 5`,
        { replacements: { startPeriod, endPeriod }, type: QueryTypes.SELECT }
      );

      const stats = result[0].get();
      return sendSuccessResponse(
        res,
        201,
        { stats: { ...stats, topChannels, topItems, topCities } },
        'Dashboard stats.'
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },
};
