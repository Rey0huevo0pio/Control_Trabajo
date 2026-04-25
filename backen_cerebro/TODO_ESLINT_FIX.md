# TODO: Corrección de Errores ESLint

## Estado Inicial
- Prettier: ✅ Formateado automáticamente
- ESLint --fix: ✅ Corregido automáticamente
- Errores restantes: 14 errores, 18 warnings

## Pasos

### Errores Críticos (14)
- [ ] 1. `auth.service.ts` - Fix `no-unsafe-return` + `no-unused-vars` en `sanitize()`
- [ ] 2. `users.service.ts` - Fix 8x `no-unsafe-return` + 2x `unbound-method`
- [ ] 3. `email-config.service.ts` - Fix `unbound-method` + `no-unsafe-return` en `sanitize()`
- [ ] 4. `email-fetcher.service.ts` - Fix `no-control-regex`

### Warnings (18)
- [ ] 5. `usuario.dto.ts` - Remove unused `IsArray`
- [ ] 6. `roles.guard.ts` - Remove unused `ForbiddenException`
- [ ] 7. `email.service.ts` - Remove unused `NotFoundException`
- [ ] 8. `instalaciones.controller.ts` - Remove unused `Query`
- [ ] 9. `ticket-it.controller.ts` - Remove unused `Query`
- [ ] 10. `uploads.module.ts` - Remove unused `join`
- [ ] 11. `email-attachment.service.ts` - Remove unused `mime`
- [ ] 12. `email-fetcher.service.ts` - Fix floating promises + unused vars
- [ ] 13. `email.gateway.ts` - Fix floating promise
- [ ] 14. `email-config.service.ts` - Remove unused `passwordEmail`

### Verificación Final
- [ ] 15. Ejecutar `npx eslint src --ext .ts` → 0 errores
- [ ] 16. Ejecutar `npx tsc --noEmit` → Compila OK

