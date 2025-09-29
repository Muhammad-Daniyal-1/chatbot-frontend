'use client';

import { useEffect } from 'react';

export default function WidgetStyle() {
  useEffect(() => {
    const isWidget = new URLSearchParams(window.location.search).get('widget') === 'true';
    if (isWidget) {
      document.documentElement.setAttribute('data-widget', 'true');
      // 모바일 viewport 설정
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=400, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    }
  }, []);

  return (
    <style jsx global>{`
      html[data-widget="true"] {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      html[data-widget="true"]::-webkit-scrollbar {
        display: none;
      }

      html[data-widget="true"] body {
        width: 400px;
        margin: 0;
        padding: 0;
      }
    `}</style>
  );
} 