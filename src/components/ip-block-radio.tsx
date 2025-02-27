'use client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function IpBlockSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select IP restriction" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="0">No block</SelectItem>
                <SelectItem value="1">Block regions</SelectItem>
                <SelectItem value="2">Allow regions</SelectItem>
            </SelectContent>
        </Select>
    );
}
