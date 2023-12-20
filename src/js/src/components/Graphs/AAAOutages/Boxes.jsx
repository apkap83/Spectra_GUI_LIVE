import { useEffect, useState } from "react";
import httpService from "../../../services/httpService";
import config from "../../../config";

const apiEndPoint =
  config.apiPrefix +
  "/api/charts/aaa_avg_outages_perday_uniq_dslam_sess_affacted";

const apiEndPointTotal =
  config.apiPrefix + "/api/charts/getPowerVSNTWOutagesTotal";

import { formatNumberWithThousandsSeparator } from "../../../lib/helpFunctions";

const enrichObject = (myDataTotal) => {
  // Calculating the sum of all 'total' values
  let nextId = myDataTotal.reduce(
    (sum, item) => sum + parseInt(item.id, 10),
    0
  );

  // Calculating the sum of all 'total' values
  let totalSum = myDataTotal.reduce(
    (sum, item) => sum + parseInt(item.total, 10),
    0
  );

  // Calculating the sum of all 'total' values
  let windNovaSum = myDataTotal.reduce(
    (sum, item) => sum + parseInt(item.wind_NOVA, 10),
    0
  );

  const networkObj = myDataTotal.find((item) => item.outage_TYPE === "Network");
  const powerObj = myDataTotal.find((item) => item.outage_TYPE === "Power");

  console.log("myDataTotal", myDataTotal);
  myDataTotal.push({
    id: nextId,
    totalPercentage: ((parseFloat(networkObj.total) / totalSum) * 100).toFixed(
      1
    ),
    windNovaPercentage: ((parseFloat(powerObj.total) / totalSum) * 100).toFixed(
      1
    ),
  });
};

export const Boxes = ({ dateRange }) => {
  const [avgOutagesPerDay, setAvgOutagesPerDay] = useState(0);
  const [dslamAffected, setDslamAffected] = useState(0);
  const [usersAffected, setUsersAffected] = useState(0);

  const [myDataTotal, setMyDataTotal] = useState([]);

  const [currentlyLoading, setCurrentlyLoading] = useState(true);

  useEffect(() => {
    let { startDate, endDate } = dateRange;

    startDate = startDate;
    endDate = endDate.add(1, "day");

    const getDataFromDB = async () => {
      const { data: myData } = await httpService.post(apiEndPoint, {
        dateRange: { startDate, endDate },
      });
      const { data: myDataTotal } = await httpService.post(apiEndPointTotal, {
        dateRange: { startDate, endDate },
      });

      if (myData && myDataTotal) {
        setAvgOutagesPerDay(myData[0]["avgOutagesPerDay"]);
        setDslamAffected(myData[0]["uniqueDslam"]);
        setUsersAffected(myData[0]["sessionAffected"]);

        // Add Total and Wind Nova Percentages
        enrichObject(myDataTotal);
        setMyDataTotal(myDataTotal);
      }
      setCurrentlyLoading(false);
    };

    getDataFromDB();
  }, []);

  const showBoxes =
    !currentlyLoading &&
    avgOutagesPerDay &&
    dslamAffected &&
    usersAffected &&
    myDataTotal;
  // windNovaOutagesOverTotalEvents;

  return (
    <div className="infoBoxContainer">
      <div
        className="infoBox collapsibleConent"
        style={{
          height: showBoxes ? "var(--infoBox-height)" : "0",
          transition: "height 0.2s ease-out",
        }}
      >
        <h4 className="infoBox__title">Average Outages Per Day</h4>

        <h1 className="infoBox__avgNumber">{avgOutagesPerDay}</h1>
        <div className="infoBox__details">
          <div className="infoBox__details__row">
            <div className="infoBox__details__row--left">
              Cabinets/ DSLAMs Affected:
            </div>
            <div className="infoBox__details__row--right">
              {formatNumberWithThousandsSeparator(parseFloat(dslamAffected))}
            </div>
          </div>
          <div className="infoBox__details__row">
            <div className="infoBox__details__row--left">Users Affected:</div>
            <div className="infoBox__details__row--right">
              {formatNumberWithThousandsSeparator(parseFloat(usersAffected))}
            </div>
          </div>
        </div>
      </div>
      <div
        className="infoBox collapsibleConent"
        style={{
          height: showBoxes ? "var(--infoBox-height)" : "0",
          transition: "height 0.2s ease-out",
        }}
      >
        <h4
          className="infoBox__title"
          style={{
            margin: "-1.3rem 0 1rem",
          }}
        >
          Network Outages over all Events on Average
        </h4>

        <h1
          className="infoBox__avgNumber"
          style={{
            marginLeft: "1.4rem",
          }}
        >
          {myDataTotal[3]?.totalPercentage}%
        </h1>
      </div>

      <div
        className="infoBox collapsibleConent"
        style={{
          height: showBoxes ? "var(--infoBox-height)" : "0",
          transition: "height 0.2s ease-out",
        }}
      >
        <h4
          className="infoBox__title"
          style={{
            margin: "-1.3rem 0 1.3rem",
          }}
        >
          Power Outages over all Events on Average
        </h4>

        <h1 className="infoBox__avgNumber" style={{ marginLeft: "1rem" }}>
          {myDataTotal[3]?.windNovaPercentage}%
        </h1>
      </div>
    </div>
  );
};
