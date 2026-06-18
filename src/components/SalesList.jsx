import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";   // ← 追加（重要）

export default function SalesSummary() {
  const [employees, setEmployees] = useState([]);
  const [sales, setSales] = useState([]);

  const [mode, setMode] = useState("week");

  const now = new Date();

  const [yearSelect, setYearSelect] = useState(null);
  const [monthSelect, setMonthSelect] = useState(null);
  const [weekSelect, setWeekSelect] = useState(null);

  const navigate = useNavigate();

  // 社員一覧
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/employees`)   // ← ここを変更
      .then((res) => setEmployees(res.data));
  }, []);

  // 売上一覧
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/sales`)       // ← ここも変更
      .then((res) => {
        setSales(res.data);
      });
  }, []);

  // ISO週番号
  const getWeek = (d) => {
    const temp = new Date(d.getTime());
    temp.setHours(0, 0, 0, 0);
    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
    const week1 = new Date(temp.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((temp.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  };

  // sales が入ったら初期値セット
  useEffect(() => {
    if (sales.length > 0) {
      const years = [...new Set(sales.map(s => new Date(s.sale_date).getFullYear()))];
      setYearSelect(years[0]);

      const firstDate = new Date(sales[0].sale_date);
      setMonthSelect(firstDate.getMonth() + 1);
      setWeekSelect(getWeek(firstDate));
    }
  }, [sales]);

  // 個人別の期間売上（社員番号で集計）
  const personalTotals = (() => {
    const totals = {};
    employees.forEach((emp) => (totals[emp.employee_id] = 0));

    sales.forEach((s) => {
      const date = new Date(s.sale_date);
      const empId = s.employee_id;

      let match = false;

      if (mode === "week") {
        match =
          date.getFullYear() === Number(yearSelect) &&
          getWeek(date) === Number(weekSelect);
      }

      if (mode === "month") {
        match =
          date.getFullYear() === Number(yearSelect) &&
          date.getMonth() + 1 === Number(monthSelect);
      }

      if (mode === "year") {
        match = date.getFullYear() === Number(yearSelect);
      }

      if (match) totals[empId] += Number(s.amount);
    });

    return totals;
  })();

  const employeesWithTotals = employees.filter(
    (emp) => personalTotals[emp.employee_id] > 0
  );

  const yearList = [...new Set(sales.map((s) => new Date(s.sale_date).getFullYear()))];
  const weekList = Array.from({ length: 53 }, (_, i) => i + 1);
  const monthList = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h2 className="text-2xl font-bold mb-4">売上一覧</h2>

      {/* 期間区分 */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">期間区分：</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="week">週</option>
          <option value="month">月</option>
          <option value="year">年</option>
        </select>
      </div>

      {/* 年・週・月 */}
      <div className="flex gap-4 mb-6">
        <select
          value={yearSelect}
          onChange={(e) => setYearSelect(e.target.value)}
          className="border p-2 rounded"
        >
          {yearList.map((y) => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>

        {mode === "week" && (
          <select
            value={weekSelect}
            onChange={(e) => setWeekSelect(e.target.value)}
            className="border p-2 rounded"
          >
            {weekList.map((w) => (
              <option key={w} value={w}>{w}週</option>
            ))}
          </select>
        )}

        {mode === "month" && (
          <select
            value={monthSelect}
            onChange={(e) => setMonthSelect(e.target.value)}
            className="border p-2 rounded"
          >
            {monthList.map((m) => (
              <option key={m} value={m}>{m}月</option>
            ))}
          </select>
        )}
      </div>

      {/* 個人別売上テーブル */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">社員名</th>
            <th className="border p-2">売上合計</th>
            <th className="border p-2">操作</th>
          </tr>
        </thead>

        <tbody>
          {employeesWithTotals.map((emp) => (
            <tr key={emp.employee_id} className="hover:bg-gray-100">
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">
                {personalTotals[emp.employee_id].toLocaleString()} 円
              </td>

              <td className="border p-2 space-x-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() =>
                    navigate(`/sales/detail?employee_id=${emp.employee_id}&mode=${mode}&year=${yearSelect}&month=${monthSelect}&week=${weekSelect}`)
                  }
                >
                  詳細
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
