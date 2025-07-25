export async function getAccountOverview(customer_id) {
  if (!customer_id) throw new Error("Customer ID required");
  await new Promise(res => setTimeout(res, 500));
  return {
    customer_id,
    total_loans: 2,
    loans: [
      {
        loan_id: "LOAN123",
        principal: 10000,
        total_amount: 12000,
        total_interest: 2000,
        emi_amount: 1000,
        amount_paid: 2000,
        emis_left: 10
      },
      {
        loan_id: "LOAN456",
        principal: 5000,
        total_amount: 6000,
        total_interest: 1000,
        emi_amount: 500,
        amount_paid: 1000,
        emis_left: 10
      }
    ]
  };
}
