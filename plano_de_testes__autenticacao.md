# Plano de Testes — CxFinance

**Projeto:** Cx Finance  
**Escopo:** autenticação, cadastro de usuário e gerenciamento de sessão  
**Ambiente:** Windows, navegador web e projeto Spring Boot  
**Responsável pelos testes:** Antonio Mazzon Dalla Valle 
**Data de execução:** 12/10/2026

## 1. Checklist de testes

### A. Cadastro (Signup)

- [X] **CT01 — Acessar a tela de cadastro:** abrir `signup.html` e verificar se ela carrega corretamente, sem erros visuais ou de JavaScript.
- [X] **CT02 — Cadastrar usuário válido:** preencher todos os campos obrigatórios com dados válidos e enviar o formulário. Verificar se o sistema confirma o cadastro.
- [X] **CT03 — Validar campos obrigatórios:** tentar cadastrar um usuário deixando campos obrigatórios vazios. O sistema deve impedir o envio ou informar os campos pendentes.
- [X] **CT04 — Validar confirmação de senha:** informar senhas diferentes nos campos de senha e confirmação. O cadastro deve ser bloqueado.
- [X] **CT05 — Validar aceite dos termos:** tentar realizar o cadastro sem marcar a caixa de aceite, caso ela seja obrigatória. O sistema deve impedir o cadastro.
- [X] **CT06 — Impedir duplicidade de usuário:** tentar cadastrar novamente um e-mail ou identificador já cadastrado. O sistema deve informar a duplicidade e não criar outra conta.
- [X] **CT07 — Persistência do cadastro:** após cadastrar um usuário, atualizar a página ou reiniciar a aplicação e verificar se a conta continua registrada, conforme o armazenamento implementado.

### B. Login (Sign in)

- [X] **CT08 — Acessar a tela de login:** abrir `index.html` e verificar se a tela carrega corretamente.
- [X] **CT09 — Login com credenciais válidas:** informar o usuário e a senha de uma conta cadastrada. O sistema deve autenticar o usuário e direcioná-lo à página prevista.
- [X] **CT10 — Login com senha incorreta:** informar um usuário existente com senha errada. O sistema deve negar o acesso e apresentar uma mensagem adequada.
- [X] **CT11 — Login com usuário inexistente:** informar um e-mail ou identificador não cadastrado. O sistema deve negar o acesso.
- [X] **CT12 — Login com campos vazios:** tentar entrar sem preencher os campos obrigatórios. O sistema deve impedir o envio ou informar os campos pendentes.
- [X] **CT13 — Não expor a senha:** verificar se a senha não aparece em texto puro nos registros do servidor, na resposta da API ou em mensagens de erro. O sistema nunca deve retornar a senha ou seu hash ao navegador.

### C. Funcionamento da sessão

- [X] **CT14 — Criar sessão após login:** realizar login com credenciais válidas e verificar se o servidor cria uma sessão autenticada ou emite o mecanismo de autenticação previsto pelo projeto.
- [X] **CT15 — Manter sessão ao navegar:** depois do login, navegar entre as páginas protegidas. O sistema deve manter o usuário autenticado enquanto a sessão estiver válida.
- [X] **CT16 — Atualizar página com sessão ativa:** atualizar uma página protegida usando `F5`. O usuário deve continuar autenticado, sem precisar fazer login novamente.
- [ ] **CT17 — Bloquear acesso sem login:** abrir uma página protegida diretamente pela URL, em uma janela sem autenticação. O sistema deve redirecionar para o login ou negar o acesso.
- [ ] **CT18 — Bloquear acesso após encerramento da sessão:** fazer logout, caso já esteja implementado, e tentar abrir novamente uma página protegida. O acesso deve ser negado.
- [ ] **CT19 — Invalidar a sessão no logout:** fazer logout e verificar se a sessão no servidor foi invalidada ou se o mecanismo de autenticação foi encerrado corretamente.
- [ ] **CT20 — Impedir reutilização da sessão encerrada:** após o logout, usar o botão Voltar do navegador ou tentar acessar uma URL protegida novamente. O sistema não deve permitir que a sessão encerrada continue autorizando o acesso.
- [ ] **CT21 — Expiração da sessão:** deixar a sessão inativa pelo período configurado e tentar acessar uma página protegida. O sistema deve solicitar nova autenticação ou negar o acesso, conforme a configuração.
- [ ] **CT22 — Isolamento entre usuários:** entrar com uma conta, sair e entrar com outra. O segundo usuário não deve ter acesso aos dados privados da primeira conta.

**Importante:** os testes CT14–CT22 dependem de como a autenticação foi implementada. Se o backend ainda não tiver sessão, logout ou expiração configurados, registre o teste como **Pendente de implementação**, em vez de marcar como aprovado.

## 2. Registro dos resultados

Use esta tabela para documentar o resultado de cada teste executado. Para CT14–CT22, registre cada teste separadamente.

| ID | Resultado | Evidência / observação |
|---|---|---|
| CT01 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT02 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT03 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT04 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT05 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT06 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT07 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT08 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT09 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT10 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT11 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT12 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT13 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT14 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT15 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT16 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT17 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT18 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT19 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT20 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT21 | [ ] Aprovado [ ] Falhou [ ] Pendente | |
| CT22 | [ ] Aprovado [ ] Falhou [ ] Pendente | |

## 3. Registro de defeitos (Bugtracking)

Quando um teste falhar, registre o problema usando este modelo:

```text
ID do defeito: BUG-001
Teste relacionado: CT__
Data:
Descrição:
Passos para reproduzir:
Resultado esperado:
Resultado obtido:
Gravidade: Baixa / Média / Alta
Status: Aberto / Em correção / Corrigido / Retestado
Evidência: captura de tela, mensagem de erro ou log
```

Após corrigir o problema, execute novamente o teste correspondente e registre o resultado do reteste.

## 4. Critério de conclusão

- [ ] Todos os testes aplicáveis foram executados.
- [ ] Todos os testes aprovados possuem evidências quando necessário.
- [ ] Todos os defeitos encontrados foram registrados.
- [ ] Os defeitos corrigidos foram retestados.
- [ ] Os testes pendentes foram identificados e justificados.

**Observação técnica:** validar o formulário de login no JavaScript não comprova que a sessão funciona. O backend precisa confirmar a identidade do usuário e proteger as rotas privadas. Como o Cx Finance usa Spring Boot com HTML, Bootstrap e JavaScript, teste também as requisições diretamente à API, e não apenas o comportamento visual das páginas.

**Limite deste plano:** cadastro, login e sessão. Não inclui testes de finanças, metas, relatórios ou outras funcionalidades.
