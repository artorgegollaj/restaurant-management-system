package com.ubt.restaurant.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}
```

**Lejo endpoint-in pa auth (ose me auth)** ne `SecurityConfig.java`:
```java
.requestMatchers("/uploads/**").permitAll()
.requestMatchers("/api/upload/**").authenticated()
```
