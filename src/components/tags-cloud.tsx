'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useSearchParams, usePathname } from 'next/navigation';

export function TagsCloud({ tags }: { tags: Record<string, number> }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentTag = searchParams.get('tag');

    const createQueryString = (name: string, value?: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        return params.toString();
    };

    return (
        <div className="flex flex-wrap gap-2 px-2 pb-4">
            <Link href={`${pathname}?${createQueryString('tag')}`} scroll={false}>
                <Badge variant={!currentTag ? 'default' : 'outline'} className="hover:bg-primary/20 transition-colors text-md">
                    ALL
                </Badge>
            </Link>

            {Object.entries(tags).map(([tag, count]) => (
                <Link key={tag} href={`${pathname}?${createQueryString('tag', tag)}`} scroll={false}>
                    <Badge variant={currentTag === tag ? 'default' : 'outline'} className="hover:bg-primary/20 transition-colors text-md">
                        {tag} ({count})
                    </Badge>
                </Link>
            ))}
        </div>
    );
}
