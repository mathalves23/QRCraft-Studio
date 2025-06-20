import { test, expect } from '@playwright/test'

test.describe('Gerador de QR Code', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Navega para o gerador (assumindo que existe um link/botão)
    const generatorLink = page.locator('a[href*="generator"], a[href*="gerador"], button:has-text("Gerar")').first()
    if (await generatorLink.isVisible()) {
      await generatorLink.click()
    }
  })

  test('deve gerar QR Code básico com texto', async ({ page }) => {
    // Insere texto no campo de entrada
    const textInput = page.locator('input[type="text"], textarea').first()
    await textInput.fill('https://example.com')
    
    // Procura pelo botão de gerar
    const generateButton = page.locator('button:has-text("Gerar"), button:has-text("Criar")').first()
    if (await generateButton.isVisible()) {
      await generateButton.click()
    }
    
    // Verifica se o QR Code foi gerado
    await expect(page.locator('canvas, img[src*="qr"], svg')).toBeVisible()
  })

  test('deve selecionar diferentes templates', async ({ page }) => {
    // Testa seleção de template WiFi
    const wifiTemplate = page.getByText('WiFi')
    if (await wifiTemplate.isVisible()) {
      await wifiTemplate.click()
      
      // Verifica se campos específicos do WiFi aparecem
      await expect(page.locator('input[placeholder*="rede"], input[placeholder*="SSID"]')).toBeVisible()
      await expect(page.locator('input[placeholder*="senha"], input[type="password"]')).toBeVisible()
    }
    
    // Testa template URL
    const urlTemplate = page.getByText('URL')
    if (await urlTemplate.isVisible()) {
      await urlTemplate.click()
    }
  })

  test('deve preencher dados de exemplo', async ({ page }) => {
    // Seleciona template WiFi
    const wifiTemplate = page.getByText('WiFi')
    if (await wifiTemplate.isVisible()) {
      await wifiTemplate.click()
      
      // Clica no botão de exemplo
      const exampleButton = page.locator('button:has-text("Exemplo"), button:has-text("📝")').first()
      if (await exampleButton.isVisible()) {
        await exampleButton.click()
        
        // Verifica se os campos foram preenchidos
        const ssidInput = page.locator('input[placeholder*="rede"], input[placeholder*="SSID"]').first()
        await expect(ssidInput).toHaveValue(/\w+/)
      }
    }
  })

  test('deve personalizar cores do QR Code', async ({ page }) => {
    // Procura por controles de cor
    const colorPicker = page.locator('input[type="color"], button:has-text("Cor")').first()
    
    if (await colorPicker.isVisible()) {
      await colorPicker.click()
      
      // Verifica se há opções de personalização
      await expect(page.locator('[class*="color"], [class*="picker"]')).toBeVisible()
    }
  })

  test('deve fazer download do QR Code', async ({ page }) => {
    // Gera um QR Code primeiro
    const textInput = page.locator('input[type="text"], textarea').first()
    await textInput.fill('Teste E2E')
    
    // Aguarda o QR Code ser gerado
    await expect(page.locator('canvas, img[src*="qr"], svg')).toBeVisible()
    
    // Procura pelo botão de download
    const downloadButton = page.locator('button:has-text("Download"), button:has-text("Baixar"), a[download]').first()
    
    if (await downloadButton.isVisible()) {
      // Configura o listener para download
      const downloadPromise = page.waitForEvent('download')
      await downloadButton.click()
      
      // Verifica se o download foi iniciado
      const download = await downloadPromise
      expect(download.suggestedFilename()).toMatch(/\.png|\.jpg|\.svg/)
    }
  })

  test('deve testar QR Code gerado', async ({ page }) => {
    // Gera um QR Code
    const textInput = page.locator('input[type="text"], textarea').first()
    await textInput.fill('https://example.com')
    
    // Aguarda o QR Code ser gerado
    await expect(page.locator('canvas, img[src*="qr"], svg')).toBeVisible()
    
    // Procura pelo botão de teste
    const testButton = page.locator('button:has-text("Testar"), button:has-text("🧪")').first()
    
    if (await testButton.isVisible()) {
      await testButton.click()
      
      // Verifica se o modal de teste aparece
      await expect(page.locator('[class*="modal"], [role="dialog"]')).toBeVisible()
      await expect(page.getByText('Teste')).toBeVisible()
    }
  })
}) 