"use client";

export default function DarkModeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var t = localStorage.getItem('arsorandi-theme');
              if (t === 'dark') { document.documentElement.classList.add('dark'); }
              else if (t === 'night') { document.documentElement.classList.add('night'); }
              else if (!t && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}
