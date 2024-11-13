// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Sketch to Image Generator',
  description: 'Generate images from sketches using AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex items-center justify-center min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
