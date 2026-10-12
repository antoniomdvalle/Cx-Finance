package com.cx_finance.cx_finance.config;

import com.cx_finance.cx_finance.interceptor.LoginInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/dashboard", "/finances", "/goals", "/reports")
                .excludePathPatterns(
                    "/", 
                    "/login", 
                    "/signup", 
                    "/api/login", 
                    "/api/signup", 
                    "/api/logout", 
                    "/css/**", 
                    "/js/**", 
                    "/images/**"
                );
    }

    // Adiciona regras de anti-cache para impedir que o botão "Voltar" mostre telas protegidas após o logout (CT20)
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mantém o comportamento padrão dos recursos estáticos
    }
}