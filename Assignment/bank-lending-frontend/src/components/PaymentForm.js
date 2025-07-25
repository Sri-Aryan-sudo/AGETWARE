// src/components/PaymentForm.js
import React, { useState } from "react";
import { makePayment } from "../api/loans";

export default function PaymentForm() {
  const [form, setForm] = useState({
    loan_id: "",
    amount: "",
    payment_type: "EMI"
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const url = `http://localhost:3000/api/v1/loans/${form.loan_id}/payments`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // ✅ ADD THIS
      },
      body: JSON.stringify({
        amount: form.amount,
        payment_type: form.payment_type
      })
    });
    
    if(response.ok){
      const data=await response.json()
      setResult(data)
    }else{
      
      setError(response.status)
    }
    setForm({ loan_id: "", amount: "", payment_type: "EMI" });
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="14" width="36" height="20" rx="4" fill="#ffd700" stroke="#2d3e50" strokeWidth="2"/>
          <rect x="10" y="22" width="8" height="4" rx="1" fill="#fff" />
          <rect x="30" y="22" width="8" height="4" rx="1" fill="#fff" />
          <rect x="14" y="18" width="20" height="2" rx="1" fill="#2d3e50" />
        </svg>
      </div>
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Loan ID:</label>
          <input name="loan_id" value={form.loan_id} onChange={handleChange} required />
        </div>
        <div>
          <label>Amount:</label>
          <input name="amount" type="number" value={form.amount} onChange={handleChange} required />
        </div>
        <div>
          <label>Payment Type:</label>
          <select name="payment_type" value={form.payment_type} onChange={handleChange}>
            <option value="EMI">EMI</option>
            <option value="LUMP_SUM">LUMP_SUM</option>
          </select>
        </div>
        <button type="submit">Submit Payment</button>
      </form>
      {result && (
        <div>
          <h3>Payment Successful!</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}