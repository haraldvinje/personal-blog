import Link from 'next/link'
import { PostCardData } from 'pages'
import Image from 'next/image'
import { RichText, urlFor } from 'components/RichText'
import { Category } from 'components/Category'
import { formatDate } from 'lib/utils'
import { useWidthMediaQuery } from 'lib/hooks/useWidthMediaQuery'

const BlogPostCard = ({ post }: { post: PostCardData }) => {
  const { title, categories, mainImage, publishedAt, introduction, slug, estimatedReadingTime } =
    post
  const wideEnough = useWidthMediaQuery(800)
  const linkRef = `/post/${slug}`
  return (
    <div className="scale-90 rounded-md border border-slate-400 p-2 shadow-sm transition ease-in-out hover:shadow-xl sm:mb-8 sm:scale-100">
      <div className="ml-4">
        <div className="my-2 flex items-center space-x-2">
          {wideEnough && (
            <Link href={linkRef} passHref>
              <a>
                <div style={{ width: '200px' }}>
                  <Image
                    src={urlFor(mainImage).url()}
                    alt="mainImage"
                    width={200}
                    height={200}
                    quality={100}
                    placeholder="blur"
                    blurDataURL="mountains.avif"
                  />
                </div>
              </a>
            </Link>
          )}
          <div>
            <Link href={linkRef} passHref>
              <a className="text-2xl font-bold hover:text-blue-600">{title}</a>
            </Link>
            <div className="my-2 text-xs opacity-60">
              {`${formatDate(publishedAt)} - ${estimatedReadingTime} min lesning`}
            </div>
            <RichText className="mr-6 text-sm" value={introduction} />
          </div>
        </div>
        {categories?.map((category, index) => (
          <Category key={index} value={category} />
        ))}
      </div>
    </div>
  )
}

export default BlogPostCard
