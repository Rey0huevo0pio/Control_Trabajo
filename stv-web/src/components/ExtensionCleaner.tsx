'use client';

import { useEffect } from 'react';

function cleanExtensionAttributes() {
  if (typeof document === 'undefined') return;

  const extensionAttrs = [
    'bis_skin_checked',
    'bis_register',
    'data-new-gr-c-s-check-loaded',
    'data-gr-ext-installed',
  ];

  const allElements = document.querySelectorAll('*');
  allElements.forEach((el) => {
    extensionAttrs.forEach((attr) => {
      if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    });

    // Remove any attribute starting with __processed_
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('__processed_')) {
        el.removeAttribute(attr.name);
      }
    });
  });
}

export default function ExtensionCleaner() {
  useEffect(() => {
    cleanExtensionAttributes();

    // Also set up a MutationObserver to clean any dynamically added attributes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName;
          if (
            attrName &&
            (attrName === 'bis_skin_checked' ||
              attrName === 'bis_register' ||
              attrName.startsWith('__processed_') ||
              attrName === 'data-new-gr-c-s-check-loaded' ||
              attrName === 'data-gr-ext-installed')
          ) {
            const target = mutation.target as Element;
            target.removeAttribute(attrName);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: [
        'bis_skin_checked',
        'bis_register',
        '__processed_',
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed',
      ],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

