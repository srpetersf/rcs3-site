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


/* =========================================
   PRIVACIDADE E COOKIES - RCS3
   ========================================= */

(() => {
  const STORAGE_KEY = 'rcs3-cookie-preference-v1';

  // Cria o banner em todas as páginas do site.
  const banner = document.createElement('aside');

  banner.className = 'cookie-banner';
  banner.id = 'rcs3-cookie-banner';
  banner.hidden = true;

  banner.setAttribute('role', 'region');
  banner.setAttribute(
    'aria-label',
    'Preferências de privacidade e cookies'
  );

  banner.innerHTML = `
    <div class="cookie-content">

      <div class="cookie-title">
        <span class="cookie-icon" aria-hidden="true">●</span>
        Privacidade e cookies
      </div>

      <p class="cookie-description">
        Utilizamos recursos essenciais para o
        funcionamento do site.

        Atualmente, não utilizamos cookies opcionais
        de análise ou publicidade.

        Você pode registrar sua preferência
        neste navegador.

        Saiba mais em nossa
        <a href="privacidade.html">
          Política de Privacidade e Cookies
        </a>.
      </p>

    </div>

    <div class="cookie-actions"
         role="group"
         aria-label="Escolha de cookies">

      <button
        type="button"
        class="cookie-btn cookie-btn-reject"
        data-cookie-reject>
        Rejeitar opcionais
      </button>

      <button
        type="button"
        class="cookie-btn cookie-btn-accept"
        data-cookie-accept>
        Aceitar opcionais
      </button>

    </div>
  `;

  document.body.appendChild(banner);

  // Recupera a escolha salva no navegador.
  function obterPreferencia() {
    try {
      const valor = localStorage.getItem(STORAGE_KEY);

      return ['accepted', 'rejected'].includes(valor)
        ? valor
        : null;
    } catch (erro) {
      return null;
    }
  }

  // Salva a escolha e fecha o banner.
  function salvarPreferencia(valor) {
    try {
      localStorage.setItem(STORAGE_KEY, valor);
    } catch (erro) {
      // Se o armazenamento estiver bloqueado,
      // fecha o banner nesta visita.
    }

    banner.hidden = true;
  }

  // Botão aceitar.
  banner
    .querySelector('[data-cookie-accept]')
    .addEventListener('click', () => {
      salvarPreferencia('accepted');
    });

  // Botão rejeitar.
  banner
    .querySelector('[data-cookie-reject]')
    .addEventListener('click', () => {
      salvarPreferencia('rejected');
    });

  // Exibe somente quando não existe escolha salva.
  if (!obterPreferencia()) {
    banner.hidden = false;
  }

  // Adiciona automaticamente um botão no rodapé.
  const footerLinks = document.querySelector('.footer-links');

  if (footerLinks) {
    const botaoPreferencias = document.createElement('button');

    botaoPreferencias.type = 'button';
    botaoPreferencias.className = 'cookie-preferences';
    botaoPreferencias.textContent = 'Preferências de cookies';

    botaoPreferencias.addEventListener('click', () => {
      banner.hidden = false;

      banner.querySelector('[data-cookie-reject]').focus();
    });

    footerLinks.appendChild(botaoPreferencias);
  }
})();
