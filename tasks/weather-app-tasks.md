# Backlog de Tarefas — Weather App

As tarefas estão agrupadas por fase e ordenadas por dependência. Cada item tem um foco principal, critérios verificáveis e rastreabilidade à spec quando aplicável.

## Matriz RF → Tarefas

| Requisito funcional | Tarefas de implementação | Tarefas de teste | Critérios da spec cobertos |
|---|---|---|---|
| RF-01 — Buscar cidades | T-03, T-07, T-10, T-11, T-17 | T-21, T-25, T-28, T-33 | CA-01.1 a CA-01.4 |
| RF-02 — Selecionar uma cidade | T-09, T-11, T-13, T-17 | T-27, T-28, T-30, T-33 | CA-02.1 a CA-02.2 |
| RF-03 — Consultar clima atual | T-04, T-06, T-08, T-13 | T-22, T-24, T-26, T-30, T-34 | CA-03.1 a CA-03.5 |
| RF-04 — Previsão diária de cinco dias | T-06, T-08, T-14 | T-24, T-26, T-31, T-35 | CA-04.1 a CA-04.4 |
| RF-05 — Alternar unidade | T-05, T-09, T-15 | T-23, T-27, T-32, T-35 | CA-05.1 a CA-05.3 |
| RF-06 — Estados e recuperação | T-02, T-09, T-12, T-17 | T-27, T-29, T-34 | CA-06.1 a CA-06.6 |

**Cobertura:** todos os requisitos funcionais RF-01 a RF-06 têm tarefas de implementação e de teste associadas. Gates de operação/lançamento, como termos do provedor e SLO, estão nas tarefas de hardening e não representam RF descobertos.

## Próximo Bloco de Implementação — Contratos e Dados

T-01 (`src/types/weather.ts`) já foi implementada. Para a próxima etapa, executar as tarefas existentes abaixo sem duplicar seus critérios:

| Ordem | Tarefa | Resultado necessário para avançar |
|---|---|---|
| 1 | T-02 — Definir tipos de estado da aplicação | `SearchState`, `WeatherState` e `AppError` compilam em TypeScript strict. |
| 2 | T-03 a T-06 — Implementar funções puras | Termo, códigos WMO, conversão e formatação temporal seguem os contratos e compilam. Estas quatro tarefas podem ser paralelizadas após T-01. |
| 3 | T-07 — Implementar serviço de geocoding | Geocoding normaliza resultados para `City`; depende de T-03. |
| 4 | T-08 — Implementar serviço de forecast | `current` e `daily` são normalizados para `WeatherData`; depende de T-06. |

**Saída do bloco:** tipos de aplicação, funções puras e ambos os services compilam; então T-09 (`useWeatherApp`) pode começar. Os testes associados permanecem nas tarefas da Fase 7.

## Prioridade, Tamanho e Fatias

**Prioridade:** P0 bloqueia um MVP demonstrável; P1 é necessária antes de produção; P2 é condicional ou pode ser adiada se sua condição não se aplicar. **Tamanho:** P é uma mudança pequena e isolada; M é uma unidade delimitada que exige integração/testes; G atravessa responsabilidades ou estados suficientes para justificar decomposição antes de começar.

| Tarefa | Prioridade | Tamanho |
|---|---|---|
| T-01 | P0 | P |
| T-02 | P0 | P |
| T-03 | P0 | P |
| T-04 | P0 | P |
| T-05 | P0 | P |
| T-06 | P0 | M |
| T-07 | P0 | M |
| T-08 | P0 | M |
| T-09 | P0 | G |
| T-10 | P0 | P |
| T-11 | P0 | P |
| T-12 | P0 | P |
| T-13 | P0 | M |
| T-14 | P0 | M |
| T-15 | P0 | P |
| T-16 | P0 | M |
| T-17 | P0 | G |
| T-18 | P0 | M |
| T-19 | P0 | P |
| T-20 | P0 | P |
| T-21 | P0 | P |
| T-22 | P0 | P |
| T-23 | P0 | P |
| T-24 | P0 | P |
| T-25 | P0 | M |
| T-26 | P0 | M |
| T-27 | P0 | M |
| T-28 | P0 | M |
| T-29 | P0 | P |
| T-30 | P0 | P |
| T-31 | P0 | P |
| T-32 | P0 | P |
| T-33 | P0 | M |
| T-34 | P0 | M |
| T-35 | P0 | M |
| T-36 | P1 | M |
| T-37 | P1 | M |
| T-38 | P1 | M |
| T-39 | P1 | M |
| T-40 | P1 | P |
| T-41 | P2* | P |
| T-42 | P1 | G |

`P2*` aplica somente se os termos do provedor exigirem atribuição visível; nesse caso T-41 torna-se gate de release. T-09, T-17 e T-42 são G: dividir por transição de estado, ponto de integração e configuração operacional, respectivamente, antes de implementar.

### Sequência sugerida de entrega

1. **Shell visível:** T-01, T-16, T-19 e T-20. Resultado: a SPA abre, mostra o shell e já possui a infraestrutura para testes.
2. **Busca vertical:** T-03, T-07, T-10, T-11, T-21, T-25, T-28 e T-33. Extrair de T-09/T-17 primeiro a orquestração e composição de busca; resultado: a pessoa envia cidade, vê resultados e seleciona a localidade.
3. **Consulta meteorológica completa:** T-04 a T-06, T-08, restante de T-09/T-17, T-12 a T-15 e T-22 a T-27, T-29 a T-35. Resultado: clima atual, previsão de cinco dias, unidade e recuperação de falhas, com testes unitários e E2E.
4. **Hardening e release:** T-18, T-36 a T-42. Resultado: responsividade, compatibilidade, acessibilidade, performance, termos do provedor e operação de produção verificados.

Para manter cada fatia entregável sem esperar todo o hook/compositor, decompor T-09 em estado/orquestração de busca e estado/orquestração meteorológica, e T-17 em composição de busca e composição do painel meteorológico, preservando os IDs ou criando subtarefas antes da execução.

## Fase 1 — Tipos

### T-01 — Definir tipos de domínio meteorológico
- **Descrição:** declarar `City`, `CurrentWeather`, `ForecastDay`, `WeatherData`, `SectionResult`, `WeatherErrorCode` e `Unit`.
- **Critérios de aceite:** modelos correspondem ao Data Model do plano; temperatura canônica em Celsius; opcionais e sucesso parcial representados sem valores artificiais; TypeScript strict compila.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Rastreabilidade:** RF-03, RF-04, RF-05.
- **Tipo:** Data.

### T-02 — Definir tipos de estado da aplicação
- **Descrição:** declarar `SearchState`, `WeatherState` e `AppError`.
- **Critérios de aceite:** busca distingue `idle/loading/success/empty/error`; clima distingue `idle/loading/success/partial/error`; erro indica se a operação permite retry.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/types/appState.ts`.
- **Rastreabilidade:** RF-06 (CA-06.1 a CA-06.6).
- **Tipo:** Data.

## Fase 2 — Funções Puras

### T-03 — Normalizar e validar termos de busca
- **Descrição:** implementar trim e validação pura da entrada.
- **Critérios de aceite:** remove espaços externos, preserva acentos, rejeita vazio/caracteres de controle e não faz I/O.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/searchTerm.ts`.
- **Rastreabilidade:** RF-01 (CA-01.2).
- **Tipo:** Data.

### T-04 — Mapear códigos meteorológicos WMO
- **Descrição:** mapear grupos WMO definidos na spec para descrições pt-BR.
- **Critérios de aceite:** cada grupo da spec retorna a descrição correspondente; código não mapeado retorna “Condição indisponível”.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Rastreabilidade:** RF-03 (CA-03.1, CA-03.5).
- **Tipo:** Data.

### T-05 — Implementar conversão de temperatura
- **Descrição:** converter Celsius/Fahrenheit com o arredondamento especificado.
- **Critérios de aceite:** converte a partir do Celsius canônico e arredonda empate para longe de zero.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Rastreabilidade:** RF-05 (CA-05.1, CA-05.2).
- **Tipo:** Data.

### T-06 — Implementar formatação temporal
- **Descrição:** formatar datas e timestamps locais usando o timezone da cidade.
- **Critérios de aceite:** datas são exibidas em `dd/MM/yyyy`; timestamp local não é reinterpretado no fuso do dispositivo.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/lib/dateTime.ts`.
- **Rastreabilidade:** RF-03, RF-04 (CA-03.1, CA-04.1, CA-04.2).
- **Tipo:** Data.

## Fase 3 — Services

### T-07 — Implementar serviço de geocoding
- **Descrição:** consultar Open-Meteo Geocoding e normalizar resultados para `City`.
- **Critérios de aceite:** usa `URLSearchParams`, `count=10`, `language=pt`, `format=json`; preserva ordem; resultado vazio e erro de serviço são estados distintos.
- **Dependências:** T-01, T-03.
- **Arquivos prováveis:** `src/services/geocodingService.ts`.
- **Rastreabilidade:** RF-01 (CA-01.1, CA-01.3, CA-01.4).
- **Tipo:** Data.

### T-08 — Implementar serviço de forecast
- **Descrição:** consultar Forecast API e normalizar `current` e `daily` independentemente.
- **Critérios de aceite:** request inclui coordenadas selecionadas, campos `current`/`daily`, timezone automático, cinco dias e unidades especificadas; valida JSON, timezone, unidades e números; timeout ≤ 10 s; suporta seção parcial.
- **Dependências:** T-01, T-06.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Rastreabilidade:** RF-03, RF-04 (CA-03.1 a CA-03.4, CA-04.1 a CA-04.4); RNF-03, RNF-04.
- **Tipo:** Data.

## Fase 4 — Hook e Estado

### T-09 — Implementar orquestração da jornada
- **Descrição:** implementar `useWeatherApp` para busca, seleção, consulta, retry, unidade e concorrência.
- **Critérios de aceite:** aplica os estados discriminados; selecionar cidade limpa dados anteriores; somente a resposta mais recente atualiza o estado; retry é manual; trocar unidade não chama services.
- **Dependências:** T-02, T-07, T-08.
- **Arquivos prováveis:** `src/hooks/useWeatherApp.ts`.
- **Rastreabilidade:** RF-02, RF-05, RF-06 (CA-02.1, CA-05.1 a CA-05.3, CA-06.2 a CA-06.5).
- **Tipo:** Data.

## Fase 5 — Componentes

### T-10 — Implementar formulário de busca
- **Descrição:** criar campo acessível, validação visual e envio explícito.
- **Critérios de aceite:** envio por teclado funciona; campo tem nome “Cidade”; erro é associado ao campo; componente recebe ações por props.
- **Dependências:** T-02, T-03.
- **Arquivos prováveis:** `src/components/CitySearchForm.tsx`.
- **Rastreabilidade:** RF-01 (CA-01.2, CA-06.1); RNF-02.
- **Tipo:** UI.

### T-11 — Implementar resultados de cidades
- **Descrição:** apresentar resultados e encaminhar seleção explícita.
- **Critérios de aceite:** exibe nome e país/região disponíveis; não seleciona automaticamente; seleção funciona por teclado.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/CityResults.tsx`.
- **Rastreabilidade:** RF-01, RF-02 (CA-01.1, CA-02.1, CA-02.2); RNF-02.
- **Tipo:** UI.

### T-12 — Implementar mensagens de estado
- **Descrição:** criar componente acessível para loading, vazio e erro.
- **Critérios de aceite:** estados usam texto e semântica acessível; loading é anunciado sem deslocar foco; não dependem só de cor ou ícone.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/components/StatusMessage.tsx`.
- **Rastreabilidade:** RF-06 (CA-06.2, CA-06.3); RNF-02.
- **Tipo:** UI.

### T-13 — Exibir condições atuais
- **Descrição:** apresentar cidade, temperatura, condição e timestamp local.
- **Critérios de aceite:** unidade e timezone são corretos; opcionais ausentes são omitidos; código WMO desconhecido não oculta temperatura válida.
- **Dependências:** T-04, T-06, T-09, T-12.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Rastreabilidade:** RF-02, RF-03 (CA-02.1, CA-03.1 a CA-03.5).
- **Tipo:** UI.

### T-14 — Exibir previsão de cinco dias
- **Descrição:** apresentar cinco posições diárias, incluindo slots incompletos.
- **Critérios de aceite:** datas são locais e consecutivas; temperaturas e precipitação aparecem quando válidas; slot indisponível não remove os outros dias.
- **Dependências:** T-04, T-06, T-09, T-12.
- **Arquivos prováveis:** `src/components/FiveDayForecast.tsx`.
- **Rastreabilidade:** RF-04 (CA-04.1 a CA-04.4).
- **Tipo:** UI.

### T-15 — Implementar controle de unidade
- **Descrição:** criar controle acessível Celsius/Fahrenheit.
- **Critérios de aceite:** unidade ativa é identificável; controle é operável por teclado e envia a seleção por callback.
- **Dependências:** T-02, T-09.
- **Arquivos prováveis:** `src/components/TemperatureUnitControl.tsx`.
- **Rastreabilidade:** RF-05 (CA-05.3); RNF-02.
- **Tipo:** UI.

## Fase 6 — Integração da Aplicação

### T-16 — Criar entrada e shell React
- **Descrição:** montar a raiz React, um `App` placeholder e o shell inicial da SPA.
- **Critérios de aceite:** `pnpm dev` abre a aplicação; `src/main.tsx` monta `App`; `App` placeholder renderiza `main`; `pnpm build` compila.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/main.tsx`, `src/App.tsx`, `index.html`.
- **Rastreabilidade:** base de execução para RF-01 a RF-06; RNF-03.
- **Tipo:** Infra.

### T-17 — Compor a tela principal
- **Descrição:** conectar hook e componentes sem colocar fetch ou regras de domínio em `App`.
- **Critérios de aceite:** fluxo buscar → selecionar → consultar está conectado; estado/ações passam por props; build compila.
- **Dependências:** T-09, T-10, T-11, T-12, T-13, T-14, T-15, T-16.
- **Arquivos prováveis:** `src/App.tsx`.
- **Rastreabilidade:** integra RF-01 a RF-06 (CA-06.1).
- **Tipo:** UI.

### T-18 — Aplicar estilos responsivos
- **Descrição:** ajustar o layout para os viewports definidos na spec.
- **Critérios de aceite:** busca, resultados, unidade e previsão não causam rolagem horizontal em 320 px, 768 px ou 1280 px.
- **Dependências:** T-17.
- **Arquivos prováveis:** `src/styles/index.css`.
- **Rastreabilidade:** RNF-01.
- **Tipo:** UI.

## Fase 7 — Testes

### T-19 — Configurar runner Vitest
- **Descrição:** configurar Vitest para descobrir os testes unitários.
- **Critérios de aceite:** `pnpm test` descobre testes em `tests/unit`; fake timers podem ser usados.
- **Dependências:** T-16.
- **Arquivos prováveis:** `vite.config.ts`.
- **Rastreabilidade:** habilita testes automatizados de todos os CA.
- **Tipo:** Test.

### T-20 — Configurar ambiente DOM dos testes
- **Descrição:** configurar Testing Library, jsdom e um smoke test.
- **Critérios de aceite:** smoke test renderiza React; matchers DOM ficam disponíveis.
- **Dependências:** T-19.
- **Arquivos prováveis:** `tests/setup.ts`, `tests/unit/setup.test.ts`.
- **Rastreabilidade:** habilita testes automatizados de componentes e hooks.
- **Tipo:** Test.

### T-21 — Testar normalização de busca
- **Descrição:** testar entradas válidas e inválidas.
- **Critérios de aceite:** cobre espaços, acentos, campo vazio e caracteres de controle.
- **Dependências:** T-03, T-20.
- **Arquivos prováveis:** `tests/unit/lib/searchTerm.test.ts`.
- **Rastreabilidade:** CA-01.2.
- **Tipo:** Test.

### T-22 — Testar mapeamento WMO
- **Descrição:** testar códigos nos limites dos grupos e fallback.
- **Critérios de aceite:** cobre todos os grupos da spec e códigos fora deles.
- **Dependências:** T-04, T-20.
- **Arquivos prováveis:** `tests/unit/lib/weatherCodes.test.ts`.
- **Rastreabilidade:** CA-03.1, CA-03.5.
- **Tipo:** Test.

### T-23 — Testar conversão de temperatura
- **Descrição:** testar conversões positivas, negativas e repetidas.
- **Critérios de aceite:** teste Vitest verifica `0 °C → 32 °F`, `-10 °C → 14 °F`, a regra de empate para longe de zero e que as funções não alteram o valor canônico recebido.
- **Dependências:** T-05, T-20.
- **Arquivos prováveis:** `tests/unit/lib/temperature.test.ts`.
- **Rastreabilidade:** CA-05.1, CA-05.2.
- **Tipo:** Test.

### T-24 — Testar formatação temporal
- **Descrição:** testar datas, horários e virada do dia em timezones.
- **Critérios de aceite:** cobre ao menos dois fusos e horário próximo da virada local.
- **Dependências:** T-06, T-20.
- **Arquivos prováveis:** `tests/unit/lib/dateTime.test.ts`.
- **Rastreabilidade:** CA-03.1, CA-04.1, CA-04.2.
- **Tipo:** Test.

### T-25 — Testar serviço de geocoding
- **Descrição:** testar contrato de geocoding com `fetch` controlado.
- **Critérios de aceite:** verifica acentos, parâmetros, limite/ordem, mapeamento, lista vazia, JSON inválido e erros HTTP/rede; não chama API real.
- **Dependências:** T-07, T-19.
- **Arquivos prováveis:** `tests/unit/services/geocodingService.test.ts`.
- **Rastreabilidade:** CA-01.1, CA-01.3, CA-01.4.
- **Tipo:** Test.

### T-26 — Testar serviço de forecast
- **Descrição:** testar normalização e falhas com `fetch` mockado, fixtures e fake timers.
- **Critérios de aceite:** todos os casos controlam `fetch` com mock e verificam cinco slots, opcionais, unidades, timezone, payload parcial, HTTP, JSON, timeout e abort; nenhuma chamada real à Open-Meteo ocorre.
- **Dependências:** T-08, T-19.
- **Arquivos prováveis:** `tests/unit/services/weatherService.test.ts`, `tests/fixtures/openMeteo.ts`.
- **Rastreabilidade:** CA-03.3, CA-03.4, CA-04.3, CA-04.4, CA-06.3.
- **Tipo:** Test.

### T-27 — Testar estados e concorrência do hook
- **Descrição:** testar transições do hook com services simulados.
- **Critérios de aceite:** cobre vazio/sucesso/erro, seleção, parcial, retry, limpeza de dados antigos, resposta fora de ordem e unidade sem nova chamada.
- **Dependências:** T-09, T-20.
- **Arquivos prováveis:** `tests/unit/hooks/useWeatherApp.test.ts`.
- **Rastreabilidade:** CA-05.1, CA-06.2 a CA-06.5.
- **Tipo:** Test.

### T-28 — Testar formulário e resultados
- **Descrição:** testar formulário e lista de cidades.
- **Critérios de aceite:** verifica validação/envio, nomes acessíveis, resultados e seleção por teclado.
- **Dependências:** T-10, T-11, T-20.
- **Arquivos prováveis:** `tests/unit/components/CitySearchForm.test.tsx`, `tests/unit/components/CityResults.test.tsx`.
- **Rastreabilidade:** CA-01.1, CA-01.2, CA-02.1, CA-02.2.
- **Tipo:** Test.

### T-29 — Testar mensagens de estado
- **Descrição:** testar o componente nos estados `loading`, `error` e `empty`.
- **Critérios de aceite:** Testing Library renderiza cada estado com props controladas; loading tem status acessível, erro tem mensagem e retry quando aplicável, e vazio tem mensagem de ausência de resultados; cada um é consultável por role/nome acessível.
- **Dependências:** T-12, T-20.
- **Arquivos prováveis:** `tests/unit/components/StatusMessage.test.tsx`.
- **Rastreabilidade:** CA-06.2, CA-06.3.
- **Tipo:** Test.

### T-30 — Testar condições atuais
- **Descrição:** verificar renderização atual completa e parcial.
- **Critérios de aceite:** cobre sucesso, opcionais ausentes, código desconhecido e seção indisponível.
- **Dependências:** T-13, T-20.
- **Arquivos prováveis:** `tests/unit/components/CurrentWeather.test.tsx`.
- **Rastreabilidade:** CA-03.1 a CA-03.5.
- **Tipo:** Test.

### T-31 — Testar previsão diária
- **Descrição:** verificar estados completos e parciais dos cinco dias.
- **Critérios de aceite:** cobre datas, unidades, probabilidade opcional e dia indisponível sem ocultar outros dias.
- **Dependências:** T-14, T-20.
- **Arquivos prováveis:** `tests/unit/components/FiveDayForecast.test.tsx`.
- **Rastreabilidade:** CA-04.1 a CA-04.4.
- **Tipo:** Test.

### T-32 — Testar controle de unidade
- **Descrição:** testar valor inicial, seleção e acessibilidade.
- **Critérios de aceite:** Celsius é inicial; cada opção chama callback com unidade correta; controles têm nome acessível e funcionam por teclado.
- **Dependências:** T-15, T-20.
- **Arquivos prováveis:** `tests/unit/components/TemperatureUnitControl.test.tsx`.
- **Rastreabilidade:** CA-05.3.
- **Tipo:** Test.

### T-33 — Testar E2E de busca e seleção
- **Descrição:** verificar busca, resultados e escolha da localidade no navegador.
- **Critérios de aceite:** APIs interceptadas; cobre acentos, homônimos, vazio e seleção explícita; sem rede ao vivo.
- **Dependências:** T-17, T-18, T-28.
- **Arquivos prováveis:** `tests/e2e/city-search.spec.ts`.
- **Rastreabilidade:** CA-01.1 a CA-01.4, CA-02.1, CA-02.2.
- **Tipo:** Test.

### T-34 — Testar E2E de clima atual e retry
- **Descrição:** validar condições atuais, erro, timeout e retry manual no browser.
- **Critérios de aceite:** sucesso mostra temperatura/condição/timestamp local; falha mostra mensagem e retry; retry envia uma chamada; nenhuma API real é chamada.
- **Dependências:** T-33, T-13.
- **Arquivos prováveis:** `tests/e2e/current-weather.spec.ts`.
- **Rastreabilidade:** CA-03.1, CA-06.2 a CA-06.4, CA-06.6.
- **Tipo:** Test.

### T-35 — Testar E2E de previsão e unidades
- **Descrição:** percorrer a jornada E2E completa: buscar cidade, selecionar resultado, carregar clima atual e cinco dias, alternar C/F.
- **Critérios de aceite:** com APIs interceptadas, a pessoa conclui a jornada; cinco datas locais são exibidas; alternar unidade não chama API de novo; após recarga inicia em Celsius.
- **Dependências:** T-34, T-14, T-15, T-31, T-32.
- **Arquivos prováveis:** `tests/e2e/forecast-and-units.spec.ts`.
- **Rastreabilidade:** CA-04.1, CA-04.2, CA-05.1, CA-05.3.
- **Tipo:** Test.

## Fase 8 — Hardening e Release

### T-36 — Verificar viewport mobile
- **Descrição:** repetir o fluxo principal de busca, seleção e consulta em viewport mobile e nos tamanhos mínimos da spec.
- **Critérios de aceite:** Playwright executa busca → seleção → clima/previsão em 320 px, 768 px e perfil mobile; `scrollWidth <= clientWidth`; campo, seleção, controle de unidade e leitura dos cinco dias permanecem utilizáveis.
- **Dependências:** T-33, T-35.
- **Arquivos prováveis:** `tests/e2e/responsive.spec.ts`, `playwright.config.ts`.
- **Rastreabilidade:** RNF-01.
- **Tipo:** Test.

### T-37 — Configurar matriz de navegadores
- **Descrição:** configurar CI para navegadores suportados pela spec.
- **Critérios de aceite:** fluxos principais executam nos Chrome, Edge, Firefox e Safari/WebKit definidos para release; resultados são separados por projeto.
- **Dependências:** T-33, T-35.
- **Arquivos prováveis:** `playwright.config.ts`, workflow de CI existente.
- **Rastreabilidade:** RNF-04.
- **Tipo:** Test.

### T-38 — Automatizar auditoria de acessibilidade
- **Descrição:** adicionar auditoria automatizada aos estados principais.
- **Critérios de aceite:** estados inicial, resultados, loading, erro e clima não têm violações críticas/serious; fluxo de teclado tem cobertura E2E.
- **Dependências:** T-17, T-18, T-28 a T-32, T-33.
- **Arquivos prováveis:** `package.json`, `tests/e2e/accessibility.spec.ts`.
- **Rastreabilidade:** RNF-02.
- **Tipo:** Test.

### T-39 — Medir performance percebida
- **Descrição:** registrar execução reproduzível das metas de performance.
- **Critérios de aceite:** cinco execuções Lighthouse mobile com cache frio têm mediana ≤ 2 s até formulário utilizável; loading aparece ≤ 100 ms; ambiente/resultado ficam registrados.
- **Dependências:** T-18, T-36.
- **Arquivos prováveis:** `docs/performance.md`.
- **Rastreabilidade:** RNF-03.
- **Tipo:** Test.

### T-40 — Validar termos e limites Open-Meteo
- **Descrição:** confirmar cobertura, limites, termos e atribuição exigidos para o uso previsto.
- **Critérios de aceite:** aprovação/documentação registrada antes do release; requisitos de atribuição identificados.
- **Dependências:** T-07, T-08.
- **Arquivos prováveis:** `docs/provider-approval.md`.
- **Rastreabilidade:** RNF-06; Open Question 1 da spec.
- **Tipo:** Infra.

### T-41 — Exibir atribuição quando exigida
- **Descrição:** implementar crédito visível conforme validação dos termos.
- **Critérios de aceite:** se exigida, aparece na UI e tem teste de renderização; se dispensada, decisão fica documentada sem UI desnecessária.
- **Dependências:** T-17, T-40.
- **Arquivos prováveis:** `src/components/SourceAttribution.tsx`, `src/App.tsx`.
- **Rastreabilidade:** RNF-06.
- **Tipo:** UI.

### T-42 — Configurar hospedagem e monitoramento do SLO
- **Descrição:** escolher hospedagem/responsável e configurar verificação sintética do frontend.
- **Critérios de aceite:** probe a cada cinco minutos confirma aplicação/formulário utilizável; relatório mensal mede 99,5% do frontend separado da API; procedimento de incidente documentado.
- **Dependências:** T-17, T-39, T-40.
- **Arquivos prováveis:** configuração de deploy/CI do provedor escolhido, `docs/operations.md`.
- **Rastreabilidade:** RNF-06; Open Question 2 da spec.
- **Tipo:** Infra.