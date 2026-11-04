// Photo imports from src/assets are cut into responsive WebP variants at build
// time (vite.config.ts, the `asset` output format) and resolve to this shape.
// Referenced before vite/client (see vite-env.d.ts) so it overrides Vite's own
// `string` typing for these extensions.
declare module '*.webp' {
  const asset: import('./components/ui/image').ImageAsset;
  export default asset;
}
declare module '*.jpeg' {
  const asset: import('./components/ui/image').ImageAsset;
  export default asset;
}
declare module '*.jpg' {
  const asset: import('./components/ui/image').ImageAsset;
  export default asset;
}
declare module '*.png' {
  const asset: import('./components/ui/image').ImageAsset;
  export default asset;
}
