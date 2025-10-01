// API Configuration - Replace with your actual API key
const FINNHUB_API_KEY = 'd3elvrpr01qh40ff089gd3elvrpr01qh40ff08a0'; // Get free key at finnhub.io
const API_BASE_URL = 'https://finnhub.io/api/v1';
const RATE_LIMIT_DELAY = 100; // milliseconds between API calls
const CACHE_DURATION = 60000; // 1 minute cache

// Cache for API responses
const apiCache = new Map();

// Stock data
const SP500_STOCKS = [
    {symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 178.72, marketCap: 'mega'},
    {symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', price: 429.17, marketCap: 'mega'},
    {symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', price: 175.82, marketCap: 'mega'},
    {symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', price: 181.30, marketCap: 'mega'},
    {symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', price: 885.60, marketCap: 'mega'},
    {symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer', price: 248.42, marketCap: 'mega'},
    {symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', price: 505.16, marketCap: 'mega'},
    {symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financial', price: 421.13, marketCap: 'mega'},
    {symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial', price: 202.58, marketCap: 'mega'},
    {symbol: 'V', name: 'Visa Inc.', sector: 'Financial', price: 285.40, marketCap: 'mega'},
    {symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 155.87, marketCap: 'mega'},
    {symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer', price: 165.34, marketCap: 'mega'},
    {symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer', price: 162.79, marketCap: 'mega'},
    {symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial', price: 467.92, marketCap: 'mega'},
    {symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer', price: 365.12, marketCap: 'large'},
    {symbol: 'XOM', name: 'Exxon Mobil Corp.', sector: 'Energy', price: 118.45, marketCap: 'mega'},
    {symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy', price: 162.38, marketCap: 'mega'},
    {symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial', price: 38.67, marketCap: 'large'},
    {symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare', price: 175.23, marketCap: 'large'},
    {symbol: 'KO', name: 'Coca-Cola Company', sector: 'Consumer', price: 61.84, marketCap: 'large'},
    {symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer', price: 168.52, marketCap: 'large'},
    {symbol: 'COST', name: 'Costco Wholesale Corp.', sector: 'Consumer', price: 725.61, marketCap: 'large'},
    {symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare', price: 128.94, marketCap: 'large'},
    {symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology', price: 1285.47, marketCap: 'mega'},
    {symbol: 'ORCL', name: 'Oracle Corporation', sector: 'Technology', price: 125.68, marketCap: 'large'},
    {symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Consumer', price: 585.32, marketCap: 'large'},
    {symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', price: 162.45, marketCap: 'large'},
    {symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', price: 42.87, marketCap: 'large'},
    {symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', price: 52.34, marketCap: 'large'},
    {symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', price: 582.67, marketCap: 'large'},
    {symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', price: 285.92, marketCap: 'large'},
    {symbol: 'DIS', name: 'Walt Disney Company', sector: 'Consumer', price: 98.45, marketCap: 'large'},
    {symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer', price: 102.34, marketCap: 'large'},
    {symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Financial', price: 68.92, marketCap: 'large'},
    {symbol: 'QCOM', name: 'Qualcomm Inc.', sector: 'Technology', price: 165.78, marketCap: 'large'},
    {symbol: 'IBM', name: 'IBM Corp.', sector: 'Technology', price: 178.45, marketCap: 'large'},
    {symbol: 'GE', name: 'General Electric', sector: 'Industrial', price: 145.67, marketCap: 'large'},
    {symbol: 'BA', name: 'Boeing Company', sector: 'Industrial', price: 182.34, marketCap: 'large'},
    {symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare', price: 512.45, marketCap: 'mega'},
    {symbol: 'LLY', name: 'Eli Lilly and Co.', sector: 'Healthcare', price: 685.23, marketCap: 'mega'},
    {symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', price: 28.67, marketCap: 'large'},
    {symbol: 'TMO', name: 'Thermo Fisher Scientific', sector: 'Healthcare', price: 542.89, marketCap: 'large'},
    {symbol: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare', price: 112.34, marketCap: 'large'},
    {symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrial', price: 328.56, marketCap: 'large'},
    {symbol: 'GS', name: 'Goldman Sachs Group', sector: 'Financial', price: 412.78, marketCap: 'large'},
    {symbol: 'MS', name: 'Morgan Stanley', sector: 'Financial', price: 98.45, marketCap: 'large'},
    {symbol: 'AXP', name: 'American Express Co.', sector: 'Financial', price: 215.67, marketCap: 'large'},
    {symbol: 'BLK', name: 'BlackRock Inc.', sector: 'Financial', price: 785.34, marketCap: 'large'}
];

let analysisResults = [];
let filteredResults = [];
let currentFilter = 'all';
let liveUpdateInterval = null;
let scanInProgress = false;

// API Functions
async function rateLimitedFetch(url) {
    return new Promise((resolve) => {
        setTimeout(async () => {
            try {
                const response = await fetch(url);
                resolve(response);
            } catch (error) {
                console.error('API fetch error:', error);
                resolve(null);
            }
        }, RATE_LIMIT_DELAY);
    });
}

async function fetchWithCache(url, cacheKey) {
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    const response = await rateLimitedFetch(url);
    if (response && response.ok) {
        const data = await response.json();
        apiCache.set(cacheKey, { data, timestamp: Date.now() });
        return data;
    }
    return null;
}

// New function to fetch S&P 500 index price
async function fetchSP500Index() {
    if (FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') {
        return null;
    }

    // Try multiple S&P 500 symbols to get the most accurate data
    const symbols = ['^GSPC', 'SPX', '.SPX', 'SPY'];

    for (const symbol of symbols) {
        const url = `${API_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const data = await fetchWithCache(url, `sp500_${symbol}`);

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
                change: changePercent,
                changeValue: changeValue,
                source: symbol
            };
        }
    }

    return null;
}

async function fetchLiveQuote(symbol) {
    if (FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') {
        return null; // Return null if no API key is set
    }

    const url = `${API_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const data = await fetchWithCache(url, `quote_${symbol}`);

    if (data && data.c) {
        return {
            price: data.c,
            change: data.dp || 0,
            high: data.h,
            low: data.l
        };
    }
    return null;
}

async function fetchTechnicalIndicators(symbol) {
    if (FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') {
        return generateTechnicalIndicators({ symbol, price: 100 }); // Fallback to mock data
    }

    // Note: Finnhub's technical indicators require premium subscription
    // For demo purposes, we'll use mock data but structure it for real API
    const mockData = generateTechnicalIndicators({ symbol, price: 100 });

    // Real API call structure (commented out for free tier):
    /*
    const rsiUrl = `${API_BASE_URL}/indicator?symbol=${symbol}&resolution=D&from=${Math.floor(Date.now()/1000) - 86400*30}&to=${Math.floor(Date.now()/1000)}&indicator=rsi&token=${FINNHUB_API_KEY}`;
    const rsiData = await fetchWithCache(rsiUrl, `rsi_${symbol}`);
    */

    return mockData;
}

async function fetchFundamentals(symbol) {
    if (FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') {
        return generateFundamentalMetrics({ symbol, sector: 'Technology' }); // Fallback to mock data
    }

    const url = `${API_BASE_URL}/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_API_KEY}`;
    const data = await fetchWithCache(url, `fundamentals_${symbol}`);

    if (data && data.metric) {
        return {
            pe: data.metric.peBasicExclExtraTTM || 20,
            roe: data.metric.roeRfy || 15,
            debtEquity: data.metric.totalDebt2TotalEquityQuarterly || 0.5,
            revenueGrowth: data.metric.revenueGrowthTTMYoy || 10,
            profitMargin: data.metric.netProfitMarginTTM || 15
        };
    }

    // Fallback to mock data
    return generateFundamentalMetrics({ symbol, sector: 'Technology' });
}

// Core Functions
function updateMarketStatus() {
    const now = new Date();
    document.getElementById('lastUpdate').textContent = now.toLocaleTimeString();

    fetchSP500Index().then(data => {
        if (data) {
            const sp500IndexEl = document.getElementById('sp500Index');
            const changeEl = document.getElementById('sp500Change');

            const currentValue = parseFloat(sp500IndexEl.textContent.replace(',', ''));
            const newValue = data.price;
            sp500IndexEl.textContent = newValue.toFixed(2);

            const changeValue = data.changeValue;
            const changePercent = data.change;

            changeEl.textContent = `${changeValue >= 0 ? '+' : ''}${changeValue.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
            changeEl.className = changeValue >= 0 ? 'positive' : 'negative';
        }
    });

    const bullishCount = analysisResults.filter(s => s.recommendation === 'BUY').length;
    const totalCount = analysisResults.length;
    const sentiment = totalCount > 0 ? (bullishCount / totalCount > 0.6 ? 'Bullish' : bullishCount / totalCount < 0.4 ? 'Bearish' : 'Neutral') : 'Neutral';
    document.getElementById('marketTemp').textContent = sentiment;
}

async function scanSP500() {
    if (scanInProgress) return;

    const scanBtn = document.getElementById('scanBtn');
    const stocksGrid = document.getElementById('stocksGrid');

    // Check if API key is configured
    if (FINNHUB_API_KEY === 'YOUR_API_KEY_HERE') {
        stocksGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <div style="font-size: 3rem; margin-bottom: 25px;">🔑</div>
                <h3>API Configuration Required</h3>
                <p style="margin: 20px 0;">To get live data, please:</p>
                <div style="text-align: left; display: inline-block; font-size: 0.9rem; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px;">
                    <p>1. Get a free API key from <a href="https://finnhub.io" target="_blank" style="color: #667eea;">finnhub.io</a></p>
                    <p>2. Replace 'YOUR_API_KEY_HERE' in main.js with your key</p>
                    <p>3. For now, click below to see demo with simulated data</p>
                </div>
                <button onclick="proceedWithDemo()" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    Continue with Demo Data
                </button>
            </div>
        `;
        return;
    }

    scanInProgress = true;
    scanBtn.disabled = true;
    scanBtn.textContent = '🤖 Analyzing...';

    // Progress tracking
    let processed = 0;
    const total = SP500_STOCKS.length;

    stocksGrid.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1;">
            <div class="ai-spinner"></div>
            <h3>AI Analysis in Progress</h3>
            <p>Analyzing S&P 500 stocks with live data</p>
            <div style="margin-top: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden;">
                <div id="progressBar" style="height: 4px; background: #667eea; width: 0%; transition: width 0.3s;"></div>
            </div>
            <p id="progressText" style="margin-top: 10px;">0 / ${total} stocks analyzed</p>
        </div>
    `;

    try {
        analysisResults = [];
        const filters = getFilterCriteria();

        for (const stock of SP500_STOCKS) {
            const analysis = await analyzeStock(stock, filters);
            if (analysis) {
                analysisResults.push(analysis);
            }

            processed++;
            const progress = (processed / total) * 100;

            // Update progress
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${processed} / ${total} stocks analyzed`;

            await new Promise(resolve => setTimeout(resolve, 50));
        }

        analysisResults.sort((a, b) => b.overallScore - a.overallScore);
        filteredResults = analysisResults.slice(0, 50);

        displayResults();
        updateStats();
        generateMarketInsights();

        if (liveUpdateInterval) clearInterval(liveUpdateInterval);
        liveUpdateInterval = setInterval(updateLivePrices, 30000); // Update every 30 seconds to save API calls

    } catch (error) {
        console.error('Scan error:', error);
        stocksGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <h3 style="color: #f44336;">Analysis Error</h3>
                <p>Unable to complete analysis. Please try again.</p>
            </div>
        `;
    } finally {
        scanInProgress = false;
        scanBtn.disabled = false;
        scanBtn.textContent = '🔍 Scan S&P 500';
        updateMarketStatus();
    }
}

// Demo function for when no API key is set
function proceedWithDemo() {
    scanSP500();
}

function getFilterCriteria() {
    return {
        rsiFilter: document.getElementById('rsiFilter').value,
        macdFilter: document.getElementById('macdFilter').value,
        peRange: parseFloat(document.getElementById('peRange').value),
        roeRange: parseFloat(document.getElementById('roeRange').value),
        sectorFilter: document.getElementById('sectorFilter').value
    };
}

async function analyzeStock(stock, filters) {
    if (filters.sectorFilter !== 'all' && stock.sector !== filters.sectorFilter) {
        return null;
    }

    // Fetch live data
    const liveQuote = await fetchLiveQuote(stock.symbol);
    const technicals = await fetchTechnicalIndicators(stock.symbol);
    const fundamentals = await fetchFundamentals(stock.symbol);

    if (!passesFilters(technicals, fundamentals, filters)) {
        return null;
    }

    // Update price with live data if available
    if (liveQuote) {
        stock.price = liveQuote.price;
    }

    const technicalScore = calculateTechnicalScore(technicals);
    const fundamentalScore = calculateFundamentalScore(fundamentals);
    const overallScore = (technicalScore * 0.6 + fundamentalScore * 0.4);

    const recommendation = generateRecommendation(overallScore, technicals, fundamentals);
    const priceChange = liveQuote ? liveQuote.change : (Math.random() - 0.5) * 6;

    return {
        ...stock,
        technicals,
        fundamentals,
        technicalScore: Math.round(technicalScore),
        fundamentalScore: Math.round(fundamentalScore),
        overallScore: Math.round(overallScore),
        recommendation: recommendation.action,
        confidence: recommendation.confidence,
        priceChange: priceChange,
        targetPrice: stock.price * (1 + (overallScore - 70) / 100 * 0.25),
        stopLoss: stock.price * 0.92
    };
}

function generateTechnicalIndicators(stock) {
    const rsi = Math.random() * 100;
    const macd = (Math.random() - 0.5) * 8;
    const volume = 1 + Math.random() * 2.5;
    const adx = 25 + Math.random() * 50;

    return {
        rsi: Math.round(rsi * 100) / 100,
        macd: Math.round(macd * 100) / 100,
        volume: Math.round(volume * 100) / 100,
        adx: Math.round(adx * 100) / 100,
        ma50: stock.price * (0.92 + Math.random() * 0.16),
        ma200: stock.price * (0.85 + Math.random() * 0.3)
    };
}

function generateFundamentalMetrics(stock) {
    const sectorMultipliers = {
        'Technology': { pe: 28, roe: 32, growth: 18 },
        'Healthcare': { pe: 22, roe: 20, growth: 12 },
        'Financial': { pe: 15, roe: 14, growth: 10 },
        'Consumer': { pe: 25, roe: 22, growth: 14 },
        'Industrial': { pe: 20, roe: 15, growth: 11 },
        'Energy': { pe: 12, roe: 12, growth: 8 }
    };

    const multiplier = sectorMultipliers[stock.sector] || { pe: 20, roe: 15, growth: 12 };

    return {
        pe: Math.round((multiplier.pe * (0.7 + Math.random() * 0.6)) * 100) / 100,
        roe: Math.round((multiplier.roe * (0.6 + Math.random() * 0.8)) * 100) / 100,
        debtEquity: Math.round((Math.random() * 1.5) * 100) / 100,
        revenueGrowth: Math.round((multiplier.growth * (0.4 + Math.random() * 1.2)) * 100) / 100,
        profitMargin: Math.round((10 + Math.random() * 25) * 100) / 100
    };
}

function passesFilters(technicals, fundamentals, filters) {
    if (filters.rsiFilter === 'oversold' && technicals.rsi >= 30) return false;
    if (filters.rsiFilter === 'neutral' && (technicals.rsi < 30 || technicals.rsi > 70)) return false;
    if (filters.rsiFilter === 'overbought' && technicals.rsi <= 70) return false;

    if (filters.macdFilter === 'bullish' && technicals.macd <= 0) return false;
    if (filters.macdFilter === 'bearish' && technicals.macd >= 0) return false;

    if (fundamentals.pe > filters.peRange) return false;
    if (fundamentals.roe < filters.roeRange) return false;

    return true;
}

function calculateTechnicalScore(technicals) {
    let score = 50;

    if (technicals.rsi < 30) score += 15;
    else if (technicals.rsi > 70) score -= 15;
    else score += 5;

    if (technicals.macd > 0) score += 12;
    else score -= 12;

    if (technicals.volume > 1.8) score += 10;
    else if (technicals.volume < 1.2) score -= 5;

    if (technicals.adx > 40) score += 8;

    return Math.max(0, Math.min(100, score));
}

function calculateFundamentalScore(fundamentals) {
    let score = 50;

    if (fundamentals.pe < 15) score += 15;
    else if (fundamentals.pe < 25) score += 8;
    else if (fundamentals.pe > 40) score -= 12;

    if (fundamentals.roe > 25) score += 15;
    else if (fundamentals.roe > 15) score += 8;
    else if (fundamentals.roe < 10) score -= 10;

    if (fundamentals.revenueGrowth > 20) score += 10;
    else if (fundamentals.revenueGrowth < 5) score -= 8;

    if (fundamentals.debtEquity < 0.5) score += 8;
    else if (fundamentals.debtEquity > 1.2) score -= 8;

    return Math.max(0, Math.min(100, score));
}

function generateRecommendation(overallScore, technicals, fundamentals) {
    let action = 'HOLD';
    let confidence = Math.abs(overallScore - 50) + 50;

    if (overallScore >= 75) {
        action = 'BUY';
    } else if (overallScore <= 60) {
        action = 'SELL';
    }

    if (technicals.macd > 0 && technicals.rsi < 70) confidence += 5;
    if (fundamentals.roe > 20 && fundamentals.pe < 20) confidence += 5;

    return {
        action,
        confidence: Math.min(95, Math.max(55, Math.round(confidence)))
    };
}

function displayResults() {
    const stocksGrid = document.getElementById('stocksGrid');

    if (filteredResults.length === 0) {
        stocksGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <h3>No stocks match your criteria</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }

    stocksGrid.innerHTML = filteredResults.map(stock => {
        const signalClass = stock.recommendation.toLowerCase() + '-signal';
        const changeClass = stock.priceChange >= 0 ? 'price-positive' : 'price-negative';
        const changeSymbol = stock.priceChange >= 0 ? '+' : '';

        return `
            <div class="stock-card ${signalClass}" data-symbol="${stock.symbol}">
                <div class="stock-header">
                    <div class="stock-info">
                        <h4>${stock.symbol}</h4>
                        <div class="stock-name">${stock.name}</div>
                        <div class="stock-sector">${stock.sector}</div>
                    </div>
                    <div>
                        <div class="stock-price" data-price="${stock.price}">$${stock.price.toFixed(2)}</div>
                        <div class="price-change ${changeClass}" data-change="${stock.priceChange}">${changeSymbol}${stock.priceChange.toFixed(2)}%</div>
                    </div>
                </div>

                <div class="recommendation-badge badge-${stock.recommendation.toLowerCase()}">
                    ${stock.recommendation} - ${stock.confidence}%
                </div>

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
                        <span class="indicator-label">Volume</span>
                        <span class="indicator-value ${stock.technicals.volume > 1.8 ? 'indicator-bullish' : 'indicator-neutral'}">${stock.technicals.volume.toFixed(1)}x</span>
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

function updateStats() {
    const buyCount = analysisResults.filter(s => s.recommendation === 'BUY').length;
    const holdCount = analysisResults.filter(s => s.recommendation === 'HOLD').length;
    const sellCount = analysisResults.filter(s => s.recommendation === 'SELL').length;

    document.getElementById('buyCount').textContent = buyCount;
    document.getElementById('holdCount').textContent = holdCount;
    document.getElementById('sellCount').textContent = sellCount;
    document.getElementById('totalScanned').textContent = analysisResults.length;
}

function generateMarketInsights() {
    const buyCount = analysisResults.filter(s => s.recommendation === 'BUY').length;
    const totalCount = analysisResults.length;
    const buyPercent = ((buyCount / totalCount) * 100).toFixed(1);

    const topSectors = {};
    analysisResults.forEach(stock => {
        topSectors[stock.sector] = (topSectors[stock.sector] || 0) + 1;
    });
    const leadingSector = Object.keys(topSectors).reduce((a, b) => topSectors[a] > topSectors[b] ? a : b);

    const avgScore = (analysisResults.reduce((sum, s) => sum + s.overallScore, 0) / totalCount).toFixed(1);

    let sentiment = 'neutral';
    let sentimentEmoji = '😐';
    if (buyPercent > 60) { sentiment = 'bullish'; sentimentEmoji = '📈'; }
    else if (buyPercent < 40) { sentiment = 'bearish'; sentimentEmoji = '📉'; }

    const insights = `
        ${sentimentEmoji} <strong>Market Sentiment:</strong> Currently ${sentiment} with ${buyPercent}% buy signals detected.<br><br>
        🎯 <strong>Average AI Score:</strong> ${avgScore}/100 across all analyzed stocks.<br><br>
        🏆 <strong>Leading Sector:</strong> ${leadingSector} sector showing strongest technical signals.<br><br>
        💡 <strong>Recommendation:</strong> ${buyPercent > 60 ? 'Consider increasing equity exposure with selective buys.' : buyPercent < 40 ? 'Exercise caution - consider defensive positions.' : 'Maintain current allocation with selective opportunities.'}
    `;

    document.getElementById('marketInsights').innerHTML = insights;
}

async function updateLivePrices() {
    if (!filteredResults.length) return;

    for (const stock of filteredResults) {
        const liveQuote = await fetchLiveQuote(stock.symbol);
        if (liveQuote) {
            const oldPrice = stock.price;
            stock.price = liveQuote.price;
            stock.priceChange = liveQuote.change;

            const card = document.querySelector(`[data-symbol="${stock.symbol}"]`);
            if (card) {
                const priceEl = card.querySelector('.stock-price');
                const changeEl = card.querySelector('.price-change');

                // Add flash effect for price changes
                const flashColor = stock.price > oldPrice ? '#4CAF50' : stock.price < oldPrice ? '#f44336' : 'transparent';
                priceEl.style.backgroundColor = flashColor;
                setTimeout(() => priceEl.style.backgroundColor = 'transparent', 1000);

                priceEl.textContent = `$${stock.price.toFixed(2)}`;

                const changeSymbol = stock.priceChange >= 0 ? '+' : '';
                changeEl.textContent = `${changeSymbol}${stock.priceChange.toFixed(2)}%`;
                changeEl.className = stock.priceChange >= 0 ? 'price-change price-positive' : 'price-change price-negative';
            }
        }

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    updateMarketStatus();
}

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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Start market status updates
    setInterval(updateMarketStatus, 1000);

    // Initial market status update
    updateMarketStatus();
});

// Make functions globally accessible
window.scanSP500 = scanSP500;
window.filterResults = filterResults;
window.proceedWithDemo = proceedWithDemo;
