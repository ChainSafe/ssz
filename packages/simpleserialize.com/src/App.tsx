import React from "react";

import ForkMe from "./components/ForkMe";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import Footer from "./components/Footer";

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
