/* eslint-disable @next/next/no-img-element */

import groq from 'groq'
import client from 'lib/sanityClient'
import { formatAuthors, formatDate } from 'lib/utils'
import {
  RichText,
  SanityImage,
  urlFor,
  PortableTextIntro,
  PortableTextBody
} from 'components/RichText'
import { Category } from 'components/Category'
import Metatags from 'components/Metatags'
import { ShareButtons } from 'components/ShareButtons'

export interface Post {
  title: string
  authors: string[]
  slug: string
  mainImage: SanityImage
  categories?: string[]
  publishedAt: string
  introduction: PortableTextIntro
  body: PortableTextBody
}

const Post = ({ post }: { post: Post }) => {
  const { title, authors, categories, mainImage, publishedAt, introduction, body, slug } = post

  return (
    <>
      <Metatags
        title={title}
        description={(introduction as PortableTextIntro)?.[0]?.text || ''}
        image={urlFor(mainImage).url()}
        url={`tekblogg.dev/post/${slug}`}
      />
      <article className="prose w-full lg:prose-xl">
        <h1 className="flex justify-center">{title}</h1>
        <div className="flex flex-col space-y-2">
          <span className="flex items-center justify-between">
            <i>{formatAuthors(authors)}</i>
            <ShareButtons />
          </span>
          <p>
            <b>{formatDate(publishedAt)}</b>
          </p>
        </div>
        {categories && (
          <>
            <div className="flex">
              <span className="mr-2">
                <i>Kategorier:</i>
              </span>
              {categories.map((category, index) => (
                <Category key={index} value={category} />
              ))}
            </div>
          </>
        )}
        <div className="text-xl font-bold">
          <RichText value={introduction} />
        </div>
        {mainImage && (
          <img
            className="w-full"
            alt={'mainImage'}
            loading="lazy"
            src={urlFor(mainImage).fit('max').auto('format').url()}
          />
        )}
        <RichText value={body} />
        <ShareButtons className="justify-center" />
      </article>
    </>
  )
}

export const getStaticPaths = async () => {
  const paths: string[] = await client.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  )

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params }: { params: { slug: string } }) => {
  const { slug = '' } = params

  const post: Post[] = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      title,
      "authors": authors[]->name,
      slug,
      "categories": categories[]->title,
      "publishedAt": publishedAt,
      mainImage,
      introduction,
      body
    }`,
    { slug: slug }
  )

  if (!post) return { notFound: true }

  return {
    props: {
      post
    },
    revalidate: 60
  }
}

export default Post
