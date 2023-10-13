export const metadata = {
  title: "Cooking Forum",
};

import "./global.scss";
import ProfileIcon from "@/features/svgs/ProfileIcon";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Cooking Forum</h1>
        </header>
        <main>
          <div id="content">{children}</div>
          <ProfileIcon />
        </main>
      </body>
    </html>
  );
}
