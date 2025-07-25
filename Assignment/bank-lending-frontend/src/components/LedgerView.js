// src/components/LedgerView.js
import React, { useState } from "react";
import { getLedger } from "../api/loans";

export default function LedgerView({ initialLoanId = "" }) {
  const [loanId, setLoanId] = useState(initialLoanId);
  const [ledger, setLedger] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const url=`/api/v1/loans/${loanId}/ledger`
    const response=await fetch(url,{method:"GET"})
    if(response.ok){
      const data=await response.json()
      setLedger(data)
    }else{
      setError(response.status)
    }
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="28" height="28" rx="6" fill="#ffd700" stroke="#2d3e50" strokeWidth="2"/>
          <rect x="16" y="18" width="16" height="2" rx="1" fill="#2d3e50" />
          <rect x="16" y="24" width="10" height="2" rx="1" fill="#2d3e50" />
          <rect x="16" y="30" width="6" height="2" rx="1" fill="#2d3e50" />
        </svg>
      </div>
      <h2>Loan Ledger</h2>
      <form onSubmit={handleSubmit}>
        <label>Loan ID:</label>
        <input value={loanId} onChange={e => setLoanId(e.target.value)} required />
        <button type="submit">View Ledger</button>
      </form>
      {ledger && (
        <div>
          <h3>Ledger for Loan {ledger.loan_id}</h3>
          <p>Customer ID: {ledger.customer_id}</p>
          <p>Principal: {ledger.principal_amount}</p>
          <p>Total Amount: {ledger.total_amount}</p>
          <p>Monthly EMI: {ledger.monthly_emi}</p>
          <p>Amount Paid: {ledger.amount_paid}</p>
          <p>Balance Amount: {ledger.balance_amount}</p>
          <p>EMIs Left: {ledger.emis_left}</p>
          <h4>Transactions:</h4>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {ledger.transactions.map(txn => (
                <tr key={txn.payment_id}>
                  <td>{txn.payment_id}</td>
                  <td>{txn.payment_date}</td>
                  <td>{txn.amount}</td>
                  <td>{txn.payment_type}</td>
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