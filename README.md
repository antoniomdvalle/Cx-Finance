# Cx Finance 💰

Uma aplicação web completa e intuitiva de gestão financeira pessoal desenvolvida como parte do **Projeto Integrador (Etapa 9)** do Senac. O **Cx Finance** permite ao usuário organizar suas movimentações (entradas e saídas), gerenciar metas financeiras e acompanhar relatórios consolidados com isolamento total de dados por conta.

---

## 📌 Visão Geral e Objetivo

O **Cx Finance** foca em transformar dados de movimentações em informações úteis para o controle financeiro diário. A aplicação combina páginas server-side renderizadas dinamicamente com endpoints REST consumidos de forma assíncrona (AJAX), garantindo navegação fluida e navegação protegida via controle de sessão.

---

## 🛠️ Tecnologias Utilizadas (Tech Stack)

| Camada | Tecnologia / Lib |
| :--- | :--- |
| **Linguagem / SDK** | Java (JDK 21) |
| **Framework Base** | Spring Boot (Spring MVC, Spring Data JPA) |
| **Segurança / Auth** | Criptografia com `BCryptPasswordEncoder`, `HttpSession`, Interceptors de rota |
| **Banco de Dados** | MySQL |
| **Front-end & UI** | Thymeleaf (com componentes reutilizáveis), HTML5, CSS3, JavaScript |
| **Bibliotecas UI** | Bootstrap 5, jQuery 3.7.1, Chart.js (gráficos) |
| **Utilitários Java** | Lombok |
| **Testes Unitários**| JUnit 5, Mockito |
| **Versionamento** | Git & GitHub |

---

## 🏗️ Arquitetura e Organização

A aplicação segue uma arquitetura em camadas bem definida para separar responsabilidades:

```text
com.cx_finance.cx_finance
├── controller/     # Controllers MVC (páginas) e REST ApiControllers
├── service/        # Regras de negócio, cálculos e validações
├── repository/     # Interfaces Spring Data JPA para acesso ao MySQL
├── model/          # Entidades do banco de dados (User, RegistroFinanceiro, Goal)
├── dto/            # Data Transfer Objects para requisições/respostas
└── config/         # Configurações de segurança, interceptors e rotas
```

---

## 🚀 Funcionalidades Principais

### 1. Autenticação e Gestão de Sessão
* **Cadastro e Login:** Fluxo completo de criação de conta e validação de acesso.
* **Segurança:** Senhas codificadas com BCrypt.
* **Sessão:** Usuário autenticado mantido via `HttpSession` (`loggedUser`).
* **Proteção de Rotas:** Interceptor (`LoginInterceptor`) bloqueia páginas privadas sem login prévio.
* **Logout:** Invalidação da sessão HTTP no servidor e redirecionamento para login.

### 2. Dashboard
* Painel consolidado que atua como visão geral da situação financeira do usuário após o acesso.

### 3. Registros Financeiros (Movimentações)
* **Tipos:** Suporte a movimentações de **ENTRADA** (receitas) e **SAIDA** (despesas).
* **Campos:** Descrição, Categoria, Tipo, Valor (BigDecimal) e Data (LocalDate).
* **Lógica Assíncrona:** Inserção e atualização via requisições AJAX (`POST /api/registros-financeiros`).
* **Ordenação:** Registros listados por data e ID em ordem decrescente.

### 4. Metas Financeiras
* **Módulo Completo (CRUD):** Visualização, criação, consulta detalhada, atualização e remoção de metas (`/api/goals`).

### 5. Relatórios Financeiros
* **Filtros Dinâmicos:** Consulta por período (`dataInicio` / `dataFim`) e por categoria.
* **Indicadores:** Resumo com total de receitas, total de despesas, saldo acumulado e total de movimentações.
* **Visualização:** Tabela interativa e gráficos agregados por categoria com Chart.js.
* **Exportação:** Suporte a impressão e exportação dos dados filtrados em formato CSV.

---

## 🔗 Mapeamento de Rotas e Endpoints (API)

### Rotas Públicas (Páginas e APIs)
* `GET /` - Página inicial / Apresentação
* `GET /login` / `GET /signup` - Telas de acesso
* `POST /api/login` / `POST /api/signup` - Endpoints de login e cadastro
* `POST /api/logout` - Invalidação de sessão

### Rotas Privadas (Páginas Protegidas)
* `GET /dashboard` - Visão geral
* `GET /finances` - Gestão de movimentações
* `GET /goals` - Gestão de metas
* `GET /reports` - Visualização de relatórios

### Principais Endpoints REST
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/registros-financeiros` | Cadastra nova movimentação financeira |
| `GET` | `/api/goals` | Lista todas as metas do usuário |
| `POST` | `/api/goals` | Cadastra uma nova meta |
| `GET` | `/api/goals/{id}` | Busca os detalhes de uma meta específica |
| `PUT` | `/api/goals/{id}` | Atualiza uma meta existente |
| `DELETE` | `/api/goals/{id}` | Exclui uma meta |
| `GET` | `/api/reports` | Retorna dados consolidados e filtrados para relatórios |

---

## ⚙️ Pré-requisitos e Configuração Local

### Pré-requisitos
* **Java SDK 21** instalado.
* **MySQL Server** (instância ativa na máquina local).
* **Maven** (opcional se utilizar o wrapper `./mvnw`).

### Configuração do Banco de Dados (`application.properties`)
Ajuste as credenciais do banco de dados no arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cx_finance?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=SEU_USUARIO_MYSQL
spring.datasource.password=SUA_SENHA_MYSQL

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### Passo a Passo para Execução

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/antoniomdvalle/Cx-Finance.git
   cd Cx-Finance
   ```

2. **Compilar e Executar a Aplicação:**
   * No Windows:
     ```cmd
     mvnw.cmd spring-boot:run
     ```
   * No Linux/macOS:
     ```bash
     ./mvnw spring-boot:run
     ```

3. **Acessar no Navegador:**
   Acesse [http://localhost:8080](http://localhost:8080) para visualizar a aplicação.

---

## 🧪 Testes e Qualidade

O projeto é acompanhado de plano formal de validação (com os casos de teste `CT01` a `CT22`), cobrindo desde regras de login/sessão até a precisão de cálculos nos relatórios e o isolamento de dados entre diferentes contas de usuário.

* **Testes Unitários:** Desenvolvidos utilizando **JUnit 5** e **Mockito** (ex.: `UserServiceTest` com verificação de criptografia de senhas e autenticação).
* **Execução dos Testes:**
  ```bash
  ./mvnw test
  ```

---

## 👤 Autor

* **Antonio Mazzon Dalla Valle**
* **Repositório GitHub:** [github.com/antoniomdvalle/Cx-Finance](https://github.com/antoniomdvalle/Cx-Finance)