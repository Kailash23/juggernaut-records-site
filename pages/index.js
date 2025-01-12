import { getPosts } from '../utils/mdx-utils';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Layout, { GradientBackground } from '../components/Layout';
import { getGlobalData } from '../utils/global-data';
import SEO from '../components/SEO';
import { FaInstagram, FaSpotify, FaYoutube } from 'react-icons/fa';
import '../services/firebase.ts';

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

        {/* Artist Profiles */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-10">
            Artist Profiles
          </h2>

          {/* Profile: Saurabh Sam */}
          <div className="mb-10 py-8 px-6 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Saurabh Sam</h3>
            <ul className="flex justify-center space-x-10">
              <li>
                <a
                  href="https://www.instagram.com/saurabhsammusic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-pink-400 hover:scale-110 transition duration-300 text-4xl"
                >
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a
                  href="https://open.spotify.com/artist/2t6ezfKsJuEeJw1tLQCXed?si=SZMF5oQFSxeujX-ZgYJH0A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-400 hover:scale-110 transition duration-300 text-4xl"
                >
                  <FaSpotify />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@saurabhsammusic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-red-400 hover:scale-110 transition duration-300 text-4xl"
                >
                  <FaYoutube />
                </a>
              </li>
            </ul>
          </div>

          {/* Profile: Dxlla */}
          <div className="py-8 px-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Dxlla</h3>
            <ul className="flex justify-center space-x-10">
              <li>
                <a
                  href="https://www.instagram.com/yxngdxlla/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-pink-400 hover:scale-110 transition duration-300 text-4xl"
                >
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a
                  href="https://open.spotify.com/artist/5xkhaQwF5f3zcBQrGRfWGp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-400 hover:scale-110 transition duration-300 text-4xl"
                >
                  <FaSpotify />
                </a>
              </li>
            </ul>
          </div>
        </div>
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
