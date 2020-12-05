import Head from "next/head"
import Layout, { siteTitle } from "../components/layout"
import Date from "../components/date"
import utilStyles from "../styles/utils.module.css"
import { getSortedPostsData } from "../lib/posts"
import Link from "next/link"
import { GetStaticProps } from "next"

export default function Home({ postsData }) {
  return (
    <Layout home={true}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          <a href="https://github.com/thangpham7793">Git</a>{" "}
          <a href="https://www.linkedin.com/in/thangpham7793/">Linkedin</a>
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {postsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}

//this acts like a container component
export const getStaticProps: GetStaticProps = async (_) => {
  const postsData = getSortedPostsData()
  return { props: { postsData } }
}
