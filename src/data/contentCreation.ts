import type { ContentChannel } from '../types';

export const contentChannels: ContentChannel[] = [
  {
    platform: 'youtube',
    handle: '@arni_pictures_tech',
    url: 'https://youtube.com/@arni_pictures_tech',
    subscribers: '1.2K+',
    description: 'In-depth technical tutorials, project showcases, and deep dives into software engineering and hardware development.',
    icon: 'youtube',
  },
  {
    platform: 'instagram',
    handle: '@arni_pictures_tech',
    url: 'https://instagram.com/arni_pictures_tech',
    subscribers: '3.4K+',
    description: 'Behind-the-scenes content, quick tips, project progress updates, and visual documentation of builds.',
    icon: 'instagram',
  },
  {
    platform: 'tiktok',
    handle: '@arni_pictures_tech',
    url: 'https://tiktok.com/@arni_pictures_tech',
    subscribers: '8.7K+',
    description: 'Short-form tech content, quick explanations of complex concepts, and engaging technical demonstrations.',
    icon: 'music', // TikTok uses music icon in lucide
  },
];