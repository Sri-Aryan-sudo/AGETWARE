// src/components/LoanForm.js
import React, { useState } from "react";
import { createLoan } from "../api/loans";

export default function LoanForm() {
  const [form, setForm] = useState({
    customer_id: "",
    loan_amount: "",
    loan_period_years: "",
    interest_rate_yearly: ""
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setResult(null);
    const url="/api/v1/loans"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json" // ✅ ADD THIS
      },
      body: JSON.stringify(form)
    });
    
    if(response.ok){
      const data=await response.json()
      setResult(data)
    }else{
      setError("Error creating loan")
    }
    setForm({ customer_id: "", loan_amount: "", loan_period_years: "", interest_rate_yearly: "" });
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="18" width="36" height="18" rx="4" fill="#ffd700" stroke="#2d3e50" strokeWidth="2"/>
          <rect x="14" y="10" width="20" height="8" rx="3" fill="#fff" stroke="#2d3e50" strokeWidth="2"/>
          <circle cx="24" cy="27" r="4" fill="#2d3e50" />
        </svg>
      </div>
      <h2>Apply for a New Loan</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer ID:</label>
          <input name="customer_id" value={form.customer_id} onChange={handleChange} required />
        </div>
        <div>
          <label>Loan Amount:</label>
          <input name="loan_amount" type="number" value={form.loan_amount} onChange={handleChange} required />
        </div>
        <div>
          <label>Loan Period (years):</label>
          <input name="loan_period_years" type="number" value={form.loan_period_years} onChange={handleChange} required />
        </div>
        <div>
          <label>Interest Rate (% per year):</label>
          <input name="interest_rate_yearly" type="number" value={form.interest_rate_yearly} onChange={handleChange} required />
        </div>
        <button type="submit">Create Loan</button>
      </form>
      {result && (
        <div>
          <h3>Loan Created!</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}