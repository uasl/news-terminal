// DİKKAT: Baştaki 'export const' ifadesi hatayı çözecek.
export const sources = [
  // ==================================================
  // 1. POLITICS (SİYASET)
  // ==================================================
  { id: 'p-bb-1', name: 'BullionBite Pol', category: 'politics', region: 'us', url: 'https://bullionbite.com/politics/feed/' },
  { id: 'p-us-1', name: 'CBS Politics', category: 'politics', region: 'us', url: 'https://www.cbsnews.com/latest/rss/politics' },
  { id: 'p-us-2', name: 'HuffPost Pol', category: 'politics', region: 'us', url: 'https://www.huffpost.com/section/politics/feed' },
  { id: 'p-us-3', name: 'Fox Politics', category: 'politics', region: 'us', url: 'https://moxie.foxnews.com/google-publisher/politics.xml' },
  { id: 'p-us-4', name: 'NY Post Pol', category: 'politics', region: 'us', url: 'https://nypost.com/politics/feed/' },
  { id: 'p-us-5', name: 'NPR Politics', category: 'politics', region: 'us', url: 'https://feeds.npr.org/1014/rss.xml' },
  { id: 'p-us-6', name: 'Washington Exam', category: 'politics', region: 'us', url: 'https://www.washingtonexaminer.com/feed' },
  { id: 'p-us-7', name: 'Breitbart', category: 'politics', region: 'us', url: 'http://feeds.feedburner.com/breitbart' },
  { id: 'p-us-8', name: 'RealClearPol', category: 'politics', region: 'us', url: 'https://www.realclearpolitics.com/index.xml' },
  { id: 'p-us-9', name: 'Daily Beast', category: 'politics', region: 'us', url: 'https://feeds.thedailybeast.com/rss/articles' },
  { id: 'p-us-10', name: 'New Yorker', category: 'politics', region: 'us', url: 'https://www.newyorker.com/feed/news' },
  { id: 'p-us-11', name: 'Slate', category: 'politics', region: 'us', url: 'https://slate.com/feeds/news-and-politics.rss' },

  // --- UK POLITICS ---
  { id: 'p-uk-1', name: 'BBC Politics', category: 'politics', region: 'uk', url: 'https://feeds.bbci.co.uk/news/politics/rss.xml' },
  { id: 'p-uk-2', name: 'Sky News', category: 'politics', region: 'uk', url: 'https://feeds.skynews.com/feeds/rss/politics.xml' },
  { id: 'p-uk-3', name: 'The Guardian', category: 'politics', region: 'uk', url: 'https://www.theguardian.com/politics/rss' },
  { id: 'p-uk-4', name: 'Independent', category: 'politics', region: 'uk', url: 'https://www.independent.co.uk/news/uk/politics/rss' },
  { id: 'p-uk-5', name: 'Mirror Politics', category: 'politics', region: 'uk', url: 'https://www.mirror.co.uk/news/politics/?service=rss' },
  { id: 'p-uk-6', name: 'Express UK', category: 'politics', region: 'uk', url: 'https://www.express.co.uk/posts/rss/1/politics' },
  { id: 'p-uk-7', name: 'Standard UK', category: 'politics', region: 'uk', url: 'https://www.standard.co.uk/news/politics/rss' },

  // --- EU & GLOBAL POLITICS ---
  { id: 'p-eu-1', name: 'Euronews', category: 'politics', region: 'eu', url: 'https://www.euronews.com/rss?level=theme&name=news' },
  { id: 'p-eu-2', name: 'Deutsche Welle', category: 'politics', region: 'eu', url: 'https://rss.dw.com/xml/rss-en-eu' },
  { id: 'p-eu-3', name: 'France 24', category: 'politics', region: 'eu', url: 'https://www.france24.com/en/europe/rss' },
  { id: 'p-asia-1', name: 'CNA', category: 'politics', region: 'asia', url: 'https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=xml&category=asia' },
  { id: 'p-asia-2', name: 'Japan Times', category: 'politics', region: 'asia', url: 'https://www.japantimes.co.jp/feed/topstories.xml' },
  { id: 'p-row-1', name: 'Al Jazeera', category: 'politics', region: 'row', url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { id: 'p-row-2', name: 'RT News', category: 'politics', region: 'row', url: 'https://www.rt.com/rss/news/' },

  // ==================================================
  // 2. MARKETS (PİYASALAR)
  // ==================================================
  // BULLIONBITE MAIN
  { id: 'm-bb-main', name: 'BullionBite ALL', category: 'markets', region: 'us', url: 'https://bullionbite.com/feed/' }, 
  { id: 'm-bb-1', name: 'BullionBite Mkts', category: 'markets', region: 'us', url: 'https://bullionbite.com/markets/feed/' },
  
  { id: 'm-us-1', name: 'CNBC Market', category: 'markets', region: 'us', url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664' },
  { id: 'm-us-2', name: 'Yahoo Finance', category: 'markets', region: 'us', url: 'https://finance.yahoo.com/news/rssindex' },
  { id: 'm-us-4', name: 'Nasdaq', category: 'markets', region: 'us', url: 'https://www.nasdaq.com/feed/rssoutbound?category=Markets' },
  { id: 'm-us-5', name: 'MarketWatch', category: 'markets', region: 'us', url: 'https://feeds.contenthub.marketwatch.com/marketwatch-quotes/n/q/n/p/logo/rss?type=story' },
  { id: 'm-us-6', name: 'Forbes Money', category: 'markets', region: 'us', url: 'https://www.forbes.com/money/feed/' },
  { id: 'm-us-7', name: 'Barrons', category: 'markets', region: 'us', url: 'https://feeds.contenthub.marketwatch.com/marketwatch-quotes/n/q/n/p/logo/rss?type=story' }, 

  // --- CRYPTO & ASIA ---
  { id: 'm-asia-1', name: 'CNBC Asia', category: 'markets', region: 'asia', url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000663' },
  { id: 'm-asia-2', name: 'Nikkei Asia', category: 'markets', region: 'asia', url: 'https://asia.nikkei.com/rss/feed/nar' },
  { id: 'm-cr-1', name: 'CoinDesk', category: 'markets', region: 'row', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { id: 'm-cr-2', name: 'CoinTelegraph', category: 'markets', region: 'row', url: 'https://cointelegraph.com/rss' },
  { id: 'm-cr-3', name: 'Bitcoin Mag', category: 'markets', region: 'row', url: 'https://bitcoinmagazine.com/.rss/full/' },
  { id: 'm-cr-4', name: 'Decrypt', category: 'markets', region: 'row', url: 'https://decrypt.co/feed' },
  { id: 'm-gold-1', name: 'Kitco', category: 'markets', region: 'row', url: 'https://www.kitco.com/rss/category/commodities' },

  // ==================================================
  // 3. ECONOMICS (EKONOMİ)
  // ==================================================
  { id: 'e-bb-1', name: 'BullionBite Econ', category: 'economics', region: 'us', url: 'https://bullionbite.com/economics/feed/' },
  { id: 'e-us-1', name: 'CNBC Economy', category: 'economics', region: 'us', url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=20910258' },
  { id: 'e-us-2', name: 'Business Insider', category: 'economics', region: 'us', url: 'https://feeds.businessinsider.com/custom/2024-09/rss-business' },
  { id: 'e-us-3', name: 'The Atlantic', category: 'economics', region: 'us', url: 'https://www.theatlantic.com/feed/channel/business/' },
  { id: 'e-us-4', name: 'Entrepreneur', category: 'economics', region: 'us', url: 'https://www.entrepreneur.com/latest.rss' },
  { id: 'e-us-