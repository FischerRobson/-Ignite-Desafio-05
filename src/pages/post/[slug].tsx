import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';
import Prismic from "@prismicio/client";

import commonStyles from '../../styles/common.module.scss';
import { formatDate } from '../../utils/formatDate';
import styles from './post.module.scss';

import { FiCalendar, FiUser, FiClock } from "react-icons/fi";
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  const router = useRouter();

  const totalPostWordsBody = RichText.asText(
    post.data.content.reduce((acc, data) => [...acc, ...data.body], [])
  ).split(' ').length;

  const totalPostWordsHeading = post.data.content.reduce((acc, data) => {
    if (data.heading) {
      return [...acc, ...data.heading.split(' ')];
    }
    return [...acc];
  }, []).length;

  const totalReadTime = Math.ceil((totalPostWordsBody + totalPostWordsHeading) / 200);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Header />

      {post.data.banner.url && (
        <div className={styles.imageContainer}>
          <img src={post.data.banner.url} alt={post.data.title} />
        </div>
      )}

      <div className={styles.postContainer}>
        <h1>{post.data.title}</h1>
        <section>
          <span>
            <FiCalendar />{formatDate(post.first_publication_date)}
          </span>
          <span>
            <FiUser />
            {post.data.author}
          </span>
          <span>
            <FiClock />
            {totalReadTime} min
          </span>
        </section>

        <main>
          {post.data.content.map(({ heading, body }) => (
            <div key={heading}>
              {heading && <h2 className={styles.heading}>{heading}</h2>}

              <div
                className={styles.postBody}
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(body) }}
              />
            </div>
          ))}
        </main>
      </div>

    </>
  )

}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    { pageSize: 20 }
  );

  const paths = posts.results.map(result => {
    return {
      params: {
        slug: result.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ req, params }) => {

  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', slug, {});

  const post = {
    ...response,
    //first_publication_date: formatDate(response.first_publication_date),
    // data: {
    //   ...response.data,
    //   content: RichText.asHtml(response.data.content),
    // }
  };

  return {
    props: {
      post
    },
    revalidate: 60 * 60 * 24 //24 horas
  }
};
