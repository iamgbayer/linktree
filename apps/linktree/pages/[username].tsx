import React from 'react';
import { Link } from '../types/link';
import { Category } from '../types/category';
import Head from 'next/head';
import ProfileHeader from '../src/components/profile/ProfileHeader';
import LinksList from '../src/components/profile/LinksList';
import JoinPrompt from '../src/components/profile/JoinPrompt';
import { linkService } from '../src/services/links';
import { categoryService } from '../src/services/category';

interface UserProfileProps {
  username: string;
  links: Link[];
  categories: Category[];
}

const UserProfile: React.FC<UserProfileProps> = ({ username, links = [], categories = [] }) => {
  return (
    <>
      <Head>
        <title>{username} | Linktree</title>
        <meta name="description" content={`${username}'s links`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8 sm:py-12">
        <div className="w-full max-w-md" data-cy="public-profile-page">
          <ProfileHeader username={username} />
          
          <div data-cy="public-links-container">
            <LinksList links={links} categories={categories} />
          </div>

          <JoinPrompt username={username} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const { params } = context;
  const username = params?.username as string;

  if (!username) {
    return { notFound: true };
  }

  try {
    const [links, categories] = await Promise.all([
      linkService.getLinksByUsername(username),
      categoryService.getCategoriesByUsername(username)
    ]);

    return {
      props: {
        username,
        links: links || [],
        categories: categories || [],
      },
    };
  } catch (error) {
    return {
      props: {
        username,
        links: [],
        categories: [],
      },
    };
  }
};

export default UserProfile; 