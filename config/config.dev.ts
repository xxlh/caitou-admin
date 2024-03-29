// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.UMI_ENV': 'dev',
    API_URL: 'http://api-dev.caitou.ieexx.com',
    WEWORK_AGENTID: '1000009',
  },
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  webpack5: {
    // lazyCompilation: {},
  },
});
