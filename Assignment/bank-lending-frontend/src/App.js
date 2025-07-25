// src/App.js
import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import LoanForm from "./components/LoanForm";
import PaymentForm from "./components/PaymentForm";
import LedgerView from "./components/LedgerView";
import LoanDetails from "./pages/LoanDetails";
import CustomerOverview from "./pages/CustomerOverview";

function App() {
  return (
    <Router>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Simple bank logo SVG */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.6em' }}>
            <circle cx="18" cy="18" r="18" fill="#2d3e50" />
            <rect x="9" y="16" width="18" height="8" rx="2" fill="#ffd700" />
            <rect x="13" y="10" width="10" height="6" rx="2" fill="#fff" />
            <rect x="15.5" y="20" width="5" height="2" rx="1" fill="#2d3e50" />
          </svg>
          <span style={{ color: '#ffd700', fontWeight: 700, fontSize: '1.25em', letterSpacing: '1px' }}>
            Agetware Bank
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1.5em' }}>
          <Link to="/">Home</Link>
          <Link to="/lend">New Loan</Link>
          <Link to="/payment">Payment</Link>
          <Link to="/ledger">Ledger</Link>
          <Link to="/customer-overview">Account Overview</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lend" element={<LoanForm />} />
        <Route path="/payment" element={<PaymentForm />} />
        <Route path="/ledger" element={<LedgerView />} />
        <Route path="/loan/:loanId" element={<LoanDetails />} />
        <Route path="/customer-overview" element={<CustomerOverview />} />
      </Routes>
    </Router>
  );
}

export default App;