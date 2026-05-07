import { Generator, getConfig } from '@tanstack/router-generator'

const generator = new Generator({
  root: process.cwd(),
  config: getConfig({
    target: 'react',
    routesDirectory: './src/app/routes',
    generatedRouteTree: './src/app/routes/routeTree.gen.ts',
    routeFileIgnorePattern: 'routeTree\\.gen\\.ts$',
  }, process.cwd()),
})

await generator.run()
