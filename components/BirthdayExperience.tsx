"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { content } from "./content";

type Particle = { id: number; left: number; delay: number; duration: number; color: string };
const colors = ["#d89eb9", "#e9bd72", "#c6abd9", "#a8718f", "#f1a8b2"];
const TOTAL = 6;

export default function BirthdayExperience() {
  const [scene, setScene] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [memory, setMemory] = useState<string | null>(null);
  const [letterOpen, setLetterOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const celebrate = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setParticles(Array.from({ length: 75 }, (_, id) => ({
      id, left: Math.random() * 100, delay: Math.random() * 0.8,
      duration: 2.5 + Math.random() * 1.5, color: colors[id % colors.length],
    })));
  }, []);

  useEffect(() => {
    if (scene !== 1 && scene !== 5) return;
    celebrate();
    const timer = window.setTimeout(() => setParticles([]), 4500);
    return () => window.clearTimeout(timer);
  }, [scene, celebrate]);

  useEffect(() => {
    if (selectedCard !== null) modalCloseRef.current?.focus();
  }, [selectedCard]);

  useEffect(() => {
    if (selectedCard === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCard(null);
      if (event.key === "Tab") {
        // The modal has one focusable control; trap focus there.
        event.preventDefault();
        modalCloseRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeydown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeydown); };
  }, [selectedCard]);

  const go = (index: number) => {
    setScene(Math.max(0, Math.min(index, TOTAL - 1)));
    setSelectedCard(null);
  };

  const closeCard = () => {
    const previous = selectedCard;
    setSelectedCard(null);
    if (previous !== null) window.requestAnimationFrame(() => cardRefs.current[previous]?.focus());
  };

  const replay = () => { setLetterOpen(false); setMemory(null); go(0); };
  const activeCard = selectedCard !== null ? content.cards[selectedCard] : null;

  return <main className="shell">
    <div className="canvas">
      <div className="confetti" aria-hidden="true">{particles.map(p =>
        <span key={p.id} className="confetti-piece" style={{ left: `${p.left}%`, backgroundColor: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }} />
      )}</div>
      <header className="header">
        <div className="logo">Little Surprise <span>♡</span></div>
      </header>

      <div className="page" key={scene}>
        {scene === 0 && <>
          <div className="eyebrow">A little something, just for you</div>
          <h1>Some days<br />feel a little more<br /><em>magical.</em></h1>
          <p className="subtitle">And today happens to be one of them. We made something special, just to bring a smile to your face.</p>
          <div className="gift-wrap"><div className="gift-halo" /><button type="button" className="gift" aria-label="Unwrap gift" onClick={() => go(1)}>🎁</button></div>
          <button type="button" className="primary" onClick={() => go(1)}>Unwrap your surprise ✦</button>
        </>}
        {scene === 1 && <>
          <div className="eyebrow">Today is your special day</div>
          <div className="decor">✧ ✿ ✧</div>
          <h1>Happy<br /><em>Birthday, {content.recipient}!</em></h1>
          <div className="cake-art"><div className="cake-halo"/><span>🎂</span></div>
          <p className="subtitle">{content.greeting}</p>
          <button type="button" className="primary" onClick={() => go(2)}>A little note for you →</button>
        </>}
        {scene === 2 && <>
          <div className="eyebrow">Written with appreciation</div>
          <h2>A note to our<br /><em>favorite {content.recipient}.</em></h2>
          <div className="paper"><div className="flourish">❦</div><p>Dear {content.recipient},</p>{content.letter.map((paragraph, i) => <p key={i}>{paragraph}</p>)}<div className="signature">With lots of warm wishes ♡</div></div>
          <button type="button" className="primary" onClick={() => go(3)}>Let&apos;s look at some memories →</button>
        </>}
        {scene === 3 && <>
          <div className="eyebrow">Collected with smiles</div>
          <h2>The little things<br /><em>we remember.</em></h2>
          <p className="subtitle">It&apos;s the simple, happy moments that make the best stories. Tap a photo to discover a little memory.</p>
          <div className="photos">{content.memories.map((item, i) => <button key={i} type="button" className="polaroid" onClick={() => setMemory(item.text)} aria-label={`Show memory: ${item.title}`}><div className="snapshot">{item.image ? <img src={item.image} alt={item.title} /> : <span className="photo-icon">{item.icon}</span>}<span className="photo-caption">{item.title}</span></div></button>)}</div>
          <div className="memory-note" aria-live="polite">{memory ?? " "}</div>
          <button type="button" className="primary" onClick={() => go(4)}>There&apos;s something else →</button>
        </>}
        {scene === 4 && <>
          <div className="eyebrow">A little letter, sealed with love</div>
          <h2>Some words<br /><em>just for you.</em></h2>
          <p className="subtitle">A little envelope, a little warmth, and something we hope makes you smile.</p>
          <button type="button" className="envelope" aria-label="Open your birthday letter" aria-expanded={letterOpen} onClick={() => setLetterOpen(true)}>{letterOpen ? "💝" : "💌"}</button>
          {letterOpen && <div className="opened-letter">{content.envelopeMessage}</div>}
          <button type="button" className="primary" onClick={() => go(5)}>One final surprise →</button>
        </>}
        {scene === 5 && <>
          <div className="eyebrow">Three cards, three heartfelt wishes</div>
          <h2>Little messages,<br /><em>lots of love.</em></h2>
          <p className="subtitle">{content.recipient}, there are a few more things we&apos;d love to say. Pick a card and open your surprise.</p>
          <div className="message-cards">{content.cards.map((card, i) => <button key={i} ref={el => { cardRefs.current[i] = el; }} type="button" className="message-card" onClick={() => setSelectedCard(i)}><span className="card-icon">{card.icon}</span><span className="card-heading">{card.title}</span><span className="card-hint">TAP TO OPEN ↗</span></button>)}</div>
          <button type="button" className="outline" onClick={replay}>↻ Experience again</button>
        </>}
      </div>

      <footer className="footer">
        <button type="button" className="footbtn" onClick={() => go(scene-1)} disabled={scene===0}>← Back</button>
        <div className="indicators">{Array.from({length:TOTAL},(_,i)=><button key={i} type="button" aria-label={`Go to scene ${i+1}`} aria-current={scene===i?"step":undefined} className={`indicator ${scene===i?"active":""}`} onClick={()=>go(i)}/>)}</div>
        <span className="count">{String(scene+1).padStart(2,"0")} / 06</span>
        {scene<TOTAL-1 && <button type="button" className="footbtn" onClick={()=>go(scene+1)}>Next →</button>}
      </footer>

      {activeCard && <div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)closeCard()}}>
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="card-title" aria-describedby="card-message">
          <div className="symbol">{activeCard.icon}</div><h3 id="card-title">{activeCard.title}</h3><p id="card-message">{activeCard.text}</p>
          <button ref={modalCloseRef} type="button" className="primary" onClick={closeCard}>Close with love ♡</button>
        </div>
      </div>}
    </div>
    <p className="below">Made with love, just for you ♡</p>
  </main>;
}
