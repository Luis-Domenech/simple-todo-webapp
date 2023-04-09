const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_TEST,
  PHASE_EXPORT,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} = require('next/constants')

// NOTE THAT process.env ONLY works for server side
// For client, we have to set all these in next.config.js in env object
const getEnvironmentVariable = (environmentVariable, fallback = undefined) => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable]
  if (!unvalidatedEnvironmentVariable) {
    if (!fallback)
      throw new Error(
        `Couldn't find environment variable: ${environmentVariable}`
      )
    else return fallback
  } else {
    return unvalidatedEnvironmentVariable
  }
}

const withTM = require('next-transpile-modules')([
  // Insert plugins here like the fullcalendar plugin
]);

module.exports = withTM(async (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    /* development only config options here */
  }

  // Below format is used to import ECMA Script modules
  /**
   * @type { import('next').NextConfig }
   */
  const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback.fs = false
        config.resolve.fallback.tls = false
        config.resolve.fallback.net = false
        config.resolve.fallback.child_process = false
        config.resolve.fallback.hmrm = false
        config.resolve.fallback.hmrM = false
        config.resolve.fallback['stream/web'] = false
        config.resolve.fallback['perf_hooks'] = false
        config.resolve.fallback['async_hooks'] = false
        config.resolve.fallback['console'] = false
        config.resolve.fallback['util/types'] = false
        config.resolve.fallback['diagnostics_channel'] = false
      }

      return config
    },
    env: {
      // Without these, we can't access process.env variables in NextJS
      PROD: getEnvironmentVariable('NODE_ENV', 'development'),
      PORT: getEnvironmentVariable('PORT', 3000),
      AUTH_TOKEN: getEnvironmentVariable('AUTH_TOKEN'),
      GRAPHQL_ENDPOINT: getEnvironmentVariable('GRAPHQL_ENDPOINT'),
      DEV_GRAPHQL_ENDPOINT: getEnvironmentVariable('DEV_GRAPHQL_ENDPOINT'),
    },
    sassOptions: {
      includePaths: ['./src/styles'],
    },
    compiler: {
      styledComponents: true
    },
  }

  return nextConfig
})