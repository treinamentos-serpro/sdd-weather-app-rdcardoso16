import { expect, type Page, test } from '@playwright/test';
import { saoPauloForecastResponse, saoPauloGeocodingResponse } from '../fixtures/openMeteo';

async function mockWeatherApi(page: Page) {
  let forecastRequests = 0;

  await page.route('https://geocoding-api.open-meteo.com/**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(saoPauloGeocodingResponse),
    });
  });

  await page.route('https://api.open-meteo.com/v1/forecast**', async (route) => {
    forecastRequests += 1;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(saoPauloForecastResponse),
    });
  });

  return () => forecastRequests;
}

async function searchAndSelectSaoPaulo(page: Page) {
  await page.getByRole('searchbox', { name: 'Cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar cidade' }).click();
  await expect(page.getByRole('heading', { name: 'São Paulo, São Paulo, Brasil' })).toBeVisible();
}

test('busca cidade, mostra condições e alterna unidade sem nova consulta', async ({ page }) => {
  const getForecastRequests = await mockWeatherApi(page);
  await page.goto('/');

  await searchAndSelectSaoPaulo(page);

  await expect(page.getByText('20°C', { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Agora' }).getByText('Céu limpo')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(5);

  await page.getByRole('button', { name: 'Fahrenheit (°F)' }).click();

  await expect(page.getByText('68°F', { exact: true })).toBeVisible();
  expect(getForecastRequests()).toBe(1);
});

test('mostra resultado vazio sem consultar a previsão', async ({ page }) => {
  let forecastRequests = 0;
  await page.route('https://geocoding-api.open-meteo.com/**', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({}) });
  });
  await page.route('https://api.open-meteo.com/v1/forecast**', async (route) => {
    forecastRequests += 1;
    await route.fulfill({ contentType: 'application/json', body: '{}' });
  });
  await page.goto('/');

  await page.getByRole('searchbox', { name: 'Cidade' }).fill('Atlantis');
  await page.getByRole('button', { name: 'Buscar cidade' }).click();

  await expect(page.getByText('Nenhuma cidade encontrada.')).toBeVisible();
  expect(forecastRequests).toBe(0);
});

test('oferece retry manual após erro de geocoding', async ({ page }) => {
  let searchRequests = 0;
  await page.route('https://geocoding-api.open-meteo.com/**', async (route) => {
    searchRequests += 1;
    if (searchRequests === 1) {
      await route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(saoPauloGeocodingResponse),
    });
  });
  await page.route('https://api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(saoPauloForecastResponse),
    });
  });
  await page.goto('/');

  await page.getByRole('searchbox', { name: 'Cidade' }).fill('São Paulo');
  await page.getByRole('button', { name: 'Buscar cidade' }).click();
  await expect(page.getByRole('alert')).toContainText('serviço meteorológico');
  await page.getByRole('button', { name: 'Tentar novamente' }).click();

  await expect(page.getByRole('heading', { name: 'Resultados da busca' })).toBeVisible();
  expect(searchRequests).toBe(2);
});

test('completa o fluxo principal em viewport mobile sem rolagem horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockWeatherApi(page);
  await page.goto('/');

  await searchAndSelectSaoPaulo(page);
  await expect(page.getByRole('heading', { name: 'Previsão de 5 dias' })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(5);
  await page.getByRole('button', { name: 'Fahrenheit (°F)' }).click();
  await expect(page.getByText('68°F', { exact: true })).toBeVisible();

  const documentWidth = await page.locator('html').evaluate((element) => element.scrollWidth);
  const viewportWidth = page.viewportSize()?.width ?? 0;
  expect(documentWidth).toBeLessThanOrEqual(viewportWidth);
});
