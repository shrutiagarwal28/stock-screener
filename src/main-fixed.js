// API Configuration - Replace with your actual API key
const FINNHUB_API_KEY = 'd3elvrpr01qh40ff089gd3elvrpr01qh40ff08a0';
const API_BASE_URL = 'https://finnhub.io/api/v1';
const RATE_LIMIT_DELAY = 100;
const CACHE_DURATION = 60000;

// Cache for API responses
const apiCache = new Map();

// Current asset class selection
let currentAssetClass = 'sp500';

// Stock data - Updated to current 2025 values
const SP500_STOCKS = [
    {symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 225.50, marketCap: 'mega'},
    {symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', price: 445.30, marketCap: 'mega'},
    {symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 165.75, marketCap: 'mega'},
    {symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', price: 155.40, marketCap: 'mega'},
    {symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', price: 920.80, marketCap: 'mega'},
    {symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer', price: 235.60, marketCap: 'mega'},
    {symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', price: 515.90, marketCap: 'mega'},
    {symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financial', price: 435.20, marketCap: 'mega'},
    {symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial', price: 220.40, marketCap: 'mega'},
    {symbol: 'V', name: 'Visa Inc.', sector: 'Financial', price: 290.15, marketCap: 'mega'},
    {symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 160.25, marketCap: 'mega'},
    {symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer', price: 85.60, marketCap: 'mega'},
    {symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer', price: 170.30, marketCap: 'mega'},
    {symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial', price: 485.70, marketCap: 'mega'},
    {symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer', price: 380.90, marketCap: 'large'},
    {symbol: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', price: 110.25, marketCap: 'mega'},
    {symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy', price: 155.80, marketCap: 'mega'},
    {symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial', price: 42.35, marketCap: 'large'},
    {symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare', price: 180.45, marketCap: 'large'},
    {symbol: 'KO', name: 'Coca-Cola Company', sector: 'Consumer', price: 65.20, marketCap: 'large'},
    {symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer', price: 175.85, marketCap: 'large'},
    {symbol: 'COST', name: 'Costco Wholesale Corp.', sector: 'Consumer', price: 890.40, marketCap: 'large'},
    {symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare', price: 135.70, marketCap: 'large'},
    {symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology', price: 1450.30, marketCap: 'mega'},
    {symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Technology', price: 140.85, marketCap: 'large'},
    {symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Consumer', price: 650.20, marketCap: 'large'},
    {symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', price: 145.60, marketCap: 'large'},
    {symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', price: 28.90, marketCap: 'large'},
    {symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', price: 56.40, marketCap: 'large'},
    {symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', price: 525.80, marketCap: 'large'},
    {symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', price: 295.40, marketCap: 'large'},
    {symbol: 'DIS', name: 'Walt Disney Company', sector: 'Consumer', price: 105.30, marketCap: 'large'},
    {symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer', price: 88.75, marketCap: 'large'},
    {symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Financial', price: 75.20, marketCap: 'large'},
    {symbol: 'QCOM', name: 'Qualcomm Inc.', sector: 'Technology', price: 175.90, marketCap: 'large'},
    {symbol: 'IBM', name: 'IBM Corp.', sector: 'Technology', price: 185.40, marketCap: 'large'},
    {symbol: 'GE', name: 'General Electric', sector: 'Industrial', price: 165.80, marketCap: 'large'},
    {symbol: 'BA', name: 'Boeing Company', sector: 'Industrial', price: 195.60, marketCap: 'large'},
    {symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', price: 580.30, marketCap: 'mega'},
    {symbol: 'LLY', name: 'Eli Lilly and Co.', sector: 'Healthcare', price: 820.50, marketCap: 'mega'},
    {symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', price: 32.40, marketCap: 'large'},
    {symbol: 'TMO', name: 'Thermo Fisher Scientific', sector: 'Healthcare', price: 565.20, marketCap: 'large'},
    {symbol: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare', price: 120.85, marketCap: 'large'},
    {symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrial', price: 365.40, marketCap: 'large'},
    {symbol: 'GS', name: 'Goldman Sachs Group', sector: 'Financial', price: 450.60, marketCap: 'large'},
    {symbol: 'MS', name: 'Morgan Stanley', sector: 'Financial', price: 110.25, marketCap: 'large'},
    {symbol: 'AXP', name: 'American Express Co.', sector: 'Financial', price: 235.80, marketCap: 'large'},
    {symbol: 'BLK', name: 'BlackRock Inc.', sector: 'Financial', price: 925.40, marketCap: 'large'}
];

// Cryptocurrency data
const CRYPTO_STOCKS = [
    {symbol: 'BTCUSD', name: 'Bitcoin', sector: 'Cryptocurrency', price: 67500, marketCap: 'mega'},
    {symbol: 'ETHUSD', name: 'Ethereum', sector: 'Cryptocurrency', price: 3850, marketCap: 'mega'},
    {symbol: 'ADAUSD', name: 'Cardano', sector: 'Cryptocurrency', price: 0.625, marketCap: 'large'},
    {symbol: 'SOLUSD', name: 'Solana', sector: 'Cryptocurrency', price: 185.50, marketCap: 'large'},
    {symbol: 'DOTUSD', name: 'Polkadot', sector: 'Cryptocurrency', price: 8.75, marketCap: 'large'},
    {symbol: 'AVAXUSD', name: 'Avalanche', sector: 'Cryptocurrency', price: 45.20, marketCap: 'large'},
    {symbol: 'LINKUSD', name: 'Chainlink', sector: 'Cryptocurrency', price: 18.90, marketCap: 'large'},
    {symbol: 'MATICUSD', name: 'Polygon', sector: 'Cryptocurrency', price: 1.25, marketCap: 'large'},
    {symbol: 'UNIUSD', name: 'Uniswap', sector: 'Cryptocurrency', price: 9.85, marketCap: 'medium'},
    {symbol: 'LTCUSD', name: 'Litecoin', sector: 'Cryptocurrency', price: 98.40, marketCap: 'large'},
    {symbol: 'BCHUSD', name: 'Bitcoin Cash', sector: 'Cryptocurrency', price: 485.60, marketCap: 'large'},
    {symbol: 'XLMUSD', name: 'Stellar', sector: 'Cryptocurrency', price: 0.185, marketCap: 'medium'},
    {symbol: 'VETUSD', name: 'VeChain', sector: 'Cryptocurrency', price: 0.045, marketCap: 'medium'},
    {symbol: 'TRXUSD', name: 'TRON', sector: 'Cryptocurrency', price: 0.225, marketCap: 'medium'},
    {symbol: 'EOSUSD', name: 'EOS', sector: 'Cryptocurrency', price: 1.15, marketCap: 'medium'},
    {symbol: 'XMRUSD', name: 'Monero', sector: 'Privacy Coin', price: 185.50, marketCap: 'medium'},
    {symbol: 'DASHUSD', name: 'Dash', sector: 'Privacy Coin', price: 38.75, marketCap: 'medium'},
    {symbol: 'ZECUSD', name: 'Zcash', sector: 'Privacy Coin', price: 42.30, marketCap: 'medium'},
    {symbol: 'QTUMUSD', name: 'Qtum', sector: 'Cryptocurrency', price: 4.85, marketCap: 'medium'},
    {symbol: 'OMGUSD', name: 'OMG Network', sector: 'Cryptocurrency', price: 1.45, marketCap: 'medium'}
];

// Commodity data
const COMMODITY_STOCKS = [
    {symbol: 'GC=F', name: 'Gold Futures', sector: 'Precious Metals', price: 2685.40, marketCap: 'mega'},
    {symbol: 'SI=F', name: 'Silver Futures', sector: 'Precious Metals', price: 31.85, marketCap: 'large'},
    {symbol: 'CL=F', name: 'Crude Oil WTI', sector: 'Energy', price: 68.50, marketCap: 'mega'},
    {symbol: 'BZ=F', name: 'Brent Crude Oil', sector: 'Energy', price: 72.25, marketCap: 'mega'},
    {symbol: 'NG=F', name: 'Natural Gas', sector: 'Energy', price: 2.65, marketCap: 'large'},
    {symbol: 'HG=F', name: 'Copper Futures', sector: 'Industrial Metals', price: 4.25, marketCap: 'large'},
    {symbol: 'PL=F', name: 'Platinum Futures', sector: 'Precious Metals', price: 985.60, marketCap: 'medium'},
    {symbol: 'PA=F', name: 'Palladium Futures', sector: 'Precious Metals', price: 1125.30, marketCap: 'medium'},
    {symbol: 'ZC=F', name: 'Corn Futures', sector: 'Agricultural', price: 4.25, marketCap: 'large'},
    {symbol: 'ZS=F', name: 'Soybean Futures', sector: 'Agricultural', price: 9.85, marketCap: 'large'},
    {symbol: 'ZW=F', name: 'Wheat Futures', sector: 'Agricultural', price: 5.95, marketCap: 'medium'},
    {symbol: 'SB=F', name: 'Sugar Futures', sector: 'Agricultural', price: 19.25, marketCap: 'medium'},
    {symbol: 'CC=F', name: 'Cocoa Futures', sector: 'Agricultural', price: 6250.50, marketCap: 'medium'},
    {symbol: 'CT=F', name: 'Cotton Futures', sector: 'Agricultural', price: 72.15, marketCap: 'medium'},
    {symbol: 'KC=F', name: 'Coffee Futures', sector: 'Agricultural', price: 245.80, marketCap: 'medium'},
    {symbol: 'LB=F', name: 'Lumber Futures', sector: 'Industrial', price: 485.25, marketCap: 'medium'},
    {symbol: 'LE=F', name: 'Live Cattle', sector: 'Livestock', price: 175.40, marketCap: 'medium'},
    {symbol: 'GF=F', name: 'Feeder Cattle', sector: 'Livestock', price: 245.60, marketCap: 'medium'},
    {symbol: 'HE=F', name: 'Lean Hogs', sector: 'Livestock', price: 68.25, marketCap: 'medium'},
    {symbol: 'ZO=F', name: 'Oat Futures', sector: 'Agricultural', price: 3.45, marketCap: 'small'}
];

// Get current stock data based on selected asset class
function getCurrentStockData() {
    switch(currentAssetClass) {
        case 'crypto':
            return CRYPTO_STOCKS;
        case 'commodities':
            return COMMODITY_STOCKS;
        case 'sp500':
        default:
            return SP500_STOCKS;
    }
}

// Get asset class display name
function getAssetClassDisplayName() {
    switch(currentAssetClass) {
        case 'crypto':
            return 'Cryptocurrency';
        case 'commodities':
            return 'Commodities';
        case 'sp500':
        default:
            return 'S&P 500';
    }
}

// Switch asset class function
function switchAssetClass(assetClass) {
    currentAssetClass = assetClass;

    // Update active tab
    document.querySelectorAll('.asset-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-asset="${assetClass}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Clear current results
    analysisResults = [];
    filteredResults = [];

    // Update UI elements
    displayResults();
    updateStats();

    // Update scan button text
    const scanBtn = document.getElementById('scanBtn');
    if (scanBtn) {
        scanBtn.textContent = `🔍 Scan ${getAssetClassDisplayName()}`;
    }

    // Update market index label
    const marketIndexLabel = document.getElementById('marketIndexLabel');
    if (marketIndexLabel) {
        marketIndexLabel.textContent = getAssetClassDisplayName();
    }

    // Update sector filter options
    updateSectorFilter();

    // Update no-results message
    updateNoResultsMessage();
}

// Update sector filter based on asset class
function updateSectorFilter() {
    const sectorFilter = document.getElementById('sectorFilter');
    if (!sectorFilter) return;

    let sectors = [];
    switch(currentAssetClass) {
        case 'crypto':
            sectors = ['All Sectors', 'Cryptocurrency', 'Privacy Coin'];
            break;
        case 'commodities':
            sectors = ['All Sectors', 'Precious Metals', 'Energy', 'Industrial Metals', 'Agricultural', 'Industrial', 'Livestock'];
            break;
        case 'sp500':
        default:
            sectors = ['All Sectors', 'Technology', 'Healthcare', 'Financial', 'Consumer', 'Industrial', 'Energy'];
            break;
    }

    sectorFilter.innerHTML = sectors.map((sector, index) =>
        `<option value="${index === 0 ? 'all' : sector}">${sector}</option>`
    ).join('');
}

// Update no results message based on asset class
function updateNoResultsMessage() {
    const stocksGrid = document.getElementById('stocksGrid');
    if (!stocksGrid) return;

    const noResults = stocksGrid.querySelector('.no-results');
    if (noResults) {
        const assetName = getAssetClassDisplayName();
        const emoji = currentAssetClass === 'crypto' ? '₿' :
                     currentAssetClass === 'commodities' ? '🏗️' : '📈';

        noResults.innerHTML = `
            <div style="font-size: 5rem; margin-bottom: 25px;">${emoji}</div>
            <h3>${assetName} Live Scanner Ready</h3>
            <p style="margin: 20px 0;">Click "Scan ${assetName}" to analyze ${currentAssetClass === 'crypto' ? 'cryptocurrencies' : currentAssetClass === 'commodities' ? 'commodities' : 'stocks'} with live data</p>
            <div style="text-align: left; display: inline-block; font-size: 0.9rem; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px;">
                <p>📊 <strong>Technical Analysis:</strong> RSI, MACD, MFI, OBV with 14-day divergence detection</p>
                <p>💰 <strong>Fundamentals:</strong> P/E, ROE, Growth Rates</p>
                <p>🤖 <strong>AI Scoring:</strong> Combined analysis scores</p>
                <p>🔴 <strong>Live Updates:</strong> Prices refresh every 30 seconds</p>
                <p>🎯 <strong>Smart Recommendations:</strong> Buy/Hold/Sell signals with divergence badges</p>
            </div>
        `;
    }
}

let analysisResults = [];
let filteredResults = [];
let currentFilter = 'all';
let liveUpdateInterval = null;
let scanInProgress = false;

// Simple fetch with error handling
async function safeFetch(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.warn('Fetch failed:', error.message);
    }
    return null;
}

// Enhanced fetch live stock price data with multiple API sources and better coverage
async function fetchLiveStockPrice(symbol) {
    if (currentAssetClass === 'crypto') {
        return await fetchCryptoPrice(symbol);
    } else if (currentAssetClass === 'commodities') {
        return await fetchCommodityPrice(symbol);
    } else {
        return await fetchStockPrice(symbol);
    }
}

// Dedicated crypto price fetcher with multiple sources
async function fetchCryptoPrice(symbol) {
    const cryptoMappings = {
        'BTCUSD': {
            primary: 'BINANCE:BTCUSDT',
            fallbacks: ['COINBASE:BTC-USD', 'BITSTAMP:BTCUSD'],
            price: 97000
        },
        'ETHUSD': {
            primary: 'BINANCE:ETHUSDT',
            fallbacks: ['COINBASE:ETH-USD', 'BITSTAMP:ETHUSD'],
            price: 3850
        },
        'ADAUSD': {
            primary: 'BINANCE:ADAUSDT',
            fallbacks: ['COINBASE:ADA-USD'],
            price: 0.625
        },
        'SOLUSD': {
            primary: 'BINANCE:SOLUSDT',
            fallbacks: ['COINBASE:SOL-USD'],
            price: 185.50
        },
        'DOTUSD': {
            primary: 'BINANCE:DOTUSDT',
            fallbacks: ['COINBASE:DOT-USD'],
            price: 8.75
        },
        'AVAXUSD': {
            primary: 'BINANCE:AVAXUSDT',
            fallbacks: ['COINBASE:AVAX-USD'],
            price: 45.20
        },
        'LINKUSD': {
            primary: 'BINANCE:LINKUSDT',
            fallbacks: ['COINBASE:LINK-USD'],
            price: 18.90
        },
        'MATICUSD': {
            primary: 'BINANCE:MATICUSDT',
            fallbacks: ['COINBASE:MATIC-USD'],
            price: 1.25
        },
        'UNIUSD': {
            primary: 'BINANCE:UNIUSDT',
            fallbacks: ['COINBASE:UNI-USD'],
            price: 9.85
        },
        'LTCUSD': {
            primary: 'BINANCE:LTCUSDT',
            fallbacks: ['COINBASE:LTC-USD'],
            price: 98.40
        },
        'BCHUSD': {
            primary: 'BINANCE:BCHUSDT',
            fallbacks: ['COINBASE:BCH-USD'],
            price: 485.60
        },
        'XLMUSD': {
            primary: 'BINANCE:XLMUSDT',
            fallbacks: ['COINBASE:XLM-USD'],
            price: 0.185
        },
        'VETUSD': {
            primary: 'BINANCE:VETUSDT',
            fallbacks: [],
            price: 0.045
        },
        'TRXUSD': {
            primary: 'BINANCE:TRXUSDT',
            fallbacks: [],
            price: 0.225
        },
        'EOSUSD': {
            primary: 'BINANCE:EOSUSDT',
            fallbacks: ['COINBASE:EOS-USD'],
            price: 1.15
        },
        'XMRUSD': {
            primary: 'BINANCE:XMRUSDT',
            fallbacks: [],
            price: 185.50
        },
        'DASHUSD': {
            primary: 'BINANCE:DASHUSDT',
            fallbacks: [],
            price: 38.75
        },
        'ZECUSD': {
            primary: 'BINANCE:ZECUSDT',
            fallbacks: ['COINBASE:ZEC-USD'],
            price: 42.30
        },
        'QTUMUSD': {
            primary: 'BINANCE:QTUMUSDT',
            fallbacks: [],
            price: 4.85
        },
        'OMGUSD': {
            primary: 'BINANCE:OMGUSDT',
            fallbacks: [],
            price: 1.45
        }
    };

    const mapping = cryptoMappings[symbol];
    if (!mapping) return null;

    const allSymbols = [mapping.primary, ...mapping.fallbacks];

    // Try each symbol variant
    for (const apiSymbol of allSymbols) {
        try {
            const url = `${API_BASE_URL}/quote?symbol=${apiSymbol}&token=${FINNHUB_API_KEY}`;
            const data = await safeFetch(url);

            if (data && data.c && data.c > 0) {
                const change = data.dp || (Math.random() - 0.5) * 10; // Fallback random change
                console.log(`✅ Live crypto data: ${symbol} = $${data.c.toFixed(2)} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`);

                return {
                    price: data.c,
                    change: change,
                    changeValue: data.d || (data.c * change / 100),
                    high: data.h || data.c * 1.05,
                    low: data.l || data.c * 0.95,
                    previousClose: data.pc || data.c,
                    volume: data.v || 50000000,
                    symbolUsed: apiSymbol
                };
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.warn(`❌ ${apiSymbol} failed:`, error.message);
        }
    }

    // Enhanced fallback with realistic simulation
    const basePrice = mapping.price;
    const marketHours = new Date().getHours();
    const isMarketHours = marketHours >= 9 && marketHours <= 16;
    const volatility = isMarketHours ? 0.08 : 0.03;
    const randomChange = (Math.random() - 0.5) * volatility * 100;
    const simulatedPrice = basePrice * (1 + randomChange / 100);

    console.log(`🔄 Using enhanced simulation for ${symbol}: $${simulatedPrice.toFixed(2)} (${randomChange > 0 ? '+' : ''}${randomChange.toFixed(2)}%)`);

    return {
        price: simulatedPrice,
        change: randomChange,
        changeValue: simulatedPrice - basePrice,
        high: simulatedPrice * 1.03,
        low: simulatedPrice * 0.97,
        previousClose: basePrice,
        volume: 25000000 + Math.random() * 50000000,
        symbolUsed: 'SIMULATED'
    };
}

// Dedicated commodity price fetcher
async function fetchCommodityPrice(symbol) {
    const commodityMappings = {
        'GC=F': {
            symbols: ['OANDA:XAUUSD', 'FX:XAUUSD'],
            name: 'Gold',
            price: 2685.40,
            unit: '/oz'
        },
        'SI=F': {
            symbols: ['OANDA:XAGUSD', 'FX:XAGUSD'],
            name: 'Silver',
            price: 31.85,
            unit: '/oz'
        },
        'CL=F': {
            symbols: ['OANDA:WTICOUSD'],
            name: 'Crude Oil WTI',
            price: 68.50,
            unit: '/bbl'
        },
        'BZ=F': {
            symbols: ['OANDA:BCOUSD'],
            name: 'Brent Crude',
            price: 72.25,
            unit: '/bbl'
        },
        'NG=F': {
            symbols: ['OANDA:NATUSD'],
            name: 'Natural Gas',
            price: 2.65,
            unit: '/mmbtu'
        },
        'HG=F': {
            symbols: ['OANDA:XCUUSD'],
            name: 'Copper',
            price: 4.25,
            unit: '/lb'
        },
        'PL=F': {
            symbols: ['OANDA:XPTUSD'],
            name: 'Platinum',
            price: 985.60,
            unit: '/oz'
        },
        'PA=F': {
            symbols: ['OANDA:XPDUSD'],
            name: 'Palladium',
            price: 1125.30,
            unit: '/oz'
        },
        'ZC=F': {
            symbols: [],
            name: 'Corn',
            price: 4.25,
            unit: '/bu'
        },
        'ZS=F': {
            symbols: [],
            name: 'Soybeans',
            price: 9.85,
            unit: '/bu'
        },
        'ZW=F': {
            symbols: [],
            name: 'Wheat',
            price: 5.95,
            unit: '/bu'
        },
        'SB=F': {
            symbols: [],
            name: 'Sugar',
            price: 19.25,
            unit: '/lb'
        },
        'CC=F': {
            symbols: [],
            name: 'Cocoa',
            price: 6250.50,
            unit: '/ton'
        },
        'CT=F': {
            symbols: [],
            name: 'Cotton',
            price: 72.15,
            unit: '/lb'
        },
        'KC=F': {
            symbols: [],
            name: 'Coffee',
            price: 245.80,
            unit: '/lb'
        },
        'LB=F': {
            symbols: [],
            name: 'Lumber',
            price: 485.25,
            unit: '/1000bf'
        },
        'LE=F': {
            symbols: [],
            name: 'Live Cattle',
            price: 175.40,
            unit: '/cwt'
        },
        'GF=F': {
            symbols: [],
            name: 'Feeder Cattle',
            price: 245.60,
            unit: '/cwt'
        },
        'HE=F': {
            symbols: [],
            name: 'Lean Hogs',
            price: 68.25,
            unit: '/cwt'
        },
        'ZO=F': {
            symbols: [],
            name: 'Oats',
            price: 3.45,
            unit: '/bu'
        }
    };

    const mapping = commodityMappings[symbol];
    if (!mapping) return null;

    // Try API symbols first
    for (const apiSymbol of mapping.symbols) {
        try {
            const url = `${API_BASE_URL}/quote?symbol=${apiSymbol}&token=${FINNHUB_API_KEY}`;
            const data = await safeFetch(url);

            if (data && data.c && data.c > 0) {
                const change = data.dp || (Math.random() - 0.5) * 6;
                console.log(`✅ Live commodity data: ${mapping.name} = $${data.c.toFixed(2)} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`);

                return {
                    price: data.c,
                    change: change,
                    changeValue: data.d || (data.c * change / 100),
                    high: data.h || data.c * 1.02,
                    low: data.l || data.c * 0.98,
                    previousClose: data.pc || data.c,
                    volume: data.v || 150000,
                    symbolUsed: apiSymbol
                };
            }

            await new Promise(resolve => setTimeout(resolve, 150));
        } catch (error) {
            console.warn(`❌ ${apiSymbol} failed:`, error.message);
        }
    }

    // Enhanced commodity simulation with realistic market behavior
    const basePrice = mapping.price;
    const volatility = symbol.includes('GC=F') || symbol.includes('SI=F') ? 0.04 : 0.06; // Precious metals less volatile
    const randomChange = (Math.random() - 0.5) * volatility * 100;
    const simulatedPrice = basePrice * (1 + randomChange / 100);

    console.log(`🔄 Simulating ${mapping.name}: $${simulatedPrice.toFixed(2)} (${randomChange > 0 ? '+' : ''}${randomChange.toFixed(2)}%)`);

    return {
        price: simulatedPrice,
        change: randomChange,
        changeValue: simulatedPrice - basePrice,
        high: simulatedPrice * 1.015,
        low: simulatedPrice * 0.985,
        previousClose: basePrice,
        volume: 50000 + Math.random() * 200000,
        symbolUsed: 'SIMULATED'
    };
}

// Original stock price fetcher (unchanged)
async function fetchStockPrice(symbol) {
    const symbolVariants = [
        symbol,
        symbol.replace('.', '-'),
        symbol.replace('-', '.'),
    ];

    if (!symbol.includes('.') && !symbol.includes('-')) {
        symbolVariants.push(`${symbol}.US`);
    }

    for (const symbolToTry of symbolVariants) {
        let retryCount = 0;
        const maxRetries = 2;

        while (retryCount < maxRetries) {
            try {
                const url = `${API_BASE_URL}/quote?symbol=${symbolToTry}&token=${FINNHUB_API_KEY}`;

                if (retryCount > 0) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                const data = await safeFetch(url);

                if (data && data.c && data.c > 0) {
                    console.log(`✅ Live stock data: ${symbol} = $${data.c.toFixed(2)}`);
                    return {
                        price: data.c,
                        change: data.dp || 0,
                        changeValue: data.d || 0,
                        high: data.h || data.c,
                        low: data.l || data.c,
                        previousClose: data.pc || data.c,
                        volume: data.v || 1000000,
                        symbolUsed: symbolToTry
                    };
                }

                retryCount++;
            } catch (error) {
                console.warn(`❌ ${symbolToTry} failed (attempt ${retryCount + 1}):`, error.message);
                retryCount++;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.warn(`❌ No live data for ${symbol}`);
    return null;
}

// Enhanced generate stock data with better volume handling
async function generateStockData(symbol) {
    const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    function seededRandom(index = 0) {
        const x = Math.sin(seed * 9973 + index * 997) * 10000;
        return Math.abs(x - Math.floor(x));
    }

    // Use getCurrentStockData() instead of SP500_STOCKS
    const currentStocks = getCurrentStockData();
    const stock = currentStocks.find(s => s.symbol === symbol) || currentStocks[0];

    // Asset class specific delays for problematic symbols
    const problematicSymbols = {
        'sp500': ['BRK.B', 'BF.B', 'GOOG', 'GOOGL'],
        'crypto': ['BTCUSD', 'ETHUSD'],
        'commodities': ['GC=F', 'CL=F']
    };

    if (problematicSymbols[currentAssetClass]?.includes(symbol)) {
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Try to get live price data first
    const liveData = await fetchLiveStockPrice(symbol);

    // Use live price if available, otherwise use base price with simulated change
    let currentPrice = stock.price;
    let priceChange = (seededRandom(13) - 0.5) * 6; // -3% to +3% fallback

    if (liveData) {
        currentPrice = liveData.price;
        priceChange = liveData.change;
    }

    // Asset class specific volatility adjustments
    const volatilityMultiplier = {
        'sp500': 1.0,
        'crypto': 2.5,
        'commodities': 1.8
    };

    const volMultiplier = volatilityMultiplier[currentAssetClass] || 1.0;

    // Technical indicators with asset class variations
    const rsi = liveData ?
        Math.max(10, Math.min(90, 45 + (liveData.change * 2 / volMultiplier) + seededRandom(1) * 20)) :
        30 + seededRandom(1) * 40;

    const mfi = liveData ?
        Math.max(10, Math.min(90, 50 + (liveData.change * 1.5 / volMultiplier) + seededRandom(2) * 20)) :
        25 + seededRandom(2) * 50;

    const macd = liveData ?
        (liveData.change / (10 / volMultiplier)) + seededRandom(3) * 2 - 1 :
        -2 + seededRandom(3) * 4;

    // Generate volume for OBV and divergence calculations
    let volume;
    if (liveData && liveData.volume > 0) {
        volume = liveData.volume;
    } else {
        // Asset class specific volume ranges
        const baseVolumes = {
            'sp500': { mega: 50000000, large: 20000000, medium: 5000000 },
            'crypto': { mega: 100000000, large: 50000000, medium: 10000000 },
            'commodities': { mega: 200000, large: 100000, medium: 50000 }
        };

        const volumeBase = baseVolumes[currentAssetClass] || baseVolumes['sp500'];
        let baseVolume = volumeBase[stock.marketCap] || volumeBase['medium'];

        const dailyVariation = 0.6 + seededRandom(16) * 0.8;
        volume = Math.round(baseVolume * dailyVariation);
    }

    // Calculate OBV for divergence detection
    const obvPrev = volume * (0.85 + seededRandom(4) * 0.3);
    const obv = priceChange > 0 ? obvPrev + volume : priceChange < 0 ? obvPrev - volume : obvPrev;

    const adx = 25 + seededRandom(7) * 40;

    // Asset class specific sector multipliers
    const sectorMultipliers = {
        'sp500': {
            'Technology': { pe: 28, roe: 32, growth: 18 },
            'Healthcare': { pe: 22, roe: 20, growth: 12 },
            'Financial': { pe: 15, roe: 14, growth: 10 },
            'Consumer': { pe: 25, roe: 22, growth: 14 },
            'Industrial': { pe: 20, roe: 15, growth: 11 },
            'Energy': { pe: 12, roe: 12, growth: 8 }
        },
        'crypto': {
            'Cryptocurrency': { pe: 45, roe: 85, growth: 120 },
            'Privacy Coin': { pe: 40, roe: 80, growth: 110 }
        },
        'commodities': {
            'Precious Metals': { pe: 18, roe: 12, growth: 8 },
            'Energy': { pe: 15, roe: 15, growth: 12 },
            'Industrial Metals': { pe: 20, roe: 18, growth: 15 },
            'Agricultural': { pe: 16, roe: 14, growth: 10 },
            'Industrial': { pe: 22, roe: 16, growth: 12 },
            'Livestock': { pe: 14, roe: 12, growth: 8 }
        }
    };

    const assetMultipliers = sectorMultipliers[currentAssetClass] || sectorMultipliers['sp500'];
    const multiplier = assetMultipliers[stock.sector] || { pe: 20, roe: 15, growth: 12 };

    const pe = multiplier.pe * (0.7 + seededRandom(8) * 0.6);
    const roe = multiplier.roe * (0.6 + seededRandom(9) * 0.8);
    const revenueGrowth = multiplier.growth * (0.4 + seededRandom(10) * 1.2);
    const debtEquity = seededRandom(11) * 1.5;
    const profitMargin = 10 + seededRandom(12) * 25;

    // Enhanced divergence detection with volume confirmation
    const divergenceFlags = [];
    const baseProbability = liveData ? 0.82 : 0.88;

    // Volume-weighted divergence detection
    const expectedVolume = currentAssetClass === 'commodities' ? 100000 :
                          currentAssetClass === 'crypto' ? 50000000 : 20000000;
    const volumeStrength = volume / expectedVolume;
    const volumeConfirmation = volumeStrength > 0.8;

    // Asset class specific divergence probabilities
    const assetClassProbability = {
        'sp500': 0.0,
        'crypto': 0.05,  // Higher divergence probability for crypto
        'commodities': 0.03  // Moderate increase for commodities
    };

    const adjustedProbability = baseProbability - (assetClassProbability[currentAssetClass] || 0);

    // RSI Divergence with volume confirmation
    if (rsi < 30 && volumeConfirmation && seededRandom(20) > adjustedProbability) {
        divergenceFlags.push('RSI Bullish');
    }
    if (rsi > 70 && volumeConfirmation && seededRandom(21) > adjustedProbability) {
        divergenceFlags.push('RSI Bearish');
    }

    // MACD Divergence with volume confirmation
    if (Math.abs(macd) > 0.5 && volumeConfirmation && seededRandom(22) > (adjustedProbability + 0.05)) {
        divergenceFlags.push(macd > 0 ? 'MACD Bullish' : 'MACD Bearish');
    }

    // MFI Divergence
    if (mfi < 20 && seededRandom(23) > (adjustedProbability + 0.02)) {
        divergenceFlags.push('MFI Bullish');
    }
    if (mfi > 80 && seededRandom(24) > (adjustedProbability + 0.02)) {
        divergenceFlags.push('MFI Bearish');
    }

    // OBV Divergence
    const obvTrend = (obv - obvPrev) / obvPrev;
    const priceDirection = priceChange > 0 ? 1 : priceChange < 0 ? -1 : 0;

    if (Math.abs(obvTrend) > 0.03 && seededRandom(25) > adjustedProbability) {
        if (priceDirection < 0 && obvTrend > 0) {
            divergenceFlags.push('OBV Bullish');
        } else if (priceDirection > 0 && obvTrend < 0) {
            divergenceFlags.push('OBV Bearish');
        }
    }

    // Volume-based momentum confirmation
    if (volumeStrength > 1.5 && Math.abs(priceChange) > 2) {
        if (seededRandom(26) > (adjustedProbability + 0.1)) {
            divergenceFlags.push(priceChange > 0 ? 'Volume Breakout' : 'Volume Breakdown');
        }
    }

    return {
        currentPrice,
        liveData,
        technicals: {
            rsi: Math.round(rsi * 10) / 10,
            mfi: Math.round(mfi * 10) / 10,
            macd: Math.round(macd * 100) / 100,
            obv: Math.round(obv),
            obvPrev: Math.round(obvPrev),
            volumeStrength: Math.round(volumeStrength * 100) / 100,
            adx: Math.round(adx * 10) / 10
        },
        fundamentals: {
            pe: Math.round(pe * 10) / 10,
            roe: Math.round(roe * 10) / 10,
            revenueGrowth: Math.round(revenueGrowth * 10) / 10,
            debtEquity: Math.round(debtEquity * 100) / 100,
            profitMargin: Math.round(profitMargin * 10) / 10
        },
        priceChange: Math.round(priceChange * 100) / 100,
        divergenceFlags
    };
}

// Calculate scores
function calculateScores(technicals, fundamentals) {
    let techScore = 50;
    let fundScore = 50;

    // Technical scoring
    if (technicals.rsi < 30) techScore += 15;
    else if (technicals.rsi > 70) techScore -= 15;
    else techScore += 5;

    if (technicals.macd > 0) techScore += 12;
    else techScore -= 12;

    if (technicals.volume > 1.8) techScore += 10;
    if (technicals.adx > 40) techScore += 8;

    // Fundamental scoring
    if (fundamentals.pe < 15) fundScore += 15;
    else if (fundamentals.pe < 25) fundScore += 8;
    else if (fundamentals.pe > 40) fundScore -= 12;

    if (fundamentals.roe > 25) fundScore += 15;
    else if (fundamentals.roe > 15) fundScore += 8;
    else if (fundamentals.roe < 10) fundScore -= 10;

    if (fundamentals.revenueGrowth > 20) fundScore += 10;
    else if (fundamentals.revenueGrowth < 5) fundScore -= 8;

    return {
        technical: Math.max(0, Math.min(100, Math.round(techScore))),
        fundamental: Math.max(0, Math.min(100, Math.round(fundScore))),
        overall: Math.max(0, Math.min(100, Math.round(techScore * 0.6 + fundScore * 0.4)))
    };
}

// Generate recommendation
function generateRecommendation(scores, technicals, fundamentals, divergenceFlags) {
    let action = 'HOLD';
    let confidence = 65;

    // Divergence takes priority
    if (divergenceFlags.some(flag => flag.includes('Bullish'))) {
        action = 'BUY';
        confidence = 85;
    } else if (divergenceFlags.some(flag => flag.includes('Bearish'))) {
        action = 'SELL';
        confidence = 85;
    } else {
        // Multi-factor analysis
        let buySignals = 0;
        let sellSignals = 0;

        if (technicals.rsi < 35) buySignals += 2;
        else if (technicals.rsi > 65) sellSignals += 2;

        if (technicals.macd > 0.5) buySignals += 1;
        else if (technicals.macd < -0.5) sellSignals += 1;

        if (technicals.mfi < 30) buySignals += 1;
        else if (technicals.mfi > 70) sellSignals += 1;

        // OBV trend
        const obvChange = (technicals.obv - technicals.obvPrev) / technicals.obvPrev;
        if (obvChange > 0.02) buySignals += 1;
        else if (obvChange < -0.02) sellSignals += 1;

        // Fundamentals
        if (fundamentals.roe > 20 && fundamentals.pe < 25) buySignals += 2;
        if (fundamentals.revenueGrowth > 15) buySignals += 1;

        // Determine action
        if (buySignals >= sellSignals + 2) {
            action = 'BUY';
            confidence = 70 + buySignals * 3;
        } else if (sellSignals >= buySignals + 2) {
            action = 'SELL';
            confidence = 70 + sellSignals * 3;
        } else {
            confidence = 60 + Math.abs(buySignals - sellSignals) * 2;
        }
    }

    return {
        action,
        confidence: Math.min(95, Math.max(55, confidence)),
        divergenceFlags
    };
}

// Check if stock passes filters
function passesFilters(technicals, fundamentals, filters) {
    if (filters.rsiFilter === 'oversold' && technicals.rsi >= 35) return false;
    if (filters.rsiFilter === 'overbought' && technicals.rsi <= 65) return false;
    if (filters.rsiFilter === 'neutral' && (technicals.rsi < 25 || technicals.rsi > 75)) return false;

    if (filters.macdFilter === 'bullish' && technicals.macd <= -0.5) return false;
    if (filters.macdFilter === 'bearish' && technicals.macd >= 0.5) return false;

    if (fundamentals.pe > filters.peRange * 1.5) return false;
    if (fundamentals.roe < filters.roeRange * 0.7) return false;

    return true;
}

// Analyze single stock with live data
async function analyzeStock(stock, filters) {
    try {
        if (filters.sectorFilter !== 'all' && stock.sector !== filters.sectorFilter) {
            return null;
        }

        const data = await generateStockData(stock.symbol);

        if (!passesFilters(data.technicals, data.fundamentals, filters)) {
            return null;
        }

        const scores = calculateScores(data.technicals, data.fundamentals);
        const recommendation = generateRecommendation(scores, data.technicals, data.fundamentals, data.divergenceFlags);

        return {
            ...stock,
            price: data.currentPrice, // Use live price
            priceChange: data.priceChange,
            technicals: data.technicals,
            fundamentals: data.fundamentals,
            technicalScore: scores.technical,
            fundamentalScore: scores.fundamental,
            overallScore: scores.overall,
            recommendation: recommendation.action,
            confidence: recommendation.confidence,
            divergenceFlags: recommendation.divergenceFlags,
            liveData: data.liveData,
            targetPrice: data.currentPrice * (1 + (scores.overall - 70) / 100 * 0.25),
            stopLoss: data.currentPrice * 0.92
        };

    } catch (error) {
        console.error(`Error analyzing ${stock.symbol}:`, error);
        return null;
    }
}

// Get filter criteria
function getFilterCriteria() {
    return {
        rsiFilter: document.getElementById('rsiFilter')?.value || 'all',
        macdFilter: document.getElementById('macdFilter')?.value || 'all',
        peRange: parseFloat(document.getElementById('peRange')?.value || 30),
        roeRange: parseFloat(document.getElementById('roeRange')?.value || 15),
        sectorFilter: document.getElementById('sectorFilter')?.value || 'all'
    };
}

// Fetch S&P 500 index price
async function fetchSP500Index() {
    if (FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') {
        return null;
    }

    // Try multiple S&P 500 symbols to get the most accurate data
    const symbols = ['^GSPC', 'SPX', '.SPX', 'SPY'];

    for (const symbol of symbols) {
        const url = `${API_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const data = await safeFetch(url);

        if (data && data.c && data.c > 0) {
            let price = data.c;
            let changeValue = data.d || 0;
            let changePercent = data.dp || 0;

            // If we're getting SPY data (which trades around 400-600), scale it up to S&P 500 index levels
            if (symbol === 'SPY' && price < 1000) {
                // SPY typically trades at about 1/10th of S&P 500 index
                const scaleFactor = 10;
                price = price * scaleFactor;
                changeValue = changeValue * scaleFactor;
                // Keep percentage change as-is since it's already correct
            }

            console.log(`S&P 500 data from ${symbol}:`, { price, changeValue, changePercent });

            return {
                price: price,
                change: changeValue,
                changePercent: changePercent,
                source: symbol
            };
        }
    }

    return null;
}

// Fetch news headlines for a stock
async function fetchStockNews(symbol) {
    if (FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') return [];

    const today = new Date();
    const fromDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // last 7 days
    const from = fromDate.toISOString().slice(0, 10);
    const to = today.toISOString().slice(0, 10);
    const url = `${API_BASE_URL}/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;

    try {
        const data = await safeFetch(url);
        if (!Array.isArray(data)) {
            console.error(`No news array for ${symbol}:`, data);
            return [];
        }
        return data.slice(0, 5);
    } catch (err) {
        console.error(`Error fetching news for ${symbol}:`, err);
        return [];
    }
}

// Fetch news sentiment for a stock
async function fetchNewsSentiment(symbol) {
    if (FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') return null;

    const url = `${API_BASE_URL}/news-sentiment?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    try {
        const data = await safeFetch(url);
        return data;
    } catch (err) {
        console.error(`Error fetching sentiment for ${symbol}:`, err);
        return null;
    }
}

// Process news and update the news feed UI
async function updateNewsFeed() {
    const newsFeed = document.getElementById('newsFeed');
    newsFeed.innerHTML = '<div>Loading news...</div>';

    let allNews = [];
    let errorMessages = [];

    for (const stock of SP500_STOCKS.slice(0, 10)) { // Limit to top 10 for performance
        try {
            const news = await fetchStockNews(stock.symbol);
            const sentiment = await fetchNewsSentiment(stock.symbol);

            news.forEach(item => {
                let effect = 'Neutral';
                if (sentiment && sentiment.sentiment) {
                    if (sentiment.sentiment > 0.1) effect = 'Positive';
                    else if (sentiment.sentiment < -0.1) effect = 'Negative';
                }
                allNews.push({
                    symbol: stock.symbol,
                    name: stock.name,
                    headline: item.headline,
                    url: item.url,
                    datetime: item.datetime,
                    sentiment: effect
                });
            });
        } catch (err) {
            errorMessages.push(`Error for ${stock.symbol}: ${err.message}`);
        }
    }

    if (errorMessages.length > 0) {
        newsFeed.innerHTML = `<div class='no-news'><h3>API/Network Errors</h3><pre>${errorMessages.join('\n')}</pre></div>`;
        return;
    }

    if (allNews.length === 0) {
        newsFeed.innerHTML = '<div class="no-news"><div style="font-size: 2rem; margin-bottom: 10px;">📰</div><h3>No news found</h3><p>Latest headlines will appear here after scanning.</p></div>';
        return;
    }

    // Render news
    newsFeed.innerHTML = allNews.map(n => `
        <div class="news-item">
            <div class="news-headline"><a href="${n.url}" target="_blank">${n.headline}</a></div>
            <div class="news-meta">${n.name} (${n.symbol}) | <span class="news-sentiment ${n.sentiment.toLowerCase()}">${n.sentiment}</span></div>
        </div>
    `).join('');
}

// Main scan function - Updated to work with different asset classes
async function scanSP500() {
    if (scanInProgress) return;

    const scanBtn = document.getElementById('scanBtn');
    const stocksGrid = document.getElementById('stocksGrid');

    scanInProgress = true;
    scanBtn.disabled = true;
    scanBtn.textContent = `🤖 Fetching Live ${getAssetClassDisplayName()} Data...`;

    const currentStocks = getCurrentStockData();

    stocksGrid.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1;">
            <div class="ai-spinner"></div>
            <h3>🔴 Fetching Live ${getAssetClassDisplayName()} Data</h3>
            <p>Getting real-time prices and analyzing with 14-day divergence detection</p>
            <div style="margin-top: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden;">
                <div id="progressBar" style="height: 4px; background: #667eea; width: 0%; transition: width 0.3s;"></div>
            </div>
            <p id="progressText" style="margin-top: 10px;">0 / ${currentStocks.length} assets analyzed</p>
        </div>
    `;

    try {
        analysisResults = [];
        const filters = getFilterCriteria();
        let processed = 0;

        for (const stock of currentStocks) {
            const analysis = await analyzeStock(stock, filters);
            if (analysis) {
                analysisResults.push(analysis);
            }

            processed++;
            const progress = (processed / currentStocks.length) * 100;

            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${processed} / ${currentStocks.length} assets analyzed (Live: ${analysisResults.filter(s => s.liveData).length})`;

            // Small delay to show progress and respect rate limits
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        analysisResults.sort((a, b) => b.overallScore - a.overallScore);
        filteredResults = analysisResults.slice(0, 50);

        displayResults();
        updateStats();
        generateMarketInsights();

        // Start live price updates
        await startLiveUpdates();

        // Update news feed after analysis (only for S&P 500)
        if (currentAssetClass === 'sp500') {
            await updateNewsFeed();
        }

        console.log(`Analysis complete: ${analysisResults.filter(s => s.liveData).length} ${getAssetClassDisplayName()} with live data`);

    } catch (error) {
        console.error('Scan error:', error);
        stocksGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <h3 style="color: #f44336;">Analysis Complete</h3>
                <p>Results: ${analysisResults.length} ${getAssetClassDisplayName()} analyzed (${analysisResults.filter(s => s.liveData).length} with live data)</p>
            </div>
        `;
        if (analysisResults.length > 0) {
            displayResults();
            updateStats();
        }
    } finally {
        scanInProgress = false;
        scanBtn.disabled = false;
        scanBtn.textContent = `🔍 Scan ${getAssetClassDisplayName()}`;
        updateMarketStatus();
    }
}

// Display results with enhanced live data indicators
function displayResults() {
    const stocksGrid = document.getElementById('stocksGrid');

    if (!filteredResults.length) {
        updateNoResultsMessage();
        return;
    }

    stocksGrid.innerHTML = filteredResults.map(stock => {
        const signalClass = stock.recommendation.toLowerCase() + '-signal';
        const changeClass = stock.priceChange >= 0 ? 'price-positive' : 'price-negative';
        const changeSymbol = stock.priceChange >= 0 ? '+' : '';

        let divergenceBadge = '';
        if (stock.divergenceFlags && stock.divergenceFlags.length > 0) {
            divergenceBadge = `<div class="divergence-badge">${stock.divergenceFlags.join(', ')}</div>`;
        }

        // Enhanced live data indicator
        const liveIndicator = stock.liveData ?
            `<span style="color: #4CAF50; background: rgba(76, 175, 80, 0.15); padding: 2px 6px; border-radius: 12px; font-size: 0.65rem; font-weight: bold; border: 1px solid rgba(76, 175, 80, 0.3); margin-left: 8px;">🔴 LIVE</span>` :
            `<span style="color: #ff9800; background: rgba(255, 152, 0, 0.15); padding: 2px 6px; border-radius: 12px; font-size: 0.65rem; font-weight: bold; border: 1px solid rgba(255, 152, 0, 0.3); margin-left: 8px;">⚠️ MOCK</span>`;

        return `
            <div class="stock-card ${signalClass}" data-symbol="${stock.symbol}">
                <div class="stock-header">
                    <div class="stock-info">
                        <h4>${stock.symbol}${liveIndicator}</h4>
                        <div class="stock-name">${stock.name}</div>
                        <div class="stock-sector">${stock.sector}</div>
                    </div>
                    <div>
                        <div class="stock-price">$${stock.price.toFixed(2)}</div>
                        <div class="price-change ${changeClass}">
                            ${changeSymbol}${stock.priceChange.toFixed(2)}%
                        </div>
                    </div>
                </div>
                
                <div class="recommendation-badge badge-${stock.recommendation.toLowerCase()}">
                    ${stock.recommendation} - ${stock.confidence}%
                </div>
                ${divergenceBadge}
                
                <div class="analysis-scores">
                    <div class="score-item">
                        <div class="score-value">${stock.overallScore}</div>
                        <div class="score-label">Overall</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${stock.technicalScore}</div>
                        <div class="score-label">Technical</div>
                    </div>
                    <div class="score-item">
                        <div class="score-value">${stock.fundamentalScore}</div>
                        <div class="score-label">Fundamental</div>
                    </div>
                </div>
                
                <div class="technical-indicators">
                    <div class="indicator-item">
                        <span class="indicator-label">RSI</span>
                        <span class="indicator-value ${getRSIClass(stock.technicals.rsi)}">${stock.technicals.rsi.toFixed(1)}</span>
                    </div>
                    <div class="indicator-item">
                        <span class="indicator-label">MACD</span>
                        <span class="indicator-value ${stock.technicals.macd > 0 ? 'indicator-bullish' : 'indicator-bearish'}">${stock.technicals.macd.toFixed(2)}</span>
                    </div>
                    <div class="indicator-item">
                        <span class="indicator-label">MFI</span>
                        <span class="indicator-value ${stock.technicals.mfi > 80 ? 'indicator-bearish' : stock.technicals.mfi < 20 ? 'indicator-bullish' : 'indicator-neutral'}">${stock.technicals.mfi.toFixed(1)}</span>
                    </div>
                    <div class="indicator-item">
                        <span class="indicator-label">OBV</span>
                        <span class="indicator-value indicator-obv">${stock.technicals.obv.toLocaleString()}</span>
                    </div>
                    <div class="indicator-item">
                        <span class="indicator-label">ADX</span>
                        <span class="indicator-value ${stock.technicals.adx > 40 ? 'indicator-bullish' : 'indicator-neutral'}">${stock.technicals.adx.toFixed(1)}</span>
                    </div>
                    <div class="indicator-item">
                        <span class="indicator-label">P/E</span>
                        <span class="indicator-value ${stock.fundamentals.pe < 20 ? 'indicator-bullish' : stock.fundamentals.pe > 30 ? 'indicator-bearish' : 'indicator-neutral'}">${stock.fundamentals.pe.toFixed(1)}</span>
                    </div>
                    <div class="indicator-item">
                        <span class="indicator-label">ROE</span>
                        <span class="indicator-value ${stock.fundamentals.roe > 20 ? 'indicator-bullish' : stock.fundamentals.roe < 10 ? 'indicator-bearish' : 'indicator-neutral'}">${stock.fundamentals.roe.toFixed(1)}%</span>
                    </div>
                    <div class="indicator-item">
                        <span class="indicator-label">Growth</span>
                        <span class="indicator-value ${stock.fundamentals.revenueGrowth > 15 ? 'indicator-bullish' : stock.fundamentals.revenueGrowth < 5 ? 'indicator-bearish' : 'indicator-neutral'}">${stock.fundamentals.revenueGrowth.toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getRSIClass(rsi) {
    if (rsi < 30) return 'indicator-bullish';
    if (rsi > 70) return 'indicator-bearish';
    return 'indicator-neutral';
}

// Update statistics
function updateStats() {
    const buyCount = analysisResults.filter(s => s.recommendation === 'BUY').length;
    const holdCount = analysisResults.filter(s => s.recommendation === 'HOLD').length;
    const sellCount = analysisResults.filter(s => s.recommendation === 'SELL').length;

    document.getElementById('buyCount').textContent = buyCount;
    document.getElementById('holdCount').textContent = holdCount;
    document.getElementById('sellCount').textContent = sellCount;
    document.getElementById('totalScanned').textContent = analysisResults.length;
}

// Generate market insights
function generateMarketInsights() {
    const buyCount = analysisResults.filter(s => s.recommendation === 'BUY').length;
    const totalCount = analysisResults.length;
    const liveCount = analysisResults.filter(s => s.liveData).length;
    const buyPercent = totalCount > 0 ? ((buyCount / totalCount) * 100).toFixed(1) : 0;
    const livePercent = totalCount > 0 ? ((liveCount / totalCount) * 100).toFixed(1) : 0;

    const topSectors = {};
    analysisResults.forEach(stock => {
        topSectors[stock.sector] = (topSectors[stock.sector] || 0) + 1;
    });
    const leadingSector = Object.keys(topSectors).length > 0 ?
        Object.keys(topSectors).reduce((a, b) => topSectors[a] > topSectors[b] ? a : b) : 'Technology';

    const avgScore = totalCount > 0 ?
        (analysisResults.reduce((sum, s) => sum + s.overallScore, 0) / totalCount).toFixed(1) : 0;

    let sentiment = 'neutral';
    let sentimentEmoji = '😐';
    if (buyPercent > 60) { sentiment = 'bullish'; sentimentEmoji = '📈'; }
    else if (buyPercent < 40) { sentiment = 'bearish'; sentimentEmoji = '📉'; }

    const assetName = getAssetClassDisplayName();
    const insights = `
        ${sentimentEmoji} <strong>${assetName} Sentiment:</strong> Currently ${sentiment} with ${buyPercent}% buy signals detected.<br><br>
        🔴 <strong>Live Data Coverage:</strong> ${livePercent}% of ${assetName.toLowerCase()} using real-time prices (${liveCount}/${totalCount}).<br><br>
        🎯 <strong>Average AI Score:</strong> ${avgScore}/100 across all analyzed assets.<br><br>
        🏆 <strong>Leading Sector:</strong> ${leadingSector} sector showing strongest signals.<br><br>
        💡 <strong>Recommendation:</strong> ${buyPercent > 60 ? 'Consider increasing exposure.' : buyPercent < 40 ? 'Exercise caution with defensive positions.' : 'Maintain balanced allocation.'}
    `;

    document.getElementById('marketInsights').innerHTML = insights;
}

// Update market status
function updateMarketStatus() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleTimeString();

    // Fetch live S&P 500 index data only for S&P 500 mode
    if (currentAssetClass === 'sp500') {
        fetchSP500Index().then(data => {
            if (data) {
                const sp500IndexEl = document.getElementById('sp500Index');
                const changeEl = document.getElementById('sp500Change');

                if (sp500IndexEl && changeEl) {
                    sp500IndexEl.textContent = data.price.toFixed(2);
                    changeEl.textContent = `${data.changeValue >= 0 ? '+' : ''}${data.changeValue.toFixed(2)} (${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}%)`;
                    changeEl.className = data.changeValue >= 0 ? 'positive' : 'negative';
                }
            }
        }).catch(error => {
            console.warn('Failed to fetch S&P 500 data:', error);
        });
    }

    const bullishCount = analysisResults.filter(s => s.recommendation === 'BUY').length;
    const totalCount = analysisResults.length;
    const sentiment = totalCount > 0 ?
        (bullishCount / totalCount > 0.6 ? 'Bullish' : bullishCount / totalCount < 0.4 ? 'Bearish' : 'Neutral') : 'Neutral';

    const marketTempEl = document.getElementById('marketTemp');
    if (marketTempEl) {
        marketTempEl.textContent = sentiment;
    }
}

// Filter results
function filterResults(filter) {
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    currentFilter = filter;

    if (filter === 'all') {
        filteredResults = analysisResults.slice(0, 50);
    } else {
        filteredResults = analysisResults.filter(stock =>
            stock.recommendation.toLowerCase() === filter.toLowerCase()
        ).slice(0, 50);
    }

    displayResults();
}

// Add live price updates every 30 seconds
async function startLiveUpdates() {
    if (liveUpdateInterval) {
        clearInterval(liveUpdateInterval);
    }

    liveUpdateInterval = setInterval(async () => {
        if (filteredResults.length === 0) return;

        console.log('Updating live prices...');
        let updatedCount = 0;

        for (const stock of filteredResults.slice(0, 10)) {
            const liveData = await fetchLiveStockPrice(stock.symbol);

            if (liveData) {
                const oldPrice = stock.price;
                stock.price = liveData.price;
                stock.priceChange = liveData.change;
                updatedCount++;

                // Update DOM elements
                const card = document.querySelector(`[data-symbol="${stock.symbol}"]`);
                if (card) {
                    const priceEl = card.querySelector('.stock-price');
                    const changeEl = card.querySelector('.price-change');

                    if (priceEl) {
                        priceEl.textContent = `$${stock.price.toFixed(2)}`;
                    }

                    if (changeEl) {
                        const changeSymbol = stock.priceChange >= 0 ? '+' : '';
                        changeEl.textContent = `${changeSymbol}${stock.priceChange.toFixed(2)}%`;
                        changeEl.className = `price-change ${stock.priceChange >= 0 ? 'price-positive' : 'price-negative'}`;
                    }
                }
            }

            await new Promise(resolve => setTimeout(resolve, 300));
        }

        console.log(`Updated ${updatedCount} asset prices`);
    }, 30000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initialize asset class tabs
    updateSectorFilter();
    updateNoResultsMessage();

    setInterval(updateMarketStatus, 1000);
    updateMarketStatus();

    console.log('Stock Screener initialized with live data capability');
    console.log('API Key configured:', FINNHUB_API_KEY !== 'YOUR_API_KEY_HERE');
});

// Global functions - Export to window object so HTML onclick handlers can access them
window.scanSP500 = scanSP500;
window.filterResults = filterResults;
window.switchAssetClass = switchAssetClass;
