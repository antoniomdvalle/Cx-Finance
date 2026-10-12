package com.cx_finance.cx_finance.config;

import com.cx_finance.cx_finance.interceptor.LoginInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                // Páginas protegidas que exigem sessão ativa
                .addPathPatterns("/dashboard", "/finances", "/goals", "/reports")
                // Rotas públicas e recursos estáticos que devem ser ignorados pelo vigia
                .excludePathPatterns(
                    "/", 
                    "/login", 
                    "/signup", 
                    "/api/login", 
                    "/api/signup", 
                    "/css/**", 
                    "/js/**", 
                    "/images/**"
                );
    }
}