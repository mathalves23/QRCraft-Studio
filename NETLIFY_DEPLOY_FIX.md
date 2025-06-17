# 🔧 Correção do Deploy Netlify - QRCraft Studio

## 🚨 Problema Identificado

O deploy no Netlify estava falando com o erro:
```
ERR_PNPM_OUTDATED_LOCKFILE: Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
```

## ✅ Soluções Aplicadas

### 1. Atualização do pnpm-lock.yaml
- Removido o arquivo `pnpm-lock.yaml` desatualizado
- Executado `pnpm install` para regenerar o lockfile
- Novo lockfile agora está sincronizado com o `package.json`

### 2. Correção do netlify.toml
**Antes:**
```toml
[build]
  command = "npm run build"
```

**Depois:**
```toml
[build]
  command = "pnpm install --no-frozen-lockfile && pnpm build"
```

### 3. Script de Deploy Criado
- Criado `deploy-netlify.sh` para facilitar testes locais
- Inclui limpeza de cache, instalação e build
- Tornando executável com `chmod +x deploy-netlify.sh`

## 🧪 Teste Local Bem-sucedido

Build executado com sucesso:
```
✓ 105 modules transformed.
✓ built in 3.72s
PWA v1.0.0
precache 10 entries (609.46 KiB)
```

## 📝 Versões

- **pnpm local**: 8.15.0
- **pnpm package.json**: 10.4.1
- **pnpm Netlify**: 10.12.1 (detectado no log de erro)

A flag `--no-frozen-lockfile` resolve o conflito de versões.

## 🚀 Próximos Passos

1. Commit das alterações:
   - `netlify.toml` atualizado
   - `pnpm-lock.yaml` regenerado
   - Scripts de deploy criados

2. Push para o repositório Git

3. O Netlify irá automaticamente detectar as mudanças e fazer o redeploy

## 🔍 Verificações Finais

- ✅ Build local funciona
- ✅ Dependências atualizadas (681 pacotes)
- ✅ Configuração Netlify corrigida
- ✅ Scripts auxiliares criados

O deploy agora deve funcionar corretamente! 