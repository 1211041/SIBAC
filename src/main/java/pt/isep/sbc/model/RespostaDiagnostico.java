package pt.isep.sbc.model;

import java.util.List;

public class RespostaDiagnostico {
    private String tipoAnomalia;
    private String problema;
    private String conclusao;
    private List<String> regrasAtivadas;
    private List<String> explicacoes;

    public RespostaDiagnostico() {
    }

    public RespostaDiagnostico(Diagnostico diagnostico) {
        if (diagnostico != null) {
            this.tipoAnomalia = diagnostico.getTipoAnomalia();
            this.problema = diagnostico.getProblema();
            this.conclusao = diagnostico.getConclusao();
            this.regrasAtivadas = diagnostico.getRegrasAtivadas();
            this.explicacoes = diagnostico.getExplicacoes();
        }
    }

    public RespostaDiagnostico(String tipoAnomalia, String problema, String conclusao, List<String> regrasAtivadas, List<String> explicacoes) {
        this.tipoAnomalia = tipoAnomalia;
        this.problema = problema;
        this.conclusao = conclusao;
        this.regrasAtivadas = regrasAtivadas;
        this.explicacoes = explicacoes;
    }

    public String getTipoAnomalia() {
        return tipoAnomalia;
    }

    public void setTipoAnomalia(String tipoAnomalia) {
        this.tipoAnomalia = tipoAnomalia;
    }

    public String getProblema() {
        return problema;
    }

    public void setProblema(String problema) {
        this.problema = problema;
    }

    public String getConclusao() {
        return conclusao;
    }

    public void setConclusao(String conclusao) {
        this.conclusao = conclusao;
    }

    public List<String> getRegrasAtivadas() {
        return regrasAtivadas;
    }

    public void setRegrasAtivadas(List<String> regrasAtivadas) {
        this.regrasAtivadas = regrasAtivadas;
    }

    public List<String> getExplicacoes() {
        return explicacoes;
    }

    public void setExplicacoes(List<String> explicacoes) {
        this.explicacoes = explicacoes;
    }

    @Override
    public String toString() {
        return "RespostaDiagnostico{" +
                "tipoAnomalia='" + tipoAnomalia + '\'' +
                ", problema='" + problema + '\'' +
                ", conclusao='" + conclusao + '\'' +
                ", regrasAtivadas=" + regrasAtivadas +
                ", explicacoes=" + explicacoes +
                '}';
    }
}
