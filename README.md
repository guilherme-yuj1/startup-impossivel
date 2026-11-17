# 💻 Windows Troll Update - O Carregamento Infinito

Um site de pegadinha realista que simula a tela de atualização do Windows 10/11 com mecânicas hilárias de clique, decaimento contínuo, telas de erro e a lendária Tela Azul da Morte (BSOD).

---

## 🎯 Como Funciona a Pegadinha

1. **A Ilusão Inicial:**
   - O usuário vê a tela autêntica de atualização do Windows com animação giratória oficial, títulos e porcentagem (`0% concluído`).
   - A barra só avança quando o usuário **clica na tela**.
   - **O Troll:** A barra **esvazia continuamente com o tempo** (decaimento contínuo), obrigando a vítima a clicar sem parar em alta velocidade para conseguir chegar ao 100%.

2. **A Primeira Decepção (Nível 100):**
   - Ao finalmente atingir 100%, a tela pisca em glitch, treme e toca o som clássico de erro do Windows.
   - Um diálogo de erro autêntico do Windows surge:
     > *"Falha na Instalação do Pacote Base (Erro 0x80240020)... Revertendo alterações e reiniciando com pacote de 1.000 verificações."*
   
3. **A Escalada de Dificuldade:**
   - O usuário é forçado a tentar novamente, só que agora a meta é **1.000 cliques**!
   - Se ele insistir e bater 1.000: Erro de novo! Nova meta: **10.000 cliques**!
   - Depois: **100.000 cliques**!
   - Até a meta final lendária: **1.000.000 de cliques**!

4. **A Grande Recompensa (1.000.000): A Tela Azul (BSOD):**
   - Caso alguém tenha a paciência sobre-humana de alcançar 1.000.000 (ou use o auto-clicker), o sistema finalmente colapsa!
   - Uma **Tela Azul da Morte (BSOD)** autêntica toma conta da tela, com rosto triste `:(` , QR Code, código de parada `PERSISTENCIA_INCRIVEL_MAS_INUTIL` e falha em `paciencia_humana.sys`.

---

## 🚀 Como Executar

Não requer instalação nem servidor!
Basta abrir o arquivo **`index.html`** em qualquer navegador moderno (Google Chrome, Microsoft Edge, Firefox, Safari ou no celular).

> **Dica para a pegadinha perfeita:**
> - Pressione **F11** para colocar em **Tela Cheia**.
> - Ative o som do computador para ouvir os cliques sintéticos, o som de erro do Windows e o bip da BSOD.

---

## 🤫 Menu Secreto / Cheats para Demonstração

Para demonstrar ou testar o site sem quebrar o dedo clicando 1 milhão de vezes, foi incluído um menu de controle de desenvolvedor oculto:

- **Como abrir:** Pressione a tecla **`~`** (til / aspas simples no teclado) ou **`Ctrl + Shift + X`**.
- **Opções disponíveis:**
  - `+50%`: Adiciona 50% da barra atual instantaneamente.
  - `Completar Nível`: Envia a barra diretamente para 100% da fase atual para disparar o erro e passar de nível.
  - `⚡ Turbo Auto-Clicker`: Ativa cliques automáticos em velocidade ultra-rápida (ótimo para ver a barra subir correndo contra o decaimento).
  - `💀 Ir Direto para BSOD`: Dispara imediatamente o glitch e a Tela Azul de 1 Milhão de Cliques.
  - `🔄 Resetar Tudo`: Reinicia para o nível 1 (100 cliques).

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3:** Animação pura de esferas orbitais do Windows (Segoe Ring), layout responsivo e caixas de diálogo estilo Windows 11 Fluent.
- **JavaScript Vanilla:** Loop delta-time com `requestAnimationFrame` para física suave de decaimento, sistema de níveis e números flutuantes.
- **Web Audio API:** Sintetizador sonoro nativo direto no navegador (sem necessidade de arquivos de áudio externos mp3/wav).
