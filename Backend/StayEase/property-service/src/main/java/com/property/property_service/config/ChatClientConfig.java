//package com.property.property_service.config;
//
//
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration+
//public class ChatClientConfig {
//
//    // Spring AI auto-configures the underlying OpenAI/Groq ChatModel bean
//    // from application.properties. We just expose a ChatClient on top of it.
//    @Bean
//    public ChatClient chatClient(ChatClient.Builder builder) {
//        return builder
//                .defaultSystem("""
//                        You are a helpful assistant for a property rental platform in India.
//                        Be concise, helpful, and always respond in English.
//                        """)
//                .build();
//    }
//}
