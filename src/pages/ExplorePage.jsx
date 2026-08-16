import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';

const FALLBACK_CARDS = [
  { id: 'hero-1', media: 'video', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', poster: 'https://image.pollinations.ai/prompt/cinematic%20portrait%20of%20a%20woman%20neon%20cyan%20rim%20light%20dark%20studio?width=1000&height=562&seed=501&model=flux&nologo=true', title: 'CINEMA STUDIO 4 IS HERE', desc: 'More control. Longer scenes. Sharper quality.', link: '/cinema' },
  { id: 'hero-2', media: 'img', src: 'https://image.pollinations.ai/prompt/silhouette%20person%20neon%20fog%20cinematic%20moody?width=1000&height=562&seed=506&model=flux&nologo=true', title: 'GIMBALFLOW PLUGIN IN CHATGPT', desc: 'All the top models in one place: Seedance 2.5, Seedance 2.0...', link: '/image' },
  { id: 'hero-3', media: 'img', src: 'https://image.pollinations.ai/prompt/neon%20city%20skyline%20blade%20runner%20fog%20cinematic?width=1000&height=562&seed=503&model=flux&nologo=true', title: 'GIMBALFLOW LAYERS', desc: 'Image editor with real-time AI layer decomposition', link: '/image' },
  { id: 'hero-4', media: 'video', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', poster: 'https://image.pollinations.ai/prompt/milky%20way%20over%20mountain%20peaks%20astrophotography?width=1000&height=562&seed=504&model=flux&nologo=true', title: 'SEEDANCE 2.5: CINEMA PASS', desc: 'New episode, 60fps fluid motion model fully integrated', link: '/cinema' },
  { id: 'hero-5', media: 'img', src: 'https://image.pollinations.ai/prompt/cyberpunk%20city%20street%20at%20night%20neon%20signs%20rain%20cinematic?width=1000&height=562&seed=502&model=flux&nologo=true', title: 'THE GIMBALFLOW FILM FESTIVAL', desc: 'Submit your AI short film. Compete for $1M in director grants.', link: null },
];

const VALID_LINKS = ['/cinema', '/image', '/explore', '/profile'];

const FALLBACK_GALLERY = [
  { id: 'gal-1', media: 'video', ratio: 'tall', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', poster: 'https://image.pollinations.ai/prompt/milky%20way%20over%20mountain%20peaks%20astrophotography?width=800&height=1200&seed=504&model=flux&nologo=true' },
  { id: 'gal-2', media: 'img', ratio: 'tall', src: 'https://image.pollinations.ai/prompt/silhouette%20person%20neon%20fog%20cinematic%20moody?width=800&height=1200&seed=506&model=flux&nologo=true' },
  { id: 'gal-3', media: 'img', ratio: 'tall', src: 'https://image.pollinations.ai/prompt/cinematic%20portrait%20of%20a%20woman%20neon%20cyan%20rim%20light%20dark%20studio?width=800&height=1200&seed=501&model=flux&nologo=true' },
  { id: 'gal-4', media: 'video', ratio: 'tall', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', poster: 'https://image.pollinations.ai/prompt/neon%20city%20skyline%20blade%20runner%20fog%20cinematic?width=800&height=1200&seed=503&model=flux&nologo=true' },
  { id: 'gal-5', media: 'img', ratio: 'tall', src: 'https://image.pollinations.ai/prompt/silhouette%20person%20neon%20fog%20cinematic%20moody?width=800&height=1200&seed=506&model=flux&nologo=true' },
  { id: 'gal-6', media: 'img', ratio: 'tall', src: 'https://image.pollinations.ai/prompt/cyberpunk%20city%20street%20at%20night%20neon%20signs%20rain%20cinematic?width=800&height=1200&seed=502&model=flux&nologo=true' },
  { id: 'gal-7', media: 'video', ratio: 'tall', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', poster: 'https://image.pollinations.ai/prompt/milky%20way%20over%20mountain%20peaks%20astrophotography?width=800&height=1200&seed=504&model=flux&nologo=true' },
  { id: 'gal-8', media: 'img', ratio: 'tall', src: 'https://image.pollinations.ai/prompt/neon%20city%20skyline%20blade%20runner%20fog%20cinematic?width=800&height=1200&seed=503&model=flux&nologo=true' },
  { id: 'gal-9', media: 'img', ratio: 'tall', src: 'https://image.pollinations.ai/prompt/abstract%20liquid%20chrome%20waves%20dark%20background?width=800&height=1200&seed=505&model=flux&nologo=true' },
  { id: 'gal-10', media: 'img', ratio: 'tall', src: 'https://image.pollinations.ai/prompt/cinematic%20portrait%20of%20a%20woman%20neon%20cyan%20rim%20light%20dark%20studio?width=800&height=1200&seed=501&model=flux&nologo=true' },
  { id: 'gal-11', media: 'img', ratio: 'square', src: 'https://image.pollinations.ai/prompt/snow%20mountain%20peak%20night%20starry%20sky?width=800&height=800&seed=507&model=flux&nologo=true' }
];

const CACHE_KEYS = { hero: 'gf_hero_cache_v1', gallery: 'gf_gallery_cache_v1' };

function loadCache(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) && v.length ? v : null;
  } catch { return null; }
}

function saveCache(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

export default function ExplorePage({ showToast }) {
  const [heroCards, setHeroCards] = useState(() => loadCache(CACHE_KEYS.hero) || FALLBACK_CARDS);
  const [gallery, setGallery] = useState(() => loadCache(CACHE_KEYS.gallery) || FALLBACK_GALLERY);
  const [heroActive, setHeroActive] = useState(0);
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const videoRefs = useRef(new Map());

  // Only the videos actually visible on screen play — everything else stays
  // paused, so hundreds of videos can be added without slowing or crashing.
  const registerVideo = (el, key) => {
    if (el) videoRefs.current.set(key, el);
    else videoRefs.current.delete(key);
  };

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.play().catch(() => {});
          else entry.target.pause();
        }
      },
      { rootMargin: '200px 0px 200px 0px' }
    );
    videoRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [heroCards, gallery]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/hero')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('hero fetch failed'))))
      .then((cards) => {
        if (!cancelled && Array.isArray(cards) && cards.length) {
          saveCache(CACHE_KEYS.hero, cards);
          setHeroCards(cards.map((c) => {
            const link = VALID_LINKS.includes(c.link) ? c.link : null;
            return { ...c, onClick: link ? () => navigate(link) : () => showToast('Coming soon: ' + (c.title || '')) };
          }));
        }
      })
      .catch(() => { /* keep cached / fallback cards */ });
    return () => { cancelled = true; };
  }, [showToast, navigate]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/gallery')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('gallery fetch failed'))))
      .then((items) => {
        if (!cancelled && Array.isArray(items) && items.length) {
          saveCache(CACHE_KEYS.gallery, items);
          setGallery(items);
        }
      })
      .catch(() => { /* keep cached / fallback gallery */ });
    return () => { cancelled = true; };
  }, []);

  const cardCount = heroCards.length;

  const handleHeroScroll = () => {
    const el = heroRef.current;
    if (!el) return;
    const wrappers = el.querySelectorAll('.showcase-card-wrapper');
    if (!wrappers.length) return;
    let idx = 0;
    wrappers.forEach((w, i) => {
      if (w.offsetLeft - el.scrollLeft < el.clientWidth / 2) idx = i;
    });
    setHeroActive(idx % cardCount);
  };

  const scrollToHeroSlide = (domIndex) => {
    const el = heroRef.current;
    if (!el) return;
    const wrappers = el.querySelectorAll('.showcase-card-wrapper');
    if (!wrappers[domIndex]) return;
    el.scrollTo({ left: wrappers[domIndex].offsetLeft, behavior: 'smooth' });
  };

  /* AUTO-SCROLL HERO CAROUSEL EVERY 5 SECONDS — TRUE INFINITE CIRCLE (last→0 is a smooth slide via trailing clone) */
  useEffect(() => {
    if (cardCount === 0) return undefined;
    const interval = setInterval(() => {
      const next = heroActive + 1;
      if (next >= cardCount) {
        scrollToHeroSlide(cardCount);
        setHeroActive(0);
        setTimeout(() => {
          const el = heroRef.current;
          if (el) el.scrollTo({ left: 0, behavior: 'auto' });
        }, 800);
      } else {
        scrollToHeroSlide(next);
        setHeroActive(next);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [heroActive, cardCount]);

  const renderCard = (card, index) => (
    <>
      <div className="showcase-card-media card-skeuo">
        {card.media === 'video' ? (
          <video
            ref={(el) => registerVideo(el, `hero-vid-${index}`)}
            src={card.src}
            poster={card.poster}
            muted loop playsInline preload="metadata"
          />
        ) : (
          <img src={card.src} alt={card.title} loading="lazy" decoding="async" />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(2,4,8,0.65) 100%)' }}></div>
      </div>

      <div className="showcase-card-caption">
        <h3 className="showcase-card-title" style={{ fontSize: '1.05rem', marginBottom: 3 }}>
          {card.title}
        </h3>
        <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: 0 }}>
          {card.desc}
        </p>
      </div>
    </>
  );

  return (
    <div className="explore-container">
         {/* 1. TOP ROW: HORIZONTALLY SCROLLABLE HERO SHOWCASE CAROUSEL (INFINITE LOOP) */}
      <div 
        className="hero-showcase-scroll-container"
        ref={heroRef}
        onScroll={handleHeroScroll}
      >
        {heroCards.map((card, i) => (
          <div 
            key={i}
            className="showcase-card-wrapper"
            onClick={card.onClick}
          >
            {renderCard(card, i)}
          </div>
        ))}

        {/* TRAILING CLONE OF SLIDE 1 — enables seamless last→0 circular slide */}
        {heroCards[0] && (
          <div 
            className="showcase-card-wrapper"
            onClick={heroCards[0].onClick}
          >
            {renderCard(heroCards[0], heroCards.length)}
          </div>
        )}

      </div>

      {/* MOBILE ONLY: HERO PAGINATION DOTS */}
      {cardCount > 0 && (
        <div className="hero-scroll-dots">
          {Array.from({ length: cardCount }, (_, i) => (
            <button
              key={i}
              className={`hero-scroll-dot ${heroActive === i ? 'active' : ''}`}
              onClick={() => scrollToHeroSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* 2. GALLERY — below the hero, 2-column masonry */}
      {gallery.length > 0 && (() => {
        const squareItem = gallery.find((it) => it.ratio === 'square') || null;
        const talls = gallery.filter((it) => it !== squareItem);
        const leftCol = talls.filter((_, i) => i % 2 === 0);
        const rightCol = talls.filter((_, i) => i % 2 === 1);
        const renderCard = (item, extraClass = '') => (
          <div
            key={item.id}
            className={`gallery-card ${extraClass} card-skeuo`}
            onClick={() => showToast('Opening ' + (item.title || 'this work') + '...')}
          >
            {item.media === 'video' ? (
              <video
                ref={(el) => registerVideo(el, `gal-vid-${item.id}`)}
                src={item.src}
                poster={item.poster}
                muted loop playsInline preload="metadata"
              />
            ) : (
              <img src={item.src} alt={item.title || 'gallery item'} loading="lazy" decoding="async" />
            )}
            {item.media === 'video' && (
              <span className="gallery-play-hint"><Film size={16} /></span>
            )}
          </div>
        );
const renderCta = () => (
          <div
            key="gallery-cta"
            className="gallery-card gallery-square gallery-cta card-skeuo"
            onClick={() => navigate('/image')}
          >
            <img src="/create-image.webp" alt="" loading="lazy" decoding="async" />
          </div>
        );
        return (
          <div className="gallery-section">
            <div className="gallery-section-head">
              <h2>Featured Works</h2>
            </div>

            <div className="gallery-feature">
              <div className="gallery-col">
                {leftCol.map((it) => renderCard(it))}
              </div>
<div className="gallery-col">
            {renderCta()}
            <div className="gallery-cta-label"><span className="cta-create">create</span> images</div>
            {rightCol.map((it) => renderCard(it))}
          </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
