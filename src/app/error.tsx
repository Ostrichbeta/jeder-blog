'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center text-center max-w-md gap-6">
                <AlertTriangle className="h-16 w-16 text-destructive" />
                <h1 className="text-3xl font-bold tracking-tight">Error</h1>
                <p className="text-xl text-muted-foreground break-words">{error.message || 'A critical error occurred. Please try again later.'}</p>
                <div className="flex gap-4 flex-wrap justify-center">
                    <Button variant="outline" onClick={() => reset()}>
                        Try Again
                    </Button>
                    <Button asChild>
                        <Link href="/" className="flex items-center gap-2">
                            Return to Safety
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
