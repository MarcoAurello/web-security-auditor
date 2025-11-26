::: {align="center"}
# 🛡️ Web Security Auditor

### Scanner Automatizado de Segurança Web em Node.js

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Security](https://img.shields.io/badge/Security-OWASP%20Aligned-red)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![License](https://img.shields.io/badge/Uso-Interno%20Educacional-blue)

Ferramenta para **auditoria automatizada não intrusiva de aplicações
web**, com geração de relatórios profissionais em **HTML**.
:::

------------------------------------------------------------------------

## 🎯 Objetivo do Projeto

Este projeto foi criado para apoiar:

-   ✅ Equipes de **Cibersegurança**
-   ✅ **GTIC / Governança de TI**
-   ✅ Auditorias internas
-   ✅ Gestão de contratos de sistemas terceirizados

O foco da ferramenta é a **análise passiva de exposição externa**, sem
execução de ataques, exploits ou testes invasivos.

------------------------------------------------------------------------

## 🧠 O que a Ferramenta Faz

-   🔎 Verifica conectividade HTTP
-   🔐 Analisa certificado digital TLS/HTTPS
-   🧱 Avalia cabeçalhos de segurança
-   🚪 Enumera caminhos sensíveis públicos
-   📊 Gera **score automático de risco**
-   📄 Produz **relatório técnico em HTML**
-   📌 Mapeia falhas com base na **OWASP Top 10**

------------------------------------------------------------------------

## 🏗️ Arquitetura do Projeto

``` text
web-security-auditor/
├── src/
│   ├── index.js                 # Scan unitário
│   ├── batchScan.js             # Scan em lote
│   ├── httpClient.js            # Cliente HTTP
│   ├── headerScanner.js         # Análise de headers
│   ├── tlsScanner.js            # Certificado TLS
│   ├── sensitivePathsScanner.js# Caminhos sensíveis
│   ├── riskScorer.js            # Score de risco
│   ├── reportGenerator.js       # Relatório HTML
│
├── reports/                     # Relatórios gerados
├── urls.txt                     # URLs para varredura em lote
├── package.json
└── README.md
```

------------------------------------------------------------------------

## ⚙️ Tecnologias Utilizadas

-   💻 **Node.js 18+**
-   🌐 **Axios**
-   🔒 **TLS nativo do Node**
-   📁 **File System (fs)**
-   🎨 **HTML + CSS puro**
-   📚 **OWASP Top 10**

------------------------------------------------------------------------

## 🚀 Instalação

### Pré-requisitos

-   Node.js 18 ou superior
-   Acesso à internet
-   Autorização formal para testes nos sistemas

### Instalação

``` bash
npm install
```

------------------------------------------------------------------------

## ▶️ Como Executar

### 🔹 Scan de uma única URL

``` bash
npm run scan -- https://exemplo.com.br
```

------------------------------------------------------------------------

### 🔹 Scan em Lote (várias URLs)

1.  Edite o arquivo `urls.txt`:

``` txt
https://www.hemobras.gov.br
https://portal.hemobras.gov.br
https://api.hemobras.gov.br
```

2.  Execute:

``` bash
npm run scan:batch
```

3.  Relatórios gerados em:

``` text
/reports/*.html
```

------------------------------------------------------------------------

## 🔍 O que é Avaliado

### ✅ Conectividade HTTP

-   Status HTTP
-   Tempo de resposta

### ✅ Certificado Digital TLS

-   Emissor
-   Validade
-   Dias restantes
-   Classificação de risco

### ✅ Cabeçalhos de Segurança

-   CSP
-   HSTS
-   X-Frame-Options
-   X-Content-Type-Options
-   Referrer-Policy
-   Permissions-Policy

### ✅ Caminhos Sensíveis

-   `/admin`
-   `/login`
-   `/dashboard`
-   `/actuator`
-   `/wp-admin`
-   `/temp`
-   `/test`
-   `/sistema`

------------------------------------------------------------------------

## 📊 Score de Risco

A ferramenta calcula automaticamente:

  Score     Classificação
  --------- ---------------
  0--39     🟢 Baixo
  40--69    🟠 Médio
  70--100   🔴 Alto

------------------------------------------------------------------------

## 🗂️ Relatório em HTML

Cada varredura gera um relatório contendo:

-   Identificação da URL
-   Data da varredura
-   Score geral
-   Tabelas de headers e endpoints
-   Mapeamento automático OWASP
-   Recomendações técnicas dinâmicas
-   Conclusão automática

------------------------------------------------------------------------

## 🗂️ Responsabilidade de cada arquivo

🔹 index.js

Arquivo principal para execução do scanner em uma única URL. Orquestra todas as etapas da varredura: conexão HTTP, análise de cabeçalhos de segurança, verificação do certificado TLS, varredura de caminhos sensíveis, cálculo do score de risco e geração do relatório final.

🔹 batchScan.js

Responsável pela execução do scanner em lote. Lê uma lista de URLs a partir do arquivo urls.txt, realiza a varredura em cada sistema sequencialmente e gera um relatório HTML individual para cada URL, automatizando auditorias em múltiplos sistemas.

🔹 httpClient.js

Implementa o cliente HTTP/HTTPS da aplicação, utilizando Axios. É responsável por realizar as requisições aos sistemas avaliados, medir tempo de resposta, capturar status HTTP e, quando em ambiente de homologação, permitir a conexão mesmo com validação SSL flexível.

🔹 headerScanner.js

Módulo responsável por analisar os cabeçalhos de segurança HTTP retornados pelo servidor, verificando a presença e o nível de risco de políticas como CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy e Permissions-Policy.

🔹 tlsScanner.js

Executa a análise do certificado digital TLS/HTTPS do servidor, coletando informações como emissor, validade, dias restantes para expiração e classificando automaticamente o nível de risco criptográfico.

🔹 sensitivePathsScanner.js

Realiza a enumeração automatizada de caminhos sensíveis e administrativos conhecidos, testando endpoints como /admin, /login, /actuator, /wp-admin, /temp, entre outros. Classifica automaticamente o risco conforme o status HTTP retornado e registra a URL completa acessada.

🔹 riskScorer.js

Responsável pelo cálculo automático do score geral de risco (0 a 100) do sistema avaliado, correlacionando:

falhas nos cabeçalhos de segurança,

exposição de endpoints sensíveis,

risco do certificado TLS.

Também define o nível de severidade global (baixo, médio ou alto).

🔹 reportGenerator.js

Gera automaticamente o relatório técnico em HTML, consolidando todos os dados da varredura: score de risco, headers, caminhos sensíveis com URL completa, mapeamento OWASP, recomendações técnicas dinâmicas e conclusão baseada nos achados reais.

🔹 urls.txt

Arquivo de configuração da varredura em lote, contendo a lista de URLs que serão auditadas automaticamente pelo batchScan.js.

🔹 Pasta reports/

Diretório onde são armazenados todos os relatórios HTML gerados automaticamente pela ferramenta, um para cada sistema avaliado.

------------------------------------------------------------------------

## 🔐 Uso Responsável

⚠️ **Esta ferramenta é EXCLUSIVAMENTE para uso autorizado.**

------------------------------------------------------------------------

## 👨‍💻 Responsável Técnico

**Marco Aurellio Machado Nunes**\
Analista de Tecnologia da Informação -- GTIC

------------------------------------------------------------------------

## ✅ Licença de Uso

Ferramenta de uso **interno, educacional e institucional**, sem fins
comerciais.
