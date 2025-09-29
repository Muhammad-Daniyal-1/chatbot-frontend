(function() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const widgetUrl = 'https://chat.tensoftworks.com'; // 실제 Next.js 앱 URL

  function init() {
    // Create a wrapper div for the widget at the root level
    const widgetWrapper = document.createElement('div');
    widgetWrapper.id = 'supernova-widget-wrapper';
    widgetWrapper.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      pointer-events: none;
    `;
    document.documentElement.appendChild(widgetWrapper);

    // Add styles
    const style = document.createElement('style');
    style.innerHTML = `
      #custom-widget-btn {
        position: relative;
        width: 60px;
        height: 60px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        background-color: #4452F9;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        pointer-events: auto;
      }

      #custom-widget-btn:hover {
        background-color: #1c1c1c;
        transform: translateY(-2px);
      }

      #custom-widget-btn svg {
        width: 32px;
        height: 32px;
        fill: currentColor;
      }

      #custom-widget-iframe-wrapper {
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 400px;
        height: 650px;
        background-color: transparent;
        z-index: 2147483646;
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        pointer-events: auto;
      }

      #custom-widget-iframe {
        width: 400px;
        height: 650px;
        border: none;
        border-radius: 12px;
        background-color: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      #custom-widget-iframe::-webkit-scrollbar {
        width: 2px;
      }

      #custom-widget-iframe::-webkit-scrollbar-track {
        background: transparent;
      }

      #custom-widget-iframe::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }

      #custom-widget-iframe::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    `;
    document.head.appendChild(style);

    // Create button with SVG
    const btn = document.createElement('button');
    btn.id = 'custom-widget-btn';
    
    // Create overlay div
    const overlay = document.createElement('div');
    overlay.id = 'custom-widget-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 2147483645;
      display: none;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);

    // Chat bubble SVG
    const chatBubbleSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
    </svg>`;

    // Close X SVG
    const closeSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>`;

    btn.innerHTML = chatBubbleSVG;
    widgetWrapper.appendChild(btn);

    let isOpen = false;
    let iframeWrapper;

    // Handle button click
    btn.addEventListener('click', function() {
      if (isMobile) {
        window.open(widgetUrl, '_blank');
      } else {
        if (!isOpen) {
          if (!iframeWrapper) {
            iframeWrapper = document.createElement('div');
            iframeWrapper.id = 'custom-widget-iframe-wrapper';

            const iframe = document.createElement('iframe');
            iframe.id = 'custom-widget-iframe';
            iframe.src = widgetUrl + '?widget=true';
            iframe.sandbox = 'allow-scripts allow-popups allow-forms allow-same-origin allow-top-navigation';
            iframe.style.cssText = `
              width: 400px;
              height: 650px;
              border: none;
              border-radius: 12px;
              background-color: white;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            `;

            iframeWrapper.appendChild(iframe);
            widgetWrapper.appendChild(iframeWrapper);

            // Close on background click
            iframeWrapper.addEventListener('click', (e) => {
              if (e.target === iframeWrapper) {
                iframeWrapper.style.display = 'none';
                overlay.style.display = 'none';
                isOpen = false;
                btn.innerHTML = chatBubbleSVG;
              }
            });
          } else {
            iframeWrapper.style.display = 'flex';
          }
          overlay.style.display = 'block';
          btn.innerHTML = closeSVG;
        } else {
          iframeWrapper.style.display = 'none';
          overlay.style.display = 'none';
          btn.innerHTML = chatBubbleSVG;
        }
        isOpen = !isOpen;
      }
    });
  }

  // Check if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init(); // Execute immediately if DOM is already loaded
  }
})(); 