import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const config = {
  basePath: isProduction ? '/blog' : '',
  output: 'export',
};

export default withMDX(config);

