export const metadata = {
  title: "Cooking Forum",
};

import './global.scss';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Cooking Forum</h1>
        </header>
        <div id="box">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
