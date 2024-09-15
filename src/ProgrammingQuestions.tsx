interface Example {
  Input: string;
  Output: boolean;
  Explanation: string;
}

export interface Problem {
  No: number;
  Title: string;
  Difficulty: string;
  Topics: string[];
  Prompt: string[];
  StyledPrompt: string[];
  Examples: Example[];
  CanonicalSolution: string;
  UnitTest: string;
}

const pq1: Problem = {
  No: 1,
  Title: "Valid Palindrome",
  Difficulty: "Easy",
  Topics: ["Two Pointers", "String"],
  Prompt: [
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
    "Given a string s, return true if it is a palindrome, or false otherwise."
  ],
  StyledPrompt: [
    "A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
    "Given a string `s`, return `true` if it is a **palindrome**, or `false` otherwise."
  ],
  Examples: [
    {
      Input: 's = "A man, a plan, a canal: Panama"',
      Output: true,
      Explanation: '"amanaplanacanalpanama" is a palindrome.'
    },
    {
      Input: 's = "race a car"',
      Output: false,
      Explanation: '"raceacar" is not a palindrome.'
    },
    {
      Input: 's = " "',
      Output: true,
      Explanation: 's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.'
    }
  ],
  CanonicalSolution: `class Solution:
    def isPalindrome(self, s: str) -> bool:

        i, j = 0, len(s) - 1

        while i < j:
            while i < j and not s[i].isalnum():
                i += 1
            while i < j and not s[j].isalnum():
                j -= 1

            if s[i].lower() != s[j].lower():
                return False

            i += 1
            j -= 1

        return True`,
    UnitTest: `soln = Solution()
if (soln.isPalindrome("A man, a plan, a canal: Panama") == True):
    print("UNIT TEST PASSED...")
else:
    print("UNIT TEST FAILED...")
if (soln.isPalindrome("race a car") == False):
    print("UNIT TEST PASSED...")
else:
    print("UNIT TEST FAILED...")
if (soln.isPalindrome(" ") == True):
    print("UNIT TEST PASSED...")
else:
    print("UNIT TEST FAILED...")`  
};

export const pqs = {
  "pq1": pq1
}
