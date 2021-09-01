import axios from "axios";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import moment from "moment";
import { useState, useEffect, useRef } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';

const Home = () => {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);

  const GenerateStarDate = () => {
    let date = new Date();
    date.setDate(date.getDate() - 30);
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    if (day.length < 2)
      day = "0" + day;
    if (month.length < 2)
      month = "0" + month;
    const stringDate = date.getFullYear() + "-" + month + "-" + day;
    return stringDate;
  }

  // Get Data From Github Using Axios
  const getReposData = async () => {
    const startdate = GenerateStarDate();
    const API_REQUEST = `https://api.github.com/search/repositories?q=created:>${startdate}&sort=stars&order=desc&page=${page}`;
    const { data } = await axios.get(API_REQUEST);
    setRepos([...repos, ...data.items]);
  };

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
        <InfiniteScroll dataLength={repos.length} hasMore={true} next={() => setPage(page + 1)} className={styles.container}>
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
        </InfiniteScroll>
      </main>
    </div>
  );
};
export default Home;
