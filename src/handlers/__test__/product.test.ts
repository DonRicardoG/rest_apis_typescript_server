import request from "supertest";
import server from "../../server";

describe("POST /api/products", () => {
  it("should display validation errors", async () => {
    const response = await request(server).post("/api/products").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(4);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  it("should validate that the price is greater than 0", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo",
      price: 0,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(4);
  });

  it("should validate that the price is greater than 0 and it is a number", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Monitor Curvo",
      price: "hola",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(2);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(4);
  });

  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Mouse- Testing",
      price: 50,
    });

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("error");
  });
});

describe("GET /api/products", () => {
  it("Should check if api/products url exists", async () => {
    const response = await request(server).get("/api/products");
    expect(response.status).not.toBe(404);
  });

  it("GET a JSON response with products", async () => {
    const response = await request(server).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveLength(1);

    expect(response.body).not.toHaveProperty("errors");
    expect(response.status).not.toBe(404);
  });
});

describe("GET /api/products/:id", () => {
  it("Should return a 404 response for a non-existent product", async () => {
    const productID = 2000;
    const response = await request(server).get(`/api/products/${productID}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Product does not exist");
  });

  it("Should check a valid ID in our url", async () => {
    const response = await request(server).get("/api/products/not-valid-url");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Invalid ID");
  });

  it("GET a JSON response for a single product", async () => {
    const response = await request(server).get("/api/products/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });
});

describe("PUT /api/products/:id", () => {
  it("Should check a valid ID in our url", async () => {
    const response = await request(server)
      .put("/api/products/not-valid-url")
      .send({
        name: "Curved Monitor",
        availability: true,
        price: 300,
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("Invalid ID");
  });

  it("Should display validation error messages when updating a product", async () => {
    const response = await request(server).put("/api/products/1").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("Should display error when enter an unvalid price", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Curved Monitor",
      availability: true,
      price: -300,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe("You must enter a valid price");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("Should return a 404 response for non-existent product", async () => {
    const productID = 2000;
    const response = await request(server)
      .put(`/api/products/${productID}`)
      .send({
        name: "Curved Monitor",
        availability: true,
        price: 300,
      });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Product does not exist");

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty("data");
  });

  it("Update an existing product with valid data", async () => {
    const response = await request(server).put("/api/products/1").send({
      name: "Curved Monitor",
      availability: true,
      price: 300,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty("errors");
  });
});

describe("PATCH /api/products/:id", () => {
  it("should return a 404 response for a non-existent product", async () => {
    const productID = 2000;
    const response = await request(server).patch(`/api/products/${productID}`);
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Product does not exist");
    expect(response.status).not.toBe(200);
    expect(response.status).not.toHaveProperty("data");
  });

  it("should update the product availability", async () => {
    const response = await request(server).patch(`/api/products/1`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data.availability).toBe(false);

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty("error");
  });
});

describe("DELETE /api/products/1", () => {
  it("Should check a valid ID", async () => {
    const response = await request(server).delete("/api/products/not-valid");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors[0].msg).toBe("Invalid ID");
  });

  it("Should return a 404 response for a non-existent product", async () => {
    const productID = 2000;
    const response = await request(server).delete(`/api/products/${productID}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Product does not exist");

    expect(response.status).not.toBe(200);
  });

  it("Should delete a product", async () => {
    const response = await request(server).delete("/api/products/1");

    expect(response.status).toBe(200);
    expect(response.body.data).toBe("The product has been eliminated");

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
  });
});
