import "./globals.css";
import Script from 'next/script';
import { GA_TRACKING_ID } from '../lib/gtag';
import GoogleAnalytics from '../components/GoogleAnalytics';
import WidgetStyle from '../components/WidgetStyle';

export const metadata = {
  title: "텐소프트웍스 AI 에이전트",
  description: "AI 데이터 솔루션 기업 텐소프트웍스(Ten Softworks)는 산업별 맞춤형 AI 플랫폼을 개발합니다. AI 에이전트와 대화하며 기업 정보, 서비스 설명, 비즈니스 제안, 기술 지원 등 다양한 콘텐츠를 실시간으로 확인해보세요.",
  openGraph: {
    title: "텐소프트웍스 AI 에이전트",
    description: "AI 데이터 솔루션 기업 텐소프트웍스(Ten Softworks)는 산업별 맞춤형 AI 플랫폼을 개발합니다. AI 에이전트와 대화하며 기업 정보, 서비스 설명, 비즈니스 제안, 기술 지원 등 다양한 콘텐츠를 실시간으로 확인해보세요.",
    url: "https://tensoftworks.com", 
    siteName: "텐소프트웍스",
    images: [
      {
        url: "/og-image.png", // public 폴더에 og-image.png 파일을 추가해야 합니다
        width: 1200,
        height: 630,
        alt: "텐소프트웍스 AI 에이전트",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "텐소프트웍스 AI 에이전트",
    description: "AI 데이터 솔루션 기업 텐소프트웍스(Ten Softworks)는 산업별 맞춤형 AI 플랫폼을 개발합니다. AI 에이전트와 대화하며 기업 정보, 서비스 설명, 비즈니스 제안, 기술 지원 등 다양한 콘텐츠를 실시간으로 확인해보세요.",
    images: ["/og-image.png"], // public 폴더에 og-image.png 파일을 추가해야 합니다
  },
};

export default function RootLayout({ children }) {
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        <WidgetStyle />
        {isProd && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-pretendard antialiased">
        {isProd && <GoogleAnalytics />}
        {children}
      </body>
    </html>
  );
}
