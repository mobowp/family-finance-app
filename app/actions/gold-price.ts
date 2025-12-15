'use server';

export async function getGoldPrice() {
  const url = 'http://api.k780.com';
  const params = new URLSearchParams({
    app: 'finance.gold_price',
    goldid: '1053',
    appkey: '72260',
    sign: 'd4d168d8f065608742e3cda54efa9a01',
    format: 'json',
  });

  const fullUrl = `${url}?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(fullUrl, { 
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success !== '0') {
      // API returns success != '0' for success
      // Structure: result: { dtList: { "1053": { last_price: "..." } } }
      let price = null;
      if (data.result && data.result.dtList && data.result.dtList['1053']) {
        price = data.result.dtList['1053'].last_price;
      }

      return {
        success: true,
        price: price,
        result: data.result
      };
    } else {
      return {
        success: false,
        message: `${data.msgid} ${data.msg}`
      };
    }
  } catch (error: any) {
    console.error('Error fetching gold price:', error);
    return {
      success: false,
      message: error.message
    };
  }
}
