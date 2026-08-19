import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Clock, Users, Phone, Mail, MapPin, 
  ChevronRight, Sparkles, Music, GlassWater, 
  Menu as MenuIcon, X, Instagram, Facebook, 
  Compass, ArrowRight, CheckCircle2, MessageSquare, 
  Info, Volume2, ShieldCheck, Star, Award, Flame
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Dish {
  id: string;
  name: string;
  category: 'small-plates' | 'mains' | 'sushi' | 'dimsum' | 'cocktails' | 'desserts';
  desc: string;
  price: string;
  image: string;
  tag?: string;
  ingredients: string[];
}

const MENU_ITEMS: Dish[] = [
  {
    id: '1',
    name: 'Herb Chilli Tossed Chicken',
    category: 'small-plates',
    desc: 'Wok-tossed chicken with fresh green herbs, sliced chillies, and bell peppers.',
    price: '₹ 595',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    tag: 'Waterfield Favorite',
    ingredients: ['Chicken thigh', 'Green herb paste', 'Bird eye chilli', 'Bell peppers']
  },
  {
    id: '2',
    name: 'Tandoori Spiced Skewers',
    category: 'small-plates',
    desc: 'Charred spiced skewers served with fresh lime, red onion rings, and mint chutney.',
    price: '₹ 625',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    tag: 'Bestseller',
    ingredients: ['Spiced potato/paneer', 'Tandoori spices', 'Red onion', 'Lime']
  },
  {
    id: '3',
    name: 'Nori-Wrapped Crispy Bites',
    category: 'sushi',
    desc: 'Golden crisp snack bites secured with nori strips, served in a rustic wooden presentation box.',
    price: '₹ 750',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    tag: 'Signature Snack',
    ingredients: ['Prawn/Vegetable filling', 'Nori strips', 'Panko crust', 'Sweet chili']
  },
  {
    id: '4',
    name: 'Golden Kintsugi Prawns',
    category: 'small-plates',
    desc: 'Tiger prawns, gold chilli oil, crisp garlic scallion crumble.',
    price: '₹ 995',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    tag: 'Chef Choice',
    ingredients: ['Tiger prawns', 'Edible gold leaf', 'Bird eye chilli', 'Garlic butter']
  },
  {
    id: '5',
    name: 'Crispy Honey Chilli Lotus Stem',
    category: 'small-plates',
    desc: 'Wok-glazed lotus stem crisps with toasted sesame seeds and scallions.',
    price: '₹ 525',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    tag: 'Vegetarian Hit',
    ingredients: ['Lotus stem', 'Wild honey', 'Dry red chillies', 'Sesame']
  },
  {
    id: '6',
    name: 'Rock Shrimp Tempura',
    category: 'small-plates',
    desc: 'Crispy rock shrimp tossed in creamy spicy gochujang mayo and tobiko.',
    price: '₹ 895',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    tag: 'Popular',
    ingredients: ['Rock shrimp', 'Tempura batter', 'Gochujang', 'Tobiko']
  },
  {
    id: '7',
    name: 'Truffle Edamame Dumplings',
    category: 'dimsum',
    desc: 'Handmade translucent pouches filled with edamame, water chestnut, and black truffle oil.',
    price: '₹ 645',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    tag: 'Chef Signature',
    ingredients: ['Edamame', 'Water chestnut', 'Truffle oil', 'Wheat starch skin']
  },
  {
    id: '8',
    name: 'Spicy Chicken & Chives Dim Sum',
    category: 'dimsum',
    desc: 'Steamed delicate dumplings with minced chicken, garlic chives, and chilli oil drizzle.',
    price: '₹ 675',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    tag: 'Steamed',
    ingredients: ['Minced chicken', 'Chinese chives', 'Sichuan oil', 'Ginger']
  },
  {
    id: '9',
    name: 'Miso Black Cod',
    category: 'mains',
    desc: '72-hr Saikyo miso marinade, charred baby pak choy, ginger dashi.',
    price: '₹ 1,450',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    tag: 'Masterpiece',
    ingredients: ['Black cod fillet', 'Saikyo miso', 'Mirin', 'Pak choy']
  },
  {
    id: '10',
    name: 'Volcano Sushi Tower',
    category: 'sushi',
    desc: 'Spicy minced tuna, snow crab, tobiko, crispy rice cake, gold leaf.',
    price: '₹ 1,150',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
    tag: 'Must Try',
    ingredients: ['Bluefin tuna', 'Snow crab', 'Tobiko', 'Japanese mayo']
  },
  {
    id: '11',
    name: 'Dragon Roll Flame',
    category: 'sushi',
    desc: 'Eel, avocado, tempura prawn, unagi reduction, flamed tableside.',
    price: '₹ 995',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    tag: 'Signature Roll',
    ingredients: ['Unagi', 'Avocado', 'Prawn tempura', 'Micro greens']
  },
  {
    id: '12',
    name: 'Bora Bora Old Fashioned',
    category: 'cocktails',
    desc: 'Lapsang souchong infused bourbon, lychee smoke, Angostura, gold dust.',
    price: '₹ 850',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    tag: 'Signature Drink',
    ingredients: ['Bourbon', 'Lapsang souchong', 'Lychee liqueur', 'Gold dust']
  },
  {
    id: '13',
    name: 'Tokyo Smoked Negroni',
    category: 'cocktails',
    desc: 'Japanese gin, umeshu plum wine, Campari, hinoki wood smoke.',
    price: '₹ 895',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    tag: 'Lounge Favorite',
    ingredients: ['Roku gin', 'Umeshu', 'Campari', 'Hinoki smoke']
  },
  {
    id: '14',
    name: 'Matcha Kintsugi Tart',
    category: 'desserts',
    desc: 'Ceremonial Uji matcha ganache, white chocolate gold crackle, yuzu sorbet.',
    price: '₹ 495',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    tag: 'Sweet Finish',
    ingredients: ['Uji matcha', 'White chocolate', 'Yuzu', 'Almond crust']
  }
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuCat, setActiveMenuCat] = useState<string>('all');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeFrameModal, setActiveFrameModal] = useState<string | null>(null);
  
  // Reservation form state
  const [resDate, setResDate] = useState('2026-08-25');
  const [resTime, setResTime] = useState('21:00');
  const [resGuests, setResGuests] = useState('2 Guests');
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [resZone, setResZone] = useState('Indoor Brick Arch');
  const [confirmedBooking, setConfirmedBooking] = useState<{ id: string; name: string; date: string; time: string; guests: string } | null>(null);

  // Concierge AI state
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Namaste! I am your Bora Bora Aesthetic Concierge. Ask me about our Pan-Asian menu, cocktail pairings, table seating in Bandra, or tonight\'s DJ lineup.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && window.matchMedia('(hover:hover)').matches) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName || !resPhone) {
      alert('Please provide your name and phone number for the reservation.');
      return;
    }
    const bookingId = 'BORA-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmedBooking({
      id: bookingId,
      name: resName,
      date: resDate,
      time: resTime,
      guests: resGuests
    });
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const apiKey = (import.meta as unknown as { env: { VITE_GEMINI_API_KEY?: string } }).env.VITE_GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `You are the sophisticated aesthetic concierge at BORA BORA Bandra, Mumbai's premier Pan-Asian dining and late-night lounge on Waterfield Road. 
            Key facts:
            - Located at Ground Floor, Tamang Nivas, No. 155, Waterfield Road, Bandra West, Mumbai 400050.
            - Atmosphere: Brick vaulted ceilings, grand chandeliers, red-lit illumination bar counters, iconic captain mural art, Kintsugi gold accents.
            - Signature dishes: Herb Chilli Tossed Chicken (₹595), Tandoori Spiced Skewers (₹625), Nori-Wrapped Crispy Bites (₹750), Miso Black Cod (₹1450), Bora Bora Old Fashioned (₹850), Truffle Edamame Dumplings (₹645).
            - Hours: Open daily from 6:00 PM to 1:30 AM.
            
            User's question: "${userMsg}"
            
            Give a refined, aesthetic editorial recommendation.` }]
          }
        ]
      });

      const reply = response.text || "We would love to welcome you to Bora Bora Bandra. Please reserve your table online or call us at 091676 66734.";
      setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error(err);
      let fallback = "Bora Bora Bandra offers exceptional Pan-Asian plates and late-night DJ vibes on Waterfield Road. Try our Miso Black Cod and Bora Bora Old Fashioned!";
      if (userMsg.toLowerCase().includes('cocktail') || userMsg.toLowerCase().includes('drink')) {
        fallback = "Our signature 'Bora Bora Old Fashioned' features Lapsang bourbon, lychee smoke, and edible gold dust (₹850).";
      } else if (userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('cost')) {
        fallback = "Small plates range from ₹595 to ₹995, and signature mains like Miso Black Cod are ₹1,450.";
      }
      setChatMessages(prev => [...prev, { role: 'assistant', text: fallback }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="bg-[#0d0b09] text-[#f3ead9] min-h-screen relative font-sans selection:bg-[#c9a961] selection:text-[#0d0b09]">
      {/* Magnetic Cursor Dot */}
      <div 
        ref={cursorRef} 
        className="fixed w-2 h-2 rounded-full bg-[#c9a961] pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hidden lg:block mix-blend-difference"
      />

      {/* LUXURY EDITORIAL TOP HEADER */}
      <header className={`flex justify-between items-center px-8 lg:px-16 py-6 border-b border-[#c9a961]/20 transition-all duration-300 ${scrolled ? 'fixed top-0 inset-x-0 bg-[#0d0b09]/95 backdrop-blur-md z-40 shadow-2xl' : ''}`}>
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#c9a961] hidden sm:inline">Issue No. 018</span>
          <a href="#home" className="font-serif text-2xl tracking-[0.15em] font-medium text-[#f3ead9]">BORA BORA</a>
        </div>

        <nav className="hidden lg:flex items-center gap-10 text-[11px] uppercase font-bold tracking-[0.2em] text-[#cfc3ad]">
          <a href="#story" className="hover:text-[#c9a961] transition-colors">Our Story</a>
          <a href="#menu" className="hover:text-[#c9a961] transition-colors">Menu Catalog</a>
          <a href="#nightlife" className="hover:text-[#c9a961] transition-colors">Experience</a>
          <a href="#gallery" className="hover:text-[#c9a961] transition-colors">Gallery Frames</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setConciergeOpen(true)}
            className="flex items-center gap-2 border border-[#c9a961]/50 px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-[#c9a961] hover:bg-[#c9a961] hover:text-[#0d0b09] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Concierge
          </button>
          <a href="#reserve" className="hidden sm:inline-flex bg-[#c9a961] text-[#0d0b09] px-6 py-2.5 text-[11px] uppercase font-bold tracking-widest hover:bg-[#f3ead9] transition-all">
            Reserve
          </a>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-[#c9a961]">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0d0b09] z-50 flex flex-col p-12 overflow-y-auto">
          <div className="flex justify-between items-center mb-12 border-b border-[#c9a961]/30 pb-6">
            <span className="font-serif italic text-2xl font-black text-[#c9a961]">BORA BORA INDEX</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-[#f3ead9]"><X className="w-8 h-8" /></button>
          </div>
          <div className="space-y-6 text-2xl font-serif text-[#f3ead9]">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#c9a961]/15 pb-4">Home</a>
            <a href="#story" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#c9a961]/15 pb-4">Our Story</a>
            <a href="#menu" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#c9a961]/15 pb-4">Complete Menu</a>
            <a href="#nightlife" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#c9a961]/15 pb-4">After Dark Experience</a>
            <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="block border-b border-[#c9a961]/15 pb-4">Gallery Frames</a>
            <a href="#reserve" onClick={() => setMobileMenuOpen(false)} className="block pt-4 text-[#c9a961]">Reserve a Table</a>
          </div>
        </div>
      )}

      {/* HERO SECTION - WIDE IMMERSIVE BANNER */}
      <section id="home" className="relative h-[85vh] min-h-[600px] flex items-end px-8 lg:px-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=2000&q=90" 
            alt="Bora Bora Bandra Bar Counter" 
            className="w-full h-full object-cover brightness-[0.75] scale-105 animate-drift"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09] via-[#0d0b09]/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#c9a961] animate-ping" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#c9a961] font-semibold">Waterfield Road · Bandra West, Mumbai</span>
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-serif font-light text-[#f3ead9] tracking-tight leading-none mb-6">
            Where Mumbai <br /><span className="italic text-[#e6cd8f]">Comes Alive.</span>
          </h1>
          <p className="max-w-xl text-[#cfc3ad] text-base sm:text-lg font-light leading-relaxed mb-10">
            Arched brick vaults, grand chandeliers, red-lit slatted bar counters, and Pan-Asian plates that lead into electric late-night DJ sets.
          </p>
          <div className="flex flex-wrap gap-5">
            <a href="#reserve" className="px-8 py-4 bg-[#c9a961] text-[#0d0b09] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#f3ead9] transition-all">
              Reserve Your Table
            </a>
            <a href="#gallery" className="px-8 py-4 border border-[#c9a961]/60 text-[#f3ead9] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#c9a961]/10 transition-all">
              View Gallery Frames
            </a>
          </div>
        </div>
      </section>

      {/* STORY & ATMOSPHERE SECTION (2-Column Spacing) */}
      <section id="story" className="py-32 px-8 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-8">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#c9a961]">01 // Heritage & Vibe</span>
              <h2 className="text-4xl sm:text-5xl font-serif italic text-[#f3ead9] mt-3">
                The Living Room of Waterfield Road
              </h2>
            </div>
            <p className="text-[#cfc3ad] text-base sm:text-lg font-light leading-relaxed">
              BORA BORA is where Asian-inspired dining, considered cocktails, and underground nightlife converge. By early evening, brick vaults and low amber lights set a sophisticated dining tone.
            </p>
            <p className="text-[#cfc3ad] text-sm leading-relaxed">
              As the clock approaches midnight, the room transforms into Bandra's electric dancefloor — low basslines, immersive lighting, and a crowd that stays until 1:30 AM.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#c9a961]/20">
              <div>
                <span className="font-serif text-3xl text-[#c9a961]">02</span>
                <small className="text-[9px] uppercase tracking-widest text-[#cfc3ad] block mt-1">Atmospheres</small>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#c9a961]">1:30A</span>
                <small className="text-[9px] uppercase tracking-widest text-[#cfc3ad] block mt-1">Late Nights</small>
              </div>
              <div>
                <span className="font-serif text-3xl text-[#c9a961]">Bandra</span>
                <small className="text-[9px] uppercase tracking-widest text-[#cfc3ad] block mt-1">West Mumbai</small>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setActiveFrameModal('frame1')}
              className="aspect-[3/4] bg-[#181512] border-2 border-[#c9a961] p-3 shadow-2xl cursor-pointer group"
            >
              <div className="w-full h-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=600&q=80" alt="Chandelier Vault Frame" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest bg-black/80 text-[#c9a961] px-2 py-0.5 border border-[#c9a961]/40">Frame I · Vault</span>
              </div>
            </div>
            <div 
              onClick={() => setActiveFrameModal('frame2')}
              className="aspect-[3/4] bg-[#181512] border-2 border-[#c9a961] p-3 shadow-2xl cursor-pointer group mt-12"
            >
              <div className="w-full h-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80" alt="Captain Mural Frame" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                <span className="absolute bottom-2 left-2 text-[9px] uppercase tracking-widest bg-black/80 text-[#c9a961] px-2 py-0.5 border border-[#c9a961]/40">Frame II · Mural</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETE MENU SECTION */}
      <section id="menu" className="py-32 px-8 lg:px-20 max-w-7xl mx-auto border-t border-[#c9a961]/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#c9a961]">02 // Complete Catalog</span>
            <h2 className="text-4xl sm:text-5xl font-serif italic text-[#f3ead9] mt-3">The Bora Bora Menu</h2>
          </div>
          <div className="flex gap-2 flex-wrap mt-6 md:mt-0">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'small-plates', label: 'Small Plates' },
              { id: 'dimsum', label: 'Dim Sum' },
              { id: 'sushi', label: 'Sushi & Rolls' },
              { id: 'mains', label: 'Mains' },
              { id: 'cocktails', label: 'Cocktails' },
              { id: 'desserts', label: 'Desserts' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveMenuCat(cat.id)}
                className={`text-[10px] uppercase tracking-widest px-4 py-2 border transition-all ${activeMenuCat === cat.id ? 'bg-[#c9a961] text-[#0d0b09] border-[#c9a961] font-bold' : 'border-[#c9a961]/30 text-[#cfc3ad] hover:border-[#c9a961] hover:text-[#f3ead9]'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MENU_ITEMS.filter(item => activeMenuCat === 'all' || item.category === activeMenuCat).map(dish => (
            <div 
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              className="bg-[#181512] border border-[#c9a961]/30 flex flex-col justify-between cursor-pointer hover:border-[#c9a961] transition-all duration-300 group overflow-hidden shadow-xl"
            >
              <div className="aspect-[16/10] relative overflow-hidden bg-[#221d18]">
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <span className="absolute top-4 left-4 bg-[#0d0b09]/90 text-[#c9a961] border border-[#c9a961]/40 text-[9px] uppercase font-bold tracking-widest px-3 py-1">
                  {dish.tag || dish.category}
                </span>
              </div>
              <div className="p-8 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-2xl text-[#f3ead9] group-hover:text-[#e6cd8f] transition-colors">{dish.name}</h3>
                    <span className="font-serif italic font-semibold text-xl text-[#c9a961]">{dish.price}</span>
                  </div>
                  <p className="text-sm text-[#cfc3ad] leading-relaxed">{dish.desc}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-[#c9a961]/20 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-[#c9a961]">
                  <span>Inspect Ingredients</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NIGHTLIFE & EVENTS SECTION */}
      <section id="nightlife" className="py-32 px-8 lg:px-20 max-w-7xl mx-auto border-t border-[#c9a961]/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#c9a961]">03 // After Dark</span>
            <h2 className="text-4xl sm:text-5xl font-serif italic text-[#f3ead9]">When The Sun Goes Down</h2>
            <p className="text-[#cfc3ad] text-base leading-relaxed">
              The lights dim, the bar comes forward, the DJ takes the room. Cocktails move faster, the crowd moves closer — this is Bandra's late-night stage.
            </p>
            <div className="flex gap-3 flex-wrap pt-2">
              {['Curated DJs', 'Craft Cocktails', 'Deep House', 'Late Nights'].map((tag, idx) => (
                <span key={idx} className="text-[10px] uppercase tracking-widest border border-[#c9a961]/40 text-[#c9a961] px-4 py-2 font-bold bg-[#c9a961]/5">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div id="events" className="bg-[#181512] border border-[#c9a961]/30 p-10 space-y-8 shadow-2xl">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c9a961]">Upcoming Sessions</span>
              <h3 className="font-serif text-3xl italic text-[#f3ead9] mt-2">Bandra Club Nights</h3>
            </div>
            <ul className="space-y-6 text-sm text-[#cfc3ad]">
              <li className="border-b border-[#c9a961]/20 pb-4">
                <span className="text-[10px] uppercase font-bold text-[#c9a961]">Friday & Saturday · 10 PM</span>
                <h4 className="font-serif text-xl text-[#f3ead9] mt-1">Waterfield Underground DJ Sets</h4>
                <p className="text-xs text-[#cfc3ad] mt-1">Afro beats, deep house & commercial sets.</p>
              </li>
              <li>
                <span className="text-[10px] uppercase font-bold text-[#c9a961]">23 August · 2 PM</span>
                <h4 className="font-serif text-xl text-[#f3ead9] mt-1">Golden Cracks — Kintsugi Workshop</h4>
                <p className="text-xs text-[#cfc3ad] mt-1">Ceramics, repair, and afternoon matcha tasting.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* VISUAL GALLERY FRAMES (SHOWCASING BORA BORA BANDRA INTERIOR ARCHITECTURE) */}
      <section id="gallery" className="py-32 px-8 lg:px-20 max-w-7xl mx-auto border-t border-[#c9a961]/20">
        <div className="mb-16">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#c9a961]">04 // Visual Archive in Frames</span>
          <h2 className="text-4xl sm:text-5xl font-serif italic text-[#f3ead9] mt-3">The Bora Bora Interior Frames</h2>
          <p className="text-[#cfc3ad] text-sm mt-2">Click any frame to inspect the full architectural perspective in high resolution.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* FRAME 1: Vaulted Ceiling & Chandelier */}
          <div 
            onClick={() => setActiveFrameModal('frame1')}
            className="bg-[#181512] border-4 border-[#c9a961] p-6 shadow-2xl cursor-pointer group hover:border-[#f3ead9] transition-all"
          >
            <div className="aspect-[4/3] bg-[#0d0b09] overflow-hidden relative mb-6 border border-[#c9a961]/40">
              <img 
                src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=90" 
                alt="Brick Vaulted Ceiling & Grand Chandelier" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <span className="absolute top-4 left-4 bg-black/80 text-[#c9a961] border border-[#c9a961]/50 text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                Exhibit 01 · Waterfield Road Vaults
              </span>
            </div>
            <h3 className="font-serif text-2xl text-[#f3ead9] mb-2">Brick Vault & Grand Chandelier</h3>
            <p className="text-xs text-[#cfc3ad] leading-relaxed mb-4">
              Barrel-arched terracotta brick ceilings, grand central chandelier, dark wood mosaic dining tables, and intimate leather booth seating at Bora Bora Bandra.
            </p>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#c9a961] flex items-center gap-1">
              <span>Inspect Frame Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* FRAME 2: Captain Mural Art Lounge */}
          <div 
            onClick={() => setActiveFrameModal('frame2')}
            className="bg-[#181512] border-4 border-[#c9a961] p-6 shadow-2xl cursor-pointer group hover:border-[#f3ead9] transition-all"
          >
            <div className="aspect-[4/3] bg-[#0d0b09] overflow-hidden relative mb-6 border border-[#c9a961]/40">
              <img 
                src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=90" 
                alt="Captain Cigar Mural Art Lounge" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <span className="absolute top-4 left-4 bg-black/80 text-[#c9a961] border border-[#c9a961]/50 text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                Exhibit 02 · Main Lounge
              </span>
            </div>
            <h3 className="font-serif text-2xl text-[#f3ead9] mb-2">Captain Cigar Mural Art</h3>
            <p className="text-xs text-[#cfc3ad] leading-relaxed mb-4">
              The iconic monochrome captain wall mural with swirling cigar smoke, framed gallery portraits, wooden lantern fixtures, and plush burgundy lounge seating.
            </p>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#c9a961] flex items-center gap-1">
              <span>Inspect Frame Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* RESERVATION SECTION */}
      <section id="reserve" className="py-32 px-8 lg:px-20 max-w-7xl mx-auto border-t border-[#c9a961]/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#c9a961]">05 // Reservations</span>
            <h2 className="text-5xl font-serif italic text-[#f3ead9]">Your Table Is Waiting</h2>
            <p className="text-sm leading-relaxed text-[#cfc3ad]">
              Secure your evening at Waterfield Road. Friday and Saturday evening slots fill rapidly after 10 PM.
            </p>
            <div className="border border-[#c9a961]/30 p-8 bg-[#181512] space-y-3 shadow-xl">
              <span className="font-serif font-bold text-lg text-[#e6cd8f] block">Bora Bora Bandra West</span>
              <p className="text-xs text-[#cfc3ad] leading-relaxed">Ground Floor, Tamang Nivas, No. 155, Waterfield Road, Bandra West, Mumbai 400050</p>
              <p className="text-xs font-bold pt-2 text-[#c9a961]">Telephone: 091676 66734</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {confirmedBooking ? (
              <div className="border border-[#c9a961] p-12 bg-[#181512] text-center shadow-2xl">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-[#c9a961]" />
                <h3 className="text-3xl font-serif italic mb-3 text-[#f3ead9]">Reservation Confirmed</h3>
                <p className="text-sm font-medium mb-8 text-[#cfc3ad]">Thank you, {confirmedBooking.name}. We await your arrival.</p>
                <div className="max-w-md mx-auto text-left space-y-2 text-sm border-t border-b border-[#c9a961]/30 py-6 mb-8 text-[#cfc3ad]">
                  <div className="flex justify-between"><strong className="text-[#f3ead9]">Reference ID:</strong> <span className="text-[#c9a961] font-mono">{confirmedBooking.id}</span></div>
                  <div className="flex justify-between"><strong className="text-[#f3ead9]">Date & Time:</strong> <span>{confirmedBooking.date} at {confirmedBooking.time}</span></div>
                  <div className="flex justify-between"><strong className="text-[#f3ead9]">Party Size:</strong> <span>{confirmedBooking.guests}</span></div>
                </div>
                <button 
                  onClick={() => setConfirmedBooking(null)}
                  className="border border-[#c9a961] text-[#c9a961] px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#c9a961] hover:text-[#0d0b09] transition-all"
                >
                  Make Another Booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleReserve} className="border border-[#c9a961]/30 p-8 sm:p-12 space-y-6 bg-[#181512] shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-[#c9a961]">Date</label>
                    <input 
                      type="date" 
                      value={resDate} 
                      onChange={e => setResDate(e.target.value)} 
                      className="w-full border-b border-[#c9a961]/40 pb-3 text-sm font-medium bg-transparent outline-none text-[#f3ead9]" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-[#c9a961]">Time</label>
                    <input 
                      type="time" 
                      value={resTime} 
                      onChange={e => setResTime(e.target.value)} 
                      className="w-full border-b border-[#c9a961]/40 pb-3 text-sm font-medium bg-transparent outline-none text-[#f3ead9]" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-[#c9a961]">Guests</label>
                    <select 
                      value={resGuests} 
                      onChange={e => setResGuests(e.target.value)} 
                      className="w-full border-b border-[#c9a961]/40 pb-3 text-sm font-medium bg-[#181512] outline-none text-[#f3ead9]"
                    >
                      <option>2 Guests</option>
                      <option>3 Guests</option>
                      <option>4 Guests</option>
                      <option>6+ Guests (VIP Table)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-[#c9a961]">Seating Zone</label>
                    <select 
                      value={resZone} 
                      onChange={e => setResZone(e.target.value)} 
                      className="w-full border-b border-[#c9a961]/40 pb-3 text-sm font-medium bg-[#181512] outline-none text-[#f3ead9]"
                    >
                      <option>Indoor Brick Arch</option>
                      <option>Tropical Garden Lounge</option>
                      <option>DJ Floor Table</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-[#c9a961]">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Julian Voss" 
                    value={resName} 
                    onChange={e => setResName(e.target.value)} 
                    className="w-full border-b border-[#c9a961]/40 pb-3 text-sm font-medium bg-transparent outline-none placeholder:text-[#cfc3ad]/30 text-[#f3ead9]" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-[#c9a961]">Phone</label>
                    <input 
                      type="tel" 
                      placeholder="+91 98200 00000" 
                      value={resPhone} 
                      onChange={e => setResPhone(e.target.value)} 
                      className="w-full border-b border-[#c9a961]/40 pb-3 text-sm font-medium bg-transparent outline-none placeholder:text-[#cfc3ad]/30 text-[#f3ead9]" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest mb-2 text-[#c9a961]">Email</label>
                    <input 
                      type="email" 
                      placeholder="you@domain.com" 
                      value={resEmail} 
                      onChange={e => setResEmail(e.target.value)} 
                      className="w-full border-b border-[#c9a961]/40 pb-3 text-sm font-medium bg-transparent outline-none placeholder:text-[#cfc3ad]/30 text-[#f3ead9]" 
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#c9a961] text-[#0d0b09] py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#f3ead9] transition-all mt-4">
                  Confirm Reservation
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* EDITORIAL FOOTER */}
      <footer className="mt-32 py-12 px-8 lg:px-20 border-t border-[#c9a961]/30 flex flex-col sm:flex-row justify-between items-center gap-6 text-[#cfc3ad]">
        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black tracking-widest mb-1 text-[#c9a961]">Edition</span>
            <span className="text-[10px] font-medium text-[#f3ead9]">Bandra / Mumbai</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black tracking-widest mb-1 text-[#c9a961]">Status</span>
            <span className="text-[10px] font-medium text-[#f3ead9]">Open until 1:30 AM</span>
          </div>
        </div>
        <div className="text-[9px] uppercase font-black tracking-[0.4em] text-center text-[#c9a961]">
          &copy; 2026 BORA BORA BANDRA / ALL RIGHTS RESERVED
        </div>
      </footer>

      {/* FRAME INSPECT MODAL */}
      {activeFrameModal && (
        <div className="fixed inset-0 z-50 bg-[#0d0b09]/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#181512] border-4 border-[#c9a961] max-w-4xl w-full p-8 relative shadow-2xl">
            <button onClick={() => setActiveFrameModal(null)} className="absolute top-6 right-6 text-[#f3ead9] bg-black/60 p-2 rounded-full hover:bg-[#c9a961] hover:text-[#0d0b09] transition-all">
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-[16/9] mb-6 overflow-hidden border border-[#c9a961]/40">
              <img 
                src={activeFrameModal === 'frame1' ? "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1400&q=90" : "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1400&q=90"} 
                alt="Frame Detail" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#c9a961]">
              {activeFrameModal === 'frame1' ? 'Exhibit 01 · Vaulted Brick & Chandelier' : 'Exhibit 02 · Captain Cigar Mural Art'}
            </span>
            <h3 className="text-3xl font-serif italic mt-1 text-[#f3ead9]">
              {activeFrameModal === 'frame1' ? 'Bandra Vault Architecture' : 'The Legendary Mural Lounge'}
            </h3>
            <p className="text-sm text-[#cfc3ad] mt-3 leading-relaxed">
              {activeFrameModal === 'frame1' 
                ? 'Every archway at Bora Bora Bandra is meticulously structured with warm terracotta brickwork, framing the grand central chandelier and mosaic dining tables where guests experience vibrant evenings.'
                : 'The focal point of the main dining room: a striking monochrome mural depicting a captain smoking a cigar amidst swirling smoke, flanked by lantern fixtures and plush velvet seating.'}
            </p>
            <div className="mt-8 pt-6 border-t border-[#c9a961]/25 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#c9a961] font-bold">Waterfield Road, Bandra West</span>
              <a 
                href="#reserve" 
                onClick={() => setActiveFrameModal(null)}
                className="bg-[#c9a961] text-[#0d0b09] text-[10px] uppercase tracking-widest font-bold px-6 py-3 hover:bg-[#f3ead9] transition-all"
              >
                Reserve This Zone
              </a>
            </div>
          </div>
        </div>
      )}

      {/* DISH DETAIL MODAL */}
      {selectedDish && (
        <div className="fixed inset-0 z-50 bg-[#0d0b09]/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#181512] border border-[#c9a961] max-w-lg w-full p-8 relative shadow-2xl">
            <button onClick={() => setSelectedDish(null)} className="absolute top-6 right-6 text-[#f3ead9]">
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-[16/9] mb-6 overflow-hidden border border-[#c9a961]/30">
              <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#c9a961]">{selectedDish.category}</span>
            <h3 className="text-3xl font-serif italic mt-1 text-[#f3ead9]">{selectedDish.name}</h3>
            <p className="text-sm text-[#cfc3ad] mt-3 leading-relaxed">{selectedDish.desc}</p>
            <div className="mt-6 pt-6 border-t border-[#c9a961]/20">
              <span className="text-[10px] uppercase font-bold tracking-widest block mb-3 text-[#c9a961]">Key Ingredients</span>
              <div className="flex gap-2 flex-wrap">
                {selectedDish.ingredients.map((ing, idx) => (
                  <span key={idx} className="text-xs border border-[#c9a961]/30 px-3 py-1 bg-[#0d0b09] text-[#cfc3ad]">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#c9a961]/20 flex items-center justify-between">
              <span className="font-serif italic text-2xl font-bold text-[#c9a961]">{selectedDish.price}</span>
              <a 
                href="#reserve" 
                onClick={() => setSelectedDish(null)}
                className="bg-[#c9a961] text-[#0d0b09] text-[10px] uppercase tracking-widest font-bold px-6 py-3 hover:bg-[#f3ead9] transition-all"
              >
                Reserve To Taste
              </a>
            </div>
          </div>
        </div>
      )}

      {/* AI CONCIERGE DRAWER */}
      {conciergeOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d0b09]/80 backdrop-blur-sm flex justify-end">
          <div className="bg-[#181512] border-l border-[#c9a961]/40 w-full max-w-md h-full flex flex-col justify-between shadow-2xl">
            <div className="p-6 border-b border-[#c9a961]/30 flex items-center justify-between bg-[#0d0b09] text-[#f3ead9]">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#c9a961]" />
                <div>
                  <h3 className="font-serif italic text-lg font-bold">Aesthetic Concierge</h3>
                  <p className="text-[9px] uppercase tracking-widest text-[#c9a961]">Gemini AI Intelligence</p>
                </div>
              </div>
              <button onClick={() => setConciergeOpen(false)} className="text-[#f3ead9]"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-[#c9a961] text-[#0d0b09] font-medium' : 'bg-[#221d18] text-[#f3ead9] border border-[#c9a961]/30'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#221d18] text-[#cfc3ad] p-4 text-xs italic border border-[#c9a961]/30">
                    Concierge is drafting...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendChat} className="p-4 border-t border-[#c9a961]/30 bg-[#0d0b09] flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about pairings or tables..." 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-grow bg-[#181512] border border-[#c9a961]/40 px-4 py-3 text-xs text-[#f3ead9] outline-none focus:border-[#c9a961]"
              />
              <button type="submit" className="px-5 bg-[#c9a961] text-[#0d0b09] text-[10px] uppercase font-bold tracking-widest hover:bg-[#f3ead9] transition-all">
                Send
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
