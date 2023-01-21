import styles from "../styles/Home.module.css";
import themes from "../utils/themes";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "../components/ThemeProvider";
import Head from "next/head";
import Graph from "../components/Graph";

const generateContributionsURL = (username: string) =>
  `/api/contributions?username=${username}`;

export default function Home() {
  const [currentTheme, setTheme] = useTheme();
  const [username, setUsername] = useState("");
  const [blobURL, setBlobURL] = useState("");

  const changeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = themes.find((theme) => theme.name === e.target.value);
    if (!theme) return;

    setTheme(theme);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = e.currentTarget.username.value;
    if (user) setUsername(user);
  };

  return (
    <>
      <Head>
        <title>GitHub Contribution Graph</title>
        <meta
          name="description"
          content="Generate your own GitHub contribution graph image with custom colors!"
        />
      </Head>

      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.title}>GitHub Contribution Graph</h1>
          <h3 className={styles.subtitle}>
            Generate your own GitHub contribution graph image with custom
            colors!
          </h3>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="username">
            <span>GitHub username</span>
            <input
              className={styles.input}
              id="username"
              placeholder="Your GitHub username"
              autoComplete="off"
              name="username"
            />
          </label>
          <label className={styles.label} htmlFor="theme">
            <span>Theme</span>
            <select
              className={styles.input}
              id="theme"
              onChange={changeTheme}
              defaultValue={currentTheme?.name}
            >
              {themes.map((theme) => (
                <option key={theme.name} value={theme.name}>
                  {theme.name}
                </option>
              ))}
            </select>
          </label>
          <button className={styles.button} type="submit">
            Generate Image
          </button>
        </form>

        <p className={styles.description}>
          Please enter a GitHub username and select a theme to generate your
          GitHub Contribution Graph. You can also fetch the
          <a target="_blank" href={blobURL} rel="noreferrer">
            {" "}
            image{" "}
          </a>
          and{" "}
          <a
            target="_blank"
            href={generateContributionsURL(username || "YOUR_USERNAME_HERE")}
            rel="noreferrer"
          >
            {" "}
            your data
          </a>{" "}
          from the API endpoint. This project is developed by{" "}
          <a href="https://github.com/mikareich">mikareich</a>.
        </p>

        <Graph username={username} />
      </div>
    </>
  );
}
