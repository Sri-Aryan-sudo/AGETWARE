require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection error', err.stack);
  } else {
    console.log('Connected to DB. Time:', res.rows[0]);
  }
});

app.post('/api/v1/loans',async(req,res)=>{
  const {customer_id,loan_amount,loan_period_years,interest_rate_yearly}=req.body
  console.log(req.body)
  const P=parseFloat(loan_amount)
  const N=parseInt(loan_period_years)
  const R=parseFloat(interest_rate_yearly)
  const I=P*N*(R/100)
  const A=P+I
  const monthly_emi=+(A/(N*12)).toFixed(2)
  const loan_id=uuidv4()
  await pool.query('INSERT INTO "Loans" (loan_id,customer_id,principal_amount,total_amount,monthly_emi,status,created_at,interest_rate) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',[loan_id,customer_id,P,A,monthly_emi,"PENDING",new Date(),R])
  const data={loan_id,total_amount_payable:A,customer_id,monthly_emi}
  res.send(data)
})

app.post('/api/v1/loans/:loan_id/payments', async (req, res) => {
    const { loan_id } = req.params;
    const { amount, payment_type } = req.body;
  
    const result = await pool.query('SELECT * FROM "Loans" WHERE loan_id = $1', [loan_id]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: "Loan not found" });
    }
  
    const loan = result.rows[0];
    let remaining_amount = loan.total_amount - amount;
    if (remaining_amount < 0) remaining_amount = 0;
  
    const emis_left = remaining_amount > 0 ? Math.ceil(remaining_amount / loan.monthly_emi) : 0;
  
    const payment_id = uuidv4()
  
    if (payment_type === "EMI") {
      const status = remaining_amount === 0 ? "PAID" : loan.status;
      await pool.query('UPDATE "Loans" SET total_amount=$1, status=$2 WHERE loan_id=$3', [remaining_amount, status, loan_id]);
      await pool.query('INSERT INTO "Payments" (payment_id,loan_id,amount,payment_type,payment_date) VALUES ($1,$2,$3,$4,$5)',[payment_id,loan_id,amount,payment_type,new Date()])
      return res.send({
        payment_id,
        loan_id,
        message: "Payment recorded successfully.",
        remaining_balance: remaining_amount,
        emis_left
      });
  
    } else if (payment_type === "LUMP_SUM") {
      const now = new Date();
      const created_at = new Date(loan.created_at);
      const elapsed_years = (now - created_at) / (1000 * 60 * 60 * 24 * 365);
      const remaining_years = Math.max(loan.loan_period_years - elapsed_years, 0.01); // avoid division by zero
  
      let new_monthly_emi = 0;
      if (remaining_amount > 0) {
        const new_interest = remaining_amount * remaining_years * (loan.interest_rate / 100);
        const new_amount_with_interest = remaining_amount + new_interest;
        new_monthly_emi = +(new_amount_with_interest / (remaining_years * 12)).toFixed(2);
        remaining_amount = new_amount_with_interest;
      }
  
      const updated_emis_left = remaining_amount > 0 ? Math.ceil(remaining_amount / new_monthly_emi) : 0;
      const status = remaining_amount === 0 ? "PAID" : loan.status;
  
      await pool.query(
        'UPDATE "Loans" SET total_amount=$1, monthly_emi=$2, status=$3 WHERE loan_id=$4',
        [remaining_amount, new_monthly_emi, status, loan_id]
      );
      await pool.query('INSERT INTO "Payments" (payment_id,loan_id,amount,payment_type,payment_date) VALUES ($1,$2,$3,$4,$5)',[payment_id,loan_id,amount,payment_type,new Date()])
      return res.send({
        payment_id,
        loan_id,
        message: "Payment recorded successfully.",
        remaining_balance: remaining_amount,
        emis_left: updated_emis_left
      });
  
    } else {
      return res.status(400).send({ error: "Invalid payment_type" });
    }
    
  });

  app.get('/api/v1/loans/:loan_id/ledger', async (req, res) => {
    const loan_id=req.params.loan_id
    const resp2=await pool.query('SELECT * FROM "Payments" WHERE loan_id=$1',[loan_id])
    const resp1=await pool.query('SELECT * FROM "Loans" WHERE loan_id=$1',[loan_id])
    const loan=resp1.rows[0]
    const payments=resp2.rows
    console.log(payments)
    console.log(loan)
    const total_amount_paid=payments.reduce((acc,payment)=>acc+parseFloat(payment.amount),0)
    const data={
        loan_id:loan.loan_id,
        customer_id:loan.customer_id,
        principal_amount:loan.principal_amount,
        total_amount:loan.total_amount,
        monthly_emi:loan.monthly_emi,
        amount_paid:total_amount_paid,
        balance_amount:loan.total_amount==="0"?0:loan.total_amount-total_amount_paid,
        emis_left:loan.total_amount==="0"?0:Math.ceil((loan.total_amount-total_amount_paid)/loan.monthly_emi),
        transactions:payments
    }
    if(resp1.rows.length===0){
      return res.status(404).send({error:"Invalid loan id"})
    }
    res.send(data)
  });
  app.get('/api/v1/customers/:customer_id/overview', async (req, res) => {
    const { customer_id } = req.params;
  
    const customerResult = await pool.query('SELECT * FROM Customers WHERE customer_id = $1', [customer_id]);
    if (customerResult.rows.length === 0) {
      return res.status(404).send({ error: "Customer not found" });
    }
  
    const customer = customerResult.rows[0];
  
    const loansResult = await pool.query('SELECT * FROM "Loans" WHERE customer_id = $1', [customer_id]);
    const loans = loansResult.rows;
  
    const formattedLoans = loans.map(loan => {
      const amount_paid = parseFloat(loan.principal_amount) - parseFloat(loan.total_amount);
      const emis_left = parseFloat(loan.monthly_emi) > 0 ? Math.ceil(parseFloat(loan.total_amount) / parseFloat(loan.monthly_emi)) : 0;
      const original_total_interest = +(parseFloat(loan.principal_amount) * 3 * (parseFloat(loan.interest_rate) / 100)).toFixed(2);
      return {
        loan_id: loan.loan_id,
        principal_amount: loan.principal_amount,
        total_amount: loan.total_amount,
        total_interest: original_total_interest,
        emi_amount: loan.monthly_emi,
        amount_paid: amount_paid < 0 ? 0 : +amount_paid.toFixed(2),
        emis_left
      };
    });
  
    const data = {
      customer_id: customer.customer_id,
      total_loans: loans.length,
      loans: formattedLoans
    };
  
    return res.send(data);
  });
  
  
  
// Start server
app.listen(3000, () => {
  console.log('Server running on port 3001');
});
