import { GetStaticProps } from 'next';
import { Header } from '../components/Header';

import { getPrismicClient } from '../services/prismic';
import Prismic from "@prismicio/client";
import { RichText } from 'prismic-dom';

import { formatDate } from '../utils/formatDate';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Head from 'next/head';

import { FiCalendar, FiUser } from "react-icons/fi";
import { useState } from 'react';
import Link from 'next/link';

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

  const { results, next_page } = postsPagination;

  const [posts, setPosts] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState<string>(next_page);

  const loadNextPage = async () => {

  }

  return (
    <>
      <Head>
        <title>Home | Space Traveling</title>
      </Head>
      <Header />
      <div className={styles.homeContainer}>
        {posts.map(post => {
          return (
            <Link href={`/post/${post.uid}`} >
              <a key={post.uid}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div>
                  <span><FiCalendar />{post.data.author}</span>
                  <span><FiUser />{post.first_publication_date}</span>
                </div>
              </a>
            </Link>
          )
        })}

        {nextPage && (
          <footer>
            <button>Carregar mais posts</button>
          </footer>
        )}
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
    pageSize: 2,
  });

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: formatDate(post.first_publication_date),
      data: {
        title: (post.data.title),
        subtitle: (post.data.subtitle),
        author: (post.data.author)
      }
    }
  });

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts,
      }
    }
  }
};
