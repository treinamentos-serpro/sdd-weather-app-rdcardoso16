# Discovery — Weather App

## Contexto

A empresa solicitou uma aplicação de previsão do tempo para permitir que
usuários consultem rapidamente as condições meteorológicas de diferentes
cidades. A experiência deve funcionar em dispositivos móveis e apresentar as
informações de forma simples e compreensível.

O produto precisa atender a dois momentos principais da jornada:

1. O usuário informa uma cidade e encontra a localização desejada.
2. O usuário consulta o clima atual e a previsão dos próximos cinco dias,
   podendo escolher a unidade de temperatura mais familiar.

O briefing ainda não define fonte de dados, autenticação, persistência,
localização automática ou funcionalidades de conta. Esses pontos devem ser
resolvidos antes do planejamento técnico ou explicitamente mantidos fora do
escopo inicial.

## Resumo Executivo

- O Weather App permitirá buscar cidades e consultar rapidamente as condições meteorológicas atuais.
- O produto exibirá a previsão de hoje e dos quatro dias seguintes, com temperaturas em Celsius por padrão e opção de Fahrenheit.
- A experiência será uma aplicação web responsiva, em português do Brasil, adequada para uso em celulares e computadores.
- O MVP usará a Open-Meteo, sem autenticação e sem armazenamento de dados em servidor, mantendo o foco na consulta essencial.
- Antes do planejamento definitivo, ainda precisam ser detalhados os campos meteorológicos, o comportamento de erros, o fuso horário e os critérios de aceite.

## Personas

### Persona 1 — Marina, profissional em deslocamento

- **Objetivo principal:** consultar rapidamente a condição atual e a previsão
  do dia para decidir como se vestir e se preparar para o deslocamento.
- **Contexto de uso:** principalmente mobile, durante a manhã ou antes de sair
  de casa, com pouco tempo e atenção limitada.
- **Métrica de sucesso:** consegue buscar sua cidade e identificar temperatura,
  condição atual e possibilidade de chuva em até 30 segundos, sem precisar
  repetir a busca.

### Persona 2 — Rafael, viajante planejando uma viagem

- **Objetivo principal:** comparar a previsão de cinco dias de uma cidade de
  destino antes de organizar atividades e bagagem.
- **Contexto de uso:** principalmente desktop durante o planejamento, com uso
  complementar em mobile durante a viagem; pode precisar alternar entre
  Celsius e Fahrenheit.
- **Métrica de sucesso:** encontra a cidade correta, visualiza os cinco dias e
  alterna a unidade sem nova busca ou confusão sobre as temperaturas.

### Persona 3 — Beatriz, organizadora de atividade ao ar livre

- **Objetivo principal:** verificar temperatura, vento e probabilidade de
  precipitação para decidir se mantém, adapta ou cancela uma atividade.
- **Contexto de uso:** mobile em deslocamento e desktop para planejamento
  antecipado; precisa localizar cidades com nomes semelhantes sem erro.
- **Métrica de sucesso:** identifica a localidade correta e encontra os
  indicadores relevantes da previsão em uma única consulta, com mensagens claras
  quando os dados não estão disponíveis.

As personas são hipóteses de discovery e devem ser validadas com usuários ou
stakeholders antes de orientar decisões definitivas de escopo.

## Decisões

### D-01 — Fonte de dados: Open-Meteo

- **Decisão:** utilizar a Open-Meteo para geocodificação e dados de previsão,
  sem API key.
- **Justificativa:** a fonte atende ao escopo do MVP sem exigir gerenciamento
  de segredo ou cadastro de credenciais.
- **Perguntas resolvidas:** fonte de dados, necessidade de API key e parte da
  avaliação de custos e limites do provedor.
- **Consequência:** a integração deve respeitar os limites, a cobertura, a
  atribuição e os termos de uso da Open-Meteo, que ainda devem ser confirmados
  no plano técnico.

### D-02 — Definição da previsão de cinco dias

- **Decisão:** “5 dias” significa hoje mais os quatro dias seguintes.
- **Justificativa:** fornece uma janela contínua de cinco dias a partir do
  momento da consulta e mantém o dia atual visível junto da previsão futura.
- **Perguntas resolvidas:** se o período inclui o dia atual ou começa no dia
  seguinte.
- **Consequência:** a interface deve destacar o dia atual e exibir quatro dias
  subsequentes, considerando o fuso horário da cidade consultada.

### D-03 — Unidade padrão: Celsius

- **Decisão:** iniciar a aplicação exibindo temperaturas em Celsius.
- **Justificativa:** a primeira versão é direcionada a usuários de língua
  portuguesa no Brasil, onde Celsius é a convenção predominante.
- **Perguntas resolvidas:** unidade padrão.
- **Consequência:** os dados podem ser mantidos em uma unidade canônica e a
  interface deve permitir alternância para Fahrenheit sem nova busca.

### D-04 — Sem autenticação e sem persistência de servidor

- **Decisão:** o MVP não terá login, contas de usuário nem armazenamento de
  dados em servidor.
- **Justificativa:** mantém o foco na consulta meteorológica e reduz
  complexidade, riscos de privacidade e esforço de infraestrutura.
- **Perguntas resolvidas:** necessidade de login, favoritos, histórico no
  servidor e persistência de preferências entre dispositivos.
- **Consequência:** buscas e preferências não serão sincronizadas entre
  dispositivos. Qualquer persistência local futura deverá ser decidida
  separadamente e não deve ser tratada como persistência de servidor.

### D-05 — Idioma da interface: pt-BR

- **Decisão:** toda a interface do MVP será apresentada em português do Brasil.
- **Justificativa:** alinha o produto ao público inicialmente assumido e evita
  introduzir internacionalização antes de validar o uso principal.
- **Perguntas resolvidas:** idioma inicial e parte das decisões sobre formatos
  de data e mensagens da interface.
- **Consequência:** textos, mensagens de erro, descrições meteorológicas e
  formatação de datas devem seguir pt-BR. Suporte a outros idiomas fica fora
  do escopo inicial.

## Crítica Arquitetural e Prontidão para a Spec

### Pontos ainda vagos

- “Clima atual” ainda não define se será uma observação, uma estimativa ou uma
  previsão para o horário corrente.
- A busca ainda permite duas experiências diferentes: envio explícito ou
  sugestões durante a digitação. É necessário escolher uma para definir UX,
  debounce e volume de chamadas.
- Os campos obrigatórios e opcionais da resposta meteorológica ainda não estão
  fechados. “Quando disponibilizados” não é um critério de aceite suficiente.
- O fuso horário da cidade, a regra de virada do dia e a formatação de datas
  ainda não estão especificados.
- Não está definido se a unidade escolhida vale apenas para a sessão ou também
  para o armazenamento local do navegador.
- Ainda faltam versões mínimas de navegadores e uma conexão de referência para
  medir os requisitos de performance.

### Pontos que podem gerar retrabalho

- A decisão D-01 escolhe a Open-Meteo, mas ainda faltam endpoints, parâmetros,
  mapeamento de códigos meteorológicos, limites de uso e regra de atribuição.
- RF-01 e RF-02 não definem se a primeira cidade encontrada será selecionada
  automaticamente ou se a seleção do usuário será sempre obrigatória.
- RF-06 não define uma taxonomia de erros: cidade não encontrada, timeout,
  resposta inválida e indisponibilidade deveriam ter comportamentos distintos.
- Não há regra para evitar que uma resposta antiga sobrescreva uma busca mais
  recente quando o usuário fizer consultas consecutivas.
- A meta de disponibilidade de 99,5% do frontend precisa ser revista para um
  app estático: ela deve separar hospedagem, código do frontend e dependência
  da Open-Meteo.
- RNF-12 pressupõe logs ou telemetria, mas ainda não existe decisão sobre uma
  ferramenta, política de retenção ou limitação de dados sensíveis.

### Contratos que faltam antes do planejamento técnico

- Contrato de geocodificação: entrada, quantidade máxima de resultados,
  campos exibidos e regra de ordenação.
- Contrato de previsão: campos obrigatórios, unidade canônica, timezone,
  período diário e conversão dos códigos meteorológicos.
- Máquina de estados da busca: `idle`, `loading`, `success`, `empty` e `error`,
  incluindo transições e ação de retry.
- Política de concorrência, timeout, cancelamento, retry e eventual cache.
- Critérios de aceite mensuráveis para os fluxos críticos de cada persona.
- Estratégia de deploy do frontend, configuração de ambiente e atribuição da
  Open-Meteo.

### Status de prontidão

O discovery está suficientemente direcionado para iniciar a especificação de
produto, mas ainda não está pronto para um plano técnico definitivo. Antes de
fechar a spec, devem ser decididos: semântica do clima atual, comportamento da
busca, campos obrigatórios, timezone, estratégia de erros e critérios de aceite.
As decisões já registradas devem ser tratadas como fonte da verdade, e não como
novas perguntas em aberto.

## Requisitos Funcionais

### RF-01 — Buscar cidades

- O usuário deve poder informar o nome de uma cidade.
- O sistema deve iniciar a busca a partir de uma ação explícita do usuário,
  como envio de formulário ou seleção de uma sugestão.
- O sistema deve apresentar resultados suficientes para diferenciar cidades
  com nomes iguais, incluindo país e, quando disponível, região/estado.
- O sistema deve informar quando nenhuma cidade correspondente for encontrada.

### RF-02 — Selecionar uma cidade

- O usuário deve poder selecionar uma cidade entre os resultados da busca.
- A cidade selecionada deve ser usada como referência para carregar os dados
  meteorológicos.
- O sistema deve indicar visualmente qual cidade está sendo consultada.

### RF-03 — Exibir o clima atual

- O sistema deve exibir a temperatura atual da cidade selecionada.
- O sistema deve exibir uma descrição compreensível da condição meteorológica
  atual.
- O sistema deve exibir, quando disponibilizados pela fonte de dados, os
  principais indicadores atuais, como umidade, vento e precipitação.
- O sistema deve indicar a unidade utilizada para a temperatura.

### RF-04 — Exibir previsão de cinco dias

- O sistema deve exibir a previsão de hoje e dos quatro dias seguintes à
  consulta, totalizando cinco dias.
- Cada dia deve apresentar a data, a condição meteorológica e as temperaturas
  máxima e mínima.
- A previsão deve indicar a probabilidade de precipitação quando esse dado
  estiver disponível.

### RF-05 — Alternar unidade de temperatura

- O usuário deve poder alternar entre Celsius e Fahrenheit.
- A alteração deve atualizar a temperatura atual e as temperaturas da previsão.
- A troca de unidade não deve exigir uma nova busca quando os dados já estiverem
  disponíveis.

### RF-06 — Informar estados da experiência

- O sistema deve apresentar um estado inicial antes de qualquer busca.
- O sistema deve informar quando uma busca ou consulta meteorológica está em
  andamento.
- O sistema deve apresentar uma mensagem compreensível quando ocorrer uma
  falha.
- O sistema deve oferecer uma forma de tentar novamente após uma falha,
  quando aplicável.
- O sistema deve permitir uma nova busca depois de uma consulta concluída ou
  sem resultados.

## Requisitos Não-Funcionais

### RNF-01 — Responsividade

- A aplicação deve ser utilizável em telas de dispositivos móveis e desktop.
- Conteúdo, controles e resultados não devem exigir rolagem horizontal.
- A informação deve permanecer legível e os controles acionáveis em telas
  pequenas.

### RNF-02 — Acessibilidade

- Campos de busca, botões, controles de unidade e mensagens devem possuir
  nomes acessíveis e semântica adequada.
- A aplicação deve ser navegável por teclado.
- Estados de carregamento e erro devem ser comunicados de forma perceptível,
  inclusive para tecnologias assistivas.
- O conteúdo não deve depender exclusivamente de cor ou ícones para transmitir
  informação.

### RNF-03 — Usabilidade

- A tarefa principal, buscar uma cidade e consultar seu clima, deve ser clara
  sem exigir instruções externas.
- Mensagens de erro e de ausência de resultados devem orientar o próximo passo.
- A unidade de temperatura atualmente selecionada deve ser evidente.

### RNF-04 — Desempenho percebido

- A interface deve responder imediatamente à interação do usuário, exibindo um
  estado de carregamento enquanto aguarda dados externos.
- A aplicação não deve ficar indefinidamente bloqueada quando uma fonte
  externa não responder.

### RNF-05 — Compatibilidade e qualidade

- A aplicação deve funcionar nos navegadores modernos suportados pelo projeto.
- Dados externos devem ser tratados como não confiáveis, com validação e
  mensagens apropriadas para respostas incompletas ou inválidas.

### RNF-06 — Performance de carregamento

- A aplicação deve exibir a interface inicial em até 2 segundos em uma
  conexão de referência.
- Após o envio da busca, o feedback visual deve aparecer em até 100 ms.
- A interface não deve bloquear interações não relacionadas enquanto aguarda
  dados externos.

### RNF-07 — Timeout e disponibilidade

- Cada chamada a um serviço externo deve possuir um timeout definido, de no
  máximo 10 segundos.
- Em caso de indisponibilidade da API, a aplicação deve continuar utilizável e
  oferecer uma ação de retry.
- A meta de disponibilidade do frontend deve ser definida separadamente da
  disponibilidade da API externa, com referência inicial de 99,5%.

### RNF-08 — Acessibilidade mensurável

- Os fluxos principais devem atender ao nível AA das WCAG 2.2.
- Todo fluxo principal deve ser concluível apenas com teclado.
- Texto e controles devem atender aos níveis mínimos de contraste definidos
  pelas WCAG.
- Alterações de loading, erro e resultados devem ser comunicadas
  adequadamente a tecnologias assistivas.

### RNF-09 — Responsividade verificável

- A aplicação deve funcionar, no mínimo, nas larguras de 320 px, 768 px e
  1280 px.
- Nenhuma tela deve exigir rolagem horizontal nessas larguras.
- Busca, troca de unidade e leitura da previsão devem permanecer utilizáveis
  em viewport mobile.

### RNF-10 — Compatibilidade de navegador

- Devem ser definidas versões mínimas para Chrome, Edge, Firefox e Safari.
- Os fluxos principais devem funcionar nas versões oficialmente suportadas.
- Recursos sem suporte devem possuir fallback ou mensagem adequada.

### RNF-11 — Segurança e privacidade

- A aplicação não deve solicitar dados pessoais desnecessários.
- As entradas do usuário devem ser codificadas e validadas antes de serem
  usadas nas requisições.
- Chaves de API, caso existam, não devem ser expostas indevidamente no
  frontend.
- Conteúdo e links externos devem ser tratados de forma segura.

### RNF-12 — Observabilidade e diagnóstico

- Erros de integração devem ser identificáveis por logs ou telemetria sem
  expor dados sensíveis.
- Falhas de busca, timeout e respostas inválidas devem ser diferenciadas para
  diagnóstico.
- A aplicação deve registrar informações suficientes para investigar
  incidentes em produção.

## Riscos

| ID | Risco | Tipo | Probabilidade | Impacto | Estratégia de mitigação |
|---|---|---|---|---|---|
| R-01 | Indisponibilidade, lentidão ou mudança de contrato da API meteorológica | Técnico | Alta | Alto: o usuário pode não conseguir consultar o clima ou receber dados incompletos. | Escolher uma fonte com contrato conhecido, configurar timeout, tratar erros, oferecer retry e monitorar falhas de integração. |
| R-02 | Resultados ambíguos para cidades com o mesmo nome | Produto | Média | Alto: o usuário pode consultar a localidade errada e tomar decisões com base em dados incorretos. | Exibir país e região, permitir seleção explícita e definir critérios de ordenação dos resultados. |
| R-03 | Dados meteorológicos ausentes, inconsistentes ou fora do contrato | Técnico | Média | Alto: a interface pode exibir valores incorretos, vazios ou enganosos. | Definir campos obrigatórios, validar respostas, tratar campos opcionais e nunca inventar valores. |
| R-04 | Conversão incorreta entre Celsius e Fahrenheit | Técnico | Média | Alto: temperaturas erradas reduzem a confiança no produto. | Usar uma unidade canônica internamente e testar conversões, arredondamento e sinais negativos. |
| R-05 | Dados apresentados como atuais, mas desatualizados | Produto | Média | Médio: o usuário pode tomar decisões com base em informação vencida. | Exibir horário da última atualização, documentar a frequência da fonte e definir uma política de validade dos dados. |
| R-06 | Performance insuficiente em carregamento ou busca | Técnico | Média | Alto: usuários podem abandonar a tarefa ou interpretar a aplicação como quebrada. | Definir metas de tempo, exibir feedback imediato, evitar requisições desnecessárias e medir performance em conexão de referência. |
| R-07 | Experiência inadequada em telas pequenas | Produto | Média | Alto: o requisito central de uso mobile não será atendido. | Desenvolver mobile-first e validar busca, troca de unidade e leitura da previsão em larguras de 320 px, 768 px e 1280 px. |
| R-08 | Falhas de acessibilidade | Produto | Média | Alto: usuários com deficiência podem não conseguir buscar uma cidade ou ler os resultados. | Adotar WCAG 2.2 AA, navegação por teclado, nomes acessíveis, contraste adequado e testes com tecnologia assistiva. |
| R-09 | Escopo crescer com favoritos, login, alertas ou histórico | Produto | Alta | Alto: aumenta prazo e complexidade antes de validar o MVP. | Definir MVP, manter itens fora do escopo documentados e exigir decisão formal para incluir novas funcionalidades. |
| R-10 | Custos, limites ou exigências de atribuição da API não identificados | Técnico/Produto | Média | Alto: o produto pode gerar custos inesperados ou violar os termos do provedor. | Confirmar licença, limites, preço, cobertura e atribuição antes de escolher a integração. |
| R-11 | Tratamento inadequado de privacidade e localização | Técnico/Produto | Baixa | Alto: pode haver exposição desnecessária de dados ou não conformidade com a LGPD. | Minimizar coleta, pedir consentimento explícito, permitir recusa e não armazenar localização sem necessidade. |
| R-12 | Ausência de critérios de sucesso e responsável pela decisão | Produto | Média | Alto: o time pode entregar funcionalidades sem saber se atendem ao objetivo. | Definir métricas, fluxos críticos, critérios de aceite e responsável pela aprovação antes da implementação. |

## Perguntas em Aberto e Impactos

Cada pergunta abaixo representa uma decisão que pode alterar escopo, arquitetura,
experiência ou critérios de aceite. O impacto indica o risco de avançar sem uma
resposta definida.

As perguntas sobre fonte de dados, idioma, período da previsão, unidade padrão e
autenticação já foram resolvidas por D-01 a D-05. Elas permanecem abaixo apenas
como histórico do discovery e não devem ser tratadas como bloqueios novamente.
Continuam abertas somente os detalhes operacionais da Open-Meteo, como limites,
atribuição, frequência de atualização e contrato de resposta.

### Produto e público

1. **Quem é o público-alvo principal: usuários casuais, viajantes, agricultores
   ou outro perfil?**
   **Impacto:** a interface pode priorizar informações inadequadas e não
   atender ao usuário principal.

2. **Qual problema deve ser resolvido prioritariamente: consulta rápida,
   planejamento de viagem ou acompanhamento diário?**
   **Impacto:** as prioridades de produto e o conteúdo da tela ficam indefinidos.

3. **Como será medido o sucesso do produto?**
   **Impacto:** não haverá critério objetivo para saber se o app entrega valor.

4. **O app será somente web responsivo ou também terá versões nativas?**
   **Impacto:** a decisão afeta tecnologia, custos, testes e distribuição.

5. **Quais regiões e países devem ser suportados?**
   **Impacto:** cobertura de cidades, idioma, unidades, datas e fonte de dados
   podem precisar de soluções diferentes.

6. **O produto será exclusivamente em português do Brasil?**
   **Impacto:** internacionalização posterior pode exigir retrabalho de textos,
   formatos e arquitetura.

### Busca e localização

7. **A busca ocorre apenas após o envio ou oferece sugestões enquanto o usuário
   digita?**
   **Impacto:** muda a UX, o volume de requisições e a necessidade de debounce.

8. **Como serão resolvidas cidades com o mesmo nome?**
   **Impacto:** o usuário pode consultar a localidade errada e receber dados
   enganosos.

9. **A busca aceita acentos, abreviações, erros de digitação e nomes em outros
   idiomas?**
   **Impacto:** buscas válidas podem retornar vazio e reduzir a utilidade do app.

10. **Quais dados aparecem nos resultados: país, estado, região, coordenadas ou
  fuso horário?**
  **Impacto:** pode ser impossível diferenciar resultados semelhantes.

11. **O usuário informa a cidade manualmente ou o app pode usar sua localização?**
  **Impacto:** localização automática exige permissões, privacidade e um
  fallback quando o usuário recusar acesso.

### Dados meteorológicos

12. **Qual fonte fornece geocodificação e previsão?**
  **Impacto:** a escolha afeta cobertura, precisão, custos, latência e formato
  dos dados.

13. **A fonte exige chave de API, atribuição, limite de uso ou pagamento?**
  **Impacto:** podem surgir custos inesperados, exposição de segredos ou
  descumprimento de licença.

14. **Com que frequência os dados são atualizados?**
  **Impacto:** o app pode apresentar dados aparentemente atuais, mas obsoletos.

15. **O que significa exatamente “clima atual”: observação, estimativa ou
  previsão do horário corrente?**
  **Impacto:** diferentes interpretações podem produzir dados inconsistentes.

16. **Os cinco dias incluem o dia atual ou começam no dia seguinte?**
  **Impacto:** a quantidade e o período exibidos podem não corresponder à
  expectativa do usuário.

17. **A previsão será diária ou também terá intervalos horários?**
  **Impacto:** altera o modelo de dados, o layout e o volume de informação.

18. **Quais indicadores são obrigatórios no clima atual?**
  **Impacto:** o time pode implementar campos diferentes ou omitir dados
  essenciais.

19. **Quais indicadores são obrigatórios na previsão: máxima, mínima, chuva,
  vento, umidade ou outros?**
  **Impacto:** os critérios de aceite e o design permanecem incompletos.

20. **Qual unidade deve ser usada por padrão?**
  **Impacto:** a primeira informação exibida pode ser mal interpretada.

21. **A troca entre Celsius e Fahrenheit persiste após recarregar a página?**
  **Impacto:** a experiência pode parecer inconsistente entre sessões.

22. **Vento, pressão, distância e precipitação também terão unidades
  configuráveis?**
  **Impacto:** o app pode misturar convenções e confundir usuários de regiões
  diferentes.

23. **Como serão exibidos horários, datas e fusos horários?**
  **Impacto:** a previsão pode parecer estar no dia ou horário errado.

24. **Como as condições meteorológicas serão traduzidas e descritas?**
  **Impacto:** códigos técnicos ou traduções inconsistentes prejudicam a
  compreensão.

### Erros e recuperação

25. **O que acontece quando a cidade existe, mas não há dados meteorológicos?**
  **Impacto:** o app pode ficar carregando indefinidamente ou exibir uma tela
  sem orientação.

26. **O que acontece quando a API está lenta, indisponível ou retorna dados
  incompletos?**
  **Impacto:** os estados de erro e os critérios de aceite ficam inconsistentes.

27. **Deve haver retry automático ou apenas uma ação manual?**
  **Impacto:** retry automático pode aumentar carga e custos; retry manual pode
  dificultar a recuperação.

28. **O app deve funcionar parcialmente offline ou mostrar dados anteriores?**
  **Impacto:** essa escolha afeta cache, armazenamento local, validade dos dados
  e privacidade.

### Escopo e experiência

29. **O usuário poderá salvar cidades favoritas ou consultar histórico?**
  **Impacto:** a ausência pode reduzir a utilidade do MVP, enquanto a inclusão
  exige persistência e uma UX adicional.

30. **Será necessário login ou a experiência será anônima?**
  **Impacto:** login altera arquitetura, segurança, persistência e esforço.

31. **O app deve permitir compartilhar uma cidade ou previsão por URL?**
  **Impacto:** isso pode exigir rotas, estado persistido e tratamento de links.

32. **Quais recursos entram no MVP e quais ficam para versões futuras?**
  **Impacto:** o escopo pode crescer continuamente e impedir uma entrega focada.

### Qualidade, operação e conformidade

33. **Quais dispositivos, tamanhos de tela e navegadores devem ser suportados?**
  **Impacto:** “responsivo” pode ser interpretado de formas diferentes e gerar
  falhas em dispositivos reais.

34. **Qual nível de acessibilidade é exigido?**
  **Impacto:** sem uma meta, como WCAG 2.2 AA, a acessibilidade não será
  verificável.

35. **Qual tempo máximo é aceitável para o carregamento inicial e a busca?**
  **Impacto:** não haverá critério objetivo para avaliar performance.

36. **Qual disponibilidade é esperada para o frontend e quanto depende da API?**
  **Impacto:** não será possível definir metas operacionais, fallback e
  responsabilidades.

37. **É necessário monitoramento de erros e métricas de uso?**
  **Impacto:** incidentes podem permanecer invisíveis e decisões futuras ficarão
  sem dados.

38. **O app coletará analytics, localização ou outros dados do usuário?**
  **Impacto:** podem surgir obrigações de consentimento, privacidade e LGPD.

39. **Como serão tratados dados pessoais e permissões de localização?**
  **Impacto:** há risco de violação de privacidade ou não conformidade legal.

40. **Haverá anúncios, assinatura ou outro modelo de negócio?**
  **Impacto:** isso pode influenciar arquitetura, UX, privacidade e escolha da
  fonte de dados.

41. **O produto exibirá alertas meteorológicos oficiais ou apenas previsão?**
  **Impacto:** sem fonte oficial, o usuário pode interpretar uma previsão comum
  como alerta de risco.

42. **Quem responde pela precisão e pelas mensagens exibidas?**
  **Impacto:** ficam indefinidos os limites de responsabilidade e a comunicação
  de incerteza.

43. **A fonte exige atribuição visível ou regras específicas de uso?**
  **Impacto:** a aplicação pode violar os termos do provedor.

44. **Existe prazo, orçamento ou tamanho de equipe definidos?**
  **Impacto:** o plano pode ser tecnicamente possível, mas inviável para o
  negócio.

45. **Quem aprova os requisitos e valida a experiência final?**
  **Impacto:** decisões podem ficar sem responsável e gerar retrabalho.

46. **Quais fluxos são críticos para o aceite?**
  **Impacto:** todos os requisitos podem parecer ter a mesma prioridade, sem
  foco para o MVP.

47. **Quais condições determinam que cada funcionalidade está concluída?**
  **Impacto:** não haverá critérios objetivos para implementação e testes.

### Decisões bloqueadoras

Antes do plano técnico, devem ser resolvidas pelo menos estas questões:

- fonte, limites, custos e atribuição da API;
- definição de clima atual e do período dos cinco dias;
- campos obrigatórios da resposta meteorológica;
- comportamento para API lenta, indisponível ou incompleta;
- unidade padrão e persistência da preferência;
- suporte a localização, favoritos e histórico;
- metas de performance, acessibilidade, responsividade e disponibilidade;
- privacidade, localização e critérios de sucesso do MVP.

## Suposições

- A primeira versão será uma aplicação web responsiva, sem necessidade de
  instalação nativa.
- O usuário informará uma cidade manualmente; localização automática não é
  necessária para o MVP enquanto não houver decisão contrária.
- A aplicação consultará dados em tempo real por meio de um serviço externo.
- A primeira versão não exigirá autenticação ou criação de conta.
- A primeira versão não persistirá dados no servidor.
- Uma cidade será selecionada antes da exibição de dados meteorológicos.
- Celsius e Fahrenheit são as únicas unidades necessárias inicialmente.
- O sistema poderá usar uma unidade interna única e converter os valores apenas
  na apresentação.
- A previsão será apresentada em visão diária, não horária, salvo decisão
  posterior.
- O produto será inicialmente direcionado a usuários de língua portuguesa no
  Brasil.
- A interface deverá ser utilizável em dispositivos móveis atuais com conexão
  de internet.
- O escopo inicial não inclui favoritos, histórico, notificações, alertas,
  mapas, previsão por hora ou personalização avançada.