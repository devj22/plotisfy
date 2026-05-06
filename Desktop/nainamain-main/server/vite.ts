import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { type Server } from "http";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define a simple logger interface
interface SimpleLogger {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  clearScreen: () => void;
  hasErrorLogged: () => boolean;
  hasWarned: boolean;
  warnOnce: (message: string) => void;
}

const viteLogger: SimpleLogger = {
  info: console.info?.bind(console),
  warn: console.warn?.bind(console),
  error: console.error?.bind(console),
  clearScreen: () => {},
  hasErrorLogged: () => false,
  hasWarned: false,
  warnOnce: console.warn?.bind(console),
};

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true as const,
    hmr: { server },
    allowedHosts: ['localhost', '127.0.0.1'] as string[],
  };

  // Dynamic import with proper type casting
  const { createServer } = await import('vite') as any;
  const viteServer = await createServer({
    ...viteConfig,
    configFile: false,
    customLogger: viteLogger,
    server: serverOptions,
    appType: "custom",
  });

  app.use(viteServer.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      viteServer.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // In production, the client build is in the dist/public directory
  const distPath = path.resolve(__dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}`);
    // Fallback to the public directory if dist/public doesn't exist
    const publicPath = path.resolve(__dirname, "..", "public");
    if (!fs.existsSync(publicPath)) {
      throw new Error(
        `Could not find the build directory: ${distPath} or ${publicPath}`,
      );
    }
    console.log(`Using fallback public directory: ${publicPath}`);
    app.use(express.static(publicPath));
    
    // fall through to index.html if the file doesn't exist
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(publicPath, "index.html"));
    });
    return;
  }

  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
