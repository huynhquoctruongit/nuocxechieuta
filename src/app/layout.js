import "./globals.css";
import Wrapper from "@/components/layout/index"
import { Space_Mono } from "next/font/google";



const spaceMono = Space_Mono({
  subsets: ["vietnamese"],
  weight: ["400",  "700"],
  style: ["italic", "normal"]
});

export const metadata = {
  title: "Đặt cơm đi mấy ní",
  description: "Nước xế chiều tà",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.className} antialiased`}
      >
        <Wrapper>
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
