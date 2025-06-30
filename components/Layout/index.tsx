import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface AllLayoutProps {
  children: React.ReactNode;
}

const AllLayout: React.FC<AllLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mb-20">{children}</main>
      <Footer />
    </div>
  );
};

export default AllLayout;
