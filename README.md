# RCS3 Engenharia Elétrica — identidade oficial aplicada

Site estático para editar no VS Code e publicar no cPanel: `index.html`, `servicos.html`, `quem-somos.html`, `contato.html`.

## Identidade visual

- Logos oficiais recortados dos arquivos transparentes enviados: `assets/images/logo-preto-laranja.png` (cabeçalho), `logo-branco-laranja.png` (rodapé) e `favicon-rcs3.png` (símbolo).
- Elementos gráficos oficiais, reduzidos e com transparência, em `assets/images/icone-*.png`.
- Paleta do manual: laranja `#D76F38`, carvão `#2C2C2B`, preto `#000000`, grafite `#484848`, cinza frio `#6D7880`, cinza claro `#E5E5E8` e branco `#FFFFFF`.
- Tipografia: Google Fonts **Nunito Sans** (pesos fortes, alternativa à versão Expanded indicada no manual) e **Poppins** para textos; a fonte comercial Creato Display foi declarada como preferência, com fallback Poppins, mas seus arquivos não são distribuídos nem embutidos porque não foram fornecidos.
- A ilustração industrial local existente foi recolorida no estilo da marca; **não representa fotografia de uma obra realizada**.
- Setas e traços decorativos do layout anterior continuam removidos. Raios permanecem apenas quando fazem parte dos elementos oficiais fornecidos pela marca.

## Como usar

1. Abra esta pasta no VS Code.
2. Use Live Server / Go Live no `index.html`.
3. Edite CSS em `assets/css/style.css` e scripts em `assets/js/main.js`.
4. Após aprovar, envie os **arquivos internos desta pasta** para `public_html/` no cPanel.

## Pendências antes de publicar

- **Formulário:** é apenas demonstração. O Javascript mostra aviso em vez de enviar dados; implementar backend de envio, SMTP, anexos com validação no servidor, antispam e política LGPD.
- Confirmar endereço de e-mail ativo, arroba Instagram, marcas de fabricantes, CNPJ e dados técnicos do briefing.
- Substituir o desenho do hero por fotografia real autorizada, se disponível.
- Conferir a disponibilidade/licença das variantes exatas **Nunito Sans Expanded** e **Creato Display** para uso web. As fontes do manual podem exigir arquivos e licença para uso online.
- Definir domínio, SSL, GA4, Search Console, políticas e prazos de resposta antes da publicação final.

O projeto não requer Node.js, Tailwind ou build. Tudo funciona como HTML, CSS e JavaScript estáticos.
