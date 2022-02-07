import Head from 'next/head';
import { getLanguage } from '../langauge/language';

const fallBackLogo =
  'https://storage.googleapis.com/awake-d48d9.appspot.com/photos/45a90398551c4ccaa2c2f263815186683f094e94984453b0.jpg';
const fallBackDescription = getLanguage().awakeDescription;

export default function CustomHeader(props: { title: string; description?: string; image?: string }) {
  console.log('here', props);
  return (
    <Head>
      <title>{props.title}</title>
      <meta property='og:title' content={props.title} />
      <meta property='og:description' content={props?.description || fallBackDescription} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta property='og:image' content={props?.image || fallBackLogo} />
      <meta property='og:image:width' content='900' />
      <meta property='og:image:height' content='470' />
    </Head>
  );
}
