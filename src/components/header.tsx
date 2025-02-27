import Link from 'next/link';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent } from '@/components/ui/navigation-menu';
import { Sheet, SheetTrigger, SheetContent, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { UserButton } from '@stackframe/stack';

export async function Header() {
    return (
        <header className="w-full border-b sticky top-0 bg-background z-50">
            <div className="max-w-6xl mx-auto h-12 flex items-center justify-between px-4">
                {/* Left side - Logo */}
                <Link href="/" className="text-xl font-medium">
                    Jeder&#39;s House
                </Link>

                {/* Right side - Navigation */}
                <div className="flex items-center space-x-4">
                    {/* Desktop navigation (md and above) */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/articles" legacyBehavior passHref>
                                    <NavigationMenuLink className="px-4 py-2 hover:bg-accent/50 rounded-lg transition-colors">Articles</NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="hover:bg-accent/50 rounded-lg transition-colors">Tools</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="w-[200px] p-1">
                                        <Link href="https://sw.ost.vg/" className="block p-2 hover:bg-accent/50 rounded-lg">
                                            <div className="text-sm font-medium">Switch game card</div>
                                            <div className="text-xs text-muted-foreground">Check your switch game plays</div>
                                        </Link>
                                        <Link href="/tools/ip-check" className="block p-2 hover:bg-accent/50 rounded-lg hidden">
                                            <div className="text-sm font-medium">IP check</div>
                                            <div className="text-xs text-muted-foreground">Check your current IP address</div>
                                        </Link>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <Link href="/about" legacyBehavior passHref>
                                    <NavigationMenuLink className="px-4 py-2 hover:bg-accent/50 rounded-lg transition-colors">About</NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Mobile navigation (below md) */}
                    <Sheet>
                        <SheetTrigger className="md:hidden px-4 py-2 hover:bg-accent/50 rounded-lg transition-colors">
                            <Menu size={20} />
                        </SheetTrigger>
                        <SheetContent side="top" className="bg-background p-4 [&>button]:hidden rounded-b-xl">
                            <SheetTitle className="sr-only">Main Menu</SheetTitle>
                            <nav className="flex flex-col gap-x-4">
                                <SheetClose asChild>
                                    <Link href="/articles" className="p-2 hover:bg-accent/50 rounded-lg">
                                        Articles
                                    </Link>
                                </SheetClose>

                                <div className="flex flex-col gap-2">
                                    <span className="p-2 font-medium">Tools</span>
                                    <SheetClose asChild>
                                        <Link href="/tools/switch-game" className="pl-4 p-2 hover:bg-accent/50 rounded-lg">
                                            <div className="text-sm">Switch game card</div>
                                            <div className="text-xs text-muted-foreground">Check your switch game plays</div>
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/tools/ip-check" className="pl-4 p-2 hover:bg-accent/50 rounded-lg">
                                            <div className="text-sm">IP check</div>
                                            <div className="text-xs text-muted-foreground">Check your current IP address</div>
                                        </Link>
                                    </SheetClose>
                                </div>

                                <SheetClose asChild>
                                    <Link href="/about" className="p-2 hover:bg-accent/50 rounded-lg">
                                        About
                                    </Link>
                                </SheetClose>

                                <SheetClose asChild>
                                    <div className="p-2 hover:bg-accent/50 rounded-lg">Close</div>
                                </SheetClose>
                            </nav>
                        </SheetContent>
                    </Sheet>

                        <UserButton />
                </div>
            </div>
        </header>
    );
}
