import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('utils', () => {
  describe('cn function', () => {
    it('combina classes CSS corretamente', () => {
      const result = cn('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('filtra valores falsy', () => {
      const result = cn('class1', null, undefined, false, 'class2', 0, 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('manipula arrays de classes', () => {
      const result = cn('class1', ['class2', 'class3'], 'class4')
      expect(result).toBe('class1 class2 class3 class4')
    })

    it('manipula objetos condicionais', () => {
      const result = cn('class1', { 'class2': true, 'class3': false, 'class4': true })
      expect(result).toBe('class1 class2 class4')
    })

    it('retorna string vazia para argumentos vazios', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('manipula strings vazias', () => {
      const result = cn('', 'class1', '', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('combina diferentes tipos de argumentos', () => {
      const result = cn(
        'base-class',
        { 'conditional-class': true },
        ['array-class1', 'array-class2'],
        'string-class',
        null,
        undefined
      )
      expect(result).toBe('base-class conditional-class array-class1 array-class2 string-class')
    })
  })
}) 