import { GetStaticProps } from 'next';
import { Header } from '../components/Header';

import { getPrismicClient } from '../services/prismic';
import Prismic from "@prismicio/client";
import { RichText } from 'prismic-dom';

import { formatDate } from '../utils/formatDate';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head';

import { FaCalendarAlt, FaUserAlt } from "react-icons/fa"

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {

  const { results } = postsPagination;

  return (
    <>
      <Head>
        <title>Home | Space Traveling</title>
      </Head>
      <div className={styles.homeContainer}>
        <Header />

        {results.map(post => {
          return (
            <section key={post.uid}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <span><FaCalendarAlt />{post.data.author}</span>
              <span><FaUserAlt />{post.first_publication_date}</span>
            </section>
          )
        })}

      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    pageSize: 20,
  });

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: formatDate(post.first_publication_date),
      data: {
        title: (post.data.title),
        subtitle: (post.data.subtitle),
        author: (post.data.subtitle)
      }
    }
  });

  return {
    props: {
      postsPagination: {
        next_page: null,
        results: posts,
      }
    }
  }
};
