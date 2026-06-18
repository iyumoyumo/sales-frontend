import { useState, useEffect } from "react";
import API_BASE_URL from "../api";   // ← 追加（重要）

export default function SalesForm({ setScreen }) {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    sale_date: "",
    amount: "",
    memo: "",
  });

  // 社員一覧を取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/employees`)   // ← ここを変更
      .then(res => res.json())
      .then(data => setEmployees(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE_URL}/api/sales`, {   // ← ここも変更
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setScreen("salesList");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">売上登録</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ★ 社員選択 */}
        <div>
          <label className="block font-semibold mb-1">社員</label>
          <select
            name="employee_id"
            className="w-full border p-2 rounded"
            value={form.employee_id}
            onChange={handleChange}
            required
          >
            <option value="">選択してください</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* 日付 */}
        <div>
          <label className="block font-semibold mb-1">日付</label>
          <input
            type="date"
            name="sale_date"
            className="w-full border p-2 rounded"
            value={form.sale_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* 金額 */}
        <div>
          <label className="block font-semibold mb-1">売上金額</label>
          <input
            type="number"
            name="amount"
            className="w-full border p-2 rounded"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        {/* メモ */}
        <div>
          <label className="block font-semibold mb-1">メモ</label>
          <textarea
            name="memo"
            className="w-full border p-2 rounded"
            rows="3"
            value={form.memo}
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          登録
        </button>
      </form>
    </div>
  );
}
