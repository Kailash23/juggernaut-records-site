import { getPosts } from '../utils/mdx-utils';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import { getGlobalData } from '../utils/global-data';
import SEO from '../components/SEO';

export default function Index({ globalData }) {
  return (
    <Layout>
      <SEO title={globalData.name} description={globalData.name} />
      <Header name={globalData.name} />
      <main className="w-full">
        <h1 className="mt-3 text-lg text-center opacity-60 px-10">
          {globalData.line1}
        </h1>
        <h1 className="mt-3 text-lg text-center opacity-60 px-10">
          {globalData.line2}
        </h1>
        <h1 className="mt-3 text-lg text-center opacity-60 px-10">
          {globalData.line3}
        </h1>
        <h1 className="mt-3 text-lg text-center opacity-60 px-10">
          {globalData.line4}
        </h1>
      </main>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60"
      />
      <GradientBackground
        variant="large"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}

export function getStaticProps() {
  const posts = getPosts();
  const globalData = getGlobalData();

  return { props: { posts, globalData } };
}
