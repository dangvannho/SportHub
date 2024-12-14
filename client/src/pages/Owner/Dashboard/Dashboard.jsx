import { useState, useEffect } from "react";
import { useContext } from "react";

import { AppContext } from "~/context/AppContext";
import bookingChart from "~/services/Owner/bookingChart";
import revenueChart from "~/services/Owner/revenueChart";
import Chart from "./components/Chart/Chart";

import "./Dashboard.scss";
import getAllFieldOwner from "~/services/Field/getAllFieldOwner";

function Dashboard() {
  const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại
  const currentYear = new Date().getFullYear(); // Năm hiện tại

  const { ownerData } = useContext(AppContext);

  const [typeTime, setTypeTime] = useState("month");
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [totalField, setTotalField] = useState(0);
  const [listField, setListField] = useState([]);
  const [fieldId, setFieldId] = useState("all");
  const [topField, setTopField] = useState([]);

  // State cho biểu đồ số lượng đặt sân
  const [chart1Data, setChart1Data] = useState([]);
  const [totalBooking, setTotalBooking] = useState(0);
  const [comparePercentageBooking, setComparePercentageBooking] = useState(0);
  const [compareBooking, setCompareBooking] = useState(0);

  // State cho biểu đồ doanh thu
  const [chart2Data, setChart2Data] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [comparePercentageRevenue, setComparePercentageRevenue] = useState(0);
  const [compareRevenue, setCompareRevenue] = useState(0);

  console.log(topField.length);

  useEffect(() => {
    fetchChart();
  }, [fieldId, typeTime, month, year]);

  useEffect(() => {
    fetchAllFieldOwner();
  }, []);

  const fetchAllFieldOwner = async () => {
    const res = await getAllFieldOwner(1, 100);
    setTotalField(res.totalResults);
    setListField(res.results);
  };

  const fetchChart = async () => {
    const res = await (typeTime === "month"
      ? bookingChart(ownerData.id, fieldId, "month", month, year)
      : bookingChart(ownerData.id, fieldId, "year", null, year));

    if (res.EC == 0) {
      setChart1Data(res.data.breakdown);
      setTotalBooking(res.data.totalBookings);
      setCompareBooking(res.data.bookingDifference);
      setComparePercentageBooking(res.data.bookingPercentage);
    } else {
      setChart1Data([]);
      setTotalBooking(0);
      setCompareBooking(0);
      setComparePercentageBooking(0);
    }

    const res2 = await (typeTime === "month"
      ? revenueChart(ownerData.id, fieldId, "month", month, year)
      : revenueChart(ownerData.id, fieldId, "year", null, year));
    if (res2.EC == 0) {
      setChart2Data(res2.data.breakdown);
      setTotalRevenue(res2.data.totalRevenue);
      setCompareRevenue(res2.data.difference);
      setComparePercentageRevenue(res2.data.revenuePercentage);
      setTopField(res2.data.topFields);
    } else {
      setChart2Data([]);
      setTotalRevenue(0);
      setCompareRevenue(0);
      setComparePercentageRevenue(0);
    }
  };

  const generateYears = () => {
    const years = [];
    for (let year = currentYear - 5; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="dashboard">
      <div className="grid-item sales-summary">
        <div className="total-group">
          <div className="total-item">
            <div className="header-item">
              <p>Tổng số lượng đặt sân</p>
            </div>
            <div className="amount">
              <strong>{totalBooking} lượt đặt</strong>
            </div>
            {comparePercentageBooking >= 0 ? (
              <div className="change positive">
                <p>
                  &#9650; +{comparePercentageBooking}% (+{compareBooking} lượt
                  đặt)
                </p>
                <span>
                  {typeTime === "month"
                    ? "so với tháng trước"
                    : "so với năm trước"}
                </span>
              </div>
            ) : (
              <div className="change negative">
                <p>
                  &#9660; {comparePercentageBooking}% ({compareBooking} lượt
                  đặt)
                </p>
                <span>
                  {typeTime === "month"
                    ? "so với tháng trước"
                    : "so với năm trước"}
                </span>
              </div>
            )}
          </div>

          <div className="total-item">
            <div className="header-item">
              <p>Tổng doanh thu</p>
            </div>
            <div className="amount">
              <strong>
                {totalRevenue !== undefined && totalRevenue !== null
                  ? totalRevenue.toLocaleString("vi-VN")
                  : 0}
                VND
              </strong>
            </div>

            {comparePercentageRevenue >= 0 ? (
              <div className="change positive">
                <p>
                  &#9650; +{comparePercentageRevenue}% (+
                  {compareRevenue !== undefined && compareRevenue !== null
                    ? compareRevenue.toLocaleString("vi-VN")
                    : 0}
                  VND)
                </p>
                <span>
                  {typeTime === "month"
                    ? "so với tháng trước"
                    : "so với năm trước"}
                </span>
              </div>
            ) : (
              <div className="change negative">
                <p>
                  &#9660; {comparePercentageRevenue}% (
                  {compareRevenue !== undefined && compareRevenue !== null
                    ? compareRevenue.toLocaleString("vi-VN")
                    : 0}
                  VND)
                </p>
                <span>
                  {typeTime === "month"
                    ? "so với tháng trước"
                    : "so với năm trước"}
                </span>
              </div>
            )}
          </div>

          <div className="total-item">
            <div className="header-item">
              <p>Top 3 sân có doanh thu cao nhất</p>
            </div>
            <div className="amount">
              {topField.length > 0 ? (
                topField.map((item, index) => {
                  return (
                    <strong key={index}>
                      {index + 1}. {item.fieldName}
                    </strong>
                  );
                })
              ) : (
                <strong style={{ fontSize: "28px" }}>{topField.length}</strong>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-item filter-container">
        <strong style={{ color: "#1f2154" }}>Mốc thời gian thống kê: </strong>
        <div className="group-filter">
          <div className="filter">
            <label htmlFor="field-select">Chọn sân:</label>
            <select
              id="field-select"
              value={fieldId}
              onChange={(e) => setFieldId(e.target.value)}
            >
              <option value="all">Tất cả sân</option>
              {listField.map((field) => (
                <option key={field._id} value={field._id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter">
            <label htmlFor="chart-type-select">Chọn loại thời gian:</label>
            <select
              id="chart1-type-select"
              value={typeTime}
              onChange={(e) => setTypeTime(e.target.value)}
            >
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>

          {typeTime === "month" && (
            <div className="filter">
              <label htmlFor="chart-month-select">Chọn tháng:</label>
              <select
                id="chart1-month-select"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
              >
                {[...Array(12).keys()].map((month) => (
                  <option key={month + 1} value={month + 1}>
                    {month + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="filter">
            <label htmlFor="chart-year-select">Chọn năm:</label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {generateYears().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Biểu đồ số lượng đặt sân */}
      <div className="grid-item total-revenue">
        <strong>Thống kê số lượng đặt sân</strong>

        <Chart data={chart1Data} name="Số lượt đặt" color="#8884d8" />
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="grid-item customer-satisfaction">
        <strong>Thống kê doanh thu</strong>

        <Chart data={chart2Data} name="Doanh thu" color="orange" />
      </div>
    </div>
  );
}

export default Dashboard;
