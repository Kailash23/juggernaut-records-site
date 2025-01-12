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
      </main>
      <div className="mt-12">
        <h2 className="text-4xl font-extrabold text-center text-gradient mb-10">
          Artist Profiles
        </h2>

        {/* Profile: Saurabh Sam (Artist) */}
        <div className="mb-10 py-10 px-8 bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 rounded-3xl shadow-xl text-center transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <span className="text-4xl text-purple-700">
                🎤 {/* Icon for lyrical representation */}
              </span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Saurabh Sam</h3>
          <p className="text-white opacity-90 mb-6 text-sm px-4 leading-relaxed">
            A lyrical powerhouse redefining the essence of hip-hop with
            heartfelt lyrics and hard-hitting bars.
          </p>
          <ul className="flex justify-center space-x-6">
            <li>
              <a
                href="https://www.instagram.com/saurabhsammusic/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-300 hover:scale-125 transition duration-300 text-5xl"
              >
                <FaInstagram />
              </a>
            </li>
            <li>
              <a
                href="https://open.spotify.com/artist/2t6ezfKsJuEeJw1tLQCXed?si=SZMF5oQFSxeujX-ZgYJH0A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-green-300 hover:scale-125 transition duration-300 text-5xl"
              >
                <FaSpotify />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/@saurabhsammusic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-300 hover:scale-125 transition duration-300 text-5xl"
              >
                <FaYoutube />
              </a>
            </li>
          </ul>
        </div>

        {/* Profile: Dxlla (Beat Producer) */}
        <div className="py-10 px-8 bg-gradient-to-br from-gray-900 via-purple-700 to-blue-500 rounded-3xl shadow-xl text-center transform hover:scale-105 transition-transform duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <span className="text-4xl text-purple-700">
                🎵 {/* Icon for beat production */}
              </span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Dxlla</h3>
          <p className="text-white opacity-90 mb-6 text-sm px-4 leading-relaxed">
            A beatmaker blending modern beats with timeless rhythms, creating
            auditory masterpieces.
          </p>
          <ul className="flex justify-center space-x-6">
            <li>
              <a
                href="https://www.instagram.com/yxngdxlla/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-300 hover:scale-125 transition duration-300 text-5xl"
              >
                <FaInstagram />
              </a>
            </li>
            <li>
              <a
                href="https://open.spotify.com/artist/5xkhaQwF5f3zcBQrGRfWGp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-green-300 hover:scale-125 transition duration-300 text-5xl"
              >
                <FaSpotify />
              </a>
            </li>
          </ul>
        </div>
      </div>

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
