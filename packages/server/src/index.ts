import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import cors from "cors";
import { redis } from "./redis";
import connectRedis from "connect-redis";

const main = async () => {
  // init typeorm
  await createConnection();

  // init type-graphql
  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.ts"],
    authChecker: ({ context: { req } }) => !!req.session.userId
  });

  //init apollo server
  const apolloServer = new ApolloServer({
    schema,
    // pass a function to the context key. Apollo server gives us access to the context key.
    // we can access this object req into our resolvers
    context: ({ req, res }: any) => ({ req, res })
  });

  // init redis connection
  const RedisStore = connectRedis(session);
  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redis as any
    }),
    name: "qid",
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // 7 years
    }
  };

  // init express server
  const app = Express();

  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
  app.use(session(sessionOption));
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => console.log("at http://localhost:4000"));
};

main();
