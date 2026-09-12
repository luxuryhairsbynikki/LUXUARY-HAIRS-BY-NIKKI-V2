export default async function handler(req, res) { const token = process.env.AIRTABLE_TOKEN; const baseId = process.env.AIRTABLE_BASE_ID; const tableName = process.env.AIRTABLE_TABLE_NAME || "Products";
if (!token || !baseId) { return res.status(500).json({ error: "Airtable environment variables are missing." }); }
const airtableUrl = https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)};
const headers = { Authorization: Bearer ${token}, "Content-Type": "application/json" };
try {
// GET PRODUCTS
if (req.method === "GET") {

  const response = await fetch(airtableUrl, {
    method: "GET",
    headers
  });

  const data = await response.json();

  const products = (data.records || []).map(record => ({
    id: record.id,
    name: record.fields.Name || "",
    category: record.fields.Category || "",
    price: record.fields.Price || 0,
    stock: record.fields.Stock || 0
  }));

  return res.status(200).json(products);
}

// ADD PRODUCT
if (req.method === "POST") {

  const { name, category, price, stock } = req.body;

  const response = await fetch(airtableUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name: name,
            Category: category,
            Price: Number(price),
            Stock: Number(stock)
          }
        }
      ]
    })
  });

  const data = await response.json();

  return res.status(201).json(data);
}

// DELETE PRODUCT
if (req.method === "DELETE") {

  const { id } = req.body;

  const response = await fetch(
    `${airtableUrl}/${id}`,
    {
      method: "DELETE",
      headers
    }
  );

  const data = await response.json();

  return res.status(200).json(data);
}

return res.status(405).json({
  error: "Method not allowed"
});
} catch (error) {
console.error(error);

return res.status(500).json({
  error: error.message
});
} }
