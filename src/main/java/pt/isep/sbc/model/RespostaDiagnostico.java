package pt.isep.sbc.model;

import java.util.List;

public class RespostaDiagnostico {
    private String tipoAnomalia;
    private String problema;
    private String conclusao;
    private String estadoDiagnostico;
    private List<String> regrasAtivadas;
    private List<String> explicacoes;

    public RespostaDiagnostico() {
    }

    public RespostaDiagnostico(Diagnostico diagnostico) {
        if (diagnostico != null) {
            this.tipoAnomalia = diagnostico.getTipoAnomalia();
            this.problema = diagnostico.getProblema();
            this.conclusao = diagnostico.getConclusao();
            this.estadoDiagnostico = diagnostico.getEstadoDiagnostico();
            this.regrasAtivadas = diagnostico.getRegrasAtivadas();
            this.explicacoes = diagnostico.getExplicacoes();
        }
    }

    public RespostaDiagnostico(String tipoAnomalia, String problema, String conclusao,
                                String estadoDiagnostico, List<String> regrasAtivadas, List<String> explicacoes) {
        this.tipoAnomalia = tipoAnomalia;
        this.problema = problema;
        this.conclusao = conclusao;
        this.estadoDiagnostico = estadoDiagnostico;
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

    public String getEstadoDiagnostico() { return estadoDiagnostico; }
    public void setEstadoDiagnostico(String estadoDiagnostico) { this.estadoDiagnostico = estadoDiagnostico; }

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
                ", estadoDiagnostico='" + estadoDiagnostico + '\'' +
                ", regrasAtivadas=" + regrasAtivadas +
                ", explicacoes=" + explicacoes +
                '}';
    }
}
