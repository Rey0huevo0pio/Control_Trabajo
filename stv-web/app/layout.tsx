import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ExtensionCleaner from "@/src/components/ExtensionCleaner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STV Global",
  description: "Migracion de Web-Flonten a Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script
          id="clean-extensions"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function cleanAttrs(el) {
                  if (!el || !el.removeAttribute) return;
                  var attrs = el.attributes;
                  for (var i = attrs.length - 1; i >= 0; i--) {
                    var name = attrs[i].name;
                    if (
                      name.indexOf('__processed_') === 0 ||
                      name === 'bis_register' ||
                      name === 'bis_skin_checked' ||
                      name === 'data-new-gr-c-s-check-loaded' ||
                      name === 'data-gr-ext-installed'
                    ) {
                      el.removeAttribute(name);
                    }
                  }
                }

                // Clean documentElement immediately
                cleanAttrs(document.documentElement);

                // Set up MutationObserver to catch elements as they're added
                var observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.target) {
                      cleanAttrs(mutation.target);
                    }
                    if (mutation.addedNodes) {
                      mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                          cleanAttrs(node);
                          var children = node.querySelectorAll ? node.querySelectorAll('*') : [];
                          for (var k = 0; k < children.length; k++) {
                            cleanAttrs(children[k]);
                          }
                        }
                      });
                    }
                  });
                });

                observer.observe(document.documentElement, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['bis_skin_checked', 'bis_register', '__processed_', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed']
                });

                // Also clean on DOMContentLoaded as a fallback
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', function() {
                    cleanAttrs(document.documentElement);
                    if (document.body) cleanAttrs(document.body);
                    var all = document.querySelectorAll ? document.querySelectorAll('*') : [];
                    for (var j = 0; j < all.length; j++) {
                      cleanAttrs(all[j]);
                    }
                  });
                }
              })();
            `,
          }}
        />
        <ExtensionCleaner />
        {children}
      </body>
    </html>
  );
}

