'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLenis } from 'lenis/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import poster from '@/assets/blogs/events/AIDA-MENA-EVENT.webp';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Hard acceleration, for the pull into the button. */
const SUCK_EASE = [0.6, 0, 0.9, 0.4] as const;

/**
 * When the poster arrives, measured against the hero's own choreography.
 *
 * The hero settles at roughly 2.1s: the name's per-character reveal finishes at
 * ~1.99s (a 0.57s delay on the second line, 0.27s of stagger across YOUSSEF,
 * then a 1.15s tween), the portrait's fade at 1.85s, and the last stat in the
 * glass panel at ~2.09s. This is that plus a held beat, so the poster lands into
 * a still hero rather than over one that is still assembling itself.
 *
 * A timer rather than a callback out of the hero. SplitText re-splits and reruns
 * the whole reveal when the webfont resolves, so "the animation finished" fires
 * more than once and not always last — and threading a completion signal out of
 * a component that restarts itself is a lot of machinery for a beat.
 */
const OPEN_DELAY_MS = 2600;

/** With reduced motion there is no choreography to wait out. */
const REDUCED_DELAY_MS = 400;

/**
 * Whether the poster opens once a session or on every visit to the home page.
 *
 * `false` — every visit — is what was asked for. Flip it to `true` and the
 * poster shows once per tab and is afterwards only reached from the button,
 * which is the gentler behaviour for a returning reader. Nothing else changes:
 * the button reopens it either way.
 */
const ONCE_PER_SESSION = false;

const SESSION_KEY = 'event-spotlight-seen';

/**
 * The upcoming event, as a poster.
 *
 * It opens itself once the hero has stopped moving. Closing it does not put it
 * away so much as park it: the poster flies down into the corner and stays there
 * as a thumbnail, which is both where it went and how to get it back.
 *
 * The corner is empty until that first close. Showing the thumbnail on load as
 * well would put the same picture on screen twice within three seconds, and the
 * flight would land on something already sitting there — so the corner has
 * nothing in it until the poster arrives to fill it.
 *
 * The thumbnail belongs to the hero and scrolls away with it. The overlay cannot:
 * the hero is `isolate`, so a z-index inside it is scoped to the hero's own
 * stacking context and the overlay would paint beneath the fixed header. It is
 * portalled to the body instead, which puts it back at the top of the page's
 * stacking order and out from under the hero's `overflow-hidden`.
 *
 * Above the header (z-50) and below the page transition (z-[200]): the poster
 * should cover the fixed header while it is up, and a route change should still
 * wipe over the poster.
 */
export function EventSpotlight() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const reduceMotion = useReducedMotion();

  /**
   * Whether the poster has been parked in the corner yet.
   *
   * False until the first close, so nothing is in the corner on load. It never
   * goes back to false: once the reader has put the poster away, the thumbnail
   * is the only way back to it.
   */
  const [parked, setParked] = useState(false);

  /**
   * Whether the thumbnail is still announcing itself.
   *
   * On at load and off at the first scroll — the label is there to say what the
   * small frame in the corner is, and a reader who has started down the page has
   * either taken that in or decided not to. Hover and focus still bring it back,
   * so nothing is lost, and the corner stops holding a permanent caption.
   */
  const [labelShown, setLabelShown] = useState(true);

  /** The vector from the poster's centre to the button's. See `measureSuck`. */
  const [suck, setSuck] = useState<{
    x: number;
    y: number;
    scale: number;
  } | null>(null);

  /**
   * The poster's entrance.
   *
   * It resolves out of a blur rather than simply fading: a flat opacity ramp on
   * a 4:5 photograph reads as an image loading, and the point here is that
   * something has been brought forward. Scale, lift and blur move together on
   * one long curve so it settles rather than arrives.
   *
   * Under reduced motion it is opacity alone — the blur and the travel are the
   * two parts that would need suppressing anyway.
   */
  const posterMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, scale: 0.955, y: 30, filter: 'blur(16px)' },
        animate: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' },
        // Drawn into the calendar button rather than dismissed on the spot, so
        // closing it also says where it went — which is the only thing that
        // makes the button in the corner discoverable.
        //
        // Three keyframes, not two. It swells and lifts a touch first, then
        // shoots away: the pause before the pull is what reads as suction
        // rather than as the poster simply shrinking. The two segments carry
        // their own curves — soft out of the hold, hard into the button.
        //
        // No rotation. The frame stays square to the page the whole way in, so
        // it reads as being drawn into the button rather than thrown at it.
        exit: suck
          ? {
              opacity: [1, 1, 0],
              scale: [1, 1.04, suck.scale],
              x: [0, 0, suck.x],
              y: [0, -12, suck.y],
              filter: ['blur(0px)', 'blur(0px)', 'blur(8px)'],
              transition: {
                duration: 0.62,
                times: [0, 0.22, 1],
                ease: [EASE, SUCK_EASE],
              },
            }
          : // Never measured — closed before the entrance finished, or the
            // button is not on screen. A plain fade, not a flight to nowhere.
            {
              opacity: 0,
              scale: 0.985,
              y: 12,
              filter: 'blur(10px)',
              transition: { duration: 0.2, ease: EASE },
            },
      };

  const closeRef = useRef<HTMLButtonElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  /**
   * The corner slot, not the thumbnail inside it.
   *
   * The thumbnail is scaled away while the poster is open, and
   * getBoundingClientRect reports the *transformed* box — so measuring the
   * button itself would return its shrunken size and land the flight short. The
   * wrapper is never transformed, so its rect is the slot's true geometry.
   */
  const slotRef = useRef<HTMLDivElement>(null);

  /** True from the moment closing starts, so nothing re-measures mid-flight. */
  const closingRef = useRef(false);

  /**
   * How far the poster has to travel, and how far down, to land on the button.
   *
   * Measured rather than assumed: the poster is centred and its size depends on
   * both its own ratio and the viewport, while the button is pinned to the
   * corner — so the distance between the two centres is only knowable at the
   * size the window happens to be.
   *
   * Read once the entrance has finished, never during it. getBoundingClientRect
   * reports the *transformed* box, so measuring while the poster is still at
   * `scale(0.955) translateY(30px)` would have it fly to the wrong place from a
   * position it is no longer in.
   */
  const measureSuck = useCallback(() => {
    if (closingRef.current) return;

    const frame = posterRef.current?.getBoundingClientRect();
    const target = slotRef.current?.getBoundingClientRect();
    if (!frame?.width || !target?.width) return;

    setSuck({
      x: target.left + target.width / 2 - (frame.left + frame.width / 2),
      y: target.top + target.height / 2 - (frame.top + frame.height / 2),
      // The larger of the two ratios, so the arriving poster *covers* the slot
      // rather than sitting inside it. The slot crops its image with
      // object-cover, so covering is what makes the handover land on matching
      // pixels — scale to fit and the thumbnail would appear fractionally wider
      // than the poster it is replacing.
      scale: Math.max(
        target.width / frame.width,
        target.height / frame.height,
      ),
    });
  }, []);

  const close = useCallback(() => {
    closingRef.current = true;
    setOpen(false);
    setParked(true);
    // Re-armed rather than left as it was: the label is there to say what the
    // thumbnail is, and this is the moment the thumbnail first exists. A reader
    // who scrolled during the hero would otherwise have spent it on a corner
    // that was still empty.
    setLabelShown(true);
    // Back where it came from, so a keyboard reader is not dropped at the top of
    // the document every time the poster shuts.
    buttonRef.current?.focus();
  }, []);

  // ---- The label steps back at the first scroll ----
  useEffect(() => {
    // Lenis drives the window's real scroll position, so the native event is
    // the reliable signal here and does not depend on Lenis having started.
    const onScroll = () => {
      if (window.scrollY > 8) setLabelShown(false);
    };

    // Not passive by accident: this only reads scrollY and must never be able
    // to hold up a scroll.
    window.addEventListener('scroll', onScroll, { passive: true });

    // A restored scroll position means the page did not start at the top, in
    // which case the label was never the first thing seen.
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---- Opens itself, once the hero has settled ----
  useEffect(() => {
    if (ONCE_PER_SESSION) {
      try {
        if (sessionStorage.getItem(SESSION_KEY)) return;
      } catch {
        // Safari in private mode throws on sessionStorage. Showing the poster is
        // the better failure than not showing it.
      }
    }

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const timer = window.setTimeout(
      () => {
        setOpen(true);
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          // As above — a storage failure must not stop the poster opening.
        }
      },
      reduced ? REDUCED_DELAY_MS : OPEN_DELAY_MS,
    );

    return () => window.clearTimeout(timer);
  }, []);

  // ---- While it is up: nothing scrolls behind it, Escape closes it ----
  useEffect(() => {
    if (!open) return;

    // Lenis is driving the page, so stopping it is what stops the scroll.
    // Deliberately not `overflow: hidden` on the body as well: that takes the
    // scrollbar away and shifts the whole layout under the poster.
    closingRef.current = false;
    lenis?.stop();
    closeRef.current?.focus();

    // The distance to the corner changes with the window, and the poster is
    // resized by it. An event handler, so this is not a setState in an effect
    // body.
    window.addEventListener('resize', measureSuck);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }

      if (event.key !== 'Tab') return;

      // A small trap. There is only the close button in here, so without it Tab
      // walks straight out into the page behind and the poster becomes a sheet
      // the reader is looking past rather than at.
      const focusable =
        dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', measureSuck);
      lenis?.start();
    };
  }, [open, lenis, close, measureSuck]);

  // In the corner only once the poster has been parked there, and never at
  // the same time as the poster itself.
  const showThumb = parked && !open;

  const overlay = (
    <AnimatePresence>
        {open && (
          // The dialog is the whole overlay, not just the poster, so the close
          // control can sit in the screen corner and still be inside the focus
          // trap. Off the artwork entirely: a chip pinned to the poster's own
          // corner covers the one thing the reader was brought here to look at.
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Upcoming event"
            className="fixed inset-0 z-[100] flex items-center justify-center p-5 md:p-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // Held a moment, then cleared over the poster's flight — the
               // ground has to still be dark while there is something crossing
               // it, or the poster flies against the live page.
              exit={{
                opacity: 0,
                transition: { duration: 0.3, delay: 0.18, ease: EASE },
              }}
              transition={{ duration: 0.65, ease: EASE }}
              onClick={close}
              aria-hidden
              className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            />

            <motion.div
              ref={posterRef}
              initial={posterMotion.initial}
              animate={posterMotion.animate}
              exit={posterMotion.exit}
              // Measured here rather than on mount: this fires when the entrance
              // has finished, which is the first moment the frame's box is its
              // real one. See measureSuck.
              onAnimationComplete={measureSuck}
              // Long, and started a beat after the ground has begun to darken,
              // so the two are read as one movement rather than as a pair of
              // things that happened to fire together.
              transition={{ duration: 1.0, ease: EASE, delay: 0.12 }}
              className="relative max-h-[86svh] max-w-[min(92vw,40rem)]"
            >
              {/* max-w against the wrapper and max-h against the viewport, with
                  both dimensions auto — so the poster scales down on its own
                  ratio and is never cropped, whichever limit it meets first. */}
              <Image
                src={poster}
                alt="Poster for the upcoming AIDA MENA event"
                placeholder="blur"
                priority
                sizes="(min-width: 768px) 40rem, 92vw"
                className="h-auto max-h-[86svh] w-auto max-w-full rounded-lg object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
              />
            </motion.div>

            {/* Last to arrive, once the poster has settled — the way out should
                not be the first thing offered. */}
            <motion.button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.6 }}
              // No frame, no fill, no colour — a grey cross that lightens on
              // hover. The hit area is still 44px square; it is simply not
              // drawn, so nothing competes with the poster it sits beside.
              className="absolute top-5 right-5 grid size-11 cursor-pointer place-items-center rounded-full text-white/55 transition-colors duration-300 hover:text-white/95 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none md:top-8 md:right-8 md:size-12"
            >
              <X aria-hidden strokeWidth={1.5} className="size-5" />
            </motion.button>
          </div>
        )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Rendered into the body, not here — see the note on the component. The
          guard is what keeps it off the server, where there is no document; the
          portal contributes no markup at this position either way, so the two
          renders agree. */}
      {typeof document !== 'undefined' && createPortal(overlay, document.body)}

      {/* ---------------- The way back to it ---------------- */}
      {/* The poster itself, small. It replaced a calendar icon, which had to be
          read as a symbol for "there is an event" — the thumbnail simply is the
          thing, so nothing has to be decoded, and closing it becomes literal:
          the poster shrinks down into its own smaller self.

          Squared off at 100px from a 4:5 source, so it is a centred crop. What
          that loses is the logo strip along the top and the venue and date along
          the bottom — both of which are a few pixels tall at this size and were
          never going to be read here. What it keeps is the portrait and the
          name, which is what makes the corner recognisable as her poster. */}
      {/* Absolute, not fixed: it belongs to the hero and leaves with it.

          Bottom right, but positioned two different ways, because the section is
          two different boxes. At lg it is exactly one viewport, so `bottom-7`
          puts the frame on the same baseline as the stats panel beside it — and
          the panel is only 60% wide there, so the right gutter is clear.

          Below lg the section is taller than the screen: the stage takes one
          viewport and the copy runs underneath it in flow, so `bottom` would
          land this down beside the paragraph rather than in the hero. It is
          measured from the top instead — one viewport less the panel's height
          and a gap — which keeps it above a stats panel that is full width down
          there, and scales with the screen rather than guessing at it.

          Measured through this wrapper because it is never transformed; the
          button inside it is. See slotRef. */}
      <div
        ref={slotRef}
        data-hero-fade
        className="absolute top-[calc(100svh-22rem)] right-5 z-30 md:right-8 lg:top-auto lg:right-12 lg:bottom-7 xl:right-20"
      >
        <motion.button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Upcoming events"
          // Out of the document whenever it is not on screen — before the first
          // close there is nothing there, and while the poster is up it is the
          // same picture. Neither is something a screen reader or a Tab press
          // should be able to reach.
          aria-hidden={!showThumb}
          tabIndex={showThumb ? 0 : -1}
          // initial={false} so the corner is simply empty on load rather than
          // playing an exit it was never in.
          initial={false}
          animate={
            showThumb
              ? {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.34,
                    ease: EASE,
                    // Timed to the flight. The poster reaches the corner at
                    // 0.62s and is already fading over the back half of it, so
                    // coming in at 0.4s means the two overlap on the same
                    // pixels and the handover is a settle, not a swap. Without
                    // a measured flight there is nothing to wait for.
                    delay: suck ? 0.4 : 0.1,
                  },
                }
              : // Steps aside as the poster takes over. Quick, and slightly
                // down in scale, so it reads as the same object leaving rather
                // than a second one being hidden.
                {
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.28, ease: EASE },
                }
          }
          className={cn(
            'group relative block h-[9.375rem] w-[6.25rem] cursor-pointer overflow-hidden rounded-lg shadow-[0_18px_50px_-14px_rgba(15,17,23,0.6)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none',
            // An element at opacity 0 still takes clicks, and this one sits over
            // the page in a corner readers reach for.
            !showThumb && 'pointer-events-none',
          )}
        >
          <Image
            src={poster}
            alt=""
            fill
            placeholder="blur"
            sizes="100px"
            className="object-cover"
          />

          <span
            aria-hidden
            className="absolute inset-0 rounded-lg ring-1 ring-white/20 ring-inset"
          />

          {/* The label. To the left because the frame is pinned to the right
              edge and there is no room the other way.

              Shown on arrival and taken away at the first scroll: it is there to
              say what the thumbnail is, and once the reader has started moving
              down the page they have either taken it in or chosen not to. Hover
              and keyboard focus still bring it back. */}
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-full border border-ink/10 bg-cream px-3.5 py-2 font-body text-[0.72rem] tracking-[0.1em] whitespace-nowrap text-ink uppercase shadow-lg transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
              labelShown ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0',
              'group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
            )}
          >
            Upcoming events
          </span>
        </motion.button>
      </div>
    </>
  );
}
