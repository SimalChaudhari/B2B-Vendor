// vite.config.js
import path from "path";
import checker from "file:///E:/Pratik%20Project/B2B-Vendor/B2B-Admin-Frontend/node_modules/vite-plugin-checker/dist/esm/main.js";
import { loadEnv, defineConfig } from "file:///E:/Pratik%20Project/B2B-Vendor/B2B-Admin-Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///E:/Pratik%20Project/B2B-Vendor/B2B-Admin-Frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
var PORT = 3030;
var env = loadEnv("all", process.cwd());
var vite_config_default = defineConfig({
  // base: env.VITE_BASE_PATH,
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"'
      },
      overlay: {
        position: "tl",
        initialIsOpen: false
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), "node_modules/$1")
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1")
      }
    ]
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxQcmF0aWsgUHJvamVjdFxcXFxCMkItVmVuZG9yXFxcXEIyQi1BZG1pbi1Gcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcUHJhdGlrIFByb2plY3RcXFxcQjJCLVZlbmRvclxcXFxCMkItQWRtaW4tRnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1ByYXRpayUyMFByb2plY3QvQjJCLVZlbmRvci9CMkItQWRtaW4tRnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XHJcbmltcG9ydCB7IGxvYWRFbnYsIGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbmNvbnN0IFBPUlQgPSAzMDMwO1xyXG5cclxuY29uc3QgZW52ID0gbG9hZEVudignYWxsJywgcHJvY2Vzcy5jd2QoKSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIC8vIGJhc2U6IGVudi5WSVRFX0JBU0VfUEFUSCxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgY2hlY2tlcih7XHJcbiAgICAgIGVzbGludDoge1xyXG4gICAgICAgIGxpbnRDb21tYW5kOiAnZXNsaW50IFwiLi9zcmMvKiovKi57anMsanN4LHRzLHRzeH1cIicsXHJcbiAgICAgIH0sXHJcbiAgICAgIG92ZXJsYXk6IHtcclxuICAgICAgICBwb3NpdGlvbjogJ3RsJyxcclxuICAgICAgICBpbml0aWFsSXNPcGVuOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIGZpbmQ6IC9efiguKykvLFxyXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy8kMScpLFxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgZmluZDogL15zcmMoLispLyxcclxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzcmMvJDEnKSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHsgcG9ydDogUE9SVCwgaG9zdDogdHJ1ZSB9LFxyXG4gIHByZXZpZXc6IHsgcG9ydDogUE9SVCwgaG9zdDogdHJ1ZSB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VSxPQUFPLFVBQVU7QUFDMVYsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsU0FBUyxvQkFBb0I7QUFDdEMsT0FBTyxXQUFXO0FBSWxCLElBQU0sT0FBTztBQUViLElBQU0sTUFBTSxRQUFRLE9BQU8sUUFBUSxJQUFJLENBQUM7QUFFeEMsSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQSxFQUUxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0EsU0FBUztBQUFBLFFBQ1AsVUFBVTtBQUFBLFFBQ1YsZUFBZTtBQUFBLE1BQ2pCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsS0FBSyxLQUFLLFFBQVEsSUFBSSxHQUFHLGlCQUFpQjtBQUFBLE1BQ3pEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLEtBQUssUUFBUSxJQUFJLEdBQUcsUUFBUTtBQUFBLE1BQ2hEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVEsRUFBRSxNQUFNLE1BQU0sTUFBTSxLQUFLO0FBQUEsRUFDakMsU0FBUyxFQUFFLE1BQU0sTUFBTSxNQUFNLEtBQUs7QUFDcEMsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
