import React, { useCallback, useEffect, useState } from 'react';
import CartDrawer from './components/CartDrawer';
import Header from './components/Header';
import HeroStage from './components/HeroStage';
import OverlayModals from './components/OverlayModals';
import { SNEAKERS } from './data/sneakers';

const STORAGE_CART_KEY = 'fn_studio_cart_v1';
const STORAGE_WISHLIST_KEY = 'fn_studio_wishlist_v1';

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionDir, setTransitionDir] = useState('next');
  const [transitionKey, setTransitionKey] = useState(0);
  const [selectedSize, setSelectedSize] = useState(41);

  const [activeModal, setActiveModal] = useState(null); // null | 'catalog' | 'about' | 'contacts'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('cart');
  const [toast, setToast] = useState('');

  const [cartItems, setCartItems] = useState(() => readStorage(STORAGE_CART_KEY, []));
  const [wishlistIds, setWishlistIds] = useState(() => readStorage(STORAGE_WISHLIST_KEY, []));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(wishlistIds));
    } catch {
      // ignore storage errors
    }
  }, [wishlistIds]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  const currentShoe = SNEAKERS[activeIndex];
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const isCurrentWishlisted = wishlistIds.includes(currentShoe.id);

  const goNext = useCallback(() => {
    setTransitionDir('next');
    setTransitionKey((k) => k + 1);
    setActiveIndex((idx) => (idx + 1) % SNEAKERS.length);
  }, []);

  const goPrev = useCallback(() => {
    setTransitionDir('prev');
    setTransitionKey((k) => k + 1);
    setActiveIndex((idx) => (idx - 1 + SNEAKERS.length) % SNEAKERS.length);
  }, []);

  const goToIndex = useCallback(
    (targetIdx) => {
      if (targetIdx === activeIndex) return;
      const forwardDist = (targetIdx - activeIndex + SNEAKERS.length) % SNEAKERS.length;
      const backwardDist = (activeIndex - targetIdx + SNEAKERS.length) % SNEAKERS.length;
      setTransitionDir(forwardDist <= backwardDist ? 'next' : 'prev');
      setTransitionKey((k) => k + 1);
      setActiveIndex(targetIdx);
    },
    [activeIndex]
  );

  const addToCart = useCallback((shoe, size, openDrawerAfter = true) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === shoe.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === shoe.id && item.size === size
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: shoe.id,
          name: shoe.name,
          colorRu: shoe.colorRu,
          price: shoe.price,
          oldPrice: shoe.oldPrice,
          image: shoe.image,
          cardGlow: shoe.cardGlow,
          size,
          qty: 1,
        },
      ];
    });
    setToast(`${shoe.name} (EU ${size}) добавлены в корзину`);
    if (openDrawerAfter) {
      setDrawerTab('cart');
      setDrawerOpen(true);
    }
  }, []);

  const updateCartQty = useCallback((id, size, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }, []);

  const removeCartItem = useCallback((id, size) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  }, []);

  const toggleWishlistId = useCallback((id) => {
    const shoe = SNEAKERS.find((s) => s.id === id);
    setWishlistIds((prev) => {
      const exists = prev.includes(id);
      if (shoe) {
        setToast(
          exists
            ? `${shoe.name} удалены из избранного`
            : `${shoe.name} сохранены в избранное`
        );
      }
      return exists ? prev.filter((x) => x !== id) : [...prev, id];
    });
  }, []);

  const handleSelectNav = (navId) => {
    if (navId === 'hero') {
      setActiveModal(null);
      return;
    }
    setActiveModal((prev) => (prev === navId ? null : navId));
  };

  return (
    <div
      className={`app-viewport ${currentShoe.isLightBackdrop ? 'theme-light-backdrop' : ''}`}
    >
      {/* Crossfading studio background layers */}
      <div className="bg-layers" aria-hidden="true">
        {SNEAKERS.map((item, idx) => (
          <div
            key={item.id}
            className={`bg-layer ${idx === activeIndex ? 'is-visible' : ''}`}
            style={{ background: item.theme }}
          />
        ))}
        <div className="bg-vignette" />
        <svg className="bg-grain" width="100%" height="100%">
          <filter id="fnStudioGrain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.78"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#fnStudioGrain)" />
        </svg>
      </div>

      <div className="stage-container">
        <Header
          activeModal={activeModal}
          onSelectNav={handleSelectNav}
          cartCount={cartCount}
          wishlistCount={wishlistIds.length}
          isCurrentWishlisted={isCurrentWishlisted}
          onOpenCart={(tab) => {
            setDrawerTab(tab || 'cart');
            setDrawerOpen(true);
          }}
          onToggleWishlist={() => toggleWishlistId(currentShoe.id)}
        />

        <HeroStage
          activeIndex={activeIndex}
          transitionDir={transitionDir}
          transitionKey={transitionKey}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onPrev={goPrev}
          onNext={goNext}
          onGoToIndex={goToIndex}
          onBuyNow={() => addToCart(currentShoe, selectedSize, true)}
        />
      </div>

      <OverlayModals
        activeModal={activeModal}
        activeShoe={currentShoe}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onClose={() => setActiveModal(null)}
        onSelectColorway={goToIndex}
        onAddToCart={(shoe, size) => addToCart(shoe, size, true)}
      />

      <CartDrawer
        isOpen={drawerOpen}
        initialTab={drawerTab}
        cartItems={cartItems}
        wishlistIds={wishlistIds}
        onClose={() => setDrawerOpen(false)}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeCartItem}
        onClearCart={() => setCartItems([])}
        onAddWishlistToCart={(shoe) => addToCart(shoe, selectedSize, false)}
        onToggleWishlistId={toggleWishlistId}
        onJumpToColorway={(id) => {
          const idx = SNEAKERS.findIndex((s) => s.id === id);
          if (idx >= 0) goToIndex(idx);
        }}
      />

      {toast && (
        <div className="studio-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
