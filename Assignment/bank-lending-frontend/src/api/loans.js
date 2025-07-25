export async function createLoan(data) {
    const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = data;
    const P = parseFloat(loan_amount);
    const N = parseInt(loan_period_years);
    const R = parseFloat(interest_rate_yearly);
  
    if (!customer_id || isNaN(P) || isNaN(N) || isNaN(R)) {
      throw new Error("Invalid input");
    }
  
    const I = P * N * (R / 100);
    const A = P + I;
    const monthly_emi = +(A / (N * 12)).toFixed(2);
  
    await new Promise(res => setTimeout(res, 500));
  
    return {
      loan_id: "LOAN" + Math.floor(Math.random() * 1000000),
      customer_id,
      total_amount_payable: +A.toFixed(2),
      monthly_emi
    };
  }
  
  export async function makePayment(loan_id, { amount, payment_type }) {
    if (!loan_id || !amount || !payment_type) throw new Error("Invalid input");
    await new Promise(res => setTimeout(res, 500));
    return {
      payment_id: "PAY" + Math.floor(Math.random() * 1000000),
      loan_id,
      message: "Payment recorded successfully.",
      remaining_balance: 10000 - amount, // mock
      emis_left: 10 // mock
    };
  }
  
  export async function getLedger(loan_id) {
    if (!loan_id) throw new Error("Loan ID required");
    await new Promise(res => setTimeout(res, 500));
    return {
      loan_id,
      customer_id: "CUST123",
      principal: 10000,
      total_amount: 12000,
      monthly_emi: 1000,
      amount_paid: 2000,
      balance_amount: 10000,
      emis_left: 10,
      transactions: [
        {
          transaction_id: "TXN1",
          date: "2024-06-01",
          amount: 1000,
          type: "EMI"
        },
        {
          transaction_id: "TXN2",
          date: "2024-07-01",
          amount: 1000,
          type: "EMI"
        }
      ]
    };
  }