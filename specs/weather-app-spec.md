# Especificação de Produto — Weather App

## Overview

O Weather App permite buscar uma cidade, selecionar a localidade e consultar as condições estimadas para o horário informado pelo provedor, além da previsão diária de hoje e dos quatro dias seguintes no fuso da cidade. A interface é web responsiva, em pt-BR, usa Celsius por padrão e oferece Fahrenheit.

O MVP usa Open-Meteo para geocodificação e meteorologia, sem conta, localização automática ou persistência. A spec define os comportamentos observáveis e critérios de aceite; as perguntas restantes são gates operacionais ou de negócio, não decisões necessárias para implementar os fluxos.

## Functional Requirements

### RF-01 — Buscar cidades

- A busca começa somente após envio explícito do formulário. O sistema remove espaços no início e no fim, preserva caracteres acentuados e envia a entrada codificada como parâmetro de consulta.
- Uma entrada vazia após remoção de espaços, ou contendo caracteres de controle, não gera chamada externa e recebe mensagem de validação junto ao campo.
- O sistema apresenta até 10 resultados na ordem de relevância devolvida pelo serviço, com nome da localidade, país e região/estado quando fornecidos. Não seleciona resultado automaticamente.
- Lista vazia é estado “cidade não encontrada”, distinto de falha de rede ou do provedor; permite corrigir e enviar outra busca.

### RF-02 — Selecionar uma cidade

- A pessoa usuária deve selecionar explicitamente um resultado. A localidade e suas coordenadas selecionadas são a referência da consulta meteorológica.
- A interface identifica a cidade, região/estado e país selecionados junto aos dados exibidos.
- Ao selecionar outra cidade, os dados da cidade anterior deixam de ser apresentados como atuais enquanto a nova consulta carrega ou falha.

### RF-03 — Consultar e exibir o clima atual

- “Clima atual” significa a estimativa do provedor para o timestamp devolvido, não uma observação de estação. A interface exibe temperatura, condição em pt-BR e horário de atualização no fuso local.
- Temperatura é apresentada em °C ou °F; umidade em %, velocidade do vento em km/h e precipitação em mm. Valores atuais opcionais só aparecem quando presentes e válidos.
- Se faltar temperatura atual ou timestamp, a seção atual mostra indisponibilidade. Campo opcional ausente é omitido; código meteorológico desconhecido resulta em “Condição indisponível”, sem ocultar a temperatura válida.
- Mapeamento dos códigos WMO: `0` limpo; `1–3` parcialmente nublado; `45, 48` nevoeiro; `51–57` garoa; `61–67` chuva; `71–77` neve; `80–82` pancadas de chuva; `85–86` pancadas de neve; `95–99` trovoadas. Código fora da lista: “Condição indisponível”.

### RF-04 — Exibir previsão diária de cinco dias

- A previsão contém cinco posições de calendário local: hoje na cidade e os quatro dias seguintes. As datas e a virada do dia usam o fuso IANA devolvido pelo provedor, não o fuso do dispositivo.
- Cada posição apresenta data, condição e máxima/mínima em °C ou °F. Probabilidade diária de precipitação é apresentada em % quando disponível.
- Se um dia ou um campo obrigatório estiver ausente/inválido, a posição daquele dia permanece e indica “Dados indisponíveis”; os demais dias válidos continuam visíveis.

### RF-05 — Alternar unidade de temperatura

- A pessoa usuária alterna entre Celsius e Fahrenheit; a seleção aplica-se a todas as temperaturas atuais e diárias carregadas sem nova chamada meteorológica.
- Valores canônicos permanecem em Celsius. Para exibição em Fahrenheit usa-se $F = C \times 9/5 + 32$; arredonda-se ao inteiro mais próximo, com meio arredondado para longe de zero.
- A escolha vale durante a sessão da página e volta a Celsius após recarga. A unidade ativa aparece junto a cada valor.

### RF-06 — Comunicar estados e permitir recuperação

- Estados distintos: inicial, buscando cidade, carregando clima, resultados vazios, sucesso parcial/completo e erro. Mensagens indicam se a cidade não existe, se o provedor falhou ou se os dados estão incompletos.
- Cada chamada externa tem timeout de 10 segundos. Não há retry automático. Falha de rede, timeout, HTTP 429/5xx ou resposta meteorológica inválida oferece retry manual; erro de validação, cidade não encontrada ou HTTP 4xx não oferece retry.
- A busca permanece disponível após sucesso, vazio ou erro. A resposta da busca mais recente é a única que pode atualizar a interface; respostas atrasadas são ignoradas.
- Erro de clima para uma cidade nova não mantém dados da cidade anterior no painel.

## User Stories

### US-01 — Buscar uma cidade (RF-01)

Como Marina, profissional em deslocamento, quero buscar pelo nome de uma cidade para encontrar rapidamente a localidade que pretendo consultar.

### US-02 — Selecionar a localidade correta (RF-02)

Como Beatriz, organizadora de atividade ao ar livre, quero selecionar a cidade correta entre localidades com nomes semelhantes para evitar consultar a previsão do lugar errado.

### US-03 — Consultar as condições atuais (RF-03)

Como Marina, profissional em deslocamento, quero ver a temperatura e a condição meteorológica atual da minha cidade para decidir como me preparar antes de sair.

### US-04 — Consultar cinco dias de previsão (RF-04)

Como Rafael, viajante, quero consultar a previsão de hoje e dos quatro dias seguintes no meu destino para planejar a viagem e a bagagem.

### US-05 — Alternar a unidade de temperatura (RF-05)

Como Rafael, viajante, quero alternar entre Celsius e Fahrenheit sem refazer a consulta para entender as temperaturas na unidade que prefiro.

### US-06 — Recuperar-se de falhas (RF-06)

Como Beatriz, organizadora de atividade ao ar livre, quero entender quando a busca ou os dados meteorológicos falharem e poder tentar novamente para continuar o planejamento da atividade.

## Acceptance Criteria

Os cenários usam respostas controladas dos serviços externos. Os rótulos **Given**, **When** e **Then** indicam contexto, ação e resultado verificável.

### RF-01 — Buscar cidades (US-01)

- **CA-01.1:** **Given** o termo `São Paulo` e uma resposta com duas localidades, **When** a pessoa usuária envia a busca, **Then** o serviço recebe o termo sem perda de acentos e a interface mostra cada resultado com nome, país e região/estado quando fornecidos.
- **CA-01.2:** **Given** um campo vazio ou contendo somente espaços/caracteres de controle, **When** a pessoa usuária envia o formulário, **Then** nenhuma chamada é feita e uma mensagem de validação é associada ao campo.
- **CA-01.3:** **Given** uma resposta vazia do serviço, **When** a busca termina, **Then** a interface mostra “Nenhuma cidade encontrada. Confira o nome e tente novamente.”, não solicita previsão e permite nova busca.
- **CA-01.4:** **Given** mais de 10 resultados em ordem de relevância, **When** a lista é exibida, **Then** são apresentados somente os 10 primeiros na mesma ordem.

### RF-02 — Selecionar uma cidade (US-02)

- **CA-02.1:** **Given** resultados com duas localidades homônimas e coordenadas distintas, **When** a pessoa seleciona uma delas, **Then** o cabeçalho identifica nome, região/estado e país disponíveis e a consulta usa as coordenadas daquele resultado.
- **CA-02.2:** **Given** resultados apresentados sem seleção, **When** a lista é renderizada, **Then** nenhuma chamada meteorológica é feita.

### RF-03 — Consultar e exibir o clima atual (US-03)

- **CA-03.1:** **Given** temperatura atual de 20 °C, código 0, timestamp 12:30 e fuso `America/Sao_Paulo`, **When** os dados são carregados, **Then** a interface mostra 20 °C, “Céu limpo” e “Atualizado às 12:30” na data local.
- **CA-03.2:** **Given** umidade, vento e precipitação atuais válidos, **When** o painel é exibido, **Then** mostra os valores em %, km/h e mm, respectivamente.
- **CA-03.3:** **Given** um campo opcional ausente ou inválido, **When** o painel é exibido, **Then** esse campo é omitido e os demais valores válidos continuam visíveis.
- **CA-03.4:** **Given** temperatura ou timestamp atual ausente/inválido, **When** a resposta é processada, **Then** o painel atual informa “Dados atuais indisponíveis” e não exibe valor fabricado.
- **CA-03.5:** **Given** um código meteorológico desconhecido, **When** o painel é exibido, **Then** a condição aparece como “Condição indisponível” e uma temperatura válida permanece visível.

### RF-04 — Exibir previsão diária de cinco dias (US-04)

- **CA-04.1:** **Given** a data local de hoje e o fuso da cidade, **When** a previsão é carregada, **Then** são renderizadas cinco posições de data consecutivas, começando hoje na cidade.
- **CA-04.2:** **Given** dados válidos para uma data, **When** essa posição é exibida, **Then** mostra data em `dd/MM/yyyy`, condição e máxima/mínima com a unidade ativa.
- **CA-04.3:** **Given** probabilidade diária disponível, **When** o dia é exibido, **Then** o percentual é mostrado; se ausente ou inválido, o percentual é omitido.
- **CA-04.4:** **Given** uma data ausente ou máxima/mínima inválida, **When** a previsão é exibida, **Then** a posição da data permanece com “Dados indisponíveis” e os outros dias válidos continuam visíveis.

### RF-05 — Alternar unidade de temperatura (US-05)

- **CA-05.1:** **Given** temperatura atual de 0 °C e máxima/mínima de 20 °C e 10 °C, **When** Fahrenheit é selecionado, **Then** os valores são 32 °F, 68 °F e 50 °F sem nova chamada meteorológica.
- **CA-05.2:** **Given** temperatura de -10 °C, **When** Fahrenheit é selecionado, **Then** o valor é 14 °F; ao voltar a Celsius, retorna a -10 °C, sem acumular erro de conversão nem fazer nova chamada.
- **CA-05.3:** **Given** a preferência Fahrenheit durante a sessão, **When** outra cidade é consultada, **Then** os novos valores continuam em Fahrenheit; após recarregar a página, a unidade inicial é Celsius.

### RF-06 — Comunicar estados e permitir recuperação (US-06)

- **CA-06.1:** **Given** nenhuma busca realizada, **When** a aplicação abre, **Then** o campo nomeado “Cidade” e a ação “Buscar” estão disponíveis por teclado.
- **CA-06.2:** **Given** uma chamada pendente, **When** o formulário é enviado, **Then** um indicador de carregamento visível e anunciado por tecnologia assistiva aparece até sucesso, erro ou timeout.
- **CA-06.3:** **Given** que uma chamada excede 10 segundos, **When** o timeout ocorre, **Then** o loading termina, a interface mostra “Não foi possível carregar os dados. Tente novamente.” e oferece retry manual; uma resposta tardia não altera a tela.
- **CA-06.4:** **Given** falha de rede ou do provedor, **When** a pessoa aciona “Tentar novamente”, **Then** uma chamada equivalente é feita uma vez, sem retry automático, e o estado de carregamento é reapresentado.
- **CA-06.5:** **Given** a busca A seguida da busca B, com B respondendo antes de A, **When** ambas as respostas chegam, **Then** somente os resultados de B são exibidos.
- **CA-06.6:** **Given** falha do provedor, **When** o erro é exibido, **Then** a mensagem é diferente do estado de cidade não encontrada e outra busca continua disponível.

## Traceability Matrix

| User Story | Requisito funcional | Acceptance Criteria | Requisitos não funcionais relevantes |
|---|---|---|---|
| US-01 — Buscar uma cidade | RF-01 | CA-01.1 a CA-01.4 | RNF-01 responsividade; RNF-02 acessibilidade; RNF-03 desempenho; RNF-04 validação/robustez; RNF-05 privacidade. |
| US-02 — Selecionar a localidade correta | RF-02 | CA-02.1 a CA-02.2 | RNF-01 responsividade; RNF-02 teclado e nomes acessíveis; RNF-03 feedback; RNF-04 validação dos dados selecionados. |
| US-03 — Consultar as condições atuais | RF-03 | CA-03.1 a CA-03.5 | RNF-01 responsividade; RNF-02 acessibilidade; RNF-03 timeout; RNF-04 resposta parcial; RNF-05 privacidade; RNF-06 disponibilidade/atribuição. |
| US-04 — Consultar cinco dias de previsão | RF-04 | CA-04.1 a CA-04.4 | RNF-01 responsividade; RNF-02 acessibilidade; RNF-03 timeout; RNF-04 integridade dos dados; RNF-05 privacidade; RNF-06 disponibilidade/atribuição. |
| US-05 — Alternar a unidade de temperatura | RF-05 | CA-05.1 a CA-05.3 | RNF-01 responsividade; RNF-02 acessibilidade por teclado; RNF-04 integridade dos valores. |
| US-06 — Recuperar-se de falhas | RF-06 | CA-06.1 a CA-06.6 | RNF-01 responsividade; RNF-02 anúncio acessível dos estados; RNF-03 timeout/desempenho; RNF-04 robustez; RNF-05 privacidade da telemetria; RNF-06 disponibilidade. |

RNF-01 e RNF-02 aplicam-se transversalmente à interface. RNF-06 mede a disponibilidade do frontend em todos os fluxos; atribuição e disponibilidade da Open-Meteo impactam diretamente US-03 e US-04.

## Non-Functional Requirements

### RNF-01 — Responsividade

- Busca, seleção, unidade e cinco dias devem funcionar em viewports de 320 px, 768 px e 1280 px, sem rolagem horizontal.

### RNF-02 — Acessibilidade

- Os fluxos de busca, seleção, unidade, retry e leitura devem atender WCAG 2.2 AA e ser concluíveis por teclado.
- Campo, resultados, botões e estados devem ter nomes/roles acessíveis; loading, erro e resultados são anunciados sem exigir foco forçado.
- Cor ou ícone não podem ser o único meio de transmitir estado. Contraste de texto e controles atende WCAG 2.2 AA.
- Verificação: testes automatizados de acessibilidade sem violações críticas/serious e revisão manual de teclado e leitor de tela nos fluxos principais.

### RNF-03 — Desempenho

- Em Lighthouse mobile, cache frio e cinco execuções, a mediana do tempo até o formulário utilizável deve ser ≤ 2 s.
- Após envio, o estado visual de carregamento deve aparecer em ≤ 100 ms, medido no navegador sem aguardar a rede.
- Cada chamada externa termina em sucesso, erro ou timeout de no máximo 10 s; operações pendentes não bloqueiam nova busca.

### RNF-04 — Robustez e compatibilidade

- O sistema deve validar respostas externas e tratar conteúdo externo como não confiável.
- Respostas incompletas ou inválidas não devem resultar em valores meteorológicos apresentados como válidos.
- O produto funciona nas duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari na data de cada release.

### RNF-05 — Segurança e privacidade

- O MVP não deve exigir dados pessoais desnecessários, conta ou localização automática.
- A entrada é validada e codificada; conteúdo externo é renderizado como texto, nunca como HTML executável.
- Não são coletados nome de busca, coordenadas, localização do dispositivo, identificadores de usuário ou analytics de uso.
- A integração não requer chave de API; segredos futuros não podem ser distribuídos no frontend.
- Telemetria de diagnóstico pode registrar somente classe do erro, operação, provedor, versão da aplicação e timestamp; não inclui busca, coordenadas ou identificador. Retenção máxima: 30 dias.

### RNF-06 — Disponibilidade e atribuição

- Meta do frontend: ao menos 99,5% das verificações sintéticas bem-sucedidas por mês-calendário, executadas a cada 5 minutos; sucesso significa carregar a aplicação e deixar o formulário utilizável. Falhas da Open-Meteo são contabilizadas separadamente.
- Atribuição à Open-Meteo é exibida conforme os termos vigentes no release; a conformidade é condição de lançamento.

## Edge Cases

- Termo vazio, caracteres de controle ou nenhum resultado: validar antes da consulta; não chamar o serviço meteorológico; manter o formulário disponível.
- Cidades homônimas: mostrar contexto geográfico disponível e exigir seleção explícita.
- Resposta meteorológica parcialmente válida: manter os campos/dias válidos, marcar o campo obrigatório ausente como indisponível e nunca inventar dados.
- Resposta atual válida com previsão inválida, ou vice-versa: preservar o conjunto válido e mostrar erro somente na seção afetada.
- Timeout, erro de rede/provedor ou resposta inválida: encerrar loading em até 10 s, não fazer retry automático e oferecer retry manual.
- Respostas fora de ordem: ignorar resposta de busca anterior à busca mais recente.
- Virada de dia e horário de verão: usar data e hora do fuso da localidade devolvido pelo provedor; não usar o fuso do dispositivo.
- Código meteorológico desconhecido: mostrar “Condição indisponível” e preservar outros campos válidos.
- Falha ao carregar uma cidade recém-selecionada: não manter dados da cidade anterior no painel.

## Assumptions

- A cobertura geográfica é a oferecida pela Open-Meteo; a interface permanece em pt-BR.
- A pessoa usuária informa a cidade; não há GPS, conta, persistência local ou servidor de dados.
- O clima atual é estimativa do provedor; horário e calendário usam o fuso retornado para a localidade.
- Celsius é o padrão, Fahrenheit é a alternativa e a escolha não sobrevive à recarga.
- Personas e metas de sucesso do discovery são hipóteses até validação por stakeholders/usuários.

## Risks

| ID | Risco | Mitigação |
|---|---|---|
| R-01 | Open-Meteo indisponível, lenta ou com mudança de contrato. | Timeout de 10 s, validação de resposta, erro distinto e retry manual. |
| R-02 | Cidade homônima selecionada incorretamente. | Exibir país/região disponíveis e exigir seleção explícita. |
| R-03 | Dado parcial apresentado como completo ou atual. | Timestamp local, validação por campo e estados de indisponibilidade sem valores inventados. |
| R-04 | Violação de termos, limites ou atribuição do provedor. | Confirmar termos vigentes, limites e crédito antes do release. |
| R-05 | Falha de acessibilidade ou layout mobile. | Testes WCAG 2.2 AA, teclado e viewports definidos como gate de release. |

## Out of Scope

- Login, contas, perfis e sincronização entre dispositivos.
- Persistência local ou em servidor de buscas, favoritos, preferências, coordenadas ou dados meteorológicos.
- Sugestões/autocomplete durante a digitação ou busca sem envio explícito do formulário.
- Atualização periódica automática, notificações e retry automático.
- Favoritos, histórico de cidades e personalização avançada.
- Localização automática do dispositivo ou uso de GPS.
- Aplicativos nativos para iOS ou Android.
- Previsão por hora, mapas meteorológicos e alertas meteorológicos oficiais.
- Notificações, alertas personalizados e compartilhamento de cidade/previsão por URL.
- Idiomas diferentes de português do Brasil.
- Unidades configuráveis para vento, pressão, distância ou precipitação.
- Modo offline, qualquer cache persistente e exibição de dados antigos após falha.
- Anúncios, assinatura e outros modelos de monetização.
- Analytics de uso ou coleta de localização. Diagnóstico técnico sem dados sensíveis permanece sujeito à decisão de observabilidade.

## Open Questions

As decisões de comportamento do produto estão definidas nesta spec. Antes do release, os responsáveis devem fechar estes gates:

1. Confirmar limites, termos e atribuição da Open-Meteo para o uso e volume previstos.
2. Definir hospedagem, responsável operacional e procedimento de resposta a incidentes para cumprir o SLO de 99,5% do frontend.
3. Validar personas, métrica de sucesso do MVP e responsável pela aprovação com stakeholders/usuários.