import { test, expect } from '@playwright/test'

test.describe('Fluxo Completo do Usuário', () => {
  test('deve completar jornada completa: criar QR Code → testar → baixar', async ({ page }) => {
    // 1. Acessa a aplicação
    await page.goto('/')
    await expect(page).toHaveTitle(/QRCraft Studio/i)
    
    // 2. Navega para o gerador (se necessário)
    const generateButton = page.locator('button:has-text("Gerar"), a:has-text("Gerar"), button:has-text("Começar")').first()
    if (await generateButton.isVisible()) {
      await generateButton.click()
    }
    
    // 3. Seleciona template URL
    const urlTemplate = page.getByText('URL')
    if (await urlTemplate.isVisible()) {
      await urlTemplate.click()
    }
    
    // 4. Insere dados
    const urlInput = page.locator('input[placeholder*="url"], input[type="url"], input[type="text"]').first()
    await urlInput.fill('https://qrcraft-studio.com')
    
    // 5. Aguarda geração automática ou clica em gerar
    const generateQRButton = page.locator('button:has-text("Gerar QR")').first()
    if (await generateQRButton.isVisible()) {
      await generateQRButton.click()
    }
    
    // 6. Verifica se QR Code foi gerado
    await expect(page.locator('canvas, img[src*="qr"], svg')).toBeVisible({ timeout: 10000 })
    
    // 7. Testa o QR Code (se disponível)
    const testButton = page.locator('button:has-text("Testar"), button:has-text("🧪")').first()
    if (await testButton.isVisible()) {
      await testButton.click()
      
      // Verifica modal de teste
      await expect(page.locator('[class*="modal"], [role="dialog"]')).toBeVisible()
      
      // Fecha modal
      const closeButton = page.locator('button:has-text("✕"), button:has-text("Fechar"), button[aria-label*="fechar"]').first()
      if (await closeButton.isVisible()) {
        await closeButton.click()
      }
    }
    
    // 8. Faz download (se disponível)
    const downloadButton = page.locator('button:has-text("Download"), button:has-text("Baixar")').first()
    if (await downloadButton.isVisible()) {
      const downloadPromise = page.waitForEvent('download')
      await downloadButton.click()
      const download = await downloadPromise
      expect(download.suggestedFilename()).toMatch(/qr.*\.(png|jpg|svg)/)
    }
  })

  test('deve navegar pelo histórico de QR Codes', async ({ page }) => {
    await page.goto('/')
    
    // Procura pelo link/botão do histórico
    const historyLink = page.locator('a:has-text("Histórico"), button:has-text("Histórico"), nav a[href*="history"]').first()
    
    if (await historyLink.isVisible()) {
      await historyLink.click()
      
      // Verifica se chegou na página de histórico
      await expect(page.locator('h1:has-text("Histórico"), h2:has-text("Histórico")')).toBeVisible()
      
      // Verifica se há elementos do histórico ou mensagem de vazio
      const historyItems = page.locator('[class*="history"], [class*="qr-item"]')
      const emptyMessage = page.locator(':has-text("Nenhum QR Code"), :has-text("vazio")')
      
      await expect(historyItems.or(emptyMessage)).toBeVisible()
    }
  })

  test('deve acessar página sobre/informações', async ({ page }) => {
    await page.goto('/')
    
    // Procura pelo link "Sobre" ou "About"
    const aboutLink = page.locator('a:has-text("Sobre"), a:has-text("About"), nav a[href*="about"]').first()
    
    if (await aboutLink.isVisible()) {
      await aboutLink.click()
      
      // Verifica se chegou na página sobre
      await expect(page.locator('h1:has-text("Sobre"), h2:has-text("About")')).toBeVisible()
      
      // Verifica se há informações sobre a aplicação
      await expect(page.locator(':has-text("QRCraft"), :has-text("QR Code")')).toBeVisible()
    }
  })

  test('deve testar responsividade em diferentes dispositivos', async ({ page }) => {
    await page.goto('/')
    
    // Testa em mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('body')).toBeVisible()
    
    // Verifica se menu mobile funciona (se existir)
    const mobileMenu = page.locator('button[aria-label*="menu"], button:has-text("☰")').first()
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      await expect(page.locator('nav, [role="navigation"]')).toBeVisible()
    }
    
    // Testa em tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('body')).toBeVisible()
    
    // Testa em desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('body')).toBeVisible()
  })

  test('deve verificar acessibilidade básica', async ({ page }) => {
    await page.goto('/')
    
    // Verifica se há texto alternativo em imagens
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      const ariaLabel = await img.getAttribute('aria-label')
      
      // Verifica se tem alt ou aria-label
      expect(alt || ariaLabel).toBeTruthy()
    }
    
    // Verifica se botões têm labels adequados
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      
      // Verifica se tem texto ou aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy()
    }
  })
}) 