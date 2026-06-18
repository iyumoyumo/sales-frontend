import axios from "axios";
import { useState } from "react";
import API_BASE_URL from "../api";


export default function EmployeeForm() {
  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/employees`,   // ← ここだけ変更
        form
      );
      alert("登録成功: " + JSON.stringify(res.data));
    } catch (error) {
      console.error(error);
      alert("登録エラー");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">社員登録</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">社員ID</label>
          <input
            type="text"
            name="employeeId"
            className="w-full border p-2 rounded"
            value={form.employeeId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">名前</label>
          <input
            type="text"
            name="name"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">メール</label>
          <input
            type="email"
            name="email"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">部署</label>
          <input
            type="text"
            name="department"
            className="w-full border p-2 rounded"
            value={form.department}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          登録
        </button>
      </form>
    </div>
  );
}
