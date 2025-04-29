
export type SocialTemplate = {
  name: string;
  padding: number;
  borderRadius: number;
  shadow: number;
  aspectRatio: number | null;
  inset: boolean;
};

export const socialTemplates: SocialTemplate[] = [
  {
    name: "LinkedIn",
    padding: 40,
    borderRadius: 8,
    shadow: 15,
    aspectRatio: 16/9,
    inset: false
  },
  {
    name: "Instagram",
    padding: 24,
    borderRadius: 16,
    shadow: 12,
    aspectRatio: 1,
    inset: false
  },
  {
    name: "Twitter/X",
    padding: 32,
    borderRadius: 12,
    shadow: 18,
    aspectRatio: 16/9,
    inset: false
  },
  {
    name: "Facebook",
    padding: 20,
    borderRadius: 8,
    shadow: 10,
    aspectRatio: 16/9,
    inset: false
  },
  {
    name: "Pinterest",
    padding: 16,
    borderRadius: 20,
    shadow: 8,
    aspectRatio: 2/3,
    inset: false
  },
  {
    name: "Reddit",
    padding: 24,
    borderRadius: 8,
    shadow: 20,
    aspectRatio: 4/3,
    inset: true
  }
];
