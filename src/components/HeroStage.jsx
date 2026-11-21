import React, { useEffect, useRef, useState } from 'react';
import { SIZE_CHART, SNEAKERS, formatRub } from '../data/sneakers';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InstagramIcon,
  TelegramIcon,
  VkIcon,
  YoutubeIcon,
} from './Icons';

export default function HeroStage({
  activeIndex,
  transitionDir,
  transitionKey,
  selectedSize,
  onSelectSize,
  onPrev,
  onNext,
  onGoToIndex,
  onBuyNow,
}) {
  const current = SNEAKERS[activeIndex];
  const nextIndex = (activeIndex + 1) % SNEAKERS.length;
  const nextShoe = SNEAKERS[nextIndex];

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const stageRef = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onNext, onPrev]);

  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({
      rx: Number((-ny * 3).toFixed(2)),
      ry: Number((nx * 3.5).toFixed(2)),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 48) {
      if (delta < 0) onNext();
      else onPrev();
    }
    touchStartX.current = null;
  };

  const prevIndex =
    transitionDir === 'next'
      ? (activeIndex - 1 + SNEAKERS.length) % SNEAKERS.length
      : (activeIndex + 1) % SNEAKERS.length;
  const outgoingShoe = transitionKey > 0 ? SNEAKERS[prevIndex] : null;

  return (
    <main
      className="hero-stage"
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left Column */}
      <section className="hero-left" aria-label="Описание расцветки">
        <div className="carousel-controls-row">
          <div className="carousel-arrows">
            <button
              type="button"
              className="arrow-circle-btn"
              onClick={onPrev}
              aria-label="Предыдущая расцветка"
            >
              <ChevronLeftIcon size={15} />
            </button>
            <button
              type="button"
              className="arrow-circle-btn"
              onClick={onNext}
              aria-label="Следующая расцветка"
            >
              <ChevronRightIcon size={15} />
            </button>
          </div>
          <span className="slide-counter">
            {current.indexLabel} / 0{SNEAKERS.length} · {current.name.toUpperCase()}
          </span>
        </div>

        <div key={`copy-${current.id}`} className="hero-copy-animate">
          <h1 className="hero-headline">
            <span>{current.headlineLine1}</span>
            <span>{current.headlineLine2}</span>
          </h1>

          <p className="hero-description">{current.description}</p>
        </div>

        <button
          type="button"
          className="cta-pill-btn"
          onClick={onBuyNow}
        >
          <span>Купить пару</span>
          <ChevronRightIcon size={14} />
        </button>
      </section>

      {/* Center Product Stage */}
      <section className="hero-center" aria-label="Превью кроссовка">
        <div className="sneaker-stage-box">
          {outgoingShoe && (
            <div
              key={`out-${transitionKey}`}
              className={`sneaker-flight sneaker-flight--out-${transitionDir}`}
              aria-hidden="true"
            >
              <img
                src={outgoingShoe.image}
                alt=""
                className="sneaker-hero-img"
                draggable="false"
              />
            </div>
          )}

          <div
            key={`in-${current.id}-${transitionKey}`}
            className={`sneaker-flight ${
              transitionKey > 0 ? `sneaker-flight--in-${transitionDir}` : 'sneaker-flight--initial'
            }`}
          >
            <div
              className="sneaker-levitate"
              style={{
                transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              }}
            >
              <img
                src={current.image}
                alt={`Кроссовки FN Studio — ${current.name} (${current.colorRu})`}
                className="sneaker-hero-img"
                draggable="false"
              />
            </div>
          </div>

          <div className="sneaker-floor-shadow" aria-hidden="true" />
        </div>

        <div className="center-bottom-meta">
          <p key={`tag-${current.id}`} className="hero-motto">
            <span>{current.taglineLine1}</span>
            <span>{current.taglineLine2}</span>
          </p>

          <div className="colorway-dots" role="tablist" aria-label="Переключение цветов">
            {SNEAKERS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`Цвет ${item.name}`}
                className={`colorway-dot ${idx === activeIndex ? 'is-active' : ''}`}
                onClick={() => onGoToIndex(idx)}
                title={`${item.name} — ${item.colorRu}`}
              >
                <span
                  className="colorway-dot__swatch"
                  style={{ backgroundColor: item.swatchHex }}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Right Column */}
      <section className="hero-right" aria-label="Цена и выбор размера">
        <div className="right-purchase-stack">
          <div key={`price-${current.id}`} className="price-stack">
            <span className="price-current">{formatRub(current.price)}</span>
            <span className="price-old">{formatRub(current.oldPrice)}</span>
          </div>

          <div className="size-block">
            <div className="size-label-row">
              <span className="size-label">Выберите размер:</span>
              <button
                type="button"
                className="size-guide-trigger"
                onClick={() => setShowSizeGuide((prev) => !prev)}
              >
                Таблица
              </button>
            </div>

            <div className="size-pills" role="radiogroup" aria-label="Размер EU">
              {current.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`size-circle-btn ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => onSelectSize(size)}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {showSizeGuide && (
              <div className="size-guide-popover" role="dialog" aria-label="Таблица размеров">
                <div className="size-guide-header">
                  <span>Сетка размеров</span>
                  <button
                    type="button"
                    className="size-guide-close"
                    onClick={() => setShowSizeGuide(false)}
                    aria-label="Закрыть таблицу"
                  >
                    ×
                  </button>
                </div>
                <div className="size-guide-grid">
                  <span>EU</span>
                  <span>RU</span>
                  <span>Стопа</span>
                  {SIZE_CHART.map((row) => (
                    <React.Fragment key={row.eu}>
                      <strong>{row.eu}</strong>
                      <span>{row.ru}</span>
                      <span>{row.cm}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom-Right Next Colorway Miniature Preview */}
        <button
          type="button"
          className="next-preview-btn"
          onClick={onNext}
          aria-label={`Следующий цвет: ${nextShoe.name}`}
        >
          <span className="next-preview-tooltip">
            Следующий: <strong>{nextShoe.name}</strong>
          </span>
          <img
            src={nextShoe.image}
            alt={`Следующий цвет ${nextShoe.name}`}
            className="next-preview-img"
            draggable="false"
          />
          <span className="next-preview-shadow" aria-hidden="true" />
        </button>
      </section>

      {/* Bottom-Left Social Links */}
      <footer className="hero-socials" aria-label="Социальные сети">
        <a href="#telegram" onClick={(e) => e.preventDefault()} aria-label="Telegram" title="Telegram">
          <TelegramIcon size={15} />
        </a>
        <a href="#instagram" onClick={(e) => e.preventDefault()} aria-label="Instagram" title="Instagram">
          <InstagramIcon size={15} />
        </a>
        <a href="#vk" onClick={(e) => e.preventDefault()} aria-label="VK" title="VK">
          <VkIcon size={16} />
        </a>
        <a href="#youtube" onClick={(e) => e.preventDefault()} aria-label="YouTube" title="YouTube">
          <YoutubeIcon size={16} />
        </a>
      </footer>
    </main>
  );
}
