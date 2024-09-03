package com.ah.todolist;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.setup.SharedHttpSessionConfigurer;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:tests.properties")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class UserAuthenticationTests {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .apply(SharedHttpSessionConfigurer.sharedHttpSession())
                .build();
    }

    @Test
    public void testUnauthorizedAccess() throws Exception {
        var unixTimestampTomorrow = System.currentTimeMillis() / 1000L + 86400;
        var jsonContent = "{\"name\":\"test\",\"description\":\"test\",\"dueDate\":" + unixTimestampTomorrow + "}";
        mockMvc.perform(MockMvcRequestBuilders.post("/create")
                .contentType("application/json")
                .content(jsonContent))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }

    @Test
    public void testLoginFail() throws Exception {
        mockMvc.perform(SecurityMockMvcRequestBuilders.formLogin("/user/login")
                .user("test").password("test"))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

    @Test
    public void testRegisterSameName() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/user/register")
                .content("{\"username\":\"test\",\"password\":\"test\"}")
                .contentType("application/json"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("id").exists())
                .andReturn();

        mockMvc.perform(MockMvcRequestBuilders.post("/user/register")
                .content("{\"username\":\"test\",\"password\":\"test\"}")
                .contentType("application/json"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void testRegister_andLogin_andAccessAuthorized() throws Exception {
        // Register a new user
        mockMvc.perform(MockMvcRequestBuilders.post("/user/register")
                .content("{\"username\":\"test\",\"password\":\"test\"}")
                .contentType("application/json"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("id").exists())
                .andReturn();

        // Login with the new user
        mockMvc.perform(SecurityMockMvcRequestBuilders.formLogin("/user/login")
                .user("test").password("test"))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Access a protected endpoint
        var unixTimestampTomorrow = System.currentTimeMillis() / 1000L + 86400;
        var jsonContent = "{\"name\":\"test\",\"description\":\"test\",\"dueDate\":" + unixTimestampTomorrow + "}";
        mockMvc.perform(MockMvcRequestBuilders.post("/create")
                .contentType("application/json")
                .content(jsonContent))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Logout
        mockMvc.perform(SecurityMockMvcRequestBuilders.logout("/user/logout"))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Access the protected endpoint again
        mockMvc.perform(MockMvcRequestBuilders.post("/create")
                .contentType("application/json")
                .content(jsonContent))
                .andExpect(MockMvcResultMatchers.status().isForbidden());
    }
}
