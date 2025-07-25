// src/components/AccountOverview.js
import React, { useState } from "react";
import { getAccountOverview } from "../api/customers";

export default function AccountOverview() {
  const [customerId, setCustomerId] = useState("");
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setOverview(null);
    const url=`/api/v1/customers/${customerId}/overview`
    const response=await fetch(url,{method:"GET"})
    if(response.ok){
      const data=await response.json()
      setOverview(data)
    }else{
      setError(response.status)
    }
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="18" r="8" fill="#ffd700" stroke="#2d3e50" strokeWidth="2"/>
          <rect x="10" y="30" width="28" height="10" rx="5" fill="#fff" stroke="#2d3e50" strokeWidth="2"/>
        </svg>
      </div>
      <h2>Customer Account Overview</h2>
      <form onSubmit={handleSubmit}>
        <label>Customer ID:</label>
        <input value={customerId} onChange={e => setCustomerId(e.target.value)} required />
        <button type="submit">View Overview</button>
      </form>
      {overview && (
        <div>
          <h3>Overview for Customer {overview.customer_id}</h3>
          <p>Total Loans: {overview.total_loans}</p>
          <table>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Principal</th>
                <th>Total Amount</th>
                <th>Total Interest</th>
                <th>EMI Amount</th>
                <th>Amount Paid</th>
                <th>EMIs Left</th>
              </tr>
            </thead>
            <tbody>
              {overview.loans.map(loan => (
                <tr key={loan.loan_id}>
                  <td>{loan.loan_id}</td>
                  <td>{loan.principal_amount}</td>
                  <td>{loan.total_amount}</td>
                  <td>{loan.total_interest}</td>
                  <td>{loan.emi_amount}</td>
                  <td>{loan.amount_paid}</td>
                  <td>{loan.emis_left}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}