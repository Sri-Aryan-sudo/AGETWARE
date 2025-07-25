// src/pages/LoanDetails.js
import React from "react";
import { useParams } from "react-router-dom";
import LedgerView from "../components/LedgerView";

export default function LoanDetails() {
  const { loanId } = useParams();

  // Pass loanId as a prop to LedgerView if you want to auto-load it
  // Otherwise, LedgerView can have its own input for loanId

  return (
    <div>
      <h2>Loan Details</h2>
      <LedgerView initialLoanId={loanId} />
    </div>
  );
}