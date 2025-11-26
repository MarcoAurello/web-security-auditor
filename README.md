Web Security Auditor – Scanner de Segurança Web em Node.js

Ferramenta desenvolvida para varredura automatizada não intrusiva de segurança em aplicações web, com foco em:

configurações de segurança,

certificados TLS,

cabeçalhos HTTP,

exposição de endpoints sensíveis,

classificação automática de risco,

geração de relatórios técnicos em HTML.

⚠️ Uso exclusivo em sistemas próprios ou com autorização formal.

📌 1. Objetivo do Projeto

Este projeto tem como objetivo apoiar:

equipes de Cibersegurança,

GTIC,

gestores de contratos terceirizados,

auditorias internas,

na identificação rápida de riscos de exposição externa, sem realizar qualquer tipo de ataque, exploração ativa ou técnica invasiva.

A ferramenta atua apenas com:

requisições HTTP/HTTPS,

verificação de certificados,

enumeração passiva de caminhos públicos.

🧱 2. Arquitetura da Aplicação

O sistema é modular, cada parte com uma responsabilidade clara:

web-security-auditor/
├── src/
│   ├── index.js                # Scan unitário
│   ├── batchScan.js            # Scan em lote (várias URLs)
│   ├── httpClient.js           # Cliente HTTP
│   ├── headerScanner.js        # Análise de cabeçalhos de segurança
│   ├── tlsScanner.js           # Análise de certificado TLS
│   ├── sensitivePathsScanner.js # Enumeração de caminhos sensíveis
│   ├── riskScorer.js           # Cálculo automático de score de risco
│   ├── reportGenerator.js      # Geração de relatório HTML
├── reports/                    # Relatórios gerados
├── urls.txt                    # Lista de URLs para varredura em lote
├── package.json
└── README.md

⚙️ 3. Tecnologias Utilizadas

Node.js 18+

Axios – Requisições HTTP

TLS nativo do Node – Análise de certificados

File System (fs) – Geração de relatórios

HTML + CSS puro – Relatório visual

Metodologia OWASP Top 10 – Base para classificação de riscos

🚀 4. Instalação do Projeto
4.1 Pré-requisitos

Node.js instalado (versão 18 ou superior)

Acesso à internet (para escanear URLs públicas)

Permissão formal para auditoria dos sistemas testados

4.2 Instalação

Na raiz do projeto:

npm install

▶️ 5. Como Executar
🔹 5.1 Scan Unitário (1 URL)
npm run scan -- https://exemplo.com.br


Resultado:

Exibe relatório no terminal

Pode gerar JSON (se configurado)

🔹 5.2 Scan em Lote (múltiplas URLs)

Criar o arquivo urls.txt:

https://www.hemobras.gov.br
https://portal.hemobras.gov.br
https://api.hemobras.gov.br


Executar:

npm run scan:batch


Relatórios gerados em:

/reports/*.html


Cada URL gera um relatório individual em HTML.

🧪 6. O que o Scanner Analisa
✅ 6.1 Conectividade HTTP

Status HTTP

Tempo de resposta

✅ 6.2 Certificado TLS / HTTPS

Emissor

Validade

Dias para expirar

Classificação automática de risco

✅ 6.3 Cabeçalhos de Segurança

Content-Security-Policy (CSP)

Strict-Transport-Security (HSTS)

X-Frame-Options

X-Content-Type-Options

Referrer-Policy

Permissions-Policy

✅ 6.4 Enumeração de Caminhos Sensíveis

Exemplos:

/admin

/login

/dashboard

/actuator

/wp-admin

/temp

/test

/sistema

📊 7. Score de Risco

O sistema gera automaticamente:

Score de 0 a 100

Classificação:

LOW → Risco Baixo

MEDIUM → Risco Médio

HIGH → Risco Alto

O cálculo utiliza:

quantidade de headers ausentes,

endpoints sensíveis acessíveis,

risco do certificado TLS.

🗂️ 8. Geração de Relatório HTML

Cada execução gera automaticamente um relatório técnico contendo:

Identificação do sistema

Data da varredura

Score geral

Tabela de cabeçalhos

Tabela de endpoints

Mapeamento automático OWASP

Recomendações técnicas dinâmicas

Conclusão automática baseada nos achados

Identificação do responsável técnico

O relatório é salvo em:

/reports/scan-<hostname>-<data>.html


Basta abrir no navegador.

🔎 9. Mapeamento OWASP Automático

O sistema correlaciona automaticamente os achados com:

A01 – Broken Access Control

A02 – Cryptographic Failures

A05 – Security Misconfiguration

A06 – Vulnerable and Outdated Components

🔐 10. Boas Práticas e Segurança Legal

⚠️ Esta ferramenta não deve ser usada para ataque, exploração ou testes sem autorização.

Uso permitido:

Ambientes próprios

Homologação

Treinamento

Sistemas com autorização formal por escrito

Uso proibido:

Produção sem autorização

Sistemas de terceiros sem contrato

Ambientes governamentais sem ordem formal

🛠️ 11. Possíveis Evoluções Futuras

Geração automática de PDF

Dashboard web consolidado

Integração com OWASP ZAP

Exportação para Excel

Ranking de risco por sistema

Alertas automáticos por e-mail

Integração com sistema de chamados

👨‍💻 12. Responsável Técnico

Desenvolvido por:

Marco Aurellio Machado Nunes
Analista de Tecnologia da Informação – GTIC
Foco em Cibersegurança, Governança de TI e Auditoria de Sistemas

✅ 13. Licença de Uso

Ferramenta de uso interno e educativo, sem fins comerciais, voltada para:

gestão de riscos,

melhoria de segurança,

conformidade institucional.