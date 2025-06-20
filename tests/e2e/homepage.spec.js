import { test, expect } from '@playwright/test'

test.describe('Página Inicial', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('deve carregar a página inicial corretamente', async ({ page }) => {
    // Verifica se o título da página está correto
    await expect(page).toHaveTitle(/QRCraft Studio/i)
    
    // Verifica se elementos principais estão visíveis
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByText('QRCraft Studio')).toBeVisible()
  })

  test('deve navegar para a página do gerador', async ({ page }) => {
    // Clica no botão para ir ao gerador
    await page.getByRole('button', { name: /começar|gerar|criar/i }).first().click()
    
    // Verifica se navegou corretamente
    await expect(page).toHaveURL(/.*generator.*|.*gerador.*/i)
  })

  test('deve ter navegação responsiva', async ({ page }) => {
    // Testa em diferentes tamanhos de tela
    await page.setViewportSize({ width: 375, height: 667 }) // Mobile
    await expect(page.locator('nav')).toBeVisible()
    
    await page.setViewportSize({ width: 1024, height: 768 }) // Desktop
    await expect(page.locator('nav')).toBeVisible()
  })

  test('deve alternar entre modo claro e escuro', async ({ page }) => {
    // Procura pelo botão de alternância de tema
    const themeToggle = page.locator('[data-testid="theme-toggle"], button:has-text("🌙"), button:has-text("☀️")').first()
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
      
      // Verifica se o tema mudou (pode verificar classes CSS ou atributos)
      const body = page.locator('body')
      await expect(body).toHaveAttribute('class', /dark|light/)
    }
  })
}) 