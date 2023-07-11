# Mindmap Frontend

## Install

### With Docker

Install all dependencies.

```bash
./build.sh initDev
```

### Without Docker

Install all dependencies.

```bash
./build-noDocker.sh initDev
```

or

```bash
node scripts/package.js && yarn install
```

## Dev

### Start project

Open your project with Vite Server + HMR at <http://localhost:3000>.

```bash
yarn dev
```

### [Server Options](https://vitejs.dev/config/server-options.html)

You can change Vite Server by editing `vite.config.ts`

```bash
server: {
  host: "0.0.0.0",
  port: 3000,
  open: true // open the page on <http://localhost:3000> when dev server starts.
}
```

### Lint

```bash
yarn lint
```

### Prettier

```bash
yarn format
```

### Lighthouse

> LHCI will check if your app respect at least 90% of these categories: performance, a11y, Best practices and seo

```bash
yarn lh
```

### Pre-commit

When committing your work, `pre-commit` will start `yarn lint-staged`:

> lint-staged starts lint + prettier

```bash
yarn pre-commit
```

## Build

TypeScript check + Vite Build

```bash
yarn build
```

## Preview

```bash
yarn preview
```

## License

This project is licensed under the AGPL-3.0 license.
