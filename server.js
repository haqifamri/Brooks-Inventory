const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// ===== HARDWARE TYPES =====
app.get('/api/hardware-types', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM hardware_types ORDER BY name');
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/hardware-types', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nama diperlukan' });
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query('INSERT INTO hardware_types (name) VALUES (?)', [name]);
    await connection.end();
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/hardware-types/:id', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nama diperlukan' });
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('UPDATE hardware_types SET name = ? WHERE id = ?', [name, req.params.id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/hardware-types/:id', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('DELETE FROM hardware_types WHERE id = ?', [req.params.id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== CATEGORIES =====
app.get('/api/categories', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(`
      SELECT categories.id, categories.name, categories.hardware_type_id, hardware_types.name AS hardware_type_name
      FROM categories
      JOIN hardware_types ON categories.hardware_type_id = hardware_types.id
      ORDER BY hardware_types.name, categories.name
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { name, hardware_type_id } = req.body;
    if (!name || !hardware_type_id) return res.status(400).json({ error: 'Nama dan Hardware Type diperlukan' });
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
      'INSERT INTO categories (name, hardware_type_id) VALUES (?, ?)', [name, hardware_type_id]
    );
    await connection.end();
    res.status(201).json({ id: result.insertId, name, hardware_type_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { name, hardware_type_id } = req.body;
    if (!name || !hardware_type_id) return res.status(400).json({ error: 'Nama dan Hardware Type diperlukan' });
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(
      'UPDATE categories SET name = ?, hardware_type_id = ? WHERE id = ?', [name, hardware_type_id, req.params.id]
    );
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== STATUSES =====
app.get('/api/statuses', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT * FROM statuses ORDER BY name');
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/statuses', async (req, res) => {
  try {
    const { name, color_hex } = req.body;
    if (!name || !color_hex) return res.status(400).json({ error: 'Nama dan warna diperlukan' });
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
      'INSERT INTO statuses (name, color_hex) VALUES (?, ?)', [name, color_hex]
    );
    await connection.end();
    res.status(201).json({ id: result.insertId, name, color_hex });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/statuses/:id', async (req, res) => {
  try {
    const { name, color_hex } = req.body;
    if (!name || !color_hex) return res.status(400).json({ error: 'Nama dan warna diperlukan' });
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(
      'UPDATE statuses SET name = ?, color_hex = ? WHERE id = ?', [name, color_hex, req.params.id]
    );
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/statuses/:id', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('DELETE FROM statuses WHERE id = ?', [req.params.id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== MODELS =====
app.get('/api/models', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(`
      SELECT models.id, models.name, models.hardware_type_id, hardware_types.name AS hardware_type_name
      FROM models
      JOIN hardware_types ON models.hardware_type_id = hardware_types.id
      ORDER BY hardware_types.name, models.name
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/models', async (req, res) => {
  try {
    const { name, hardware_type_id } = req.body;
    if (!name || !hardware_type_id) return res.status(400).json({ error: 'Nama dan Hardware Type diperlukan' });
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
      'INSERT INTO models (name, hardware_type_id) VALUES (?, ?)', [name, hardware_type_id]
    );
    await connection.end();
    res.status(201).json({ id: result.insertId, name, hardware_type_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/models/:id', async (req, res) => {
  try {
    const { name, hardware_type_id } = req.body;
    if (!name || !hardware_type_id) return res.status(400).json({ error: 'Nama dan Hardware Type diperlukan' });
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(
      'UPDATE models SET name = ?, hardware_type_id = ? WHERE id = ?', [name, hardware_type_id, req.params.id]
    );
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/models/:id', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('DELETE FROM models WHERE id = ?', [req.params.id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== ASSETS =====
app.get('/api/assets', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(`
      SELECT
        assets.*,
        hardware_types.name AS hardware_type_name,
        models.name AS model_name,
        categories.name AS category_name,
        statuses.name AS status_name,
        statuses.color_hex AS status_color
      FROM assets
      JOIN hardware_types ON assets.hardware_type_id = hardware_types.id
      LEFT JOIN models ON assets.model_id = models.id
      JOIN categories ON assets.category_id = categories.id
      JOIN statuses ON assets.status_id = statuses.id
      ORDER BY assets.created_at DESC
    `);
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/assets/bulk-update', async (req, res) => {
  try {
    const { ids, updates } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Tiada aset dipilih' });
    }
    const allowedFields = ['status_id', 'category_id', 'location', 'asset_owner', 'remark'];
    const setClauses = [];
    const values = [];
    for (const field of allowedFields) {
      if (updates && Object.prototype.hasOwnProperty.call(updates, field) && updates[field] !== '') {
        setClauses.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }
    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'Tiada medan dipilih untuk dikemaskini' });
    }
    const placeholders = ids.map(() => '?').join(',');
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
      `UPDATE assets SET ${setClauses.join(', ')} WHERE id IN (${placeholders})`,
      [...values, ...ids]
    );
    await connection.end();
    res.json({ success: true, affected: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/assets/bulk', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const { shared, rows } = req.body;
    const { hardware_type_id, model_name, category_id, status_id,
      date_received, start_date, asset_owner, box_no, login_id, email,
      location, teamviewer_id, remark } = shared || {};

    if (!hardware_type_id || !category_id || !status_id) {
      await connection.end();
      return res.status(400).json({ error: 'Hardware Type, Category, dan Status diperlukan' });
    }
    if (!Array.isArray(rows) || rows.length === 0) {
      await connection.end();
      return res.status(400).json({ error: 'Tiada baris untuk disimpan' });
    }

    let model_id = null;
    if (model_name && model_name.trim()) {
      const [existing] = await connection.query(
        'SELECT id FROM models WHERE name = ? AND hardware_type_id = ?',
        [model_name.trim(), hardware_type_id]
      );
      if (existing.length > 0) {
        model_id = existing[0].id;
      } else {
        const [newModel] = await connection.query(
          'INSERT INTO models (name, hardware_type_id) VALUES (?, ?)',
          [model_name.trim(), hardware_type_id]
        );
        model_id = newModel.insertId;
      }
    }

    const results = { savedCount: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const service_tag = (row.service_tag || '').trim();
      const serial_number = (row.serial_number || '').trim();
      const host_name = (row.host_name || '').trim();

      if (!service_tag && !serial_number) {
        results.errors.push({ row: i + 1, error: 'Service Tag atau Serial Number diperlukan' });
        continue;
      }

      const rowAssetOwner = row.asset_owner || shared.asset_owner || null;
      const rowLoginId = row.login_id || shared.login_id || null;
      const rowEmail = row.email || shared.email || null;
      const rowLocation = row.location || shared.location || null;
      const rowTeamviewerId = row.teamviewer_id || shared.teamviewer_id || null;
      const rowBoxNo = row.box_no || shared.box_no || null;
      const rowRemark = row.remark || shared.remark || null;

      try {
        await connection.query(
          `INSERT INTO assets
            (service_tag, serial_number, host_name, hardware_type_id, model_id, category_id, status_id,
             teamviewer_id, date_received, start_date, asset_owner,
             box_no, login_id, email, location, remark)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [service_tag || null, serial_number || null, host_name || null, hardware_type_id, model_id, category_id, status_id,
           rowTeamviewerId, date_received || null, start_date || null,
           rowAssetOwner, rowBoxNo, rowLoginId, rowEmail, rowLocation, rowRemark]
        );
        results.savedCount++;
      } catch (rowError) {
        if (rowError.code === 'ER_DUP_ENTRY') {
          results.errors.push({ row: i + 1, error: `Service Tag/Serial Number pendua (${service_tag || serial_number})` });
        } else {
          results.errors.push({ row: i + 1, error: rowError.message });
        }
      }
    }

    await connection.end();
    res.json(results);
  } catch (error) {
    await connection.end();
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/assets/:id', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(`
      SELECT
        assets.*,
        hardware_types.name AS hardware_type_name,
        models.name AS model_name,
        categories.name AS category_name,
        statuses.name AS status_name,
        statuses.color_hex AS status_color
      FROM assets
      JOIN hardware_types ON assets.hardware_type_id = hardware_types.id
      LEFT JOIN models ON assets.model_id = models.id
      JOIN categories ON assets.category_id = categories.id
      JOIN statuses ON assets.status_id = statuses.id
      WHERE assets.id = ?
    `, [req.params.id]);
    await connection.end();
    if (rows.length === 0) return res.status(404).json({ error: 'Aset tidak dijumpai' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/assets', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const {
      service_tag, serial_number, host_name, hardware_type_id, model_name, category_id, status_id,
      teamviewer_id, date_received, start_date, asset_owner,
      box_no, login_id, email, location, remark
    } = req.body;

    const hasServiceTag = service_tag && service_tag.trim();
    const hasSerialNumber = serial_number && serial_number.trim();

    if (!hasServiceTag && !hasSerialNumber) {
      await connection.end();
      return res.status(400).json({ error: 'Sila isi Service Tag atau Serial Number (sekurang-kurangnya satu).' });
    }
    if (!hardware_type_id || !category_id || !status_id) {
      await connection.end();
      return res.status(400).json({ error: 'Hardware Type, Category, dan Status diperlukan' });
    }

    let model_id = null;
    if (model_name && model_name.trim()) {
      const [existing] = await connection.query(
        'SELECT id FROM models WHERE name = ? AND hardware_type_id = ?',
        [model_name.trim(), hardware_type_id]
      );
      if (existing.length > 0) {
        model_id = existing[0].id;
      } else {
        const [newModel] = await connection.query(
          'INSERT INTO models (name, hardware_type_id) VALUES (?, ?)',
          [model_name.trim(), hardware_type_id]
        );
        model_id = newModel.insertId;
      }
    }

    const [result] = await connection.query(
      `INSERT INTO assets
        (service_tag, serial_number, host_name, hardware_type_id, model_id, category_id, status_id,
         teamviewer_id, date_received, start_date, asset_owner,
         box_no, login_id, email, location, remark)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [service_tag || null, serial_number || null, host_name || null, hardware_type_id, model_id, category_id, status_id,
       teamviewer_id || null, date_received || null, start_date || null,
       asset_owner || null, box_no || null, login_id || null, email || null, location || null, remark || null]
    );

    await connection.end();
    res.status(201).json({ id: result.insertId, service_tag, serial_number });
  } catch (error) {
    await connection.end();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Service Tag atau Serial Number ini sudah wujud.' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/assets/:id', async (req, res) => {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const {
      service_tag, serial_number, host_name, hardware_type_id, model_name, category_id, status_id,
      teamviewer_id, date_received, start_date, asset_owner,
      box_no, login_id, email, location, remark
    } = req.body;

    const hasServiceTag = service_tag && service_tag.trim();
    const hasSerialNumber = serial_number && serial_number.trim();

    if (!hasServiceTag && !hasSerialNumber) {
      await connection.end();
      return res.status(400).json({ error: 'Sila isi Service Tag atau Serial Number (sekurang-kurangnya satu).' });
    }
    if (!hardware_type_id || !category_id || !status_id) {
      await connection.end();
      return res.status(400).json({ error: 'Hardware Type, Category, dan Status diperlukan' });
    }

    let model_id = null;
    if (model_name && model_name.trim()) {
      const [existing] = await connection.query(
        'SELECT id FROM models WHERE name = ? AND hardware_type_id = ?',
        [model_name.trim(), hardware_type_id]
      );
      if (existing.length > 0) {
        model_id = existing[0].id;
      } else {
        const [newModel] = await connection.query(
          'INSERT INTO models (name, hardware_type_id) VALUES (?, ?)',
          [model_name.trim(), hardware_type_id]
        );
        model_id = newModel.insertId;
      }
    }

    await connection.query(
      `UPDATE assets SET
        service_tag = ?, serial_number = ?, host_name = ?, hardware_type_id = ?, model_id = ?, category_id = ?, status_id = ?,
        teamviewer_id = ?, date_received = ?, start_date = ?, asset_owner = ?,
        box_no = ?, login_id = ?, email = ?, location = ?, remark = ?
       WHERE id = ?`,
      [service_tag || null, serial_number || null, host_name || null, hardware_type_id, model_id, category_id, status_id,
       teamviewer_id || null, date_received || null, start_date || null,
       asset_owner || null, box_no || null, login_id || null, email || null, location || null, remark || null,
       req.params.id]
    );

    await connection.end();
    res.json({ success: true });
  } catch (error) {
    await connection.end();
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Service Tag atau Serial Number ini sudah digunakan aset lain.' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/assets/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || ids.some(id => !Number.isInteger(Number(id)))) {
      return res.status(400).json({ error: 'There are no valid assets to delete.' });
    }

    const placeholders = ids.map(() => '?').join(',');
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.query(
      `DELETE FROM assets WHERE id IN (${placeholders})`,
      ids
    );
    await connection.end();
    res.json({ success: true, affected: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/assets/:id', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('DELETE FROM assets WHERE id = ?', [req.params.id]);
    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
