
package com.shopscale.shopscale;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ShopscaleApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void getAllProductsShouldReturnSuccess() throws Exception {
		mockMvc.perform(get("/api/products"))
				.andExpect(status().isOk());
	}

	@Test
	void createProductShouldReturnSuccess() throws Exception {
		String json = """
                {
                    "name": "Automated Test Product",
                    "price": 999.0,
                    "stockQuantity": 10
                }
                """;

		mockMvc.perform(post("/api/products")
						.contentType(MediaType.APPLICATION_JSON)
						.content(json))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.name")
						.value("Automated Test Product"));
	}

	@Test
	void updateProductShouldReturnUpdatedProduct() throws Exception {
		long id = createTestProduct(
				"Original Test Product", 500.0, 5
		);

		String updateJson = """
                {
                    "name": "Updated Test Product",
                    "price": 750.0,
                    "stockQuantity": 8
                }
                """;

		mockMvc.perform(put("/api/products/" + id)
						.contentType(MediaType.APPLICATION_JSON)
						.content(updateJson))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(id))
				.andExpect(jsonPath("$.name")
						.value("Updated Test Product"))
				.andExpect(jsonPath("$.price").value(750.0))
				.andExpect(jsonPath("$.stockQuantity").value(8));
	}

	@Test
	void deleteProductShouldRemoveProduct() throws Exception {
		long id = createTestProduct(
				"Delete Test Product", 250.0, 3
		);

		// Delete the product
		mockMvc.perform(delete("/api/products/" + id))
				.andExpect(status().isOk());

		// Confirm the deleted product is absent from the list
		mockMvc.perform(get("/api/products"))
				.andExpect(status().isOk())
				.andExpect(jsonPath(
						"$[?(@.id == " + id + ")]"
				).doesNotExist());
	}

	@Test
	void createProductWithInvalidDataShouldReturnBadRequest()
			throws Exception {

		String invalidJson = """
                {
                    "name": "",
                    "price": -100.0,
                    "stockQuantity": -5
                }
                """;

		mockMvc.perform(post("/api/products")
						.contentType(MediaType.APPLICATION_JSON)
						.content(invalidJson))
				.andExpect(status().isBadRequest());
	}

	private long createTestProduct(
			String name, double price, int stockQuantity
	) throws Exception {

		String json = """
                {
                    "name": "%s",
                    "price": %s,
                    "stockQuantity": %d
                }
                """.formatted(name, price, stockQuantity);

		String response = mockMvc.perform(post("/api/products")
						.contentType(MediaType.APPLICATION_JSON)
						.content(json))
				.andExpect(status().isOk())
				.andReturn()
				.getResponse()
				.getContentAsString();

		return Long.parseLong(
				response.replaceAll(
						"(?s).*\"id\"\\s*:\\s*(\\d+).*", "$1"
				)
		);
	}
}

