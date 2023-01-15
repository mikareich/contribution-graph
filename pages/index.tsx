import Image from "next/image";
import styles from "../styles/Home.module.css";
import themes, { ColorTheme } from "../utils/themes";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "../components/ThemeProvider";
import ContributionGraph from "../utils/ContributionGraph";

const generateContributionsURL = (username: string) =>
  `/api/contributions?username=${username}`;

// generates base64 image data url
const generateImageURL = async (username: string, theme: ColorTheme) => {
  const canvas = document.createElement("canvas");

  const contributionRes = await fetch(generateContributionsURL(username));
  const contributions = await contributionRes.json();

  const graph = new ContributionGraph(
    username,
    contributions || [],
    theme,
    2,
    canvas
  );

  return graph.generateImageDataURL();
};

export default function Home() {
  const [currentTheme, setTheme] = useTheme();
  const [username, setUsername] = useState("mikareich");
  const [imageURL, setImageURL] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [blobURL, setBlobURL] = useState("");

  const changeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = themes.find((theme) => theme.name === e.target.value);
    if (!theme) return;

    setTheme(theme);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const url = await generateImageURL(username, currentTheme);
      setImageURL(url);
      setStatus("idle");

      const blob = await fetch(url).then((res) => res.blob());
      setBlobURL(URL.createObjectURL(blob));
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>GitHub Contribution Graph</h1>
        <h3 className={styles.subtitle}>
          Generate your own GitHub contribution graph image with custom colors!
        </h3>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="username">
          <span>GitHub username</span>
          <input
            className={styles.input}
            id="username"
            value={username}
            placeholder="Your GitHub username"
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
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
        GitHub Contribution Graph. You can also fetch the{" "}
        <a target="_blank" href={blobURL} rel="noreferrer">
          image
        </a>{" "}
        and{" "}
        <Link
          target="_blank"
          href={generateContributionsURL(username || "YOUR_USERNAME_HERE")}
        >
          your data
        </Link>{" "}
        from the API endpoint. This project is developed by{" "}
        <a href="https://github.com/mikareich">mikareich</a>.
      </p>

      <section className={styles.imageSection}>
        {status === "loading" && (
          <p className={styles.loading}>Generating your graph...</p>
        )}

        {status === "error" && (
          <p className={styles.error}>
            There was an error loading the image. Please check your username and
            try later again.
          </p>
        )}

        {status === "idle" && (
          <Image
            className={`${styles.image}`}
            src={imageURL}
            alt={`GitHub contribution graph for ${username}`}
            width={1}
            height={1}
          />
        )}
      </section>
    </div>
  );
}
