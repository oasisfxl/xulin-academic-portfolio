"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./FolderLink.module.css";

type FolderLinkProps = {
  href: string;
  label: string;
  meta: string;
  color?: string;
};

function darkenColor(hex: string, amount: number) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value.split("").map((character) => character + character).join("")
    : value;
  const number = Number.parseInt(normalized, 16);
  const channel = (shift: number) =>
    Math.max(0, Math.floor(((number >> shift) & 0xff) * (1 - amount)));
  return `#${[channel(16), channel(8), channel(0)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function FolderLink({
  href,
  label,
  meta,
  color = "#8c99ad",
}: FolderLinkProps) {
  return (
    <motion.div whileTap={{ scale: 0.975 }}>
      <Link className={styles.link} href={href}>
        <span className={styles.folderStage} aria-hidden="true">
          <span
            className={styles.folder}
            style={
              {
                "--folder-color": color,
                "--folder-back-color": darkenColor(color, 0.14),
              } as CSSProperties
            }
          >
            <span className={styles.back} />
            <span className={styles.paper} />
            <span className={styles.paper} />
            <span className={styles.paper} />
            <span className={styles.front} />
            <span className={styles.frontRight} />
          </span>
        </span>
        <span className={styles.label}>
          <span className={styles.title}>{label}</span>
          <span className={styles.meta}>{meta}</span>
        </span>
      </Link>
    </motion.div>
  );
}
