/**
 * SIBAC Chatbot — Guided Diagnostic Conversation (v5)
 *
 * Fluxo conforme o relatório e os diagramas de fluxo:
 *
 *  Triagem → Vapor (apenas árvore vapor) | Combustão (apenas árvore combustão)
 *
 *  Árvore Combustão — alinhada com o diagrama:
 *    Bloco A (sem chama):   7 caminhos com todas as perguntas necessárias
 *    Bloco B1 (instável):   5 caminhos: gás → mistura → queimadores → detetor → controlo
 *    Bloco B2/3/4 (estável): temperatura → consumo/caudal/ar → controlo
 *
 *  Progresso dinâmico: stepsTotal incrementa a cada pergunta feita.
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
    //  State
    // ──────────────────────────────────────
    let answers = {};
    let stepsDone = 0;
    let stepsTotal = 0;

    // ──────────────────────────────────────
    //  Progress helpers
    // ──────────────────────────────────────

    function addStep()  { stepsTotal++; }
    function tickStep() {
        stepsDone++;
        const pct = stepsTotal > 0 ? Math.round((stepsDone / stepsTotal) * 100) : 0;
        progressFill.style.width = pct + '%';
        progressCount.textContent = stepsDone + ' / ' + stepsTotal;
    }
    function resetProgress() {
        stepsDone = 0;
        stepsTotal = 0;
        progressFill.style.width = '0%';
        progressCount.textContent = '0 / —';
    }

    // ──────────────────────────────────────
    //  Utilities
    // ──────────────────────────────────────

    function scrollToBottom() {
        requestAnimationFrame(() => {
            chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
        });
    }
    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ──────────────────────────────────────
    //  Message rendering
    // ──────────────────────────────────────

    function addBotMessage(html) {
        const w = document.createElement('div');
        w.className = 'message bot';
        w.innerHTML = `<div class="message-avatar">🤖</div><div class="message-content">${html}</div>`;
        chatMessages.appendChild(w);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const w = document.createElement('div');
        w.className = 'message user';
        w.innerHTML = `<div class="message-avatar">👤</div><div class="message-content">${text}</div>`;
        chatMessages.appendChild(w);
        scrollToBottom();
    }

    function showTyping() {
        const el = document.createElement('div');
        el.className = 'typing-indicator';
        el.innerHTML = `<div class="message-avatar">🤖</div><div class="typing-dots"><span></span><span></span><span></span></div>`;
        chatMessages.appendChild(el);
        scrollToBottom();
        return el;
    }

    function removeTyping(el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    function askOptions(options) {
        return new Promise(resolve => {
            const container = document.createElement('div');
            container.className = 'options-container';
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.setAttribute('id', 'opt-' + opt.toLowerCase().replace(/[\s\/]+/g, '-'));
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.option-btn').forEach(b => { b.disabled = true; });
                    btn.classList.add('selected');
                    resolve(opt);
                });
                container.appendChild(btn);
            });
            chatMessages.appendChild(container);
            scrollToBottom();
        });
    }

    /**
     * Pergunta ao utilizador, regista no progresso dinâmico e guarda a resposta.
     * O stepsTotal cresce aqui — garante que o contador reflecte sempre
     * apenas as perguntas que foram efectivamente feitas.
     */
    async function ask(fieldKey, html, options) {
        addStep();
        const typing = showTyping();
        await delay(420);
        removeTyping(typing);
        addBotMessage(html);
        await delay(180);
        const selected = await askOptions(options);
        addUserMessage(selected);
        answers[fieldKey] = selected;
        tickStep();
        await delay(300);
    }

    // ──────────────────────────────────────
    //  Resultado do diagnóstico
    // ──────────────────────────────────────

    function renderDiagnostic(data) {
        const hasAnomaly = data.problema && data.problema !== null;
        const wrapper = document.createElement('div');
        wrapper.className = 'message bot';
        let resultHTML;

        if (hasAnomaly) {
            const regras = (data.regrasAtivadas || []).join(', ');
            const explicacoes = (data.explicacoes || []).map(e => `<li>${e}</li>`).join('');
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
                        <span class="label">💡 Conclusão e Ação:</span>
                        <span class="value">${data.conclusao}</span>
                    </div>
                    <div class="result-divider"></div>
                    <div class="result-row">
                        <span class="label">📐 Regra ativada:</span>
                        <span class="value">${regras}</span>
                    </div>
                    <div class="result-row">
                        <span class="label">🔍 Raciocínio:</span>
                        <span class="value"><ul style="margin:4px 0 0 16px;padding:0">${explicacoes}</ul></span>
                    </div>
                </div>`;
        } else {
            resultHTML = `
                <div class="diagnostic-result no-anomaly">
                    <div class="result-title">🟢 Diagnóstico Concluído — Sem Anomalias</div>
                    <div class="result-row">
                        <span class="value">Todos os parâmetros analisados estão dentro dos valores esperados.
                        Nenhuma anomalia foi identificada pelo motor de regras Drools.</span>
                    </div>
                </div>`;
        }

        wrapper.innerHTML = `<div class="message-avatar">🤖</div>${resultHTML}`;
        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    // ══════════════════════════════════════════════════════════════
    //  FLUXO PRINCIPAL
    // ══════════════════════════════════════════════════════════════

    async function startConversation() {
        answers = {};
        resetProgress();
        chatMessages.innerHTML = '';

        const t1 = showTyping();
        await delay(600);
        removeTyping(t1);
        addBotMessage('Olá! 👋 Sou o assistente de diagnóstico da <strong>central termoelétrica</strong>. ' +
                      'Vou ajudá-lo a identificar a causa de uma anomalia nos sistemas energéticos.');
        await delay(700);
        const t2 = showTyping();
        await delay(400);
        removeTyping(t2);

        // TRIAGEM
        await ask('tipoAnomalia',
            '📋 Em qual dos subsistemas foi detetada a anomalia?',
            ['Produção de Vapor', 'Sistema de Combustão']
        );

        if (answers.tipoAnomalia === 'Produção de Vapor') {
            await flowVapor();
        } else {
            await flowCombustao();
        }

        await submitDiagnosis();
    }

    // ══════════════════════════════════════════════════════════════
    //  ÁRVORE DE VAPOR — 10 grupos P/T/C com fallbacks
    // ══════════════════════════════════════════════════════════════

    async function flowVapor() {
        const t = showTyping(); await delay(450); removeTyping(t);
        addBotMessage('Vamos analisar o <strong>sistema de produção de vapor</strong>. 🌡️');
        await delay(400);

        await ask('pressao',     'Qual é o estado da <strong>pressão de vapor</strong>?',  ['Baixa', 'Normal', 'Alta']);
        await ask('temperatura', 'Qual é a <strong>temperatura do vapor</strong>?',         ['Baixa', 'Normal', 'Alta']);
        await ask('caudal',      'Qual é o estado do <strong>caudal de vapor</strong>?',    ['Baixo', 'Normal', 'Alto']);

        const p = answers.pressao, temp = answers.temperatura, c = answers.caudal;

        // ── G1: P↓ T↓ C↓ ─────────────────────────────────────────
        if (p === 'Baixa' && temp === 'Baixa' && c === 'Baixo') {
            await ask('combustaoNormal', 'A <strong>combustão está a funcionar normalmente</strong>?', ['Sim', 'Nao']);
            if (answers.combustaoNormal === 'Sim') {
                await ask('turbinaForneceCalorSuficiente', 'A <strong>turbina fornece calor suficiente</strong> à caldeira?', ['Sim', 'Nao']);
                if (answers.turbinaForneceCalorSuficiente === 'Sim') {
                    await ask('alimentacaoBFWCorreta', 'A <strong>alimentação de água (BFW)</strong> está correta?', ['Sim', 'Nao']);
                    if (answers.alimentacaoBFWCorreta === 'Sim') {
                        await ask('nivelBarrileteDentroLimites', 'O <strong>nível do barrilete</strong> está dentro dos limites?', ['Sim', 'Nao']);
                        if (answers.nivelBarrileteDentroLimites === 'Sim') {
                            await ask('sistemaControloAtuaCorretamente', 'O <strong>sistema de controlo da caldeira</strong> está a atuar corretamente?', ['Sim', 'Nao']);
                        }
                    }
                }
            }

        // ── G2: P↓ T↓ C Normal ───────────────────────────────────
        } else if (p === 'Baixa' && temp === 'Baixa' && c === 'Normal') {
            await ask('sensoresCoerentes', 'As leituras dos <strong>sensores são coerentes</strong> entre si?', ['Sim', 'Nao']);
            if (answers.sensoresCoerentes === 'Sim') {
                await ask('combustaoNormal', 'A <strong>combustão está normal</strong>?', ['Sim', 'Nao']);
                if (answers.combustaoNormal === 'Sim') {
                    await ask('turbinaForneceCalorSuficiente', 'A <strong>turbina fornece calor suficiente</strong>?', ['Sim', 'Nao']);
                    if (answers.turbinaForneceCalorSuficiente === 'Sim') {
                        await ask('dessobreaquecedorAbertoEmExcesso', 'O <strong>dessobreaquecedor está aberto em excesso</strong>?', ['Sim', 'Nao']);
                    }
                }
            }

        // ── G3: P↓ T Normal C↓ ───────────────────────────────────
        } else if (p === 'Baixa' && temp === 'Normal' && c === 'Baixo') {
            await ask('medidorCaudalCorreto', 'O <strong>medidor de caudal</strong> está a funcionar corretamente?', ['Sim', 'Nao']);
            if (answers.medidorCaudalCorreto === 'Sim') {
                await ask('valvulasVaporTotalmenteAbertas', 'As <strong>válvulas de saída de vapor</strong> estão totalmente abertas?', ['Sim', 'Nao']);
                if (answers.valvulasVaporTotalmenteAbertas === 'Sim') {
                    await ask('restricaoLinhaVapor', 'Existe alguma <strong>restrição na linha de vapor</strong>?', ['Sim', 'Nao']);
                    if (answers.restricaoLinhaVapor === 'Nao') {
                        await ask('combustaoNormal', 'A <strong>combustão está normal</strong>?', ['Sim', 'Nao']);
                    }
                }
            }

        // ── G4: P↓ T Normal C Normal ─────────────────────────────
        } else if (p === 'Baixa' && temp === 'Normal' && c === 'Normal') {
            await ask('sensorPressaoCorreto', 'O <strong>sensor de pressão</strong> está correto?', ['Sim', 'Nao']);
            if (answers.sensorPressaoCorreto === 'Sim') {
                await ask('valvulaAbertaIndevidamente', 'Existe alguma <strong>válvula aberta indevidamente</strong>?', ['Sim', 'Nao']);
                if (answers.valvulaAbertaIndevidamente === 'Nao') {
                    await ask('fugaLinhaVapor', 'Foi detetada alguma <strong>fuga na linha de vapor</strong>?', ['Sim', 'Nao']);
                    if (answers.fugaLinhaVapor === 'Nao') {
                        await ask('consumoVapor', 'O <strong>consumo de vapor</strong> aumentou recentemente?', ['Sim (Aumentou)', 'Nao']);
                        answers.consumoVapor = answers.consumoVapor === 'Sim (Aumentou)' ? 'Aumentou' : 'Normal';
                    }
                }
            }

        // ── G5: P Normal T↓ C Normal ─────────────────────────────
        } else if (p === 'Normal' && temp === 'Baixa' && c === 'Normal') {
            await ask('sensorTemperaturaCorreto', 'O <strong>sensor de temperatura</strong> está correto?', ['Sim', 'Nao']);
            if (answers.sensorTemperaturaCorreto === 'Sim') {
                await ask('combustaoNormal', 'A <strong>combustão está normal</strong>?', ['Sim', 'Nao']);
                if (answers.combustaoNormal === 'Sim') {
                    await ask('turbinaForneceCalorSuficiente', 'A <strong>turbina fornece calor suficiente</strong>?', ['Sim', 'Nao']);
                    if (answers.turbinaForneceCalorSuficiente === 'Sim') {
                        await ask('dessobreaquecedorAbertoEmExcesso', 'O <strong>dessobreaquecedor está aberto em excesso</strong>?', ['Sim', 'Nao']);
                    }
                }
            }

        // ── G6: P Normal T Normal C↓ ─────────────────────────────
        } else if (p === 'Normal' && temp === 'Normal' && c === 'Baixo') {
            await ask('medidorCaudalCorreto', 'O <strong>medidor de caudal</strong> está correto?', ['Sim', 'Nao']);
            if (answers.medidorCaudalCorreto === 'Sim') {
                await ask('valvulasVaporTotalmenteAbertas', 'As <strong>válvulas de saída</strong> estão totalmente abertas?', ['Sim', 'Nao']);
                if (answers.valvulasVaporTotalmenteAbertas === 'Sim') {
                    await ask('restricaoLinhaVapor', 'Existe <strong>restrição na linha de vapor</strong>?', ['Sim', 'Nao']);
                    if (answers.restricaoLinhaVapor === 'Nao') {
                        await ask('consumoVapor', 'O <strong>consumo de vapor</strong> diminuiu recentemente?', ['Sim (Diminuiu)', 'Nao']);
                        answers.consumoVapor = answers.consumoVapor === 'Sim (Diminuiu)' ? 'Diminuiu' : 'Normal';
                    }
                }
            }

        // ── G7: P↑ T↑ ────────────────────────────────────────────
        } else if (p === 'Alta' && temp === 'Alta') {
            await ask('sensoresCoerentes', 'As leituras dos <strong>sensores são coerentes</strong>?', ['Sim', 'Nao']);
            if (answers.sensoresCoerentes === 'Sim') {
                await ask('sistemaControloAtuaCorretamente', 'O <strong>sistema de controlo</strong> está a atuar corretamente?', ['Sim', 'Nao']);
                if (answers.sistemaControloAtuaCorretamente === 'Sim') {
                    await ask('consumoVapor', 'O <strong>consumo de vapor</strong> diminuiu?', ['Sim (Diminuiu)', 'Nao']);
                    if (answers.consumoVapor === 'Sim (Diminuiu)') {
                        answers.consumoVapor = 'Diminuiu';
                    } else {
                        answers.consumoVapor = 'Normal';
                        await ask('combustaoNormal', 'A <strong>combustão está normal</strong> (sem excesso)?', ['Sim', 'Nao']);
                        if (answers.combustaoNormal === 'Nao') { answers.caudal = 'Alto'; }
                    }
                }
            }

        // ── G8: P↑ T Normal ──────────────────────────────────────
        } else if (p === 'Alta' && temp === 'Normal') {
            await ask('sensorPressaoCorreto', 'O <strong>sensor de pressão</strong> está correto?', ['Sim', 'Nao']);
            if (answers.sensorPressaoCorreto === 'Sim') {
                await ask('controloPressaoAtuaCorretamente', 'O <strong>controlo de pressão</strong> está a atuar corretamente?', ['Sim', 'Nao']);
                if (answers.controloPressaoAtuaCorretamente === 'Sim') {
                    await ask('valvulasVaporTotalmenteAbertas', 'As <strong>válvulas de saída</strong> estão totalmente abertas?', ['Sim', 'Nao']);
                    if (answers.valvulasVaporTotalmenteAbertas === 'Sim') {
                        await ask('consumoVapor', 'O <strong>consumo de vapor</strong> está baixo?', ['Sim (Baixo)', 'Nao']);
                        answers.consumoVapor = answers.consumoVapor === 'Sim (Baixo)' ? 'Baixo' : 'Normal';
                    }
                }
            }

        // ── G9: P Normal T↑ C Normal ─────────────────────────────
        } else if (p === 'Normal' && temp === 'Alta' && c === 'Normal') {
            await ask('sensorTemperaturaCorreto', 'O <strong>sensor de temperatura</strong> está correto?', ['Sim', 'Nao']);
            if (answers.sensorTemperaturaCorreto === 'Sim') {
                await ask('dessobreaquecedorAtuaCorretamente', 'O <strong>dessobreaquecedor</strong> está a atuar corretamente?', ['Sim', 'Nao']);
                if (answers.dessobreaquecedorAtuaCorretamente === 'Sim') {
                    await ask('combustaoNormal', 'A <strong>combustão está normal</strong> (sem excesso)?', ['Sim', 'Nao']);
                    if (answers.combustaoNormal === 'Sim') {
                        await ask('turbinaForneceCalorSuficiente', 'A <strong>turbina tem carga elevada</strong> (muitos gases quentes para a caldeira)?', ['Sim', 'Nao']);
                    }
                }
            }

        // ── G10: Contraditório/Raro ───────────────────────────────
        } else {
            await ask('sensoresCoerentes', 'As leituras dos <strong>sensores são coerentes</strong> entre si?', ['Sim', 'Nao']);
            if (answers.sensoresCoerentes === 'Nao') {
                await ask('mudancaOperacionalRecente', 'Houve uma <strong>mudança operacional recente</strong>?', ['Sim', 'Nao']);
            }
        }
    }

    // ══════════════════════════════════════════════════════════════
    //  ÁRVORE DE COMBUSTÃO — alinhada com diagrama do relatório
    // ══════════════════════════════════════════════════════════════

    async function flowCombustao() {
        const t = showTyping(); await delay(450); removeTyping(t);
        addBotMessage('Vamos analisar o <strong>sistema de combustão</strong>. 🔥');
        await delay(400);

        // ─────────────────────────────────────────────────────────
        //  BLOCO A — Ausência de chama
        // ─────────────────────────────────────────────────────────
        await ask('chamaDetetada', 'A <strong>chama foi detetada</strong> nos queimadores?', ['Sim', 'Nao']);

        if (answers.chamaDetetada === 'Nao') {
            await ask('gasDisponivel', 'O <strong>gás está disponível</strong> na linha?', ['Sim', 'Nao']);

            if (answers.gasDisponivel === 'Sim') {
                await ask('pressaoGasSuficiente', 'A <strong>pressão de gás</strong> é suficiente?', ['Sim', 'Nao']);

                if (answers.pressaoGasSuficiente === 'Sim') {
                    await ask('valvulasGasAbertas', 'As <strong>válvulas de gás</strong> dos queimadores estão abertas?', ['Sim', 'Nao']);

                    if (answers.valvulasGasAbertas === 'Sim') {
                        await ask('sistemaIgnicaoAtivo', 'O <strong>sistema de ignição</strong> está ativo?', ['Sim', 'Nao']);

                        if (answers.sistemaIgnicaoAtivo === 'Sim') {
                            await ask('detetorChamaFuncional', 'O <strong>detetor de chama</strong> está operacional?', ['Sim', 'Nao']);

                            // ← Pergunta adicionada para cobrir C-A.6 e C-A.7
                            if (answers.detetorChamaFuncional === 'Sim') {
                                await ask('relacaoArCombustivelCorreta',
                                    'A <strong>relação ar/combustível</strong> está correta (mistura inflamável)?',
                                    ['Sim', 'Nao']);
                            }
                        }
                    }
                }
            }

        } else {
            // ─────────────────────────────────────────────────────
            //  BLOCO B — Chama presente
            // ─────────────────────────────────────────────────────
            await ask('chamaEstavel', 'A <strong>chama está estável</strong>?', ['Sim', 'Nao']);

            if (answers.chamaEstavel === 'Nao') {
                // ── B1: Chama instável ────────────────────────────
                await ask('pressaoGasEstavel', 'A <strong>pressão de gás está estável</strong>?', ['Sim', 'Nao']);

                if (answers.pressaoGasEstavel === 'Sim') {
                    // Pressão estável: verificar mistura, queimadores, detetor, controlo
                    await ask('relacaoArCombustivelCorreta',
                        'A <strong>relação ar/combustível</strong> está correta?', ['Sim', 'Nao']);

                    if (answers.relacaoArCombustivelCorreta === 'Sim') {
                        await ask('queimadoresFuncionamCorretamente',
                            'Os <strong>queimadores estão a funcionar corretamente</strong>?', ['Sim', 'Nao']);

                        if (answers.queimadoresFuncionamCorretamente === 'Sim') {
                            // Todos os componentes OK → verificar detetor e controlo
                            await ask('detetorChamaFuncional',
                                'O <strong>detetor de chama</strong> está a funcionar corretamente?', ['Sim', 'Nao']);
                            // (Se detetor=Sim → C-B1.5 instabilidade controlo; se Nao → C-B1.4 leitura incorreta)
                        }
                        // Se queimadores=Nao → C-B1.3 AnomaliaQueimadores
                    }
                    // Se relacao=Nao → C-B1.2 MisturaDesajustada
                }
                // Se pressaoGas=Nao → C-B1.1 InstabilidadeGas

            } else {
                // ── B2/3/4: Chama estável — verificar temperatura ─
                await ask('temperaturaCombustao',
                    'Qual é a <strong>temperatura de combustão</strong>?',
                    ['Baixa', 'Normal', 'Alta']);

                const tc = answers.temperaturaCombustao;

                if (tc === 'Normal') {
                    // ── B2: Temperatura normal — verificar consumo e controlo
                    await ask('consumoCombustivel',
                        'O <strong>consumo de combustível</strong> está dentro do esperado?',
                        ['Normal', 'Alto (acima do esperado)', 'Baixo (abaixo do esperado)']);

                    // Normalizar para valores simples
                    if (answers.consumoCombustivel === 'Alto (acima do esperado)') {
                        answers.consumoCombustivel = 'Alto';
                    } else if (answers.consumoCombustivel === 'Baixo (abaixo do esperado)') {
                        answers.consumoCombustivel = 'Baixo';
                    } else {
                        answers.consumoCombustivel = 'Normal';
                        // Só pede controlo quando consumo está normal
                        await ask('sistemaControloCombustaoCorreto',
                            'O <strong>sistema de controlo da combustão</strong> está a atuar corretamente?',
                            ['Sim', 'Nao']);
                    }

                } else if (tc === 'Baixa') {
                    // ── B3: Temperatura baixa — verificar caudal e ar
                    await ask('caudalGas', 'Qual é o <strong>caudal de gás</strong>?', ['Baixo', 'Normal', 'Alto']);

                    if (answers.caudalGas !== 'Baixo') {
                        // Caudal OK mas temp baixa → verificar excesso de ar
                        await ask('fluxoArAdequado',
                            'O <strong>fluxo de ar</strong> para a combustão é adequado (sem excesso)?',
                            ['Sim', 'Nao']);
                    }
                    // Se caudalGas=Baixo → C-B3.1 diretamente

                } else {
                    // ── B4: Temperatura alta — verificar caudal e défice de ar
                    await ask('caudalGas', 'Qual é o <strong>caudal de gás</strong>?', ['Baixo', 'Normal', 'Alto']);

                    if (answers.caudalGas !== 'Alto') {
                        // Caudal não excessivo mas temp alta → verificar défice de ar
                        await ask('fluxoArAdequado',
                            'O <strong>fluxo de ar</strong> para a combustão é adequado (sem défice)?',
                            ['Sim', 'Nao']);
                    }
                    // Se caudalGas=Alto → C-B4.1 diretamente
                }
            }
        }
    }

    // ══════════════════════════════════════════════════════════════
    //  SUBMISSÃO AO DROOLS + RESULTADO
    // ══════════════════════════════════════════════════════════════

    async function submitDiagnosis() {
        const typing = showTyping(); await delay(600); removeTyping(typing);
        addBotMessage('A processar os dados no motor de inferência Drools... ⏳');

        const vaporFields = [
            'pressao', 'temperatura', 'caudal', 'combustaoNormal',
            'turbinaForneceCalorSuficiente', 'alimentacaoBFWCorreta',
            'nivelBarrileteDentroLimites', 'valvulasVaporTotalmenteAbertas',
            'valvulaAbertaIndevidamente', 'restricaoLinhaVapor',
            'fugaLinhaVapor', 'consumoVapor',
            'dessobreaquecedorAtuaCorretamente', 'dessobreaquecedorAbertoEmExcesso',
            'controloPressaoAtuaCorretamente', 'sistemaControloAtuaCorretamente',
            'sensorPressaoCorreto', 'sensorTemperaturaCorreto',
            'medidorCaudalCorreto', 'sensoresCoerentes', 'mudancaOperacionalRecente'
        ];

        const combustaoFields = [
            'chamaDetetada', 'chamaEstavel', 'gasDisponivel',
            'pressaoGasSuficiente', 'pressaoGasEstavel', 'valvulasGasAbertas',
            'sistemaIgnicaoAtivo', 'detetorChamaFuncional',
            'relacaoArCombustivelCorreta', 'fluxoArAdequado',
            'queimadoresFuncionamCorretamente', 'temperaturaCombustao',
            'caudalGas', 'consumoCombustivel',
            'sistemaControloCombustaoCorreto'
        ];

        const sistemaVapor = {};
        vaporFields.forEach(f => { if (answers[f] !== undefined) sistemaVapor[f] = answers[f]; });

        const sistemaCombustao = {};
        combustaoFields.forEach(f => { if (answers[f] !== undefined) sistemaCombustao[f] = answers[f]; });

        const requestBody = { sistemaVapor, sistemaCombustao };
        const typing2 = showTyping();

        try {
            const response = await fetch('/api/diagnostico', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) throw new Error('Erro HTTP: ' + response.status);
            const data = await response.json();
            await delay(1000);
            removeTyping(typing2);
            renderDiagnostic(data);
        } catch (err) {
            await delay(800);
            removeTyping(typing2);
            addBotMessage('❌ <strong>Erro ao comunicar com o motor de regras.</strong><br>' +
                          'Verifique se o servidor de diagnóstico SIBAC está em execução e acessível.<br>' +
                          '<small style="color:var(--text-muted);">' + err.message + '</small>');
        }

        // Oferecer recomeço
        await delay(600);
        const t3 = showTyping(); await delay(400); removeTyping(t3);
        addBotMessage('Deseja realizar um <strong>novo diagnóstico</strong> ou <strong>terminar</strong>?');
        await delay(200);

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'options-container';

        const restartBtn = document.createElement('button');
        restartBtn.className = 'option-btn';
        restartBtn.innerHTML = '🔄 Novo Diagnóstico';
        restartBtn.id = 'btn-restart';
        restartBtn.addEventListener('click', () => {
            actionsContainer.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
            restartBtn.classList.add('selected');
            addUserMessage('Novo Diagnóstico');
            setTimeout(() => startConversation(), 400);
        });

        const endBtn = document.createElement('button');
        endBtn.className = 'option-btn';
        endBtn.innerHTML = 'Terminar';
        endBtn.id = 'btn-end';
        endBtn.addEventListener('click', () => {
            actionsContainer.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
            endBtn.classList.add('selected');
            addUserMessage('Terminar');
            setTimeout(() => { addBotMessage('Obrigado por utilizar o SIBAC! 👋 Sessão terminada.'); }, 400);
        });

        actionsContainer.appendChild(restartBtn);
        actionsContainer.appendChild(endBtn);
        chatMessages.appendChild(actionsContainer);
        scrollToBottom();
    }

    // Boot
    document.addEventListener('DOMContentLoaded', () => { startConversation(); });

})();
