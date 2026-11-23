'use strict';

const mobileToggle = document.querySelector('[data-menu-toggle]');
const primaryNav = document.querySelector('[data-primary-nav]');

if (mobileToggle && primaryNav) {
  const closeMenu = () => {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.textContent = 'Menu';
    primaryNav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileToggle.textContent = isOpen ? 'Menu' : 'Fechar';
    primaryNav.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });
  primaryNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', event => {
    if (!primaryNav.contains(event.target) && !mobileToggle.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMenu();
  });
}


/* =========================================
   ANIMAÇÕES DE ENTRADA
   ========================================= */

const revealSelectors = [
  '.simple-card',
  '.service-card',
  '.process-card',
  '.safety-card',
  '.work-card',
  '.doc-item',
  '.value-card',
  '.contact-option',
  '.metric',
  '.region-box',
  '.form-card'
].join(', ');

document.querySelectorAll(revealSelectors).forEach(element => {
  // Evita duplicar a animação de blocos já configurados.
  if (!element.closest('[data-reveal]')) {
    element.setAttribute('data-reveal', '');
  }
});

const observerTargets = document.querySelectorAll('[data-reveal]');

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -20px 0px'
  });

  observerTargets.forEach(element => {
    observer.observe(element);
  });
} else {
  observerTargets.forEach(element => {
    element.classList.add('is-visible');
  });
}

/* =========================================
   CONTADORES NUMÉRICOS
   ========================================= */

const counters = document.querySelectorAll('[data-count]');

if (
  counters.length &&
  'IntersectionObserver' in window &&
  !reducedMotion
) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      counterObserver.unobserve(element);

      const target = Number(element.dataset.count);

      if (!Number.isFinite(target) || target < 0) return;

      const duration = 1600;
      let startTime = null;

      element.textContent = '0';

      function updateCounter(now) {
        if (startTime === null) startTime = now;

        const progress = Math.min(
          (now - startTime) / duration,
          1
        );

        const easeOut = 1 - Math.pow(1 - progress, 3);

        element.textContent = Math.round(
          target * easeOut
        ).toLocaleString('pt-BR');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString('pt-BR');
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(element => {
    counterObserver.observe(element);
  });
}


const year = document.querySelector('[data-current-year]');
if (year) year.textContent = String(new Date().getFullYear());


/* =========================================
   FORMULÁRIO DE ORÇAMENTO VIA E-MAIL
   ========================================= */

const quoteForm = document.querySelector('[data-quote-form]');

if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) return;

    const dados = new FormData(quoteForm);

    const obter = (campo) => {
      return String(dados.get(campo) ?? '').trim();
    };

    const destinatario = 'contato@rcs3engenharia.com.br';

    const assunto = `Solicitação de orçamento - ${obter('empresa')}`
      .replace(/[\r\n]+/g, ' ');

    const mensagem = [
      'Olá, equipe RCS3!',
      '',
      'Gostaria de solicitar um orçamento.',
      '',
      'DADOS DO SOLICITANTE',
      '',
      `Nome: ${obter('nome')}`,
      `Cargo: ${obter('cargo') || 'Não informado'}`,
      `Empresa: ${obter('empresa')}`,
      `Cidade da obra: ${obter('cidade')}`,
      `E-mail: ${obter('email')}`,
      `Telefone/WhatsApp: ${obter('telefone')}`,
      '',
      'INFORMAÇÕES DO PROJETO',
      '',
      `Tipo de obra: ${obter('tipo')}`,
      `Previsão de início: ${obter('prazo')}`,
      '',
      'Descrição da obra:',
      obter('descricao'),
      '',
      'DOCUMENTAÇÃO',
      '',
      'Caso necessário, anexarei os arquivos do projeto',
      'diretamente neste e-mail.',
      '',
      'Aguardo o retorno da equipe RCS3.',
      '',
      'Atenciosamente,',
      obter('nome')
    ].join('\r\n');

    const linkEmail =
      `mailto:${destinatario}` +
      `?subject=${encodeURIComponent(assunto)}` +
      `&body=${encodeURIComponent(mensagem)}`;

    const feedback = quoteForm.querySelector(
      '[data-form-feedback]'
    );

    if (feedback) {
      feedback.textContent =
        'Seu aplicativo de e-mail deverá abrir com os dados preenchidos. ' +
        'Confira as informações, anexe seus projetos, se necessário, ' +
        'e clique em Enviar.';

      feedback.classList.remove('is-error');
    }

    window.location.href = linkEmail;
  });
}
