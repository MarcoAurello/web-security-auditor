::: {align="center"}
# 🛡️ Web Security Auditor

### Scanner Automatizado de Segurança Web em Node.js

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Security](https://img.shields.io/badge/Security-OWASP%20Aligned-red)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![License](https://img.shields.io/badge/Uso-Interno%20Educacional-blue)

Ferramenta para **auditoria automatizada não intrusiva de aplicações web**, com geração de relatórios profissionais em **HTML**, classificação institucional e detecção de CVEs.
:::

------------------------------------------------------------------------

## 🎯 Objetivo do Projeto

Este projeto foi criado para apoiar:

- ✅ Equipes de **Cibersegurança**
- ✅ **GTIC / Governança de TI**
- ✅ Auditorias internas e externas
- ✅ Gestão de contratos de sistemas **terceirizados**
- ✅ Apoio a comitês de risco e segurança da informação

O foco da ferramenta é a **análise passiva de exposição externa**, sem execução de exploits, ataques ou testes invasivos.

------------------------------------------------------------------------

## 🧠 O que a Ferramenta Faz

- 🔎 Verifica conectividade HTTP e tempo de resposta
- 🔐 Analisa certificado digital **TLS/HTTPS**
- 🧱 Avalia **cabeçalhos de segurança**
- 🚪 Enumera **caminhos sensíveis públicos**
- 🍪 Analisa **segurança de cookies de sessão**
- 🌐 Verifica **CORS**
- ⚙️ Detecta **métodos HTTP perigosos**
- 🧬 Realiza **fingerprint de tecnologias**
- 🕷️ Detecta **versões vulneráveis (CVE offline)**
- 📊 Gera **score automático de risco**
- 🏛️ Aplica **classificação institucional automática**
- 📄 Produz **relatório técnico profissional em HTML**

------------------------------------------------------------------------

## 🏗️ Arquitetura do Projeto

```text
web-security-auditor/
├── src/
│   ├── index.js                  # Scan unitário
│   ├── batchScan.js              # Scan em lote
│   ├── httpClient.js             # Cliente HTTP
│   ├── headerScanner.js          # Análise de headers
│   ├── tlsScanner.js             # Certificado TLS
│   ├── sensitivePathsScanner.js # Caminhos sensíveis
│   ├── techFingerprintScanner.js# Fingerprint tecnológico
│   ├── corsScanner.js            # Análise CORS
│   ├── sessionCookieScanner.js  # Segurança de cookies
│   ├── httpMethodsScanner.js    # Métodos HTTP perigosos
│   ├── cveDatabase.js           # Base offline de CVEs
│   ├── cveScanner.js            # Scanner de CVEs
│   ├── riskScorer.js            # Score de risco
│   ├── reportGenerator.js       # Relatório HTML
│
├── reports/                      # Relatórios gerados
├── urls.txt                      # URLs para varredura em lote
├── package.json
└── README.md
🚀 Instalação
Pré-requisitos

Node.js 18 ou superior

Acesso à internet

Autorização formal para testes nos sistemas

Instalação
npm install

▶️ Como Executar
🔹 Scan de uma única URL
npm run scan -- https://exemplo.com.br

🔹 Scan em Lote (várias URLs)

Edite o arquivo urls.txt:

https://www.hemobras.gov.br
https://portal.hemobras.gov.br
https://api.hemobras.gov.br


Execute:

npm run scan:batch


Relatórios gerados em:

/reports/*.html

🔍 O que é Avaliado
✅ Conectividade HTTP

Status HTTP

Tempo de resposta

✅ Certificado Digital TLS

Emissor

Validade

Dias restantes

Classificação de risco

✅ Cabeçalhos de Segurança

CSP

HSTS

X-Frame-Options

X-Content-Type-Options

Referrer-Policy

Permissions-Policy

✅ Segurança de Sessão (Cookies)

HttpOnly

Secure

SameSite

✅ Métodos HTTP

OPTIONS

PUT

DELETE

TRACE

✅ Caminhos Sensíveis

/admin

/login

/dashboard

/actuator

/wp-admin

/temp

/test

/sistema

✅ CVEs (Vulnerabilidades Conhecidas)

Detecção por versão

Severidade automática

Classificação por risco

📊 Score de Risco Técnico

Score automático de 0 a 100:

Score	Classificação Técnica
0–29	🟢 Baixo
30–59	🟠 Médio
60–100	🔴 Alto
🏛️ Classificação Institucional
Score	Nível Institucional
≥ 85	🔴 CRÍTICO
≥ 60	🟠 ALTO
≥ 30	🟡 MÉDIO
< 30	🟢 BAIXO
📄 Relatório Profissional em HTML

Cada varredura gera um relatório contendo:

Identificação da URL

Data da varredura

Score geral

Classificação institucional

Fingerprint tecnológico

Tabelas de headers e endpoints

Segurança de sessão

Métodos HTTP

CVEs detectadas

Recomendações técnicas dinâmicas

Conclusão executiva automática

🗂️ Responsabilidade de Cada Arquivo
🔹 index.js

Executa o scanner em uma única URL.

🔹 batchScan.js

Executa o scanner em múltiplas URLs em lote e gera relatórios individuais.

🔹 httpClient.js

Cliente HTTP/HTTPS responsável pelas requisições e medições de tempo.

🔹 headerScanner.js

Analisa políticas de segurança HTTP.

🔹 tlsScanner.js

Extrai e classifica informações do certificado digital.

🔹 sensitivePathsScanner.js

Enumera endpoints sensíveis e registra URLs completas acessadas.

🔹 techFingerprintScanner.js

Identifica servidor, backend, frontend e CMS.

🔹 corsScanner.js

Analisa configuração de CORS.

🔹 sessionCookieScanner.js

Avalia segurança dos cookies de sessão.

🔹 httpMethodsScanner.js

Detecta métodos HTTP perigosos habilitados.

🔹 cveDatabase.js

Base local de vulnerabilidades conhecidas (CVE).

🔹 cveScanner.js

Cruza as tecnologias detectadas com a base CVE.

🔹 riskScorer.js

Calcula score técnico e classificação institucional.

🔹 reportGenerator.js

Gera o relatório técnico profissional em HTML.

🔹 urls.txt

Lista de sistemas a serem auditados automaticamente.

🔹 Pasta reports/

Armazena todos os relatórios gerados.

🔐 Uso Responsável

⚠️ Esta ferramenta é EXCLUSIVAMENTE para uso autorizado.
Vedada sua utilização em sistemas sem consentimento formal.

👨‍💻 Responsável Técnico

Marco Aurellio Machado Nunes
Analista de Tecnologia da Informação — GTIC