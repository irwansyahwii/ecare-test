import Image from "next/image";
import styles from "./page.module.css";

import { StrictMode } from "react";
import { LayoutFlowClientSide } from "./components/LayoutFlow";

export default function Home() {
  return (
    <div id="root">

      <LayoutFlowClientSide></LayoutFlowClientSide>
    </div>
  );
}
