import { useState, useEffect } from "react";
import API_BASE_URL from "../api";   // ← 追加（重要）

export default function PersonalSummary() {
  const [sales, setSales] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState("month");

  // 売上データ取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sales`)   // ← ここを変更
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.error("APIエラー:", err));
  }, []);

  // 社員データ取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/employees`)  // ← ここも変更
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("社員APIエラー:", err));
  }, []);

  const getEmployeeName = (employee_id) => {
    const emp = employees.find((e) => e.employee_id === employee_id);
    return emp ? emp.name : "";
  };

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

  const filtered = sales.filter((s) => s.employee_id === selected);

  const grouped = {};
  filtered.forEach((s) => {
    const key =
      mode === "week"
        ? getWeek(s.sale_date)
        : mode === "month"
        ? getMonth(s.sale_date)
        : getYear(s.sale_date);

    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += Number(s.amount);
  });

  const summary = Object.entries(grouped);

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h2 className="text-2xl font-bold mb-4">売上集計（個人別）</h2>

      <select
        className="border p-2 mb-4"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">社員を選択</option>
        {employees.map((e) => (
          <option key={e.employee_id} value={e.employee_id}>
            {e.name}
          </option>
        ))}
      </select>

      {selected && (
        <>
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

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">
                  {mode === "week" ? "週" : mode === "month" ? "月" : "年"}
                </th>
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
        </>
      )}
    </div>
  );
}
