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
  
  
// Start server
app.listen(3000, () => {
  console.log('Server running on port 3001');
});
