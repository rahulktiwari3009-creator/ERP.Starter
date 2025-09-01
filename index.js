const pool = require('./db');
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
app.get('/health', (req, res) => res.json({ ok: true }));
app.post('/grns', async (req, res) => {
  const client = await pool.connect();
  try {
    const { grn_number, po_id, supplier_id, created_by, remarks } = req.body;
    const q = `insert into grns(grn_number, po_id, supplier_id, created_by, remarks) values($1,$2,$3,$4,$5) returning *`;
    const { rows } = await client.query(q, [grn_number, po_id || null, supplier_id || null, created_by || null, remarks || null]);
    res.json(rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  } finally {
    client.release();
  }
});
app.post('/grns/:id/scan', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { barcode, qty, batch_no, exp_date, bin_code } = req.body;
    const p = await client.query('select * from products where barcode=$1', [barcode]);
    if (!p.rowCount) return res.status(400).json({ error: 'Product not found for barcode: ' + barcode });
    const product = p.rows[0];
    const b = await client.query(
      'insert into stock_batches(product_id, batch_no, exp_date) values($1,$2,$3) on conflict(product_id,batch_no) do update set exp_date=excluded.exp_date returning *',
      [product.id, batch_no || 'BATCH-DEFAULT', exp_date || null]
    );
    let sb = null;
    if (bin_code) {
      const bin = await client.query('select id from bins where code=$1', [bin_code]);
      sb = bin.rowCount ? bin.rows[0].id : null;
    } else {
      const last = await client.query('select bin_id from v_bin_onhand where product_id=$1 order by qty desc limit 1', [product.id]);
      sb = last.rowCount ? last.rows[0].bin_id : null;
    }
    const ins = await client.query(
      `insert into grn_items(grn_id, product_id, batch_id, scanned_barcode, qty, suggested_bin_id) values($1,$2,$3,$4,$5,$6) returning *`,
      [id, product.id, b.rows[0].id, barcode, qty || 1, sb]
    );
    res.json(ins.rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  } finally {
    client.release();
  }
});
app.post('/grns/:id/post', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('begin');
    const { id } = req.params;
    const gi = await client.query('select * from grn_items where grn_id=$1', [id]);
    if (!gi.rowCount) throw new Error('No items to post');
    const issues = await client.query('select id from grn_items where grn_id=$1 and (final_bin_id is null or qc_pass is not true)', [id]);
    if (issues.rowCount) throw new Error('All items need final_bin_id and qc_pass=true before posting');
    for (const row of gi.rows) {
      await client.query(
        `insert into inventory_ledger(product_id, bin_id, batch_id, ref_type, ref_id, qty) values($1,$2,$3,'GRN',$4,$5)`,
        [row.product_id, row.final_bin_id, row.batch_id, id, row.qty]
      );
    }
    await client.query("update grns set status='posted' where id=$1", [id]);
    await client.query(
      `insert into audit_log(actor, entity, entity_id, action, details) values($1,'grn',$2,'post',jsonb_build_object('count', $3))`,
      [null, id, gi.rowCount]
    );
    await client.query('commit');
    res.json({ ok: true });
  } catch (e) {
    await client.query('rollback');
    res.status(400).json({ error: e.message });
  } finally {
    client.release();
  }
});
const port = process.env.PORT || 4000;
app.listen(port, () => console.log('ERP API on :' + port));
