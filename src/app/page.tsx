import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getArticleList } from '@/lib/article-io';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default async function Home() {
    const latestArticles = (await getArticleList()).slice(0, 3);

    return (
        <>
            <div className="w-full relative md:h-[432px] h-64">
                <div className="w-full h-full bg-gray-200">
                    <Image src="/image/galaxy.jpg" width={1330} height={1208} className="w-full h-full object-cover" priority={true} sizes="100vw" alt="Background" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-9/10">
                        <p className="text-white font-bold text-3xl md:text-5xl drop-shadow-lg shadow-black">I&nbsp;love&nbsp;this&nbsp;world because&nbsp;you&apos;re&nbsp;in&nbsp;it!</p>
                        <p className="text-white font-bold text-xl md:text-3xl drop-shadow-lg shadow-black pt-3 md:pt-5">
                            <span lang="ja">皆がいるこの世界が大好き！</span>
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 text-right hidden md:block">
                        <p className="text-white text-xs drop-shadow-lg shadow-black p-2 md">
                            &quot;Firestorm Of Star Birth In The Active Galaxy Centaurus A&quot; by NASA Goddard Photo and Video is licensed under CC BY 2.0.
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 text-right md:hidden">
                        <p className="text-white text-xs drop-shadow-lg shadow-black p-2 md">Background by NASA</p>
                    </div>
                </div>
            </div>
            <div className="max-w-4xl w-full mx-auto mt-8 px-5">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight px-2">Welcome&nbsp;to Jeder&#39;s&nbsp;Blog</h1>
                    <div className="space-y-4 mb-8">
                        <div className="py-8 px-2">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                {/* Left Column - Avatar */}
                                <div className="flex flex-col items-center space-y-2">
                                    <Avatar className="h-32 w-32 md:h-40 md:w-40 mb-6">
                                        <AvatarImage src="https://gravatar.com/avatar/773eb56d1704fa16c6022913b02c9a7a0aba55172b35d5c08311053131c21cfa?s=1024" alt="Ostrichbeta Chan" />
                                        <AvatarFallback>OC</AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-3xl font-semibold">Ostrichbeta Chan</h2>
                                    <s className='text-lg'>Definitly not Lolly</s>
                                </div>

                                {/* Right Column - Introduction */
                                /* eslint-disable */}
                                <div className="space-y-4 text-xl font-light leading-7">
                                    <p>
                                        Hello there! I'm Ostrichbeta Chan, currently residing in East Asia. I'm a passionate Switch and PC gamer.
                                    </p>
                                    <p>
                                        As for my hobbies, I'm a coder and web developer. I create websites for fun, but I'm still learning the ropes with CSS. I'm more familiar with C++, TypeScript,
                                        and Python. Feel free to check out my
                                        <a href="https://github.com/Ostrichbeta" className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                                            GitHub page
                                        </a>
                                        &nbsp;if you're interested!
                                    </p>
                                </div>
                                {/* eslint-enable */}
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold px-2">Latest Articles</h2>

                        {/* Latest Articles List */}
                        {latestArticles.length > 0 ? (
                            <div className="space-y-2">
                                {latestArticles.map((article, index) => {
                                    const { fields, filename } = article;
                                    const date = new Date(fields.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    });

                                    return (
                                        <div key={filename} className="group">
                                            <Link href={`/articles/${filename.substring(0, filename.length - 3)}`}>
                                                <div className="py-2 rounded-lg transition-colors hover:bg-muted/50">
                                                    <h3 className="text-xl font-semibold mb-1 truncate max-w-[95%] px-2">{fields.title}</h3>
                                                    <p className="text-muted-foreground truncate mb-2 px-2">{fields.description}</p>
                                                    <div className="flex items-center px-2">
                                                        <time className="text-sm text-muted-foreground">{date}</time>
                                                        <div className="ml-4">
                                                            {[...article.fields.tags].map((item) => (
                                                                <Badge className="ml-2" variant="secondary" key={item}>
                                                                    {item}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            {index !== latestArticles.length - 1 && <Separator className="my-1" />}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-8">
                                <div className="space-y-4">
                                    <div className="mx-auto bg-muted/50 rounded-full p-4 flex items-center justify-center w-fit">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-8 h-8 text-muted-foreground"
                                        >
                                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                            <path d="M14 2v6h6" />
                                            <path d="M9 15h6" />
                                            <path d="M9 18h6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold tracking-tight">No Articles Yet</h3>
                                    <p className="text-muted-foreground max-w-md">Check back soon for new content!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
