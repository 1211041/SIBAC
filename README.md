# Sistema Pericial para Diagnóstico e Gestão de Anomalias em Sistemas Energéticos Industriais

Este é o projeto base para um **Sistema Pericial (Sistema Baseado em Conhecimento)**, desenvolvido com **Spring Boot 3** e **Drools 8 (KIE Engine)** com foco na identificação e gestão de anomalias em dois subsistemas industriais críticos:
1.  **Produção de vapor**
2.  **Sistema de combustão**

O motor de inferência utiliza regras declarativas escritas em Drools (`.drl`) carregadas a partir de uma `KieSession` stateful para diagnosticar problemas e retornar conclusões lógicas detalhadas com as respetivas explicações do raciocínio pericial.

---

## 🛠️ Stack Tecnológica
*   **Java 17** ou superior
*   **Spring Boot 3.2.5**
*   **Maven**
*   **Drools Engine 8.44.0.Final**
*   **REST API (Spring Web)**

---

## 📁 Estrutura do Projeto

O projeto segue a estrutura padrão Maven organizada da seguinte forma:

```
c:\Faculdade\SIBAC\SIBAC\
├── pom.xml                                     # Dependências do projeto (Spring Boot + Drools)
└── src/
    └── main/
        ├── java/
        │   └── pt/
        │       └── isep/
        │           └── sbc/
        │               ├── SbcApplication.java # Classe principal do Spring Boot
        │               ├── config/
        │               │   └── DroolsConfig.java # Bean KieContainer injetável
        │               ├── controller/
        │               │   └── DiagnosticoController.java # POST /api/diagnostico
        │               ├── service/
        │               │   └── DroolsService.java # Gestão de factos e regras
        │               └── model/
        │                   ├── SistemaVapor.java      # Facto do sistema de vapor
        │                   ├── SistemaCombustao.java  # Facto do sistema de combustão
        │                   ├── Diagnostico.java       # Facto de acumulação do diagnóstico
        │                   └── RespostaDiagnostico.java # DTO de resposta da API REST
        └── resources/
            ├── META-INF/
            │   └── kmodule.xml                 # Definição do KIE Module e Session
            ├── rules/
            │   ├── diagnostico-vapor.drl       # Regras completas de diagnóstico do sistema de vapor
            │   └── diagnostico-combustao.drl   # Regras completas de diagnóstico da combustão
            └── static/                         # Interface Web (HTML, CSS e JavaScript)
                ├── index.html                  # Interface gráfica (Chatbot)
                ├── style.css                   # Estilos da interface web
                └── app.js                      # Lógica do chatbot e integração com a API REST
```

---

## ⚙️ Regras do Motor Pericial (Drools)

O motor pericial contém uma **base de conhecimento completa** que cobre a totalidade dos diagramas de fluxo do projeto, totalizando dezenas de regras de inferência estruturadas por grupos e blocos lógicos nos ficheiros DRL.

Abaixo destacam-se os exemplos das regras principais de triagem e diagnóstico para cada subsistema:

### 1. Sistema de Vapor (`diagnostico-vapor.drl`)
*   **Regra V-1.1 — Produção Insuficiente por Combustão Anormal**:
    Se a pressão for `Baixa`, a temperatura for `Baixa`, o caudal for `Baixo` **E** a combustão estiver `Nao` normal, então infere-se que o problema é `ProducaoInsuficientePorCombustao`.
*   **Regra V-1.2 — Produção Insuficiente por Turbina sem Calor Suficiente**:
    Se a pressão for `Baixa`, a temperatura for `Baixa`, o caudal for `Baixo`, a combustão estiver `Sim` (normal) **E** a turbina `Nao` fornece calor suficiente, então infere-se que o problema é `ProducaoInsuficientePorTurbina`.

### 2. Sistema de Combustão (`diagnostico-combustao.drl`)
*   **Regra C-A.1 — Falha Total no Fornecimento de Gás**:
    Se a chama detetada for `Nao` **E** o gás estiver `Nao` disponível, então infere-se que o problema é `FalhaFornecimentoGas`.
*   **Regra C-A.2 — Pressão Insuficiente de Gás**:
    Se a chama detetada for `Nao`, o gás estiver `Sim` disponível **E** a pressão do gás for `Nao` suficiente, então infere-se que o problema é `PressaoGasInsuficiente`.

---

## 🚀 Como Executar o Projeto

1.  Garanta que tem o **JDK 17** e o **Maven** instalados na sua máquina.
2.  Abra o terminal na pasta raiz do projeto (`c:\Faculdade\SIBAC\SIBAC`).
3.  Compile o projeto para descarregar as dependências e validar as regras Drools:
    ```bash
    mvn clean compile
    ```
4.  Execute a aplicação Spring Boot:
    ```bash
    mvn spring-boot:run
    ```
    A API REST e a Interface Web estarão operacionais no endereço `http://localhost:8085`.

---

## 🌐 Interface Web (Chatbot de Diagnóstico Interativo)

O projeto inclui agora uma **Interface Web interativa** no formato de Chatbot, permitindo realizar diagnósticos guiados passo a passo diretamente no navegador, sem necessidade de utilizar ferramentas externas como o Postman.

### Como Aceder
Com a aplicação em execução (`mvn spring-boot:run`), abra o seu navegador web e aceda a:
*   👉 **[http://localhost:8085/](http://localhost:8085/)** (ou `http://localhost:8085/index.html`)

### Funcionamento do Chatbot
1.  **Conversa Guiada**: O chatbot interage com o utilizador, perguntando sobre os valores/estados das variáveis do sistema (pressão, temperatura, caudal, etc.) para ambos os subsistemas (Vapor e Combustão).
2.  **Barra de Progresso**: Indica dinamicamente o estado do preenchimento das variáveis do diagnóstico consoante o caminho e ramo de decisão selecionado.
3.  **Processamento Automático**: Ao responder à última pergunta, o chatbot envia automaticamente os dados para a API REST (`/api/diagnostico`).
4.  **Apresentação do Resultado**:
    *   Se for detetada uma **anomalia**, o chatbot mostra a conclusão em destaque (vermelho), descrevendo o tipo de anomalia, o problema identificado, as regras ativadas e o raciocínio/explicação pericial.
    *   Se **não houver anomalias**, o chatbot apresenta uma mensagem de conformidade (verde).
5.  **Opção de Reinício**: Permite iniciar um novo diagnóstico de imediato ou terminar a sessão.

