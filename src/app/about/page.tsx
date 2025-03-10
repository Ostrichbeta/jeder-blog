import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About | Jeder's House",
    description: "Jeder's blog, created by Ostrichbeta Chan",
};

export default async function AboutPage() {
    return (
        <div className="max-w-4xl w-full mx-auto mt-8 px-5">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight px-2">About Me</h1>

                <div className="py-8 px-2">
                    <div className="flex flex-col gap-8 items-center">
                        {' '}
                        {/* Changed to flex column */}
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-2">
                            <Avatar className="h-32 w-32 md:h-40 md:w-40 mb-6">
                                <AvatarImage src="https://gravatar.com/avatar/773eb56d1704fa16c6022913b02c9a7a0aba55172b35d5c08311053131c21cfa?s=1024" alt="Ostrichbeta Chan" />
                                <AvatarFallback>OC</AvatarFallback>
                            </Avatar>
                            <h2 className="text-3xl font-semibold">Ostrichbeta Chan</h2>
                            <s className="text-lg">Definitly not Lolly</s>
                        </div>
                        {/* Content Section */}
                        {/* eslint-disable */}
                        <div className="space-y-6 text-xl font-light leading-8 max-w-2xl w-full">
                            <p>
                                Hi there! I’m Ostrichbeta Chan, currently living in East Asia. I’m a Switch and PC gamer, and I especially love role-playing games. I also enjoy Animal Crossing: New
                                Horizons and am part of several Facebook clubs. And Nintendo Switch Sports is a must-play for me! You might find me in the Spocco Square Discord Server, looking for
                                friends to play with.
                            </p>
                            <p>
                                As for my hobbies, I’m a coder and web developer. I create websites for fun, but I’m still learning the basics of CSS. I’m more familiar with C++, TypeScript, and
                                Python. I’ve also worked with ROS and ROS2, and I participated in the RoboCup competition and Xiaomi Cup, especially in Machine Dog. I’m excited about ESP32 and
                                HomeAssistant, and I’m thinking of making some fun integrations using smart furniture. (But only if I’m feeling lucky!)
                            </p>
                            <p>
                                I’m a native Mandarin speaker, and I can also communicate with people who speak Cantonese and English. If you want to chat, feel free to email me or use the contact
                                details below!
                            </p>
                        </div>
                        {/* eslint-enable */}
                    </div>
                </div>

                <div className="mt-6 mb-8 space-y-6 px-4">
                    <h2 className="text-2xl font-semibold px-2 text-center">Contact Me</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* Discord Card */}
                        <Card className="p-3 bg-[#5865F2] text-white hover:bg-[#4752C4] transition-colors cursor-pointer">
                            <div className="flex flex-col items-center justify-center space-y-1 h-full">
                                <span className="text-lg font-medium">Discord</span>
                                <span className="text-2xl font-semibold">@Ostrich_B</span>
                            </div>
                        </Card>

                        {/* Facebook Card */}
                        <a href="https://www.facebook.com/ostrichbeta.chen/" target="_blank" rel="noopener noreferrer">
                            <Card className="p-3 bg-[#1877F2] text-white hover:bg-[#166FE5] transition-colors h-full">
                                <div className="flex flex-col items-center justify-center space-y-1 h-full">
                                    <span className="text-lg font-medium">Facebook</span>
                                    <span className="text-2xl font-semibold">Ostrichbeta Chan</span>
                                </div>
                            </Card>
                        </a>

                        {/* Steam Card */}
                        <a href="https://steamcommunity.com/id/ostrichbeta/" target="_blank" rel="noopener noreferrer">
                            <Card className="p-3 bg-[#000000] text-white hover:bg-[#1A1A1A] transition-colors h-full">
                                <div className="flex flex-col items-center justify-center space-y-1 h-full">
                                    <span className="text-lg font-medium">Steam</span>
                                    <span className="text-2xl font-semibold">Ostrich_B</span>
                                </div>
                            </Card>
                        </a>

                        {/* Reddit Card */}
                        <a href="https://www.reddit.com/user/ostrichbeta/" target="_blank" rel="noopener noreferrer">
                            <Card className="p-3 bg-[#FF4500] text-white hover:bg-[#E63E00] transition-colors h-full">
                                <div className="flex flex-col items-center justify-center space-y-1 h-full">
                                    <span className="text-lg font-medium">Reddit</span>
                                    <span className="text-2xl font-semibold">u/Ostrichbeta</span>
                                </div>
                            </Card>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
