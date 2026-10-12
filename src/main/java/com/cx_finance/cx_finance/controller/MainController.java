package com.cx_finance.cx_finance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {
    @GetMapping("/login")
    public String login(){
        return "/index";
    }

    @GetMapping("/signup")
    public String signup(){
        return "/signup";
    }

    @GetMapping("/dashboard")
    public String dashboard(){
        return "/dashboard";
    }

    @GetMapping("/finances")
    public String finances(){
        return "/finances";
    }

    @GetMapping("/goals")
    public String goals(){
        return "/goals";
    }

    @GetMapping("/new-goal")
    public String newGoal(){
        return "/new-goal";
    }

    @GetMapping("/reports")
    public String reports(){
        return "/reports";
    }
    
    @GetMapping("/edit-goal")
    public String paginaEditarMeta() {
        return "edit-goal";
    }
}  
