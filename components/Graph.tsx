import styles from "../styles/Graph.module.css";

import { useEffect, useRef, useState } from "react";
import { useBlobURL, useTheme } from "./ContextProvider";
import generateGraph from "../utils/ContributionGraph";
import loadingAnimation from "../utils/ContributionGraph/loadingAnimation";
import { ContributionYear } from "../utils/getContributions";
import errorAnimation from "../utils/ContributionGraph/errorAnimation";

interface GraphProps {
  username: string;
}

type Status = "completed" | "loading" | "error";

function Graph({ username }: GraphProps) {
  const [theme] = useTheme();
  const [, setBlobURL] = useBlobURL();
  const [status, setStatus] = useState<Status>();
  const [contributions, setContributions] = useState<ContributionYear[]>([]);
  const loadingCanvasRef = useRef<HTMLCanvasElement>(null);
  const errorCanvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let clearInterval: () => void;

    if (status === "loading") {
      const canvas = loadingCanvasRef.current;
      if (canvas) clearInterval = loadingAnimation(canvas, theme);
    }

    if (status === "error") {
      const canvas = errorCanvasRef.current;
      if (canvas) errorAnimation(canvas, theme);
    }

    return () => clearInterval && clearInterval();
  }, [status, theme]);

  useEffect(() => {
    if (!contributions.length) return;

    // Generate the graph
    const canvas = graphCanvasRef.current;
    const userDetails = {
      name: username,
      contributions,
    };

    const scale = window.devicePixelRatio || 1;

    if (canvas) {
      generateGraph(userDetails, canvas, theme, scale);

      // Generate the blob URL
      canvas.toBlob((blob) => {
        if (blob) setBlobURL(URL.createObjectURL(blob));
      });
    }
  }, [username, theme, contributions, setBlobURL]);

  useEffect(() => {
    if (!username) return;

    const loadGraph = async () => {
      const contributionRes = await fetch(
        `/api/contributions?username=${username}`
      );

      if (!contributionRes.ok) return setStatus("error");

      const contributions = await contributionRes.json();

      setContributions(contributions);
      setStatus("completed");
    };

    setStatus("loading");
    loadGraph();
  }, [username]);

  return (
    <section className={styles.container}>
      {status === undefined && (
        <p>Enter your GitHub username to generate your graph.</p>
      )}
      {status === "loading" && (
        <>
          <canvas ref={loadingCanvasRef} />
          <p>Generating your graph...</p>
        </>
      )}
      {status === "error" && (
        <>
          <canvas ref={errorCanvasRef} />
          <p>
            There was an error loading the image. Please check your username and
            try later again.
          </p>
        </>
      )}
      {status === "completed" && (
        <canvas className={styles.graph} ref={graphCanvasRef} />
      )}
    </section>
  );
}

export default Graph;
