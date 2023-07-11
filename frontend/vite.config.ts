import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  // Checking environement files
  const envFile = loadEnv(mode, process.cwd());
  const envs = { ...process.env, ...envFile };
  const hasEnvFile = Object.keys(envFile).length;

  // Proxy variables
  const headers = {
    cookie: `oneSessionId=${envs.VITE_ONE_SESSION_ID};authenticated=true; XSRF-TOKEN=${envs.VITE_XSRF_TOKEN}`,
  };
  const resHeaders = hasEnvFile
    ? {
        "set-cookie": [
          `oneSessionId=${envs.VITE_ONE_SESSION_ID}`,
          `XSRF-TOKEN=${envs.VITE_XSRF_TOKEN}`,
        ],
        "Cache-Control": "public, max-age=300",
      }
    : {};

  const proxyObj = hasEnvFile
    ? {
        target: envs.VITE_RECETTE,
        changeOrigin: true,
        headers,
      }
    : {
        target: envs.VITE_LOCALHOST || "http://localhost:8090",
        changeOrigin: false,
      };

  const proxy = {
    "/applications-list": proxyObj,
    "/conf/public": proxyObj,
    "^/(?=help-1d|help-2d)": proxyObj,
    "^/(?=assets)": proxyObj,
    "^/(?=theme|locale|i18n|skin)": proxyObj,
    "^/(?=auth|appregistry|cas|userbook|directory|communication|conversation|portal|session|timeline|workspace|infra)":
      proxyObj,
    "/blog": proxyObj,
    "/explorer": proxyObj,
    "/mindmap": proxyObj,
  };

  return defineConfig({
    // base: "/mindmap",
    build: {
      assetsDir: "public",
      rollupOptions: {
        external: ["/assets/js/ode-explorer/index.js"],
        input: {
          index: resolve(__dirname, "index.html"),
          abondance: resolve(__dirname, "mindmap-explorer.html"),
          print: resolve(__dirname, "print.html"),
        },
        output: {
          manualChunks: {
            react: [
              "react",
              "react-router-dom",
              "react-dom",
              "react-error-boundary",
              "react-hook-form",
              "react-hot-toast",
            ],
            "ode-react-ui": [
              "@ode-react-ui/components",
              "@ode-react-ui/core",
              "@ode-react-ui/hooks",
              "@ode-react-ui/icons",
            ],
            wisemapping: ["@edifice-wisemapping/editor"],
            "ode-ts-client": ["ode-ts-client"],
          },
        },
      },
    },
    plugins: [
      react(),
      tsconfigPaths(),
      /* {
        name: "deep-index",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/") {
              req.url = "/view/index.html";
            }
            next();
          });
        },
      }, */
    ],
    server: {
      proxy,
      host: "0.0.0.0",
      port: 3000,
      headers: resHeaders,
      open: false,
    },
  });
};
