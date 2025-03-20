import React from "react";

import Footer from "./components/Footer";
import ForkMe from "./components/ForkMe";
import Header from "./components/Header";
import Tabs from "./components/Tabs";

export default function App(): JSX.Element {
  return (
    <>
      <ForkMe />
      <Header />
      <Tabs />
      <Footer />
    </>
  );
}
