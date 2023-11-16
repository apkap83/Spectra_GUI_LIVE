import { useEffect, useState } from "react";
import httpService from "../../../services/httpService";
import config from "../../../config.json";
const apiEndPoint =
  config.apiPrefix +
  "/api/charts/aaa_avg_outages_perday_uniq_dslam_sess_affacted";

import { formatNumberWithThousandsSeparator } from "../../../lib/helpFunctions";

export const Boxes = ({
  dateRange,
  loading,
  netWorkOutagesAvgPercentage,
  windNovaOutagesOverTotalEvents,
}) => {
  const [avgOutagesPerDay, setAvgOutagesPerDay] = useState(0);
  const [dslamAffected, setDslamAffected] = useState(0);
  const [usersAffected, setUsersAffected] = useState(0);

  const [currentlyLoading, setCurrentlyLoading] = useState(true);

  useEffect(() => {
    let { startDate, endDate } = dateRange;

    startDate = startDate;
    endDate = endDate.add(1, "day");

    const getDataFromDB = async () => {
      const { data: myData } = await httpService.post(apiEndPoint, {
        dateRange: { startDate, endDate },
      });

      if (myData) {
        setAvgOutagesPerDay(myData[0]["avgOutagesPerDay"]);
        setDslamAffected(myData[0]["uniqueDslam"]);
        setUsersAffected(myData[0]["sessionAffected"]);
      }
    };

    getDataFromDB();
  }, []);

  const showBoxes =
    !currentlyLoading &&
    avgOutagesPerDay &&
    netWorkOutagesAvgPercentage &&
    windNovaOutagesOverTotalEvents;

  useEffect(() => {
    if (
      loading &&
      loading.length > 0 &&
      loading[0] === true &&
      loading[1] === true
    ) {
      setCurrentlyLoading(false);
    }
  }, [loading]);

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

        {/* <table className="infoBox__table">
          <tbody>
            <tr className="infoBox__table--1">
              <td className="infoBox__table--1-td1">
                Cabinets/
                <br />
                DSLAMs Affected:
              </td>
              <td className="infoBox__table--1-td2">
                {formatNumberWithThousandsSeparator(parseFloat(dslamAffected))}
              </td>
            </tr>
            <tr className="infoBox__table--2">
              <td className="infoBox__table--2-td1">Users Affected:</td>
              <td className="infoBox__table--2-td2">
                {formatNumberWithThousandsSeparator(parseFloat(usersAffected))}
              </td>
            </tr>
          </tbody>
        </table> */}

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
        <h4 className="infoBox__title">
          Entire Network Outages over all Events on Average
        </h4>

        <h1
          className="infoBox__avgNumber"
          style={{
            marginLeft: "1.4rem",
          }}
        >
          {netWorkOutagesAvgPercentage}%
        </h1>

        {/* <table className="infoBox__table">
          <tbody>
            <tr className="infoBox__table--1">
              <td>
                Cabinets/
                <br />
                DSLAMs Affected:
              </td>
              <td>{dslamAffected}</td>
            </tr>
            <tr>
              <td>Users Affected:</td>
              <td>{usersAffected}</td>
            </tr>
          </tbody>
        </table> */}
      </div>

      <div
        className="infoBox collapsibleConent"
        style={{
          height: showBoxes ? "var(--infoBox-height)" : "0",
          transition: "height 0.2s ease-out",
        }}
      >
        <h4 className="infoBox__title">
          Wind + Nova Outages over Wind+Nova total Events
        </h4>

        <h1 className="infoBox__avgNumber" style={{ marginLeft: "1.8rem" }}>
          {windNovaOutagesOverTotalEvents}%
        </h1>

        {/* <table className="infoBox__table">
          <tbody>
            <tr className="infoBox__table--1">
              <td>
                Cabinets/
                <br />
                DSLAMs Affected:
              </td>
              <td>{dslamAffected}</td>
            </tr>
            <tr>
              <td>Users Affected:</td>
              <td>{usersAffected}</td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  );
};
