import axios from "axios";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import moment from "moment";
import { useState, useEffect, useRef } from "react";

const Home = () => {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const container = useRef();

  // Get Data From Github Using Axios
  const getReposData = async () => {
    const url = `https://api.github.com/search/repositories?q=created:%3E2017-10-22&sort=stars&order=desc&page=${page}`;
    const response = await axios.get(url);
    setRepos([...repos, ...response.data.items]);
  };

  // Load New Data when scrolling
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > container.current.offsetHeight - 700)
        setPage(page + 1);
    });
  }, []);

  // Load Data If Scroll
  useEffect(() => {
    getReposData();
  }, [page]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Gemography Code Challenge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div ref={container} className={styles.container}>
          {repos &&
            repos.map((repo) => (
              <div key={repo.id} className={styles.card}>
                <div className={styles.card_image}>
                  <img src={repo.owner.avatar_url} alt="" />
                </div>
                <div className={styles.card_info}>
                  <h2 className={styles.card_title}>{repo.name}</h2>
                  <p className={styles.card_description}>{repo.description}</p>
                  <div className={styles.card_footer}>
                    <div
                      className={styles.stars_nb}
                    >{`Stars: ${repo.stargazers_count}`}</div>
                    <div className={styles.issues_nb}>
                      {`Issues: ${repo.open_issues_count}`}
                    </div>
                    <p>
                      {`Submitted ${moment(repo.created_at)
                        .startOf()
                        .fromNow()} by ${repo.owner.login}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};
export default Home;
