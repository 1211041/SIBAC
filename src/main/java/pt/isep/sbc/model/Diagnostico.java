package pt.isep.sbc.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Representa o frame Diagnostico conforme definido na base de conhecimento.
 * Armazena o resultado do processo de inferência do motor Drools,
 * incluindo tipo de anomalia, problema identificado, conclusão textual
 * e o historial de regras ativadas (módulo de explicações).
 */
public class Diagnostico {

    private String tipoAnomalia;      // "Anomalia na Produção de Vapor" | "Anomalia no Sistema de Combustão"
    private String problema;          // Código do problema identificado (e.g. "ProducaoInsuficientePorCombustao")
    private String conclusao;         // Texto descritivo da causa e recomendação de ação
    private String estadoDiagnostico; // "EmAnalise" | "Concluido"

    // Módulo de explicações
    private List<String> regrasAtivadas = new ArrayList<>();
    private List<String> explicacoes    = new ArrayList<>();

    public Diagnostico() {
        this.estadoDiagnostico = "EmAnalise";
    }

    /**
     * Regista a ativação de uma regra Drools no histórico de explicações.
     *
     * @param regra     Identificador da regra (e.g. "Regra 1")
     * @param explicacao Descrição das condições que despoletaram a regra
     */
    public void addRegraAtivada(String regra, String explicacao) {
        this.regrasAtivadas.add(regra);
        this.explicacoes.add(explicacao);
    }

    // ── Getters & Setters ───────────────────────────────────────────────────

    public String getTipoAnomalia() { return tipoAnomalia; }
    public void setTipoAnomalia(String tipoAnomalia) { this.tipoAnomalia = tipoAnomalia; }

    public String getProblema() { return problema; }
    public void setProblema(String problema) { this.problema = problema; }

    public String getConclusao() { return conclusao; }
    public void setConclusao(String conclusao) { this.conclusao = conclusao; }

    public String getEstadoDiagnostico() { return estadoDiagnostico; }
    public void setEstadoDiagnostico(String estadoDiagnostico) { this.estadoDiagnostico = estadoDiagnostico; }

    public List<String> getRegrasAtivadas() { return regrasAtivadas; }
    public void setRegrasAtivadas(List<String> regrasAtivadas) { this.regrasAtivadas = regrasAtivadas; }

    public List<String> getExplicacoes() { return explicacoes; }
    public void setExplicacoes(List<String> explicacoes) { this.explicacoes = explicacoes; }

    @Override
    public String toString() {
        return "Diagnostico{" +
                "tipoAnomalia='" + tipoAnomalia + '\'' +
                ", problema='" + problema + '\'' +
                ", conclusao='" + conclusao + '\'' +
                ", estadoDiagnostico='" + estadoDiagnostico + '\'' +
                ", regrasAtivadas=" + regrasAtivadas +
                ", explicacoes=" + explicacoes +
                '}';
    }
}
