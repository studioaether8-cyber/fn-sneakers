import React, { useState } from 'react';
import { SIZES, SNEAKERS, formatRub } from '../data/sneakers';
import { CheckIcon, CloseIcon, ShieldIcon, TruckIcon } from './Icons';

export default function OverlayModals({
  activeModal,
  activeShoe,
  selectedSize,
  onSelectSize,
  onClose,
  onSelectColorway,
  onAddToCart,
}) {
  const [cardSizes, setCardSizes] = useState(() =>
    Object.fromEntries(SNEAKERS.map((s) => [s.id, selectedSize || 41]))
  );
  const [contactForm, setContactForm] = useState({ name: '', contact: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  if (!activeModal) return null;

  const handleCardSize = (shoeId, size) => {
    setCardSizes((prev) => ({ ...prev, [shoeId]: size }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.contact.trim()) return;
    setContactSent(true);
    setContactForm({ name: '', contact: '', message: '' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`modal-shell modal-shell--${activeModal}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={
          activeModal === 'catalog'
            ? 'Все расцветки FN Studio'
            : activeModal === 'about'
              ? 'О модели FN Studio'
              : 'Контакты'
        }
      >
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">
              {activeModal === 'catalog'
                ? 'КОЛЛЕКЦИЯ · 5 РАСЦВЕТОК'
                : activeModal === 'about'
                  ? 'АРХИТЕКТУРА СИЛУЭТА'
                  : 'СВЯЗЬ И ШОУРУМ'}
            </span>
            <h2 className="modal-title">
              {activeModal === 'catalog'
                ? 'Все цвета модели FN Mid'
                : activeModal === 'about'
                  ? 'Инженерия силуэта FN'
                  : 'Контакты и сервис'}
            </h2>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Закрыть окно"
          >
            <CloseIcon size={17} />
          </button>
        </div>

        {activeModal === 'catalog' && (
          <div className="catalog-grid">
            {SNEAKERS.map((shoe, idx) => {
              const chosenSize = cardSizes[shoe.id] || 41;
              const isHeroActive = shoe.id === activeShoe.id;
              return (
                <article
                  key={shoe.id}
                  className={`catalog-card ${isHeroActive ? 'is-current' : ''}`}
                >
                  <button
                    type="button"
                    className="catalog-card__visual"
                    style={{ background: shoe.cardGlow }}
                    onClick={() => {
                      onSelectColorway(idx);
                      onClose();
                    }}
                    aria-label={`Открыть ${shoe.name} на главном экране`}
                  >
                    <span className="catalog-card__index">{shoe.indexLabel}</span>
                    <img src={shoe.image} alt={shoe.name} draggable="false" />
                    <span className="catalog-card__shadow" aria-hidden="true" />
                  </button>

                  <div className="catalog-card__body">
                    <div className="catalog-card__top">
                      <div>
                        <h3>{shoe.name}</h3>
                        <p>{shoe.colorRu}</p>
                      </div>
                      <div className="catalog-card__prices">
                        <strong>{formatRub(shoe.price)}</strong>
                        <span>{formatRub(shoe.oldPrice)}</span>
                      </div>
                    </div>

                    <div className="catalog-card__sizes" role="group" aria-label={`Размер для ${shoe.name}`}>
                      {SIZES.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          className={`mini-size-btn ${chosenSize === sz ? 'is-selected' : ''}`}
                          onClick={() => handleCardSize(shoe.id, sz)}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <div className="catalog-card__actions">
                      <button
                        type="button"
                        className="ghost-card-btn"
                        onClick={() => {
                          onSelectColorway(idx);
                          onClose();
                        }}
                      >
                        Смотреть
                      </button>
                      <button
                        type="button"
                        className="solid-card-btn"
                        onClick={() => {
                          onSelectSize(chosenSize);
                          onAddToCart(shoe, chosenSize);
                        }}
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {activeModal === 'about' && (
          <div className="about-layout">
            <div className="about-visual" style={{ background: activeShoe.cardGlow }}>
              <img src={activeShoe.image} alt={activeShoe.name} draggable="false" />
              <div className="about-visual__caption">
                <span>Активная расцветка</span>
                <strong>
                  {activeShoe.name} — {activeShoe.colorRu}
                </strong>
              </div>
            </div>

            <div className="about-specs">
              <p className="about-lead">
                Силуэт <strong>FN Studio Mid</strong> объединяет скульптурные баскетбольные пропорции и
                повседневный комфорт: выразительные волновые накладки из гладкой матовой кожи фиксируют стопу,
                а дышащие сетчатые секции поддерживают вентиляцию в течение всего дня.
              </p>

              <div className="spec-cards">
                <div className="spec-item">
                  <span className="spec-num">01</span>
                  <div>
                    <h4>Анатомический высокий ворот</h4>
                    <p>Мягкая многослойная набивка в области голеностопа и текстильные петли с двойной строчкой.</p>
                  </div>
                </div>
                <div className="spec-item">
                  <span className="spec-num">02</span>
                  <div>
                    <h4>Каркас с волновыми рёбрами</h4>
                    <p>Фирменная бумеранг-накладка и усиленные боковые окна удерживают форму без заломов.</p>
                  </div>
                </div>
                <div className="spec-item">
                  <span className="spec-num">03</span>
                  <div>
                    <h4>Фасетная межподошва</h4>
                    <p>Скульптурная пена двойной плотности смягчает шаг и стабилизирует пятку на асфальте.</p>
                  </div>
                </div>
                <div className="spec-item">
                  <span className="spec-num">04</span>
                  <div>
                    <h4>Треугольный протектор</h4>
                    <p>Рельефная резиновая подмётка с зацепом на носок обеспечивает уверенное сцепление.</p>
                  </div>
                </div>
              </div>

              <div className="about-footer-bar">
                <div>
                  <TruckIcon size={16} />
                  <span>Отправка за 24 часа</span>
                </div>
                <div>
                  <ShieldIcon size={16} />
                  <span>Гарантия качества и возврат 14 дней</span>
                </div>
                <button
                  type="button"
                  className="solid-card-btn"
                  onClick={() => {
                    onAddToCart(activeShoe, selectedSize);
                    onClose();
                  }}
                >
                  Купить {activeShoe.name} · EU {selectedSize}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'contacts' && (
          <div className="contacts-layout">
            <div className="contacts-info">
              <div className="contact-block">
                <span>Шоурум и самовывоз</span>
                <strong>Москва, ул. Большая Никитская, 24с1</strong>
                <p>Ежедневно с 11:00 до 21:00. Примерка всех 5 расцветок в наличии.</p>
              </div>

              <div className="contact-block">
                <span>Онлайн-поддержка и заказы</span>
                <strong>@fn_studio_support · +7 (495) 018-44-20</strong>
                <p>hello@fnstudio.store — подбор размера по длине стопы за 5 минут.</p>
              </div>

              <div className="contact-block">
                <span>Доставка и обмен</span>
                <strong>Бесплатно курьером или в ПВЗ СДЭК</strong>
                <p>Оплата при получении или онлайн по СБП. Обмен размера в течение 14 дней.</p>
              </div>
            </div>

            <div className="contact-form-card">
              {contactSent ? (
                <div className="contact-sent">
                  <div className="success-check">
                    <CheckIcon size={24} />
                  </div>
                  <h3>Сообщение отправлено</h3>
                  <p>Менеджер FN Studio ответит вам в течение 15 минут.</p>
                  <button
                    type="button"
                    className="solid-card-btn"
                    onClick={() => setContactSent(false)}
                  >
                    Написать ещё
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <h3>Быстрый вопрос по модели</h3>
                  <label className="field-group">
                    <span>Ваше имя</span>
                    <input
                      type="text"
                      required
                      placeholder="Как к вам обращаться"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </label>
                  <label className="field-group">
                    <span>Telegram или телефон</span>
                    <input
                      type="text"
                      required
                      placeholder="@username или +7..."
                      value={contactForm.contact}
                      onChange={(e) => setContactForm({ ...contactForm, contact: e.target.value })}
                    />
                  </label>
                  <label className="field-group">
                    <span>Вопрос (размер, доставка, расцветка)</span>
                    <textarea
                      rows={3}
                      placeholder="Например: подскажите размер на стопу 27 см"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                  </label>
                  <button type="submit" className="drawer-primary-btn">
                    Отправить сообщение
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
