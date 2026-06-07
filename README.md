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
            │   ├── diagnostico-vapor.drl       # Regras do sistema de vapor (Regra 1 & 2)
            │   └── diagnostico-combustao.drl   # Regras da combustão (Regra 3 & 4)
            └── static/                         # Interface Web (HTML, CSS e JavaScript)
                ├── index.html                  # Interface gráfica (Chatbot)
                ├── style.css                   # Estilos da interface web
                └── app.js                      # Lógica do chatbot e integração com a API REST
```

---

## ⚙️ Regras do Motor Pericial (Drools)

Foram implementadas as quatro regras de inferência iniciais na pasta `src/main/resources/rules/`:

### 1. Sistema de Vapor (`diagnostico-vapor.drl`)
*   **Regra 1 - Produção Insuficiente por Combustão**:
    Se pressão for `Baixa`, temperatura for `Baixa`, caudal for `Baixo` **E** a combustão estiver `Nao` normal, então infere que o problema é `ProducaoInsuficientePorCombustao`.
*   **Regra 2 - Produção Insuficiente por Turbina**:
    Se pressão for `Baixa`, temperatura for `Baixa`, caudal for `Baixo`, combustão estiver `Sim` (normal) **E** a turbina `Nao` fornece calor suficiente, então infere que o problema é `ProducaoInsuficientePorTurbina`.

### 2. Sistema de Combustão (`diagnostico-combustao.drl`)
*   **Regra 3 - Falha no Fornecimento de Gás**:
    Se chama detectada for `Nao` **E** o gás estiver `Nao` disponível, então infere que o problema é `FalhaFornecimentoGas`.
*   **Regra 4 - Pressão de Gás Insuficiente**:
    Se chama detectada for `Nao`, o gás estiver `Sim` disponível **E** a pressão do gás for `Nao` suficiente, então infere que o problema é `PressaoGasInsuficiente`.

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
    A API REST e a Interface Web estarão operacionais no endereço `http://localhost:8080`.

---

## 🌐 Interface Web (Chatbot de Diagnóstico Interativo)

O projeto inclui agora uma **Interface Web interativa** no formato de Chatbot, permitindo realizar diagnósticos guiados passo a passo diretamente no navegador, sem necessidade de utilizar ferramentas externas como o Postman.

### Como Aceder
Com a aplicação em execução (`mvn spring-boot:run`), abra o seu navegador web e aceda a:
*   👉 **[http://localhost:8080/](http://localhost:8080/)** (ou `http://localhost:8080/index.html`)

### Funcionamento do Chatbot
1.  **Conversa Guiada**: O chatbot interage com o utilizador, perguntando sobre os valores/estados das variáveis do sistema (pressão, temperatura, caudal, etc.) para ambos os subsistemas (Vapor e Combustão).
2.  **Barra de Progresso**: Indica o estado do preenchimento das 8 variáveis necessárias para o diagnóstico.
3.  **Processamento Automático**: Ao responder à última pergunta, o chatbot envia automaticamente os dados para a API REST (`/api/diagnostico`).
4.  **Apresentação do Resultado**:
    *   Se for detetada uma **anomalia**, o chatbot mostra a conclusão em destaque (vermelho), descrevendo o tipo de anomalia, o problema identificado, as regras ativadas e o raciocínio/explicação pericial.
    *   Se **não houver anomalias**, o chatbot apresenta uma mensagem de conformidade (verde).
5.  **Opção de Reinício**: Permite iniciar um novo diagnóstico de imediato ou terminar a sessão.

---

## 📮 Exemplos de Pedidos REST (Postman)

Se preferir testar diretamente a API REST, faça um pedido `POST` para `http://localhost:8080/api/diagnostico` com o cabeçalho `Content-Type: application/json`.

### Caso 1: Ativação da Regra 1 (Produção Insuficiente por Combustão)
*   **JSON de Entrada (Request)**:
    ```json
    {
      "sistemaVapor": {
        "pressao": "Baixa",
        "temperatura": "Baixa",
        "caudal": "Baixo",
        "turbinaForneceCalorSuficiente": "Nao"
      },
      "sistemaCombustao": {
        "combustaoNormal": "Nao",
        "chamaDetetada": "Sim",
        "gasDisponivel": "Sim",
        "pressaoGasSuficiente": "Sim"
      }
    }
    ```
*   **JSON de Saída (Response)**:
    ```json
    {
      "tipoAnomalia": "Anomalia na Produção de Vapor",
      "problema": "ProducaoInsuficientePorCombustao",
      "conclusao": "A produção de vapor está insuficiente devido a uma falha detectada no sistema de combustão (combustão anormal).",
      "regrasAtivadas": ["Regra 1"],
      "explicacoes": ["Pressão, temperatura e caudal baixos no sistema de vapor, associados a uma combustão não normal."]
    }
    ```

### Caso 2: Ativação da Regra 2 (Produção Insuficiente por Turbina)
*   **JSON de Entrada (Request)**:
    ```json
    {
      "sistemaVapor": {
        "pressao": "Baixa",
        "temperatura": "Baixa",
        "caudal": "Baixo",
        "turbinaForneceCalorSuficiente": "Nao"
      },
      "sistemaCombustao": {
        "combustaoNormal": "Sim",
        "chamaDetetada": "Sim",
        "gasDisponivel": "Sim",
        "pressaoGasSuficiente": "Sim"
      }
    }
    ```
*   **JSON de Saída (Response)**:
    ```json
    {
      "tipoAnomalia": "Anomalia na Produção de Vapor",
      "problema": "ProducaoInsuficientePorTurbina",
      "conclusao": "A produção de vapor está insuficiente devido a calor insuficiente fornecido pela turbina, apesar de a combustão estar normal.",
      "regrasAtivadas": ["Regra 2"],
      "explicacoes": ["Pressão, temperatura e caudal baixos no sistema de vapor, com combustão normal, mas sem calor suficiente fornecido pela turbina."]
    }
    ```

### Caso 3: Ativação da Regra 3 (Falha no Fornecimento de Gás)
*   **JSON de Entrada (Request)**:
    ```json
    {
      "sistemaVapor": {
        "pressao": "Normal",
        "temperatura": "Normal",
        "caudal": "Normal",
        "turbinaForneceCalorSuficiente": "Sim"
      },
      "sistemaCombustao": {
        "combustaoNormal": "Nao",
        "chamaDetetada": "Nao",
        "gasDisponivel": "Nao",
        "pressaoGasSuficiente": "Nao"
      }
    }
    ```
*   **JSON de Saída (Response)**:
    ```json
    {
      "tipoAnomalia": "Anomalia no Sistema de Combustão",
      "problema": "FalhaFornecimentoGas",
      "conclusao": "Falha crítica de combustão devido à falta completa de fornecimento de gás (gás indisponível e ausência de chama).",
      "regrasAtivadas": ["Regra 3"],
      "explicacoes": ["Chama não detectada associada a gás indisponível no sistema."]
    }
    ```

### Caso 4: Ativação da Regra 4 (Pressão de Gás Insuficiente)
*   **JSON de Entrada (Request)**:
    ```json
    {
      "sistemaVapor": {
        "pressao": "Normal",
        "temperatura": "Normal",
        "caudal": "Normal",
        "turbinaForneceCalorSuficiente": "Sim"
      },
      "sistemaCombustao": {
        "combustaoNormal": "Nao",
        "chamaDetetada": "Nao",
        "gasDisponivel": "Sim",
        "pressaoGasSuficiente": "Nao"
      }
    }
    ```
*   **JSON de Saída (Response)**:
    ```json
    {
      "tipoAnomalia": "Anomalia no Sistema de Combustão",
      "problema": "PressaoGasInsuficiente",
      "conclusao": "Ausência de chama devido a pressão de gás insuficiente, embora haja gás disponível na linha.",
      "regrasAtivadas": ["Regra 4"],
      "explicacoes": ["Chama não detectada com gás disponível mas pressão de gás insuficiente."]
    }
    ```
