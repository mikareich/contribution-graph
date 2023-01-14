import Image from "next/image";
import styles from "../styles/Home.module.css";
import themes, { ColorTheme } from "../utils/themes";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "../components/ThemeProvider";

const generateImageURL = (username: string, theme: ColorTheme) =>
  `/api/graph?username=${username}&theme=${theme.name}`;

const generateContributionsURL = (username: string) =>
  `/api/contributions?username=${username}`;

export default function Home() {
  const [currentTheme, setTheme] = useTheme();
  const [username, setUsername] = useState("mikareich");
  const [imageURL, setImageURL] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const changeTheme = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = themes.find((theme) => theme.name === e.target.value);
    if (!theme) return;

    setTheme(theme);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(false);
    setFirstLoad(false);

    setImageURL(generateImageURL(username, currentTheme!));
  };

  const handleImageLoad = () => {
    setError(false);
    setLoading(false);
  };

  const handleImageError = () => {
    if (firstLoad) return;

    console.log("error");

    setLoading(false);
    setError(true);
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
        <Link
          target="_blank"
          href={generateImageURL(
            username || "YOUR_USERNAME_HERE",
            currentTheme!
          )}
        >
          image
        </Link>{" "}
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
        {!firstLoad && (
          <>
            <Image
              className={`${styles.image}`}
              src={imageURL}
              alt="GitHub Contribution Graph"
              width={1040}
              height={240}
              onLoadingComplete={handleImageLoad}
              onError={handleImageError}
              style={{ width: loading || error ? "0.01px" : "100%" }}
            />
            {error && (
              <p className={styles.error}>
                There was an error loading the image. Please check your username
                and try later again.
              </p>
            )}
            {loading && (
              <p className={styles.loading}>Generating your graph...</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
