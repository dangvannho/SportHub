import { useState, useEffect } from "react";
import { useContext } from "react";

import { AppContext } from "~/context/AppContext";
import bookingChart from "~/services/Owner/bookingChart";
import revenueChart from "~/services/Owner/revenueChart";
import Chart from "./components/Chart/Chart";

import "./Dashboard.scss";

function Dashboard() {
  const currentMonth = new Date().getMonth() + 1; // Tháng hiện tại
  const currentYear = new Date().getFullYear(); // Năm hiện tại

  const { ownerData } = useContext(AppContext);

  const [typeTime, setTypeTime] = useState("month");
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  // State cho biểu đồ số lượng đặt sân
  const [chart1Data, setChart1Data] = useState([]);
  const [totalBooking, setTotalBooking] = useState(0);

  // State cho biểu đồ doanh thu
  const [chart2Data, setChart2Data] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchChart();
  }, [typeTime, month, year]);

  const fetchChart = async () => {
    const res = await (typeTime === "month"
      ? bookingChart(ownerData.id, "month", month, year)
      : bookingChart(ownerData.id, "year", null, year));
    setChart1Data(res.breakdown);
    setTotalBooking(res.totalBookings);

    const res2 = await (typeTime === "month"
      ? revenueChart(ownerData.id, "month", month, year)
      : revenueChart(ownerData.id, "year", null, year));
    setChart2Data(res2.breakdown);
    setTotalRevenue(res2.totalRevenue);
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
            <div className="header">
              <p>Tổng số lượng đặt sân</p>
            </div>
            <div className="amount">
              <strong>{totalBooking} lượt đặt</strong>
            </div>
            <div className="change positive">
              <p>▲ +26% </p> <span>so với tháng trước</span>
            </div>
          </div>

          <div className="total-item">
            <div className="header">
              <p>Tổng doanh thu</p>
            </div>
            <div className="amount">
              <strong>{totalRevenue.toLocaleString("vi-VN")} VND</strong>
            </div>
            <div className="change positive">
              <p>&#9650; +26% </p> <span>so với tháng trước</span>
            </div>
          </div>

          <div className="total-item">
            <div className="header">
              <p>Tổng số sân</p>
            </div>
            <div className="amount">
              <strong>5 sân</strong>
            </div>
            <div className="change negative">
              <p>&#9660; +26% </p> <span>so với tháng trước</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-item filter-container">
        <div className="group-filter">
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
