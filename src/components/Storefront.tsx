import React, { useState } from 'react';
import { 
  DogProduct, 
  ProductVariant, 
  CartItem, 
  ShippingAddress 
} from '../types/dropship';
import { 
  ShieldCheck, 
  Truck, 
  Heart, 
  Star, 
  ShoppingBag, 
  CheckCircle, 
  ArrowRight, 
  Filter, 
  X, 
  Check, 
  Sparkles,
  Lock,
  PackageCheck,
  Search,
  LayoutGrid,
  List,
  Eye,
  Tag,
  Zap,
  Clock,
  ChevronRight,
  Flame,
  Plus
} from 'lucide-react';
import { PolicyType } from './PolicyModal';

interface StorefrontProps {
  products: DogProduct[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  onPlaceOrder: (items: CartItem[], address: ShippingAddress) => void;
  onOpenTracking: () => void;
  onOpenPolicy: (type: PolicyType) => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  products,
  cart,
  setCart,
  isCartOpen,
  setIsCartOpen,
  onPlaceOrder,
  onOpenTracking,
  onOpenPolicy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDogSize, setSelectedDogSize] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [activeProductModal, setActiveProductModal] = useState<DogProduct | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<DogProduct | null>(null);

  // Cart / Coupon state
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');

  // GDPR Cookie Banner state
  const [cookieConsentDismissed, setCookieConsentDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pawdrop_cookie_consent') === 'true';
    } catch {
      return false;
    }
  });

  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderNumber: string;
    email: string;
    total: number;
  } | null>(null);

  // Default simulated shipping address
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'David Miller',
    email: 'david.miller@example.com',
    phone: '+1 (555) 439-1082',
    street1: '1248 Oakridge Lane',
    city: 'Denver',
    state: 'CO',
    postalCode: '80202',
    country: 'US',
  });

  const categories = [
    'All',
    'Anxiety Solutions',
    'Comfort & Orthopedic',
    'Grooming',
    'Smart Gadgets',
    'Training',
    'Health & Wellness',
    'Travel & Safety',
    'Enrichment',
    'Apparel',
    'Senior Dog Care',
  ];

  // Filtering & Sorting pipeline
  const filteredProducts = products
    .filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSize = selectedDogSize === 'All' || p.dogSize.includes('All Sizes') || p.dogSize.includes(selectedDogSize as any);
      const matchSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSize && matchSearch;
    })
    .sort((a, b) => {
      const priceA = a.variants[0]?.price || 0;
      const priceB = b.variants[0]?.price || 0;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // 'featured'
    });

  const openProduct = (product: DogProduct) => {
    setActiveProductModal(product);
    setSelectedVariant(product.variants[0] || null);
  };

  const addToCart = (product: DogProduct, variant: ProductVariant, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.variant.id === variant.id
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, variant, quantity }];
    });
    setIsCartOpen(true);
    setActiveProductModal(null);
    setQuickViewProduct(null);
  };

  const buyNow = (product: DogProduct, variant: ProductVariant) => {
    addToCart(product, variant, 1);
    setIsCartOpen(true);
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variant.id !== variantId));
  };

  const updateQuantity = (variantId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.variant.id === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'PUPPY10' || code === 'PAW10' || code === 'DOGVIP') {
      setAppliedDiscount(0.1); // 10% off
      setCouponSuccess('10% VIP Dog Discount applied!');
    } else if (code === 'FREESHIP') {
      setCouponSuccess('Free Express Delivery Unlocked!');
    } else {
      setCouponError('Invalid code. Try "PUPPY10"');
    }
  };

  const rawSubtotal = cart.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
  const discountAmount = rawSubtotal * appliedDiscount;
  const cartSubtotal = Math.max(0, rawSubtotal - discountAmount);

  // Free shipping progress bar target: $35
  const freeShippingThreshold = 35.0;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercentage = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const assignedOrderNum = `PAW-${Math.floor(10500 + Math.random() * 900)}`;
    onPlaceOrder(cart, address);
    setOrderConfirmation({
      orderNumber: assignedOrderNum,
      email: address.email,
      total: cartSubtotal,
    });
    setCart([]);
    setIsCartOpen(false);
  };

  const dismissCookies = () => {
    setCookieConsentDismissed(true);
    try {
      localStorage.setItem('pawdrop_cookie_consent', 'true');
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Dog Care Storefront Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/40" />
        
        <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Veterinarian-Vetted Canine Innovations</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Better Sleep, Less Stress, <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Happier Dogs</span>.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Curated anti-anxiety donut beds, dual-action deshedding rakes, orthopedic hip mattresses, and smart health tech. Loved by over 40,000+ dog parents.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-orange-600/30 flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <span>Shop All Dog Gear</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenTracking}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center space-x-2 transition-all"
            >
              <Truck className="w-4 h-4 text-orange-400" />
              <span>Track My Package</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Veterinary Safe Materials</h4>
            <p className="text-xs text-slate-400">100% non-toxic, pet-grade memory foam & lick-safe organic balms</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tracked Courier Delivery</h4>
            <p className="text-xs text-slate-400">Fast direct shipping with live USPS / DHL milestone tracking</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">30-Day Wag-Guarantee</h4>
            <p className="text-xs text-slate-400">If your dog isn't jumping with joy, we replace or refund hassle-free</p>
          </div>
        </div>
      </div>

      {/* Catalog & Filter Section */}
      <div id="catalog-section" className="space-y-6">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center space-x-2 text-xs text-slate-400">
          <button onClick={() => setSelectedCategory('All')} className="hover:text-white">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-white font-semibold">{selectedCategory === 'All' ? 'All Dog Products' : selectedCategory}</span>
          <span className="text-slate-500">({filteredProducts.length} items)</span>
        </nav>

        {/* Global Search & Filter Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Search input with instant autocomplete */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dog beds, deshedding brush, calming chews, gadgets..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & View Mode Controls */}
            <div className="flex items-center space-x-2 shrink-0">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
              >
                <option value="featured">Best Sellers & Popular</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>

              {/* Grid / List view toggle */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Dog Size Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <span className="font-semibold text-slate-300">Filter Dog Size:</span>
              {['All', 'Small', 'Medium', 'Large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedDogSize(size)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedDogSize === size
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-400">
              Showing <strong>{filteredProducts.length}</strong> vetted dog care items
            </div>
          </div>

          {/* Niche Category Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid / List View */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
            <Search className="w-8 h-8 text-orange-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No dog products match your search</h3>
            <p className="text-xs">Try selecting "All" categories or clearing your search keywords.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDogSize('All');
                setSearchQuery('');
              }}
              className="bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => {
              const startingPrice = Math.min(...product.variants.map((v) => v.price));
              const primaryVariant = product.variants[0];

              return (
                <div
                  key={product.id}
                  className="group bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-slate-950">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                          {product.category}
                        </span>
                      </div>

                      {/* Best seller or Stock tag */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        {product.reviewsCount > 350 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-600 text-white flex items-center space-x-1 shadow">
                            <Flame className="w-2.5 h-2.5" />
                            <span>Best Seller</span>
                          </span>
                        )}
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/90 text-white shadow">
                          In Stock ({primaryVariant.stock} left)
                        </span>
                      </div>

                      {/* Quick view button on hover */}
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="absolute bottom-2 right-2 bg-slate-900/90 hover:bg-orange-600 text-white p-2 rounded-xl text-xs font-semibold backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 shadow-lg"
                        title="Quick Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Quick View</span>
                      </button>
                    </div>

                    {/* Body Content */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center space-x-1 text-amber-400 text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold">{product.rating}</span>
                        <span className="text-slate-500">({product.reviewsCount} reviews)</span>
                      </div>

                      <h3 
                        onClick={() => openProduct(product)}
                        className="font-bold text-white text-sm line-clamp-2 cursor-pointer group-hover:text-orange-400 transition-colors"
                      >
                        {product.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="p-4 pt-0 border-t border-slate-800/80 mt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Retail Price</span>
                      <span className="text-lg font-extrabold text-white">${startingPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => buyNow(product, primaryVariant)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-2.5 py-2 rounded-xl transition-all"
                        title="Instant Buy Now"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => openProduct(product)}
                        className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center space-x-1 shadow-md shadow-orange-600/20"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View Mode */
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const startingPrice = Math.min(...product.variants.map((v) => v.price));
              const primaryVariant = product.variants[0];

              return (
                <div
                  key={product.id}
                  className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-950 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                        <div className="flex items-center text-amber-400 text-xs">
                          <Star className="w-3 h-3 fill-current mr-0.5" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <h4 
                        onClick={() => openProduct(product)}
                        className="font-bold text-white text-sm cursor-pointer hover:text-orange-400"
                      >
                        {product.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-white">${startingPrice.toFixed(2)}</div>
                      <span className="text-[10px] text-emerald-400 font-semibold">Fast US Delivery</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => addToCart(product, primaryVariant)}
                        className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center space-x-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                      <button
                        onClick={() => openProduct(product)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex gap-4">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.title}
                className="w-32 h-32 rounded-2xl object-cover bg-slate-950 shrink-0"
              />
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-orange-400 uppercase">{quickViewProduct.category}</span>
                <h3 className="font-bold text-sm text-white">{quickViewProduct.title}</h3>
                <div className="text-base font-black text-white font-mono">
                  ${quickViewProduct.variants[0]?.price.toFixed(2)}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{quickViewProduct.description}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => addToCart(quickViewProduct, quickViewProduct.variants[0])}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => {
                  openProduct(quickViewProduct);
                  setQuickViewProduct(null);
                }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Full Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Product Detail Modal (PDP) */}
      {activeProductModal && selectedVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveProductModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden aspect-square bg-slate-950 border border-slate-800">
                  <img
                    src={activeProductModal.image}
                    alt={activeProductModal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Free shipping & guarantee badges inside PDP */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Free US Tracked Delivery (3–7 Days)</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-amber-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>30-Day Wag-Back Money Guarantee</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                    {activeProductModal.category}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1 leading-snug">
                    {activeProductModal.title}
                  </h2>
                  <div className="flex items-center space-x-1.5 text-amber-400 text-xs mt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold">{activeProductModal.rating}</span>
                    <span className="text-slate-400">({activeProductModal.reviewsCount} verified reviews)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-white">${selectedVariant.price.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 line-through">${(selectedVariant.price * 1.35).toFixed(2)}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      In Stock ({selectedVariant.stock} available)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct courier delivery with real-time tracking code sent via email.
                  </p>
                </div>

                {/* Variant Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Select Size / Option:
                  </label>
                  <div className="space-y-1.5">
                    {activeProductModal.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          selectedVariant.id === variant.id
                            ? 'bg-orange-600/15 border-orange-500 text-white font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{variant.name}</span>
                        <span className="font-mono">${variant.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-300">Why Dogs & Owners Love It:</span>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {activeProductModal.benefits.map((b, i) => (
                      <li key={i} className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons: Add to Cart and Buy Now */}
                <div className="pt-2 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(activeProductModal, selectedVariant)}
                      className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-orange-600/30 transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={() => buyNow(activeProductModal, selectedVariant)}
                      className="px-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition-all"
                    >
                      Buy Now
                    </button>
                  </div>
                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Guaranteed Safe & Secure 256-Bit Encrypted Checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-Out Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 text-white flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-orange-400" />
                  <h3 className="font-bold text-white text-base">Your Dog Care Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">
                    {remainingForFreeShipping > 0
                      ? `Add $${remainingForFreeShipping.toFixed(2)} more for FREE Express Shipping!`
                      : '🎉 You have unlocked FREE Express Delivery!'}
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{freeShippingPercentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${freeShippingPercentage}%` }}
                  />
                </div>
              </div>

              {/* Cart Items */}
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Your cart is empty. Pick some dog gear!
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.variant.id}
                      className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3 text-xs"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">{item.product.title}</h4>
                        <p className="text-[11px] text-slate-400">{item.variant.name}</p>
                        <p className="font-mono text-orange-400 font-bold mt-0.5">
                          ${item.variant.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => updateQuantity(item.variant.id, -1)}
                          className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-300 hover:bg-slate-700"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variant.id, 1)}
                          className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-300 hover:bg-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Coupon Code Field */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (e.g. PUPPY10)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder-slate-600 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-400">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] text-emerald-400">{couponSuccess}</p>}
              </form>

              {/* Shipping Address Form */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center space-x-1 text-slate-300 font-bold">
                  <Truck className="w-3.5 h-3.5 text-orange-400" />
                  <span>Customer Shipping Address</span>
                </div>
                <div className="space-y-1.5 text-slate-400">
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Recipient Full Name"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                  <input
                    type="email"
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    placeholder="Email for tracking updates"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                  <input
                    type="text"
                    value={address.street1}
                    onChange={(e) => setAddress({ ...address, street1: e.target.value })}
                    placeholder="Street Address (No PO Boxes for courier delivery)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="State"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      placeholder="Zip Code"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Pricing & Submit */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${rawSubtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP 10% Discount</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Tracked US Courier Shipping</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800">
                  <span>Total</span>
                  <span className="font-mono text-orange-400">${cartSubtotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 disabled:opacity-40 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Complete Order (${cartSubtotal.toFixed(2)})</span>
              </button>

              <div className="flex items-center justify-center space-x-3 text-[10px] text-slate-500 pt-1">
                <span>✓ Visa / Mastercard / Amex</span>
                <span>•</span>
                <span>✓ Apple Pay</span>
                <span>•</span>
                <span>✓ 30-Day Wag Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Order Confirmation Screen */}
      {orderConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-md w-full p-6 text-white text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Payment Confirmed
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Your Dog's Gear Is On The Way! 🐾
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                We have received your order. A confirmation receipt has been dispatched to{' '}
                <strong className="text-white">{orderConfirmation.email}</strong>.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-orange-400">{orderConfirmation.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Processing for Courier Dispatch</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Paid:</span>
                <span className="font-mono text-white">${orderConfirmation.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setOrderConfirmation(null);
                  onOpenTracking();
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-orange-600/20"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track This Order</span>
              </button>
              <button
                onClick={() => setOrderConfirmation(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GDPR Cookie Consent Banner */}
      {!cookieConsentDismissed && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-40 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl text-xs text-slate-300 space-y-2.5 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center space-x-2 font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>We value your canine privacy</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            We use essential cookies for cart persistence, secure Stripe payment processing, and delivery status tracking. We never sell personal information.
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={dismissCookies}
              className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all"
            >
              Accept Cookies
            </button>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="text-slate-400 hover:text-white underline text-xs px-2 py-1"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
