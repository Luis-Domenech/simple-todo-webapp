declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH_TOKEN: string;
      PORT: string;
      GRAPHQL_ENDPOINT: string;
      DEV_GRAPHQL_ENDPOINT: string;
    }
  }
}

export {}
