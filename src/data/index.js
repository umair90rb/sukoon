const { cities } = require("./cities");
const leopardCities = require("./leopardProductionCityList");
const deawooCities = require("./deawooProductionCityList");
const tcsCities = require("./tcsProductionCityList");
const postexCities = require("./postexCourierProductionCityList");

module.exports = {
  cities,
  servicesCities: [leopardCities, deawooCities, tcsCities, postexCities],
  courierList: [
    {
      service: "leopard",
      idKey: "id",
      originKey: "allow_as_origin",
      destnationKey: "allow_as_destination",
      nameKey: "name",
    },
    {
      service: "deawoo",
      idKey: "terminal_id",
      originKey: "",
      destnationKey: "",
      nameKey: "terminal_name",
    },
    {
      service: "tcs",
      idKey: "cityID",
      originKey: "",
      destnationKey: "",
      nameKey: "cityName",
    },
    {
      service: "postex",
      idKey: "",
      originKey: "isPickupCity",
      destnationKey: "isDeliveryCity",
      nameKey: "operationalCityName",
    },
  ],
};
