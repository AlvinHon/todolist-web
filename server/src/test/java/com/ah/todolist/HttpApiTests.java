package com.ah.todolist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.JsonPathResultMatchers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:tests.properties")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class HttpApiTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void testCreateFail() throws Exception {
		var unixTimestampYesterday = System.currentTimeMillis() / 1000L - 86400;
		String jsonContent = "{\"name\":\"test\",\"description\":\"test\",\"dueDate\":" + unixTimestampYesterday + "}";

		var error = makeRequestExpectErr("create", jsonContent);
		assert error.equals("Due date is in the past");
	}

	@Test
	void testReadFail() throws Exception {
		String jsonContent = "{\"pagination\":{\"page\":-1,\"limit\":10}}";

		var error = makeRequestExpectErr("read", jsonContent);
		assert error.equals("Invalid page number. Page number must start from 0.");
	}

	@Test
	void testUpdateFail() throws Exception {
		String jsonContent = "{\"id\":\"00000000-0000-0000-0000-000000000000\",\"name\":\"test\",\"description\":\"test\",\"status\":\"InProgress\"}";

		var error = makeRequestExpectErr("update", jsonContent);
		assert error.equals("Item not found");
	}

	@Test
	void testDeleteFail() throws Exception {
		String jsonContent = "{\"id\":\"00000000-0000-0000-0000-000000000000\"}";

		var error = makeRequestExpectErr("delete", jsonContent);
		assert error.equals("Item not found");
	}

	@Test
	void testCRUD() throws Exception {
		// Check initial state
		makeRequestExpectOk("read", "{}")
				.andExpect(jsonPath("$.items.length()").value(0));

		// Create
		var unixTimestampTomorrow = System.currentTimeMillis() / 1000L + 86400;
		var jsonContent = "{\"name\":\"test\",\"description\":\"test\",\"dueDate\":" + unixTimestampTomorrow + "}";
		var response = makeRequestExpectOk("create", jsonContent)
				.andExpect(jsonPath("id").exists())
				.andReturn();

		var id = parse(response).get("id").getAsString();

		// Read again to check item size and id
		makeRequestExpectOk("read", "{\"pagination\":{\"page\":0,\"limit\":1}}")
				.andExpect(jsonPath("$.items.length()").value(1))
				.andExpect(jsonPath("$.items[0].id").value(id));

		// Update
		jsonContent = "{\"id\":\"" + id
				+ "\",\"name\":\"test2\",\"description\":\"test2desc\",\"status\":\"InProgress\"}";
		response = makeRequestExpectOk("update", jsonContent)
				.andExpect(jsonPath("id").exists())
				.andReturn();
		var updatedId = parse(response).get("id").getAsString();
		assert updatedId.equals(id);

		// Read again to check updated name and description
		makeRequestExpectOk("read", "{\"pagination\":{\"page\":0,\"limit\":1}}")
				.andExpect(jsonPath("$.items.length()").value(1))
				.andExpect(jsonPath("$.items[0].id").value(updatedId))
				.andExpect(jsonPath("$.items[0].name").value("test2"))
				.andExpect(jsonPath("$.items[0].description").value("test2desc"))
				.andExpect(jsonPath("$.items[0].status").value("InProgress"));

		// Delete
		makeRequestExpectOk("delete", "{\"id\":\"" + updatedId + "\"}")
				.andExpect(jsonPath("id").value(updatedId));

		// Read again to check item size
		makeRequestExpectOk("read", "{\"pagination\":{\"page\":0,\"limit\":1}}")
				.andExpect(jsonPath("$.items.length()").value(0));
	}

	@Test
	void testReadFilter() throws Exception {
		// Create 2 items
		var jsonContent = "{\"name\":\"test1\",\"description\":\"test1desc\"}";
		var response = makeRequestExpectOk("create", jsonContent)
				.andExpect(jsonPath("id").exists())
				.andReturn();
		var id1 = parse(response).get("id").getAsString();

		var unixTimestampTomorrow = System.currentTimeMillis() / 1000L + 86400;
		jsonContent = "{\"name\":\"test2\",\"description\":\"test2desc\",\"dueDate\":" + unixTimestampTomorrow + "}";
		response = makeRequestExpectOk("create", jsonContent)
				.andExpect(jsonPath("id").exists())
				.andReturn();
		var id2 = parse(response).get("id").getAsString();
		assert !id1.equals(id2);

		// Read with filter by Status
		makeRequestExpectOk("read", "{\"filter\":{\"byStatus\":\"NotStarted\"}}")
				.andExpect(jsonPath("$.items.length()").value(2));

		// Update status of 1 item
		jsonContent = "{\"id\":\"" + id1 + "\",\"name\":\"test\",\"description\":\"test\",\"status\":\"InProgress\"}";
		makeRequestExpectOk("update", jsonContent);

		// Read with filter again
		makeRequestExpectOk("read", "{\"filter\":{\"byStatus\":\"InProgress\"}}")
				.andExpect(jsonPath("$.items.length()").value(1))
				.andExpect(jsonPath("$.items[0].id").value(id1));

		// Read with filter by DueDate
		makeRequestExpectOk("read", "{\"filter\":{\"byDueDate\":" + unixTimestampTomorrow + "}}")
				.andExpect(jsonPath("$.items.length()").value(1))
				.andExpect(jsonPath("$.items[0].id").value(id2));

	}

	@Test
	void testReadSort() throws Exception {
		// Create 2 items
		var unixTimestampFuture = System.currentTimeMillis() / 1000L + 86400;
		var jsonContent = "{\"name\":\"test1\",\"description\":\"test1desc\",\"dueDate\":" + unixTimestampFuture
				+ "}";
		var response = makeRequestExpectOk("create", jsonContent)
				.andExpect(jsonPath("id").exists())
				.andReturn();
		var id1 = parse(response).get("id").getAsString();

		unixTimestampFuture = System.currentTimeMillis() / 1000L + 86400 * 2;
		jsonContent = "{\"name\":\"test2\",\"description\":\"test2desc\",\"dueDate\":" + unixTimestampFuture + "}";
		response = makeRequestExpectOk("create", jsonContent)
				.andExpect(jsonPath("id").exists())
				.andReturn();
		var id2 = parse(response).get("id").getAsString();
		assert !id1.equals(id2);

		// Read with sort by name
		makeRequestExpectOk("read", "{\"sort\":{\"sortBy\":\"name\",\"direction\":\"asc\"}}")
				.andExpect(jsonPath("$.items.length()").value(2))
				.andExpect(jsonPath("$.items[0].id").value(id1))
				.andExpect(jsonPath("$.items[1].id").value(id2));

		// Read with sort by name desc
		makeRequestExpectOk("read", "{\"sort\":{\"sortBy\":\"name\",\"direction\":\"desc\"}}")
				.andExpect(jsonPath("$.items.length()").value(2))
				.andExpect(jsonPath("$.items[0].id").value(id2))
				.andExpect(jsonPath("$.items[1].id").value(id1));

		// Read with sort by due date
		makeRequestExpectOk("read", "{\"sort\":{\"sortBy\":\"dueDate\",\"direction\":\"asc\"}}")
				.andExpect(jsonPath("$.items.length()").value(2))
				.andExpect(jsonPath("$.items[0].id").value(id1))
				.andExpect(jsonPath("$.items[1].id").value(id2));

		// Read with sort by due date desc
		makeRequestExpectOk("read", "{\"sort\":{\"sortBy\":\"dueDate\",\"direction\":\"desc\"}}")
				.andExpect(jsonPath("$.items.length()").value(2))
				.andExpect(jsonPath("$.items[0].id").value(id2))
				.andExpect(jsonPath("$.items[1].id").value(id1));

		// Update status of 1 item
		jsonContent = "{\"id\":\"" + id1 + "\",\"name\":\"test\",\"description\":\"test\",\"status\":\"InProgress\"}";
		makeRequestExpectOk("update", jsonContent);

		// Read with sort by status
		makeRequestExpectOk("read", "{\"sort\":{\"sortBy\":\"status\",\"direction\":\"asc\"}}")
				.andExpect(jsonPath("$.items.length()").value(2))
				.andExpect(jsonPath("$.items[0].id").value(id1))
				.andExpect(jsonPath("$.items[1].id").value(id2));

		// Read with sort by status desc
		makeRequestExpectOk("read", "{\"sort\":{\"sortBy\":\"status\",\"direction\":\"desc\"}}")
				.andExpect(jsonPath("$.items.length()").value(2))
				.andExpect(jsonPath("$.items[0].id").value(id2))
				.andExpect(jsonPath("$.items[1].id").value(id1));
	}

	@Test
	void testReadPagination() throws Exception {
		// Create 3 items
		var response = makeRequestExpectOk("create", "{\"name\":\"test1\"}")
				.andExpect(jsonPath("id").exists())
				.andReturn();
		var id1 = parse(response).get("id").getAsString();

		response = makeRequestExpectOk("create", "{\"name\":\"test2\"}")
				.andExpect(jsonPath("id").exists())
				.andReturn();
		var id2 = parse(response).get("id").getAsString();
		assert !id1.equals(id2);

		response = makeRequestExpectOk("create", "{\"name\":\"test3\"}")
				.andExpect(jsonPath("id").exists())
				.andReturn();
		var id3 = parse(response).get("id").getAsString();
		assert !id1.equals(id3);
		assert !id2.equals(id3);

		// Read with pagination
		makeRequestExpectOk("read",
				"{\"pagination\":{\"page\":0,\"limit\":2},\"sort\":{\"sortBy\":\"name\",\"direction\":\"asc\"}}")
				.andExpect(jsonPath("$.items.length()").value(2))
				.andExpect(jsonPath("$.items[0].id").value(id1))
				.andExpect(jsonPath("$.items[1].id").value(id2));

		makeRequestExpectOk("read",
				"{\"pagination\":{\"page\":1,\"limit\":2},\"sort\":{\"sortBy\":\"name\",\"direction\":\"asc\"}}")
				.andExpect(jsonPath("$.items.length()").value(1))
				.andExpect(jsonPath("$.items[0].id").value(id3));
	}

	ResultActions makeRequestExpectOk(String path, String jsonContent) throws Exception {
		return mockMvc.perform(MockMvcRequestBuilders.post("/" + path)
				.contentType("application/json")
				.content(jsonContent))
				.andExpect(MockMvcResultMatchers.status().isOk());
	}

	String makeRequestExpectErr(String path, String jsonContent) throws Exception {
		var response = mockMvc.perform(MockMvcRequestBuilders.post("/" + path)
				.contentType("application/json")
				.content(jsonContent))
				.andExpect(MockMvcResultMatchers.status().is4xxClientError())
				.andExpect(jsonPath("error").exists())
				.andReturn();
		var data = parse(response);
		return data.get("error").getAsString();
	}

	JsonPathResultMatchers jsonPath(String path) {
		return MockMvcResultMatchers.jsonPath(path);
	}

	JsonObject parse(MvcResult result) throws Exception {
		var content = result.getResponse().getContentAsString();
		return JsonParser.parseString(content).getAsJsonObject();
	}
}
