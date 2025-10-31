// Custom image loader for Next.js static exports
module.exports = function customLoader({ src, width, quality }) {
  // For static exports, we'll use the original image
  // In a real app, you might want to implement proper image optimization
  return `${src}?w=${width}&q=${quality || 75}`;
};
