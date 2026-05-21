import { readFileSync, writeFileSync } from 'fs';

const files = [
  'client/src/pages/admin/AdminDashboard.jsx',
  'client/src/pages/admin/AdminSermons.jsx',
  'client/src/pages/admin/AdminEvents.jsx',
  'client/src/pages/admin/AdminBlog.jsx',
  'client/src/pages/admin/AdminGallery.jsx',
  'client/src/pages/admin/AdminStreams.jsx',
  'client/src/pages/admin/AdminPrayer.jsx',
  'client/src/pages/admin/AdminContact.jsx',
  'client/src/pages/admin/AdminDonations.jsx',
  'client/src/pages/admin/AdminOrders.jsx',
  'client/src/pages/admin/AdminSubscribers.jsx',
  'client/src/pages/admin/AdminUsers.jsx',
  'client/src/pages/admin/AdminMedia.jsx',
  'client/src/pages/AdminProfile.jsx',
];

const replacements = [
  // Card containers
  [/bg-white rounded-2xl shadow-sm border border-gray-100/g, 'bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700'],
  [/border-b border-gray-100 flex justify-between items-center gap-4/g, 'border-b border-gray-100 dark:border-gray-700 flex justify-between items-center gap-4'],
  [/border-b border-gray-100 flex justify-between items-center/g, 'border-b border-gray-100 dark:border-gray-700 flex justify-between items-center'],
  
  // Backgrounds
  [/bg-gray-50\/50/g, 'bg-gray-50/50 dark:bg-gray-900/50'],
  [/bg-gray-100 dark:bg-gray-700/g, 'bg-gray-100 dark:bg-gray-700'],
  
  // Text colors
  [/text-gray-800(?![a-z\-])/g, 'text-gray-800 dark:text-gray-100'],
  [/text-gray-700(?![a-z\-])/g, 'text-gray-700 dark:text-gray-200'],
  [/text-gray-600(?![a-z\-])/g, 'text-gray-600 dark:text-gray-300'],
  [/text-gray-500(?![a-z\-])/g, 'text-gray-500 dark:text-gray-400'],
  [/text-gray-400(?![a-z\-])/g, 'text-gray-400 dark:text-gray-500'],
  
  // Borders
  [/border-gray-100 dark:border-gray-700/g, 'border-gray-100 dark:border-gray-700'],
  [/border-gray-200(?![\w\-])/g, 'border-gray-200 dark:border-gray-600'],
  [/border-t border-gray-100(?![\w\-])/g, 'border-t border-gray-100 dark:border-gray-700'],
  
  // Hover states
  [/hover:bg-gray-50(?![\w\-])/g, 'hover:bg-gray-50 dark:hover:bg-gray-800'],
  [/hover:bg-gray-100(?![\w\-])/g, 'hover:bg-gray-100 dark:hover:bg-gray-800'],
  [/hover:bg-gray-200(?![\w\-])/g, 'hover:bg-gray-200 dark:hover:bg-gray-700'],
  
  // Buttons with border
  [/border border-gray-200 rounded-xl text-sm(?![\w\-])/g, 'border border-gray-200 dark:border-gray-600 rounded-xl text-sm'],
  [/border border-gray-200 rounded-lg text-xs p-1/g, 'border border-gray-200 dark:border-gray-600 rounded-lg text-xs p-1'],
  
  // Input/select focus rings
  [/focus:ring-primary outline-none text-sm(?![\w\-])/g, 'focus:ring-primary outline-none text-sm dark:bg-gray-800 dark:text-gray-200'],
];

for (const f of files) {
  try {
    let content = readFileSync(f, 'utf-8');
    const before = content;
    for (const [pattern, replacement] of replacements) {
      content = content.replace(pattern, replacement);
    }
    if (content !== before) {
      writeFileSync(f, content);
      console.log(`Updated: ${f}`);
    }
  } catch (e) {
    console.error(`Error processing ${f}: ${e.message}`);
  }
}
