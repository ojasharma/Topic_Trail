import React from "react";
import styles from "./Footer.module.css"; // Import the CSS module

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>
          <a
            href="https://github.com/dieselsharma"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/github-logo.png"
              alt="GitHub"
              className={styles.githubIcon}
            />
          </a>
          Backend & UI/UX by Ojasvi
        </p>

        <p>
          <a
            href="https://github.com/namita3599"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/github-logo.png"
              alt="GitHub"
              className={styles.githubIcon}
            />
          </a>
          Frontend & UI/UX by Namita
        </p>
      </div>
    </footer>
  );
};

export default Footer;
