// @ts-ignore - Missing type definitions
import swaggerJsdoc from "swagger-jsdoc";
// @ts-ignore - Missing type definitions
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Valuva E-Commerce API",
      version: "2.0.0",
      description: "API documentation for Valuva e-commerce platform",
      contact: {
        name: "Valuva Support",
        email: "support@valuva.in",
      },
    },
    servers: [
      {
        url: env.NODE_ENV === "production" 
          ? (process.env.API_URL || "https://valuva.in")
          : `http://localhost:${env.PORT || 5000}`,
        description: env.NODE_ENV === "production" ? "Production server" : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/modules/**/*.routes.ts", "./src/modules/**/*.controller.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

