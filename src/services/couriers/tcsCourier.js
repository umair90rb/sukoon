import CourierInterface from "../courierInterface";
import getAxiosInstance from "../http";
import models from "../../models";
import logger from "../../middleware/logger";
const { CityNameMaping } = models;

class TCSCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance("https://devconnect.tcscourier.com/", {});
  }
  async getHeaderToken(id, secret) {
    let res;
    try {
      let headersList = {
        Accept: "*/*",
      };

      let reqOptions = {
        url: `https://devconnect.tcscourier.com/auth/api/auth?ClientID=${id}&ClientSecret=${secret}`,
        method: "GET",
        headers: headersList,
      };

      res = await this.http.request(reqOptions);
      console.log(res?.data);
      return res?.data?.result?.accessToken;
    } catch (error) {
      logger.log("error", error.message, {
        res: res?.data,
        error,
      });
    }
  }

  async getBodyToken(token, username, password) {
    let res;
    try {
      let headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      };

      let reqOptions = {
        url: `https://devconnect.tcscourier.com/ecom/api/authentication/token?username=${username}&password=${password}`,
        method: "GET",
        headers: headersList,
      };

      res = await this.http.request(reqOptions);
      console.log(res?.data);
      return res?.data?.accesstoken;
    } catch (error) {
      logger.log("error", "tcs get header token api response", {
        res: res?.data,
        error,
      });
    }
  }

  async bookParcel(order, deliveryAccount) {
    let response, body;
    try {
      const destinationCity = await CityNameMaping.findOne({
        where: {
          city: order.address.city,
          courier: deliveryAccount.service,
        },
        raw: true,
      });
      if (!destinationCity) {
        return {
          cn: null,
          slip: null,
          isSuccess: false,
          error: "City not found in the database, contact admin",
          response: "destination not found in the db",
        };
      }
      const headerToken = await this.getHeaderToken(
        deliveryAccount.client_id,
        deliveryAccount.key
      );
      if (!headerToken) {
        return {
          cn: null,
          slip: null,
          isSuccess: false,
          error: "Error in getting token from tcs service",
          response: "Error in getting token from tcs service",
        };
      }
      const bodyToken = await this.getBodyToken(
        headerToken,
        deliveryAccount.username,
        deliveryAccount.password
      );
      if (!bodyToken) {
        return {
          cn: null,
          slip: null,
          isSuccess: false,
          error: "Error in getting second token from tcs service",
          response: "Error in getting second token from tcs service",
        };
      }
      body = {
        accessToken: bodyToken,
        consignmentno: "",
        shipperinfo: {
          tcsaccount: "04011K1",
          shippername: "Test",
          address1: "Test address 1",
          address2: "",
          address3: "",
          zip: "75800",
          countrycode: "PK",
          countryname: "Pakistan",
          citycode: "KHI",
          cityname: "Karachi",
          mobile: "03451234567",
        },
        consigneeinfo: {
          consigneecode: "",
          firstname: order.customer.first_name,
          middlename: "",
          lastname: order.customer.last_name,
          address1: order.address.address1,
          address2: "",
          address3: "",
          zip: "38000",
          countrycode: "PK",
          countryname: "Pakistan",
          citycode: destinationCity.code,
          cityname: destinationCity.maped,
          email: "",
          areacode: "",
          areaname: "",
          blockcode: "",
          blockname: "",
          lat: "",
          lng: "",
          mobile: order.customer.phone || order.address.phone,
        },
        vendorinfo: {
          name: "Sukooon Wellness",
          address1: "K-86",
          address2: "Test address 2",
          address3: "Test address 2",
          citycode: "FSD",
          cityname: "Faisalabad",
          mobile: "03451234567",
        },
        shipmentinfo: {
          costcentercode: "Test-01",
          referenceno: `${order.brand.name}x${order.brand.shipment_series}`,
          contentdesc: order.items.reduce(
            (p, c, i) =>
              i > 0
                ? `${c.name}/${c.quantity}-${p}`
                : `${c.name}/${c.quantity}`,
            ""
          ),
          servicecode: "O",
          parametertype: "",
          shipmentdate: `${new Date()
            .toLocaleString("en-GB", { hour12: false })
            .replace(",", "")}`,
          shippingtype: "",
          currency: "PKR",
          codamount: order.total_price,
          declaredvalue: null,
          insuredvalue: null,
          transactiontype: "",
          dsflag: "",
          carrierslug: "",
          weightinkg: 0.5,
          pieces: order.items.length,
          fragile: false,
          remarks:
            order.address.address2 ||
            order.items.reduce(
              (p, c, i) =>
                i > 0
                  ? `${c.name}/${c.quantity}-${p}`
                  : `${c.name}/${c.quantity}`,
              ""
            ),
          skus: [],
        },
      };
      response = await this.http.post("ecom/api/booking/create", body, {
        headers: { Authorization: `Bearer ${headerToken}` },
      });
      logger.log("info", "tcs book parcel api response", {
        res: response?.data,
        body,
      });
      const { consignmentNo, message, traceid } = response?.data || {};
      return {
        cn: consignmentNo,
        slip: JSON.stringify({ traceid }),
        isSuccess: message === "SUCCESS",
        error: message !== "SUCCESS" ? message : null,
        response: message,
      };
    } catch (error) {
      logger.log("error", error.message, {
        body,
        res: response?.data,
        stack: "in tcs booking function",
      });
      const { message } = response?.data || {};
      return {
        cn: null,
        slip: null,
        isSuccess: false,
        error: error.message,
        response: message,
      };
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response;
    try {
      const headerToken = await this.getHeaderToken(
        deliveryAccount.client_id,
        deliveryAccount.key
      );
      let headersList = {
        Accept: "*/*",
        Authorization: `Bearer ${headerToken}`,
      };

      let reqOptions = {
        url: `https://devconnect.tcscourier.com/tracking/api/Tracking/GetDynamicTrackDetail?consignee=${trackingNumber}`,
        method: "GET",
        headers: headersList,
      };

      response = await this.http.request(reqOptions);
      console.log(response?.data);
      const {
        shipmentinfo,
        deliveryinfo,
        checkpoints,
        shipmentsummary,
        message,
        traceid,
      } = response.data;
      return {
        isSuccess: message === "SUCCESS",
        error: message === "SUCCESS" ? null : message,
        history: checkpoints,
        status: deliveryinfo,
        date: null,
        remarks: shipmentsummary,
        data: { shipmentinfo },
        response: "Current Booking status!",
      };
    } catch (error) {
      logger.log("error", "tcs booking status api response", {
        res: response.data,
      });
      return {
        isSuccess: false,
        data: {},
        history: [],
        status: null,
        date: null,
        remarks: null,
        error,
        response: "Error in getting booking status!",
      };
    }
  }

  async cancelBooking(trackingNumber, deliveryAccount) {
    let response, body;
    try {
      const headerToken = await this.getHeaderToken(
        deliveryAccount.client_id,
        deliveryAccount.key
      );
      const bodyToken = await this.getBodyToken(
        headerToken,
        deliveryAccount.username,
        deliveryAccount.password
      );
      body = {
        consignmentnumber: trackingNumber,
        accesstoken: bodyToken,
      };
      response = await this.http.post("ecom/api/booking/cancel", body, {
        headers: { Authorization: `Bearer ${headerToken}` },
      });
      logger.log("info", "tcs cancel booking parcel api response", {
        body,
        res: response.data,
      });
      const { message, traceid } = response?.data;
      return {
        isSuccess: Boolean(message === "SUCCESS"),
        error: message !== "SUCCESS" ? message : null,
        response: message,
      };
    } catch (error) {
      logger.log("error", "tcs cancel booking parcel api error", {
        body,
        res: response.data,
      });
      const { message, traceid } = response.data;
      return {
        isSuccess: false,
        error: message,
        response: message,
      };
    }
  }

  downloadReceipt(trackingNumber, deliveryAccount) {
    // Implementation for downloading receipt via TCS
  }
}

export default TCSCourier;
