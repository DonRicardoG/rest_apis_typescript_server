import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.2",
    tags: [
      {
        name: "Products",
        description: "API operations related to products",
      },
    ],
    info: {
      title: "REST API Node.js / Express / TypeScript",
      version: "1.0.0",
      description: "API Docs for Production",
    },
  },
  apis: ["./src/router.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions: SwaggerUiOptions = {
  customCss: `
    .topbar-wrapper .link{
      content: url('https://res.cloudinary.com/dnrdf85ss/image/upload/v1718334336/logoR_sgslfn.png');
      height: 80px;
    }
    .swagger-ui .topbar a {
      max-width: 90px !important;
    }

    .swagger-ui .topbar {
      background-color: #DBDBDB;
    }
  `,
  customSiteTitle: "REST API TypeScript Docs",
};
export default swaggerSpec;
export { swaggerUiOptions };
