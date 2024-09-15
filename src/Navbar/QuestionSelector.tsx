// ExampleDropdown.tsx
import React, { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select'; // Adjust the import path based on your project structure

interface QuestionSelectorProps {
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}

export function QuestionSelector({ selectedOption, setSelectedOption }: QuestionSelectorProps) {
  return (
    <div className="w-64">
      <Select value={selectedOption} onValueChange={(value: string) => setSelectedOption(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Problems</SelectLabel>
            <SelectItem value="pq1">Valid Palindrome</SelectItem>
            <SelectItem value="pq2">Merge Sorted Array</SelectItem>
            <SelectItem value="pq3">Two Sum</SelectItem> {/* Not Implemented! */}
            <SelectItem value="pq4">Invert Binary Tree</SelectItem> {/* Not Implemented! */}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
