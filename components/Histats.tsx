'use client';

import Script from 'next/script';

export default function Histats() {
  return (
    <>
      {/* Script Utama Histats */}
      <Script id="histats-tracker" strategy="afterInteractive">
        {`
          var _Hasync= _Hasync|| [];
          _Hasync.push(['Histats.start', '1,4828760,4,0,0,0,00010000']);
          _Hasync.push(['Histats.fasi', '1']);
          _Hasync.push(['Histats.track_hits', '']);
          (function() {
          var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
          hs.src = ('//s10.histats.com/js15_as.js');
          (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
          })();
        `}
      </Script>

      {/* Fallback kalau user matiin Javascript di browsernya */}
      <noscript>
        <a href="/" target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="//sstatic1.histats.com/0.gif?4828760&101" alt="Histats" style={{ border: 0 }} />
        </a>
      </noscript>
    </>
  );
}
