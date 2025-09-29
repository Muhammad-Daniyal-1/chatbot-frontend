export const GA_TRACKING_ID = 'G-PHFV5FTYEE';

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
}; 