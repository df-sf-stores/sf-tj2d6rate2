'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useReducedMotion } from '@dripfunnel/storefront-core/theme'
import { cx } from '../cx'
import styles from '../../styles/hero.module.css'

const autoplayMs = 4500
const swipePx = 40

export type HeroSlide = {
  key: string
  href: string
  /** What the artwork says, for screen readers: the banner's words are part of the picture. */
  label: string
  /** The slide's banner, a ThemeImage that fills the slide. */
  picture: ReactNode
}

type HeroLabels = { region: string; role: string; previous: string; next: string; pause: string; play: string; goTo: (n: number) => string }

export const HeroCarousel = ({ slides, labels }: { slides: HeroSlide[]; labels: HeroLabels }) => {
  const [selected, setSelected] = useState(0)
  const [held, setHeld] = useState(false)
  const [stopped, setStopped] = useState(false)
  const reduced = useReducedMotion()
  const swipeFrom = useRef<number | null>(null)
  const count = slides.length
  // WCAG 2.2.2: no autoplay under reduced motion, and a pause button otherwise.
  const autoplay = count > 1 && !reduced && !stopped
  const go = (index: number) => setSelected((index + count) % count)
  // The shown slide fades in over the others, which stay in place so their banners load.
  const place = (index: number) => (index === selected ? styles.current : index < selected ? styles.before : styles.after)

  // One timer per slide: keying on `selected` gives every slide the full interval after any change.
  useEffect(() => {
    if (!autoplay || held) return
    const id = setTimeout(() => setSelected((i) => (i + 1) % count), autoplayMs)
    return () => clearTimeout(id)
  }, [autoplay, held, selected, count])

  return (
    <section
      className={styles.hero}
      aria-roledescription={labels.role}
      aria-label={labels.region}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setHeld(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setHeld(false)
      }}
      onPointerDown={(e) => {
        swipeFrom.current = e.clientX
      }}
      onPointerUp={(e) => {
        if (swipeFrom.current === null) return
        const dx = e.clientX - swipeFrom.current
        swipeFrom.current = null
        if (Math.abs(dx) > swipePx) go(selected + (dx < 0 ? 1 : -1))
      }}
    >
      <div className={styles.track} aria-live={autoplay ? 'off' : 'polite'}>
        {slides.map((slide, index) => (
          <div key={slide.key} className={cx(styles.slide, place(index), reduced && styles.still)}>
            {/* The picture stays mounted; only the shown slide carries a link, so hidden ones are neither tabbed to nor read out. */}
            <span className={styles.slideLink} aria-hidden="true">
              {slide.picture}
            </span>
            {index === selected ? (
              <Link href={slide.href} className={styles.slideHit}>
                <span className={styles.hidden}>{slide.label}</span>
              </Link>
            ) : null}
          </div>
        ))}
      </div>
      {count > 1 ? (
        <>
          <button type="button" className={cx(styles.arrow, styles.previous)} aria-label={labels.previous} onClick={() => go(selected - 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className={cx(styles.arrow, styles.next)} aria-label={labels.next} onClick={() => go(selected + 1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          {reduced ? null : (
            <button type="button" className={styles.toggle} aria-label={stopped ? labels.play : labels.pause} onClick={() => setStopped(!stopped)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={stopped ? 'M8 5l11 7-11 7z' : 'M8 5v14M16 5v14'} />
              </svg>
            </button>
          )}
          <div className={styles.dots}>
            {slides.map((slide, index) => (
              <button key={slide.key} type="button" className={cx(styles.dot, index === selected && styles.dotOn)} aria-label={labels.goTo(index + 1)} aria-current={index === selected} onClick={() => go(index)} />
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}
