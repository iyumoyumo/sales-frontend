import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import API_BASE_URL from "../api";   // ← 追加（重要）

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SalesCompare() {
  const [sales, setSales] = useState([]);
  const [mode, setMode] = useState("month");

  // ★ DB から売上データを取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sales`)   // ← ここを変更
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.error("APIエラー:", err));
  }, []);

  const getYear = (d) => d.split("-")[0];

  const getMonth = (d) => {
    const date = new Date(d);
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  const getWeek = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const firstDay = new Date(year, month - 1, 1);
    const firstWeekDay = firstDay.getDay();
    const day = date.getDate();

    const weekNumber = Math.ceil((day + firstWeekDay) / 7);

    return `${year}年${month}月 第${weekNumber}週`;
  };

  // ★ 集計処理
  const grouped = {};
  sales.forEach((s) => {
    const key =
      mode === "week"
        ? getWeek(s.sale_date)
        : mode === "month"
        ? getMonth(s.sale_date)
        : getYear(s.sale_date);

    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += s.amount;
  });

  // ★ 期間順にソート
  const summary = Object.entries(grouped).sort((a, b) => {
    const da = new Date(a[0].replace("年", "-").replace("月", "-").replace(" 第", "-").replace("週", ""));
    const db = new Date(b[0].replace("年", "-").replace("月", "-").replace(" 第", "-").replace("週", ""));
    return da - db;
  });

  const chartData = {
    labels: summary.map(([period]) => period),
    datasets: [
      {
        label: "売上金額",
        data: summary.map(([_, total]) => total),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h2 className="text-2xl font-bold mb-4">売上比較</h2>

      <div className="flex space-x-3 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            mode === "week" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("week")}
        >
          週
        </button>

        <button
          className={`px-4 py-2 rounded ${
            mode === "month" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("month")}
        >
          月
        </button>

        <button
          className={`px-4 py-2 rounded ${
            mode === "year" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setMode("year")}
        >
          年
        </button>
      </div>

      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">期間</th>
            <th className="border p-2">売上合計</th>
          </tr>
        </thead>
        <tbody>
          {summary.map(([period, total]) => (
            <tr key={period} className="hover:bg-gray-100">
              <td className="border p-2">{period}</td>
              <td className="border p-2">{total.toLocaleString()} 円</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="h-80">
        <Bar data={chartData} />
      </div>
    </div>
  );
}
