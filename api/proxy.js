// export default async function handler(request, response) { ... } の部分を、
// 以下の module.exports を使った書き方に変更します。

module.exports = async (request, response) => {
  const symbol = request.query.symbol;

  if (!symbol) {
    return response.status(400).json({ error: 'Symbol query parameter is required' });
  }

  const apiUrl = `https://api.mexc.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`;

  try {
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();
    
    // CORSヘッダーを追加
    response.setHeader('Access-Control-Allow-Origin', '*');
    
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch data from MEXC API' });
  }
};