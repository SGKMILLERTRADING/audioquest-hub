
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import BookDetails from './pages/BookDetails';
import WriterStudio from './pages/WriterStudio';
import CoinStore from './pages/CoinStore';
import Wallet from './pages/Wallet';
import AudioPlayer from './components/AudioPlayer';
import NotificationToast from './components/NotificationToast';
import LoginPage from './components/LoginPage';
import InstructionalHub from './components/InstructionalHub';
import { Page, User, Book, Scene, AppNotification, FooterLink, SaleConfig, SocialLinks, CoinPackage, PayoutInfo } from './types';
import { MOCK_BOOKS, MOCK_CHAPTERS, CATEGORIES as INITIAL_CATEGORIES, COIN_PACKAGES as INITIAL_COIN_PACKAGES } from './constants';

const COIN_CONVERSION_VALUE = 0.005; 
const WRITER_SHARE_PERCENT = 0.53; 
const ADMIN_SHARE_PERCENT = 0.47;  

const SAVED_STRIPE_KEY = "pk_test_51SitdTEPFH0TjJDc6AgJ6k2B7j9FFuqkcrTBIJU6Quw0SkerbgJbxalqivKdzpXlmJaQRFIS44dQCkO5u1hAtacp00uHjLhIKs"; 

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<Page>(Page.HOME);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('aq-theme') as 'light' | 'dark') || 'dark');

  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>(INITIAL_COIN_PACKAGES);
  
  const [instructionalVideo, setInstructionalVideo] = useState<string>(() => {
    return localStorage.getItem('aq_instructional_video') || 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
  });
  
  const [showInstructionalHub, setShowInstructionalHub] = useState<boolean>(true);
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [scenesMap, setScenesMap] = useState<Record<string, Scene[]>>(MOCK_CHAPTERS as any);
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  
  const [platformRevenue, setPlatformRevenue] = useState(() => {
    const saved = localStorage.getItem('aq_platform_revenue');
    return saved ? parseFloat(saved) : 0;
  }); 

  const [announcement, setAnnouncement] = useState("HUGE HOLIDAY SAVINGS: UNLOCK MORE CHAPTERS FOR LESS! 🎄");

  const [saleConfig, setSaleConfig] = useState<SaleConfig>({
    isActive: false,
    discountPercentage: 20,
    campaignName: "Holiday Sale"
  });

  const [promoBanner, setPromoBanner] = useState({
    title: "CREATOR BONUS PROGRAM",
    subtitle: "Reach 100 fans and unlock $200 instant hub credit.",
    cta: "Join Pro Program",
    bgImage: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1400"
  });

  const [heroContent, setHeroContent] = useState({
    titlePrefix: "HEAR THE",
    titleHighlight: "UNIMAGINABLE.",
    description: "The Hub for every story imaginable. From Dark Fantasy to Contemporary Romance, your next obsession is one chapter away.",
    backgroundImage: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=1200&h=600",
    primaryButton: "Explore Hub",
    secondaryButton: "Creator Studio"
  });

  const [footerContent, setFooterContent] = useState({
    description: "Follow us for more stories! Your support fuels our mission to create the best audio series.",
    socials: { 
      instagram: "#", youtube: "#", facebook: "#", email: "mailto:support@audioquest.hub"
    } as SocialLinks,
    links: [
      [
        { label: 'ABOUT US', href: '#', content: 'AudioQuest Hub is the premier global marketplace for narrative audio. We empower creators to connect directly with their fanbase through a unique coin-based unlock system.' }, 
        { label: 'PRIVACY POLICY', href: '#', content: 'Your privacy is our priority. We use industry-standard encryption to protect your data and transactions. We do not sell your personal information to third parties.' },
        { label: 'TERMS OF SERVICE', href: '#', content: 'By using AQ Hub, you agree to our community guidelines. Creators retain rights to their work, and listeners agree to use coins only for content access.' }
      ],
      [
        { label: 'REFUND POLICY', href: '#', content: 'Coins purchased are typically non-refundable once used to unlock content. However, if you experience technical issues, contact support within 24 hours for a resolution.' },
        { label: 'CONTACT US', href: '#', content: 'Need assistance? Reach out to our global support team at support@audioquest.hub. We aim to respond to all inquiries within 12 hours.' },
        { label: 'CREATOR SAFETY', href: '#', content: 'We maintain a strict zero-tolerance policy for harassment. Creators can manage comments and report users directly through the Studio dashboard.' }
      ]
    ] as FooterLink[][],
    cdImages: ['https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=200&h=200']
  });

  useEffect(() => {
    localStorage.setItem('aq_platform_revenue', platformRevenue.toString());
  }, [platformRevenue]);

  useEffect(() => {
    localStorage.setItem('aq_instructional_video', instructionalVideo);
  }, [instructionalVideo]);

  useEffect(() => {
    if (user?.role === 'admin' && user.platformRevenue !== platformRevenue) {
      setUser(prev => prev ? ({ ...prev, platformRevenue }) : null);
    }
  }, [platformRevenue, user?.role]);

  const latestScenes = useMemo(() => {
    const allRecent: { scene: Scene, book: Book }[] = [];
    if (!scenesMap || !books) return allRecent;
    
    Object.keys(scenesMap).forEach(bookId => {
      const book = books.find(b => b.id === bookId);
      const scenes = scenesMap[bookId];
      if (book && Array.isArray(scenes)) {
        scenes.forEach(scene => {
          if (scene) allRecent.push({ scene, book });
        });
      }
    });
    return allRecent.sort((a, b) => {
      const dateA = a.scene.uploadDate ? new Date(a.scene.uploadDate).getTime() : 0;
      const dateB = b.scene.uploadDate ? new Date(b.scene.uploadDate).getTime() : 0;
      return dateB - dateA;
    }).slice(0, 10);
  }, [books, scenesMap]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('aq-theme', theme);
  }, [theme]);

  const pushNotification = (title: string, message: string, type: AppNotification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotif: AppNotification = { id, title, message, timestamp: new Date().toLocaleTimeString(), type, read: false };
    if (user) setUser(prev => prev ? ({ ...prev, notifications: [newNotif, ...(prev.notifications || [])] }) : null);
    setToasts(prev => [...prev, newNotif]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const handleLogin = (role: 'admin' | 'user', username?: string) => {
    const finalUsername = username || (role === 'admin' ? 'CreatorJM' : 'StoryLover');
    const userData: User = {
      id: role === 'admin' ? 'admin_1' : `user_${Date.now()}`,
      username: finalUsername,
      email: role === 'admin' ? 'sgkmillertrading@gmail.com' : 'user@audioquest.hub',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${finalUsername}`,
      coins: role === 'admin' ? 9999 : 100,
      earnings: 0, 
      platformRevenue: role === 'admin' ? platformRevenue : 0,
      isPro: role === 'admin',
      canCreateBook: true,
      role: role,
      notifications: [],
      listenerCount: 0,
      recentlyPlayed: [],
      stripeKey: role === 'admin' ? SAVED_STRIPE_KEY : undefined,
      payoutInfo: { method: 'bank', isVerified: false, emailVerified: false, verificationStep: 'idle' }
    };
    setUser(userData);
    pushNotification("Session Authorized", `Identity Sync: Welcome, ${userData.username}.`, "success");
  };

  const handleUpdateCoinPackages = (newPackages: CoinPackage[]) => {
    if (user?.role !== 'admin') return;
    setCoinPackages(newPackages);
    pushNotification("Treasury Update", "Coin exchange rates adjusted by Admin.", "info");
  };

  const handlePurchaseCoins = (amount: number, price: number) => {
    setUser(prev => prev ? ({...prev, coins: prev.coins + amount}) : null);
    setPlatformRevenue(prev => prev + price);
    pushNotification("Purchase Success", `${amount} coins added to wallet.`, "success");
    
    const purchaseEmail: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title: "EMAIL: Hub Transaction Invoice",
      message: `Your transaction for ${amount} Hub Coins ($${price.toFixed(2)}) was successful.`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'email',
      read: false
    };
    setUser(prev => prev ? ({ ...prev, notifications: [purchaseEmail, ...(prev.notifications || [])] }) : null);
  };

  const handleUnlockScene = (scene: Scene) => {
    if (!user) return;
    const cost = scene.cost || 15;
    const totalCashValue = cost * COIN_CONVERSION_VALUE;
    const writerCashShare = totalCashValue * WRITER_SHARE_PERCENT;
    const adminCashShare = totalCashValue * ADMIN_SHARE_PERCENT;

    setUser(prev => prev ? ({ ...prev, coins: prev.coins - cost }) : null);

    const book = books.find(b => b.id === scene.bookId);
    if (book) {
      if (user.id === book.authorId) {
        setUser(prev => prev ? ({ ...prev, earnings: prev.earnings + writerCashShare }) : null);
      }
      if (user.role === 'admin') {
        setUser(prev => prev ? ({ ...prev, earnings: prev.earnings + adminCashShare }) : null);
      }
      pushNotification("Narrative Unlocked", `${cost} Coins deducted. Hub updated.`, "success");
    }
  };

  const handleAddBook = (book: Book, scene: Scene) => {
    setBooks(prev => [book, ...prev]);
    setScenesMap(prev => ({ ...prev, [book.id]: [scene] }));
    pushNotification("Narrative Published", `${book.title} Hub is now LIVE!`, "success");
  };

  const handleAddScene = (bookId: string, scene: Scene) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    setScenesMap(prev => ({ ...prev, [bookId]: [...(prev[bookId] || []), scene] }));
    pushNotification("Chapter Uploaded", `New content for ${book.title} is available.`, "success");
  };

  const handleGiftCoins = (username: string, amount: number) => {
    if (user?.role !== 'admin') return;
    pushNotification("Treasury Distribution", `${amount} coins gifted to ${username}.`, "success");
    if (username.toLowerCase() === user.username.toLowerCase()) {
      setUser(prev => prev ? ({ ...prev, coins: prev.coins + amount }) : null);
    }
  };

  const handleUpdateStripeKey = (key: string) => {
    setUser(prev => prev ? ({ ...prev, stripeKey: key }) : null);
    pushNotification("Gateway Configured", "Stripe API Key synchronized with Treasury.", "success");
  };

  const renderPage = () => {
    if (!user) return null;
    switch (activePage) {
      case Page.HOME: 
        return <Home 
          books={books} 
          latestScenes={latestScenes} 
          onSelectBook={(selected: Book) => { setSelectedBook(selected); setActivePage(Page.BOOK_DETAILS); }} 
          onNavigate={(p: Page) => setActivePage(p)} 
          heroContent={heroContent} 
          promoBanner={promoBanner} 
          user={user} 
          saleConfig={saleConfig} 
          onUpdateHeroImage={(url: string) => setHeroContent(prev => ({ ...prev, backgroundImage: url }))} 
          onUpdatePromoBanner={(p: typeof promoBanner) => setPromoBanner(p)} 
        />;
      case Page.EXPLORE: 
        return <Explore 
          books={books} 
          onSelectBook={(selected: Book) => { setSelectedBook(selected); setActivePage(Page.BOOK_DETAILS); }} 
          onNavigate={(p: Page) => setActivePage(p)} 
        />;
      case Page.BOOK_DETAILS: 
        return selectedBook ? <BookDetails book={selectedBook} scenes={scenesMap[selectedBook.id] || []} user={user} onPlay={(s: Scene) => setActiveScene(s)} onPurchase={handleUnlockScene} /> : null;
      case Page.STUDIO: 
        return <WriterStudio user={user} books={books} onAddBook={handleAddBook} onAddScene={handleAddScene} onNavigate={(p: Page) => setActivePage(p)} categories={categories} />;
      case Page.STORE: 
        return <CoinStore onPurchaseCoins={handlePurchaseCoins} saleConfig={saleConfig} coinPackages={coinPackages} onUpdatePackages={handleUpdateCoinPackages} isAdmin={user.role === 'admin'} user={user} />;
      case Page.WALLET: 
        return <Wallet 
          user={user} 
          onUpdatePayout={(info: PayoutInfo) => pushNotification("TREASURY", "Payout configuration confirmed.", "success")} 
          onUpdateProfile={(u: string, a: string) => setUser(prev => prev ? ({ ...prev, username: u, avatar: a }) : null)} 
          onGiftCoins={handleGiftCoins} 
          categories={categories} 
          onUpdateCategories={(cats: string[]) => setCategories(cats)} 
          footerLinks={footerContent.links} 
          onUpdateFooterLinks={(links: FooterLink[][]) => setFooterContent(prev => ({...prev, links}))} 
          heroContent={heroContent} 
          onUpdateHero={(h: typeof heroContent) => setHeroContent(h)} 
          announcement={announcement} 
          onUpdateAnnouncement={(a: string) => setAnnouncement(a)} 
          promoBanner={promoBanner} 
          onUpdatePromoBanner={(pb: typeof promoBanner) => setPromoBanner(pb)} 
          saleConfig={saleConfig} 
          onUpdateSaleConfig={(sc: SaleConfig) => setSaleConfig(sc)} 
          footerDescription={footerContent.description} 
          onUpdateFooterDescription={(d: string) => setFooterContent(prev => ({...prev, description: d}))} 
          socialLinks={footerContent.socials} 
          onUpdateSocialLinks={(s: SocialLinks) => setFooterContent(prev => ({ ...prev, socials: s }))} 
          footerCdImages={footerContent.cdImages} 
          onUpdateFooterCdImages={(imgs: string[]) => setFooterContent(prev => ({ ...prev, cdImages: imgs }))} 
          onUpdateStripe={handleUpdateStripeKey} 
        />;
      default: return null;
    }
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  return (
    <Layout activePage={activePage} setActivePage={setActivePage} user={user} theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} onMarkRead={() => {}} onLogout={() => setUser(null)} footerLinks={footerContent.links} footerDescription={footerContent.description} announcement={announcement} socialLinks={footerContent.socials} footerCdImages={footerContent.cdImages}>
      {renderPage()}
      {showInstructionalHub && <InstructionalHub videoUrl={instructionalVideo} onUpdate={(url: string) => setInstructionalVideo(url)} onClose={() => setShowInstructionalHub(false)} user={user} />}
      {activeScene && selectedBook && <AudioPlayer scene={activeScene} book={selectedBook} onClose={() => setActiveScene(null)} onNext={() => {}} onPrev={() => {}} />}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => <NotificationToast key={t.id} message={t.message} type={t.type as any} title={t.title} />)}
      </div>
    </Layout>
  );
};

export default App;
