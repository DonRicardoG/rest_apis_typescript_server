import { Router } from "express";
import { body, param } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailavility,
  updateProduct,
} from "./handlers/product";
import { handleInputErrors } from "./middlewares";

const router = Router();
/**
 * @swagger
 * components:
 *    schemas:
 *        Product:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *                description: The product ID
 *                example: 1
 *              name:
 *                type: string
 *                description: The product name
 *                example: Curved monitor
 *              price:
 *                type: number
 *                description: The product price
 *                example: 300
 *              availability:
 *                type: boolean
 *                description: The product availability
 *                example: true
 */

/**
 * @swagger
 * /api/products:
 *    get:
 *        summary: Get a list of products
 *        tags:
 *            - Products
 *        description: Return a list of products
 *        responses:
 *              200:
 *                  description: Successful response
 *                  content:
 *                      application/json:
 *                            schema:
 *                                type: array
 *                                items:
 *                                  $ref: '#/components/schemas/Product'
 *
 */

router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *    get:
 *        summary: Get a product by ID
 *        tags:
 *            - Products
 *        description: Return a product based on its unit ID
 *        parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *
 *
 *        responses:
 *              200:
 *                  description: Successfull Response
 *                  content:
 *                      application/json:
 *                            schema:
 *                              $ref: '#/components/schemas/Product'
 *              404:
 *                  description: Not found
 *              400:
 *                  description: Bad Request - Invalid ID
 */

router.get(
  "/:id",
  param("id").isInt().withMessage("Invalid ID"),
  handleInputErrors,
  getProductById
);

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Returns a new record in the database
 *      requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                name:
 *                                    type: string
 *                                    example: "Curved Monitor 49"
 *                                price:
 *                                    type: number
 *                                    example: 399
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request - Invalid input data
 */

router.post(
  "/",
  body("name").notEmpty().withMessage("You must enter a valid name"),

  body("price")
    .isNumeric()
    .withMessage("You must enter a valid price")
    .notEmpty()
    .withMessage("You must enter price")
    .custom((value) => value > 0)
    .withMessage("You must enter a valid price"),
  handleInputErrors,
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *           - Products
 *      description: returns the updated product
 *      parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *      requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                                name:
 *                                    type: string
 *                                    example: "Curved Monitor 49"
 *                                price:
 *                                    type: number
 *                                    example: 399
 *                                availability:
 *                                    type: boolean
 *                                    example: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *
 *          400:
 *              description: Bad request - Invalid input data or Invalid ID
 *          404:
 *              description: Bad request - Invalid input data
 */

router.put(
  "/:id",
  param("id").isInt().withMessage("Invalid ID"),
  body("name").notEmpty().withMessage("You must enter a valid name"),

  body("price")
    .isNumeric()
    .withMessage("You must enter a valid price")
    .notEmpty()
    .withMessage("You must enter price")
    .custom((value) => value > 0)
    .withMessage("You must enter a valid price"),
  body("availability").isBoolean().withMessage("Value not valid"),
  handleInputErrors,
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *        summary: Updates product availability
 *        tags:
 *              - Products
 *        description: Returns the new availability
 *        parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *        responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *
 *          400:
 *              description: Bad request - Invalid input data or Invalid ID
 *          404:
 *              description: Not found - Item does not exists
 */

router.patch(
  "/:id",
  param("id").isInt().withMessage("Invalid ID"),
  handleInputErrors,
  updateAvailavility
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *        summary: Delete products
 *        tags:
 *              - Products
 *        description: Delete a product from the database
 *        parameters:
 *            - in: path
 *              name: id
 *              description: The ID of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *        responses:
 *          200:
 *              description: Deleted successfully
 *          400:
 *              description: Bad request - Invalid input data or Invalid ID
 *          404:
 *              description: Not found - Item does not exists
 */

router.delete(
  "/:id",
  param("id").isInt().withMessage("Invalid ID"),
  handleInputErrors,
  deleteProduct
);

export default router;
