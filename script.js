/**
 * Windows Troll Update Screen - Main Controller
 */

// Levels progression: 100 -> 1.000 -> 10.000 -> 100.000 -> 1.000.000
const TARGET_LEVELS = [100, 1000, 10000, 100000, 1000000];

// Dynamic status messages and error descriptions per level
const LEVEL_CONFIG = {
  100: {
    title: "Trabalhando nas atualizações",
    subtext: "Não desligue o computador. Isso pode demorar um pouco.",
    decayRate: 1.8, // points per second
    clickPower: 1,
    modalTitle: "Falha na Instalação do Pacote Base (100)",
    modalDesc: "Ocorreu uma inconsistência de paridade de buffer (Erro 0x80240020). Todas as alterações foram canceladas para proteger seu disco rígido.",
    modalNext: "O Windows Update precisa recompilar o subsistema com <strong>1.000</strong> verificações de integridade."
  },
  1000: {
    title: "Reconstruindo Subsistema de Arquivos (1.000)",
    subtext: "Recuperando clusters corrompidos. Mantenha os cliques rápidos para não perder os pacotes!",
    decayRate: 8, // points per second
    clickPower: 1,
    modalTitle: "Erro Crítico de Alocação de Memória (1.000)",
    modalDesc: "A pilha de execução estourou antes da finalização (Erro 0x8007000E). O pacote de 1.000 blocos falhou nos últimos 0.1%.",
    modalNext: "Tentativa de auto-recuperação do kernel ativada. Nova meta exigida pelo sistema: <strong>10.000</strong> ciclos manuais."
  },
  10000: {
    title: "Sincronizando 10.000 Drivers Obsoletos",
    subtext: "Sério mesmo? Você ainda está clicando? O sistema está quase... ops, quase desabando.",
    decayRate: 40,
    clickPower: 1,
    modalTitle: "Exceção não tratada no Registro (10.000)",
    modalDesc: "O Windows detectou teimosia excessiva do operador (Erro 0xC0000005). Todos os 10.000 drivers foram rejeitados por desatualização.",
    modalNext: "Redirecionando para o pacote corporativo enterprise estendido com <strong>100.000</strong> verificações de segurança."
  },
  100000: {
    title: "Processando 100.000 Threads Fantasmas",
    subtext: "Seu mouse ainda funciona? Seus dedos não doem? O Windows admira sua persistência inútil.",
    decayRate: 350,
    clickPower: 1,
    modalTitle: "Superaquecimento da CPU / Stack Overflow (100.000)",
    modalDesc: "O barramento PCI travou devido à velocidade de entrada do ponteiro (Erro 0xDEADDEAD).",
    modalNext: "ÚLTIMA TENTATIVA DE EMERGÊNCIA: O Windows exige a meta lendária e final de <strong>1.000.000</strong> de operações."
  },
  1000000: {
    title: "META FINAL: 1.000.000 DE OPERAÇÕES",
    subtext: "ALERTA MÁXIMO: Sobrecarga crítica iminente. Não clique... nós avisamos!",
    decayRate: 1500,
    clickPower: 1,
    modalTitle: "FIM DO SISTEMA",
    modalDesc: "Você quebrou o Windows.",
    modalNext: "Tela Azul iminente."
  }
};

class WindowsTrollApp {
  constructor() {
    this.currentLevelIndex = 0;
    this.target = TARGET_LEVELS[this.currentLevelIndex];
    this.currentProgress = 0;
    this.isPaused = false;
    this.isBSOD = false;
    this.autoClickerInterval = null;

    // DOM Elements
    this.updateScreen = document.getElementById('update-screen');
    this.statusTitle = document.getElementById('status-title');
    this.statusSubtext = document.getElementById('status-subtext');
    this.percentDisplay = document.getElementById('percent-display');
    this.subCounter = document.getElementById('sub-counter');
    this.progressFill = document.getElementById('progress-fill');
    this.trollHint = document.getElementById('troll-hint');

    this.glitchOverlay = document.getElementById('glitch-overlay');
    this.errorDialog = document.getElementById('error-dialog');
    this.modalTitle = document.getElementById('modal-title');
    this.modalDesc = document.getElementById('modal-desc');
    this.modalNext = document.getElementById('modal-next');
    this.btnTryAgain = document.getElementById('btn-try-again');
    this.btnModalClose = document.getElementById('btn-modal-close');

    this.bsodScreen = document.getElementById('bsod-screen');
    this.btnReboot = document.getElementById('btn-reboot');

    this.hintBanner = document.getElementById('hint-banner');
    this.btnFullscreen = document.getElementById('btn-fullscreen');

    this.cheatMenu = document.getElementById('cheat-menu');
    this.autoclickStatus = document.getElementById('autoclick-status');

    this.lastDecayTime = performance.now();
    this.decayTickAccumulator = 0;

    this.initEvents();
    this.updateDisplay();
    this.startLoop();
  }

  initEvents() {
    // Click on the update screen advances progress
    this.updateScreen.addEventListener('mousedown', (e) => {
      // Don't trigger if clicked on child buttons or if paused
      if (this.isPaused || this.isBSOD) return;
      this.handleClick(e.clientX, e.clientY);
    });

    // Touch support for mobile / tablets
    this.updateScreen.addEventListener('touchstart', (e) => {
      if (this.isPaused || this.isBSOD) return;
      const touch = e.touches[0];
      if (touch) {
        this.handleClick(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    // Modal buttons
    this.btnTryAgain.addEventListener('click', (e) => {
      e.stopPropagation();
      this.advanceToNextLevel();
    });

    this.btnModalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      this.advanceToNextLevel();
    });

    // Reboot on BSOD
    this.btnReboot.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetEverything();
    });

    // Fullscreen toggle
    this.btnFullscreen.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFullscreen();
    });

    // Fade hint banner after 7 seconds
    setTimeout(() => {
      if (this.hintBanner) {
        this.hintBanner.style.opacity = '0';
        setTimeout(() => this.hintBanner.classList.add('hidden'), 500);
      }
    }, 7000);

    // Keyboard Shortcuts (F11, Cheats)
    window.addEventListener('keydown', (e) => {
      // Secret Cheat Menu toggle: '~', '`' or Ctrl+Shift+X
      if (e.key === '~' || e.key === '`' || (e.ctrlKey && e.shiftKey && e.code === 'KeyX')) {
        this.toggleCheatMenu();
      }
    });

    // Cheat menu button handlers
    this.initCheatControls();
  }

  initCheatControls() {
    document.getElementById('cheat-add-progress').addEventListener('click', () => {
      this.addProgress(this.target * 0.5);
    });

    document.getElementById('cheat-complete-level').addEventListener('click', () => {
      this.addProgress(this.target - this.currentProgress);
    });

    document.getElementById('cheat-autoclicker').addEventListener('click', () => {
      this.toggleAutoClicker();
    });

    document.getElementById('cheat-bsod').addEventListener('click', () => {
      this.currentLevelIndex = TARGET_LEVELS.length - 1;
      this.target = TARGET_LEVELS[this.currentLevelIndex];
      this.triggerBSOD();
    });

    document.getElementById('cheat-reset').addEventListener('click', () => {
      this.resetEverything();
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      this.btnFullscreen.textContent = "Sair da Tela Cheia";
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      this.btnFullscreen.textContent = "⛶ Tela Cheia";
    }
  }

  toggleCheatMenu() {
    this.cheatMenu.classList.toggle('hidden');
  }

  toggleAutoClicker() {
    if (this.autoClickerInterval) {
      clearInterval(this.autoClickerInterval);
      this.autoClickerInterval = null;
      this.autoclickStatus.textContent = "OFF";
      this.autoclickStatus.style.color = "#ff5252";
    } else {
      this.autoclickStatus.textContent = "ON (TURBO)";
      this.autoclickStatus.style.color = "#5cf587";
      // Auto clicker pulses every 25ms (40 clicks/sec)
      this.autoClickerInterval = setInterval(() => {
        if (!this.isPaused && !this.isBSOD) {
          // Adjust power in auto mode to comfortably scale with current target
          const boost = Math.max(1, Math.floor(this.target / 150));
          this.addProgress(boost);
        }
      }, 25);
    }
  }

  handleClick(x, y) {
    if (this.isPaused || this.isBSOD) return;

    window.soundFx.playClick();

    const config = LEVEL_CONFIG[this.target] || LEVEL_CONFIG[100];
    const power = config.clickPower || 1;
    this.addProgress(power);

    // Spawn floating "+1"
    this.spawnFloatingEffect(x, y, `+${power}`, 'floating-plus');

    // Subtle scale bounce on percent display
    this.percentDisplay.style.transform = 'scale(1.08)';
    setTimeout(() => {
      this.percentDisplay.style.transform = 'scale(1)';
    }, 70);
  }

  addProgress(amount) {
    this.currentProgress += amount;

    if (this.currentProgress >= this.target) {
      this.currentProgress = this.target;
      this.updateDisplay();
      this.handleTargetReached();
      return;
    }

    this.updateDisplay();
  }

  /**
   * Main animation / decay loop
   */
  startLoop() {
    const loop = (currentTime) => {
      const deltaMs = currentTime - this.lastDecayTime;
      this.lastDecayTime = currentTime;

      if (!this.isPaused && !this.isBSOD && this.currentProgress > 0) {
        const config = LEVEL_CONFIG[this.target] || LEVEL_CONFIG[100];
        // Decay proportional to elapsed time
        const decayPerSec = config.decayRate || 2;
        const decayAmount = (decayPerSec * deltaMs) / 1000;

        const prevVal = Math.floor(this.currentProgress);
        this.currentProgress = Math.max(0, this.currentProgress - decayAmount);
        const newVal = Math.floor(this.currentProgress);

        // Play subtle sound when dropping whole units occasionally
        if (prevVal > newVal && Math.random() < 0.25) {
          window.soundFx.playDecay();
        }

        this.updateDisplay();
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  updateDisplay() {
    const percentage = Math.min(100, (this.currentProgress / this.target) * 100);
    const formattedPercent = Math.floor(percentage);

    this.percentDisplay.textContent = `${formattedPercent}% concluído`;
    this.subCounter.textContent = `(${Math.floor(this.currentProgress).toLocaleString('pt-BR')} / ${this.target.toLocaleString('pt-BR')})`;
    this.progressFill.style.width = `${percentage}%`;

    // Visual color shift when getting close
    if (percentage > 85) {
      this.progressFill.style.boxShadow = '0 0 15px #00ff88';
    } else {
      this.progressFill.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.6)';
    }
  }

  /**
   * Triggered when progress reaches 100% of the target
   */
  handleTargetReached() {
    this.isPaused = true;

    // Check if this was the final 1,000,000 target
    if (this.target >= 1000000) {
      this.triggerBSOD();
      return;
    }

    // Otherwise: Fake crash glitch then show Windows error modal!
    this.triggerGlitchAndErrorModal();
  }

  triggerGlitchAndErrorModal() {
    // Sound effect
    window.soundFx.playErrorChord();

    // Glitch overlay flash & screen shake
    this.glitchOverlay.classList.remove('hidden');
    document.body.classList.add('shake-screen');

    setTimeout(() => {
      this.glitchOverlay.classList.add('hidden');
      document.body.classList.remove('shake-screen');

      // Populate modal with next stage info
      const config = LEVEL_CONFIG[this.target];
      if (config) {
        this.modalTitle.textContent = config.modalTitle;
        this.modalDesc.textContent = config.modalDesc;
        this.modalNext.innerHTML = config.modalNext;
      }

      this.errorDialog.classList.remove('hidden');
    }, 600);
  }

  advanceToNextLevel() {
    this.errorDialog.classList.add('hidden');

    this.currentLevelIndex++;
    if (this.currentLevelIndex >= TARGET_LEVELS.length) {
      this.currentLevelIndex = TARGET_LEVELS.length - 1;
    }

    this.target = TARGET_LEVELS[this.currentLevelIndex];
    this.currentProgress = 0;
    this.isPaused = false;

    // Update screen headings & flavor text
    const config = LEVEL_CONFIG[this.target];
    if (config) {
      this.statusTitle.textContent = config.title;
      this.statusSubtext.textContent = config.subtext;
    }

    this.updateDisplay();
  }

  /**
   * Trigger the ultimate 1.000.000 BSOD!
   */
  triggerBSOD() {
    this.isBSOD = true;
    this.isPaused = true;

    if (this.autoClickerInterval) {
      clearInterval(this.autoClickerInterval);
      this.autoClickerInterval = null;
      this.autoclickStatus.textContent = "OFF";
    }

    // Massive glitch
    this.glitchOverlay.classList.remove('hidden');
    document.body.classList.add('shake-screen');
    window.soundFx.playBSODSound();

    setTimeout(() => {
      this.glitchOverlay.classList.add('hidden');
      document.body.classList.remove('shake-screen');

      // Hide main update screen and modal
      this.updateScreen.classList.add('hidden');
      this.errorDialog.classList.add('hidden');

      // Show BSOD
      this.bsodScreen.classList.remove('hidden');

      // Animate BSOD percentage counter (0% -> 100%)
      const bsodProgress = document.getElementById('bsod-progress-text');
      let p = 0;
      const progressTimer = setInterval(() => {
        p += Math.floor(Math.random() * 25) + 10;
        if (p >= 100) {
          p = 100;
          clearInterval(progressTimer);
        }
        bsodProgress.textContent = `${p}% concluído`;
      }, 400);
    }, 700);
  }

  resetEverything() {
    this.isBSOD = false;
    this.isPaused = false;
    this.currentLevelIndex = 0;
    this.target = TARGET_LEVELS[this.currentLevelIndex];
    this.currentProgress = 0;

    const config = LEVEL_CONFIG[this.target];
    this.statusTitle.textContent = config.title;
    this.statusSubtext.textContent = config.subtext;

    this.bsodScreen.classList.add('hidden');
    this.errorDialog.classList.add('hidden');
    this.glitchOverlay.classList.add('hidden');
    this.updateScreen.classList.remove('hidden');

    this.updateDisplay();
  }

  spawnFloatingEffect(x, y, text, className) {
    if (!x || !y) {
      x = window.innerWidth / 2 + (Math.random() * 80 - 40);
      y = window.innerHeight / 2 + (Math.random() * 80 - 40);
    }

    const elem = document.createElement('div');
    elem.className = `floating-num ${className}`;
    elem.textContent = text;
    elem.style.left = `${x}px`;
    elem.style.top = `${y}px`;

    document.body.appendChild(elem);

    setTimeout(() => {
      if (elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    }, 650);
  }
}

// Start app once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.trollApp = new WindowsTrollApp();
});
