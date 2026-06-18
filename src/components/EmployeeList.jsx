import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../api";   // ← 追加（重要）

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/employees`)   // ← ここだけ変更
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("社員取得エラー:", err));
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">社員一覧</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">社員番号</th>
            <th className="border p-2">名前</th>
            <th className="border p-2">メール</th>
            <th className="border p-2">部署</th>
            <th className="border p-2">操作</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-100">
              <td className="border p-2">{emp.employee_id}</td>
              <td className="border p-2">{emp.name}</td>
              <td className="border p-2">{emp.email}</td>
              <td className="border p-2">{emp.department}</td>

              <td className="border p-2 space-x-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => navigate(`/employees/${emp.id}/edit`)}
                >
                  編集
                </button>

                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => navigate(`/employees/${emp.id}/delete`)}
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
