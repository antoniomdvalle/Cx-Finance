package com.cx_finance.cx_finance.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class LoginInterceptor implements HandlerInterceptor{
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Obtém a sessão atual sem criar uma nova caso não exista
        HttpSession session = request.getSession(false);

        // Verifica se o utilizador está autenticado na sessão
        if (session == null || session.getAttribute("loggedUser") == null) {
            // Se não estiver autenticado, redireciona para a página de login (CT17)
            response.sendRedirect("/login");
            return false; // Interrompe a execução da requisição
        }

        return true; // Permite o acesso à página protegida
    }
}
