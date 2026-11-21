import React from 'react';
import { CartIcon, HeartIcon } from './Icons';

const NAV_ITEMS = [
  { id: 'hero', label: 'КРОССОВКИ' },
  { id: 'catalog', label: 'ВСЕ ЦВЕТА' },
  { id: 'about', label: 'О МОДЕЛИ' },
  { id: 'contacts', label: 'КОНТАКТЫ' },
];

export default function Header({
  activeModal,
  onSelectNav,
  cartCount,
  wishlistCount,
  isCurrentWishlisted,
  onOpenCart,
  onToggleWishlist,
}) {
  return (
    <header className="site-header">
      <button
        type="button"
        className="brand-mark"
        onClick={() => onSelectNav('hero')}
        aria-label="FN STUDIO — на главную"
      >
        <span className="brand-badge">FN</span>
        <span className="brand-name">FN STUDIO</span>
      </button>

      <nav className="pill-nav" aria-label="Основная навигация">
        {NAV_ITEMS.map((item) => {
          const isActive =
            (item.id === 'hero' && !activeModal) || activeModal === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`pill-nav__item ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectNav(item.id)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="icon-circle-btn"
          onClick={() => onOpenCart('cart')}
          aria-label={`Открыть корзину (${cartCount})`}
        >
          <CartIcon size={17} />
          {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
        </button>

        <button
          type="button"
          className={`icon-circle-btn ${isCurrentWishlisted ? 'is-liked' : ''}`}
          onClick={onToggleWishlist}
          onDoubleClick={() => onOpenCart('wishlist')}
          aria-label={
            isCurrentWishlisted
              ? 'Убрать текущую модель из избранного'
              : 'Добавить текущую модель в избранное'
          }
          title="Добавить в избранное (или откройте список в корзине)"
        >
          <HeartIcon size={17} filled={isCurrentWishlisted} />
          {wishlistCount > 0 && <span className="icon-dot" />}
        </button>
      </div>
    </header>
  );
}
