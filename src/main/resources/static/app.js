/**
 * SIBAC Chatbot — Guided Diagnostic Conversation
 * 
 * Drives a step-by-step conversation to collect facts about the
 * steam production and combustion systems, then calls the Drools
 * REST endpoint to obtain the expert diagnosis.
 */

(function () {
    'use strict';

    // ──────────────────────────────────────
    //  DOM references
    // ──────────────────────────────────────
    const chatMessages = document.getElementById('chatMessages');
    const progressFill = document.getElementById('progressFill');
    const progressCount = document.getElementById('progressCount');

    // ──────────────────────────────────────
    //  Question definitions (order matters)
    // ──────────────────────────────────────
    const QUESTIONS = [
        {
            key: 'pressao',
            system: 'vapor',
            text: 'Qual é o estado da <strong>pressão de vapor</strong>?',
            options: ['Baixa', 'Normal', 'Alta']
        },
        {
            key: 'temperatura',
            system: 'vapor',
            text: 'Qual é a <strong>temperatura do vapor</strong>?',
            options: ['Baixa', 'Normal', 'Alta']
        },
        {
            key: 'caudal',
            system: 'vapor',
            text: 'Qual é o estado do <strong>caudal de vapor</strong>?',
            options: ['Baixo', 'Normal', 'Alto']
        },
        {
            key: 'turbinaForneceCalorSuficiente',
            system: 'vapor',
            text: 'A <strong>turbina fornece calor suficiente</strong>?',
            options: ['Sim', 'Nao']
        },
        {
            key: 'combustaoNormal',
            system: 'combustao',
            text: 'A <strong>combustão está normal</strong>?',
            options: ['Sim', 'Nao']
        },
        {
            key: 'chamaDetetada',
            system: 'combustao',
            text: 'A <strong>chama foi detetada</strong>?',
            options: ['Sim', 'Nao']
        },
        {
            key: 'gasDisponivel',
            system: 'combustao',
            text: 'O <strong>gás está disponível</strong>?',
            options: ['Sim', 'Nao']
        },
        {
            key: 'pressaoGasSuficiente',
            system: 'combustao',
            text: 'A <strong>pressão do gás é suficiente</strong>?',
            options: ['Sim', 'Nao']
        }
    ];

    const TOTAL_QUESTIONS = QUESTIONS.length;

    // ──────────────────────────────────────
    //  State
    // ──────────────────────────────────────
    let currentStep = 0;
    let answers = {};

    // ──────────────────────────────────────
    //  Utility helpers
    // ──────────────────────────────────────

    /** Scroll chat to bottom smoothly */
    function scrollToBottom() {
        requestAnimationFrame(() => {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        });
    }

    /** Update progress bar */
    function updateProgress(step) {
        const pct = Math.round((step / TOTAL_QUESTIONS) * 100);
        progressFill.style.width = pct + '%';
        progressCount.textContent = step + ' / ' + TOTAL_QUESTIONS;
    }

    /** Small delay helper (ms) */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ──────────────────────────────────────
    //  Message rendering
    // ──────────────────────────────────────

    /** Add a bot message bubble */
    function addBotMessage(html) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message bot';
        wrapper.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">${html}</div>
        `;
        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    /** Add a user message bubble */
    function addUserMessage(text) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message user';
        wrapper.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">${text}</div>
        `;
        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    /** Show the typing indicator and return the element for later removal */
    function showTyping() {
        const el = document.createElement('div');
        el.className = 'typing-indicator';
        el.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="typing-dots"><span></span><span></span><span></span></div>
        `;
        chatMessages.appendChild(el);
        scrollToBottom();
        return el;
    }

    /** Remove typing indicator */
    function removeTyping(el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    /** Render clickable option buttons */
    function showOptions(options, onSelect) {
        const container = document.createElement('div');
        container.className = 'options-container';

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.setAttribute('id', 'opt-' + opt.toLowerCase().replace(/\s+/g, '-'));
            btn.addEventListener('click', () => {
                // Disable all buttons in this group
                container.querySelectorAll('.option-btn').forEach(b => {
                    b.disabled = true;
                });
                btn.classList.add('selected');
                onSelect(opt);
            });
            container.appendChild(btn);
        });

        chatMessages.appendChild(container);
        scrollToBottom();
    }

    // ──────────────────────────────────────
    //  Diagnostic result rendering
    // ──────────────────────────────────────

    function renderDiagnostic(data) {
        const hasAnomaly = data.problema && data.problema !== null;
        const wrapper = document.createElement('div');
        wrapper.className = 'message bot';

        let resultHTML;

        if (hasAnomaly) {
            const regras = (data.regrasAtivadas || []).join(', ');
            const explicacoes = (data.explicacoes || []).join(' ');

            resultHTML = `
                <div class="diagnostic-result anomaly-found">
                    <div class="result-title">🔴 Diagnóstico Concluído — Anomalia Detetada</div>
                    <div class="result-row">
                        <span class="label">📋 Tipo:</span>
                        <span class="value">${data.tipoAnomalia}</span>
                    </div>
                    <div class="result-row">
                        <span class="label">⚠️ Problema:</span>
                        <span class="value">${data.problema}</span>
                    </div>
                    <div class="result-divider"></div>
                    <div class="result-row">
                        <span class="label">💡 Conclusão:</span>
                        <span class="value">${data.conclusao}</span>
                    </div>
                    <div class="result-divider"></div>
                    <div class="result-row">
                        <span class="label">📐 Regras:</span>
                        <span class="value">${regras}</span>
                    </div>
                    <div class="result-row">
                        <span class="label">🔍 Explicação:</span>
                        <span class="value">${explicacoes}</span>
                    </div>
                </div>
            `;
        } else {
            resultHTML = `
                <div class="diagnostic-result no-anomaly">
                    <div class="result-title">🟢 Diagnóstico Concluído — Sem Anomalias</div>
                    <div class="result-row">
                        <span class="value">Todos os parâmetros dos subsistemas de vapor e combustão estão dentro dos valores esperados. Nenhuma anomalia foi identificada pelo motor de regras.</span>
                    </div>
                </div>
            `;
        }

        wrapper.innerHTML = `
            <div class="message-avatar">🤖</div>
            ${resultHTML}
        `;

        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    // ──────────────────────────────────────
    //  Conversation flow
    // ──────────────────────────────────────

    /** Start the conversation */
    async function startConversation() {
        currentStep = 0;
        answers = {};
        chatMessages.innerHTML = '';
        updateProgress(0);

        const typing = showTyping();
        await delay(600);
        removeTyping(typing);

        addBotMessage(
            'Olá! 👋 Sou o assistente de diagnóstico da <strong>central termoelétrica</strong>. ' +
            'Vou fazer-lhe algumas perguntas para identificar possíveis anomalias nos subsistemas de vapor e combustão.'
        );

        await delay(800);

        const typing2 = showTyping();
        await delay(500);
        removeTyping(typing2);

        addBotMessage('Vamos começar pelo <strong>sistema de vapor</strong>. 🌡️');

        await delay(600);
        askNextQuestion();
    }

    /** Ask the current question */
    async function askNextQuestion() {
        if (currentStep >= TOTAL_QUESTIONS) {
            await submitDiagnosis();
            return;
        }

        const q = QUESTIONS[currentStep];

        // Show section transition message
        if (currentStep === 4) {
            const typing = showTyping();
            await delay(500);
            removeTyping(typing);
            addBotMessage('Agora vamos analisar o <strong>sistema de combustão</strong>. 🔥');
            await delay(500);
        }

        const typing = showTyping();
        await delay(450);
        removeTyping(typing);

        addBotMessage(q.text);

        await delay(200);

        showOptions(q.options, (selected) => {
            handleAnswer(q, selected);
        });
    }

    /** Handle user answer */
    async function handleAnswer(question, value) {
        // Show user's choice as a message
        addUserMessage(value);

        // Store answer
        answers[question.key] = value;

        // Advance
        currentStep++;
        updateProgress(currentStep);

        await delay(350);
        askNextQuestion();
    }

    /** Build the request body and call the API */
    async function submitDiagnosis() {
        const typing = showTyping();
        await delay(500);
        removeTyping(typing);

        addBotMessage('A analisar os dados recolhidos... ⏳');

        const requestBody = {
            sistemaVapor: {
                pressao: answers.pressao,
                temperatura: answers.temperatura,
                caudal: answers.caudal,
                turbinaForneceCalorSuficiente: answers.turbinaForneceCalorSuficiente
            },
            sistemaCombustao: {
                combustaoNormal: answers.combustaoNormal,
                chamaDetetada: answers.chamaDetetada,
                gasDisponivel: answers.gasDisponivel,
                pressaoGasSuficiente: answers.pressaoGasSuficiente
            }
        };

        const typing2 = showTyping();

        try {
            const response = await fetch('/api/diagnostico', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Erro HTTP: ' + response.status);
            }

            const data = await response.json();

            await delay(1200);
            removeTyping(typing2);

            renderDiagnostic(data);

        } catch (err) {
            await delay(800);
            removeTyping(typing2);

            addBotMessage(
                '❌ <strong>Erro ao comunicar com o motor de regras.</strong><br>' +
                'Verifique se o servidor Spring Boot está a correr em <code>localhost:8080</code>.<br>' +
                '<small style="color:var(--text-muted);">' + err.message + '</small>'
            );
        }

        // Offer restart
        await delay(800);

        const typing3 = showTyping();
        await delay(400);
        removeTyping(typing3);

        addBotMessage('Deseja realizar um <strong>novo diagnóstico</strong>?');

        await delay(200);

        const restartBtn = document.createElement('button');
        restartBtn.className = 'restart-btn';
        restartBtn.id = 'restartBtn';
        restartBtn.innerHTML = '🔄 Novo Diagnóstico';
        restartBtn.addEventListener('click', () => {
            startConversation();
        });
        chatMessages.appendChild(restartBtn);
        scrollToBottom();
    }

    // ──────────────────────────────────────
    //  Boot
    // ──────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        startConversation();
    });

})();
