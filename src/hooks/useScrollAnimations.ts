'use client';

import { useEffect } from 'react';

export function useScrollAnimations() {
  useEffect(() => {
    const initAnimations = async () => {
      const { animate, inView, stagger } = await import('motion');

      const q = (sel: string) => document.querySelector(sel);

      if (q('.hero-badge')) {
        animate('.hero-badge', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 });
      }
      if (q('.gsap-3d-scroll-title')) {
        animate('.gsap-3d-scroll-title', { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, delay: 0.1 });
      }
      if (q('.gsap-3d-scroll-subtitle')) {
        animate('.gsap-3d-scroll-subtitle', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.2 });
      }
      if (q('.gsap-3d-scroll-actions')) {
        animate('.gsap-3d-scroll-actions', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6, delay: 0.3 });
      }

      if (q('.steps-container')) {
        inView('.steps-container', () => {
          const cards = document.querySelectorAll('.step-card');
          if (cards.length) animate('.step-card', { opacity: [0, 1], y: [50, 0] }, { delay: stagger(0.2), duration: 0.6 });
        });
      }

      if (q('.feat-grid')) {
        inView('.feat-grid', () => {
          const cells = document.querySelectorAll('.feat-cell');
          if (cells.length) animate('.feat-cell', { opacity: [0, 1], scale: [0.9, 1] }, { delay: stagger(0.1), duration: 0.5 });
        });
      }

      if (q('.gallery')) {
        inView('.gallery', () => {
          const items = document.querySelectorAll('.gallery-item');
          if (items.length) animate('.gallery-item', { opacity: [0, 1], y: [30, 0] }, { delay: stagger(0.15), duration: 0.6 });
        });
      }

      if (q('#testimonios .row')) {
        inView('#testimonios .row', () => {
          const cards = document.querySelectorAll('#testimonios .story-card');
          if (cards.length) animate('#testimonios .story-card', { opacity: [0, 1], y: [40, 0] }, { delay: stagger(0.15), duration: 0.6 });
        });
      }

      if (q('#precios .row')) {
        inView('#precios .row', () => {
          const cards = document.querySelectorAll('.pricing-card');
          if (cards.length) animate('.pricing-card', { opacity: [0, 1], y: [40, 0] }, { delay: stagger(0.15), duration: 0.6 });
        });
      }

      if (q('#historias .row')) {
        inView('#historias .row', () => {
          const cards = document.querySelectorAll('#historias .story-card');
          if (cards.length) animate('#historias .story-card', { opacity: [0, 1], scale: [0.9, 1] }, { delay: stagger(0.1), duration: 0.5 });
        });
      }

      if (q('.cta-inner')) {
        inView('.cta-inner', () => {
          animate('.cta-inner', { opacity: [0, 1], y: [50, 0] }, { duration: 0.8 });
        });
      }

      if (q('.sec-title')) {
        inView('.sec-title', () => {
          document.querySelectorAll('.sec-title').forEach(el => {
            animate(el, { opacity: [0, 1], x: [-30, 0] }, { duration: 0.6 });
          });
        });
      }
    };

    initAnimations();
  }, []);
}