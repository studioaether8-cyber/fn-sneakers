import React, { useState } from 'react';
import { SNEAKERS, formatRub } from '../data/sneakers';
import {
  CheckIcon,
  CloseIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
} from './Icons';

export default function CartDrawer({
  isOpen,
  initialTab,
  cartItems,
  wishlistIds,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onAddWishlistToCart,
  onToggleWishlistId,
  onJumpToColorway,
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'cart');
  const [step, setStep] = useState('bag'); // 'bag' | 'checkout' | 'success'
  const [orderNumber, setOrderNumber] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    city: '',
    address: '',
    delivery: 'courier',
    payment: 'sbp',
  });
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
      if (initialTab === 'cart' && step === 'success' && cartItems.length > 0) {
        setStep('bag');
      }
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const oldTotal = cartItems.reduce((acc, item) => acc + item.oldPrice * item.qty, 0);
  const savings = Math.max(0, oldTotal - subtotal);
  const totalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const wishlistShoes = SNEAKERS.filter((s) => wishlistIds.includes(s.id));

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.address.trim()) {
      setFormError('Заполните имя, телефон или Telegram и адрес доставки.');
      return;
    }
    setFormError('');
    const num = `FN-${Math.floor(1000 + Math.random() * 8999)}`;
    setOrderNumber(num);
    setOrderSummary({
      items: [...cartItems],
      total: subtotal,
      delivery: form.delivery === 'courier' ? 'Курьером до двери' : 'ПВЗ СДЭК',
      name: form.name.trim(),
      contact: form.contact.trim(),
      address: `${form.city.trim() ? `${form.city.trim()}, ` : ''}${form.address.trim()}`,
    });
    onClearCart();
    setStep('success');
  };

  const resetAndBrowse = () => {
    setStep('bag');
    onClose();
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Корзина и избранное"
      >
        <div className="drawer-top">
          <div className="drawer-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'cart'}
              className={`drawer-tab ${activeTab === 'cart' ? 'is-active' : ''}`}
              onClick={() => {
                setActiveTab('cart');
                if (step === 'success' && cartItems.length > 0) setStep('bag');
              }}
            >
              Корзина ({totalCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'wishlist'}
              className={`drawer-tab ${activeTab === 'wishlist' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              Избранное ({wishlistShoes.length})
            </button>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Закрыть панель"
          >
            <CloseIcon size={17} />
          </button>
        </div>

        <div className="drawer-body">
          {activeTab === 'wishlist' ? (
            wishlistShoes.length === 0 ? (
              <div className="drawer-empty">
                <div className="drawer-empty-icon">
                  <HeartIcon size={26} />
                </div>
                <h3>В избранном пока пусто</h3>
                <p>Нажмите на иконку сердца в шапке, чтобы сохранить понравившуюся расцветку.</p>
              </div>
            ) : (
              <div className="wishlist-list">
                {wishlistShoes.map((shoe) => (
                  <div key={shoe.id} className="drawer-item">
                    <div
                      className="drawer-thumb"
                      style={{ background: shoe.cardGlow }}
                    >
                      <img src={shoe.image} alt={shoe.name} />
                    </div>
                    <div className="drawer-item-info">
                      <div className="drawer-item-head">
                        <strong>{shoe.name}</strong>
                        <button
                          type="button"
                          className="icon-text-btn"
                          onClick={() => onToggleWishlistId(shoe.id)}
                          aria-label={`Удалить ${shoe.name} из избранного`}
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                      <span className="drawer-item-sub">{shoe.colorRu}</span>
                      <div className="wishlist-actions">
                        <span className="drawer-item-price">{formatRub(shoe.price)}</span>
                        <div className="wishlist-btns">
                          <button
                            type="button"
                            className="ghost-mini-btn"
                            onClick={() => {
                              onJumpToColorway(shoe.id);
                              onClose();
                            }}
                          >
                            Смотреть
                          </button>
                          <button
                            type="button"
                            className="solid-mini-btn"
                            onClick={() => {
                              onAddWishlistToCart(shoe);
                              setActiveTab('cart');
                              setStep('bag');
                            }}
                          >
                            В корзину
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : step === 'success' && orderSummary ? (
            <div className="order-success">
              <div className="success-check">
                <CheckIcon size={26} />
              </div>
              <span className="success-tag">Заказ подтверждён</span>
              <h3>Заказ #{orderNumber} оформлен</h3>
              <p className="success-sub">
                Мы уже резервируем вашу пару и отправили детали на {orderSummary.contact}.
              </p>

              <div className="success-receipt">
                <div className="receipt-row">
                  <span>Получатель</span>
                  <strong>{orderSummary.name}</strong>
                </div>
                <div className="receipt-row">
                  <span>Доставка</span>
                  <strong>{orderSummary.delivery}</strong>
                </div>
                <div className="receipt-row">
                  <span>Адрес</span>
                  <strong>{orderSummary.address}</strong>
                </div>
                <div className="receipt-divider" />
                {orderSummary.items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="receipt-row">
                    <span>
                      {item.name} · EU {item.size} × {item.qty}
                    </span>
                    <strong>{formatRub(item.price * item.qty)}</strong>
                  </div>
                ))}
                <div className="receipt-divider" />
                <div className="receipt-row receipt-total">
                  <span>Оплачено / к оплате</span>
                  <strong>{formatRub(orderSummary.total)}</strong>
                </div>
              </div>

              <button
                type="button"
                className="drawer-primary-btn"
                onClick={resetAndBrowse}
              >
                Вернуться к коллекции
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="drawer-empty">
              <div className="drawer-empty-icon">FN</div>
              <h3>Корзина пуста</h3>
              <p>Выберите размер и нажмите «Купить пару», чтобы оформить заказ на кроссовки FN Studio.</p>
              <button type="button" className="drawer-secondary-btn" onClick={onClose}>
                Выбрать расцветку
              </button>
            </div>
          ) : step === 'checkout' ? (
            <form className="checkout-form" onSubmit={handlePlaceOrder} noValidate>
              <div className="checkout-head">
                <button
                  type="button"
                  className="back-link-btn"
                  onClick={() => setStep('bag')}
                >
                  ← Назад в корзину
                </button>
                <span className="checkout-sum">{formatRub(subtotal)}</span>
              </div>

              <label className="field-group">
                <span>Имя и фамилия</span>
                <input
                  type="text"
                  placeholder="Адам Смирнов"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <label className="field-group">
                <span>Телефон или Telegram</span>
                <input
                  type="text"
                  placeholder="+7 (999) 123-45-67 или @username"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                />
              </label>

              <div className="field-row-2">
                <label className="field-group">
                  <span>Город</span>
                  <input
                    type="text"
                    placeholder="Москва"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </label>

                <label className="field-group">
                  <span>Адрес или ПВЗ</span>
                  <input
                    type="text"
                    placeholder="ул. Тверская, 12"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </label>
              </div>

              <div className="field-group">
                <span>Способ доставки</span>
                <div className="choice-pills">
                  <button
                    type="button"
                    className={`choice-pill ${form.delivery === 'courier' ? 'is-active' : ''}`}
                    onClick={() => setForm({ ...form, delivery: 'courier' })}
                  >
                    Курьером · Бесплатно
                  </button>
                  <button
                    type="button"
                    className={`choice-pill ${form.delivery === 'cdek' ? 'is-active' : ''}`}
                    onClick={() => setForm({ ...form, delivery: 'cdek' })}
                  >
                    СДЭК ПВЗ · Бесплатно
                  </button>
                </div>
              </div>

              <div className="field-group">
                <span>Оплата</span>
                <div className="choice-pills">
                  <button
                    type="button"
                    className={`choice-pill ${form.payment === 'sbp' ? 'is-active' : ''}`}
                    onClick={() => setForm({ ...form, payment: 'sbp' })}
                  >
                    СБП / Картой онлайн
                  </button>
                  <button
                    type="button"
                    className={`choice-pill ${form.payment === 'cod' ? 'is-active' : ''}`}
                    onClick={() => setForm({ ...form, payment: 'cod' })}
                  >
                    При получении
                  </button>
                </div>
              </div>

              {formError && <p className="form-error">{formError}</p>}

              <button type="submit" className="drawer-primary-btn">
                Подтвердить заказ · {formatRub(subtotal)}
              </button>
            </form>
          ) : (
            <>
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="drawer-item">
                    <div
                      className="drawer-thumb"
                      style={{ background: item.cardGlow }}
                    >
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="drawer-item-info">
                      <div className="drawer-item-head">
                        <strong>{item.name}</strong>
                        <button
                          type="button"
                          className="icon-text-btn"
                          onClick={() => onRemoveItem(item.id, item.size)}
                          aria-label={`Удалить ${item.name}`}
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                      <span className="drawer-item-sub">
                        {item.colorRu} · Размер EU {item.size}
                      </span>

                      <div className="drawer-item-bottom">
                        <div className="qty-control">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, item.size, -1)}
                            aria-label="Уменьшить количество"
                          >
                            <MinusIcon size={12} />
                          </button>
                          <span>{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, item.size, 1)}
                            aria-label="Увеличить количество"
                          >
                            <PlusIcon size={12} />
                          </button>
                        </div>

                        <div className="drawer-price-col">
                          <span className="drawer-item-price">
                            {formatRub(item.price * item.qty)}
                          </span>
                          <span className="drawer-item-old">
                            {formatRub(item.oldPrice * item.qty)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="drawer-perks">
                <div>
                  <TruckIcon size={15} />
                  <span>Бесплатная доставка и примерка по РФ</span>
                </div>
                <div>
                  <ShieldIcon size={15} />
                  <span>14 дней на возврат без лишних вопросов</span>
                </div>
              </div>

              <div className="drawer-summary">
                {savings > 0 && (
                  <div className="summary-row summary-savings">
                    <span>Ваша выгода</span>
                    <span>−{formatRub(savings)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Доставка</span>
                  <span>0 ₽</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Итого</span>
                  <strong>{formatRub(subtotal)}</strong>
                </div>

                <button
                  type="button"
                  className="drawer-primary-btn"
                  onClick={() => setStep('checkout')}
                >
                  Оформить заказ
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
