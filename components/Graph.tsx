import styles from "../styles/Graph.module.css";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import ContributionGraph from "../utils/ContributionGraph";
import { ColorTheme } from "../utils/themes";
import Image from "next/image";

interface GraphProps {
  username: string;
}

type Status = "completed" | "loading" | "error";

// generates base64 image data url
const generateImageURL = async (username: string, theme: ColorTheme) => {
  const canvas = document.createElement("canvas");

  const contributionRes = await fetch(
    `/api/contributions?username=${username}`
  );
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

function Graph({ username }: GraphProps) {
  const [theme] = useTheme();
  const [status, setStatus] = useState<Status>();
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    if (!username) return;

    setStatus("loading");

    generateImageURL(username, theme)
      .then((url) => {
        setImageURL(url);
        setStatus("completed");
      })
      .catch(() => setStatus("error"));
  }, [username, theme]);

  return (
    <section className={styles.container}>
      {status === undefined && (
        <p>Enter your GitHub username to generate your graph.</p>
      )}
      {status === "loading" && <p>Generating your graph...</p>}
      {status === "error" && (
        <p>
          There was an error loading the image. Please check your username and
          try later again.
        </p>
      )}
      {status === "completed" && (
        <Image
          className={`${styles.graph}`}
          src={imageURL}
          alt={`GitHub contribution graph for ${username}`}
          width={1}
          height={1}
        />
      )}
    </section>
  );
}

export default Graph;
