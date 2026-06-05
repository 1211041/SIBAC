package pt.isep.sbc.model;

import java.util.ArrayList;
import java.util.List;

public class Diagnostico {
    private String tipoAnomalia;
    private String problema;
    private String conclusao;
    private List<String> regrasAtivadas = new ArrayList<>();
    private List<String> explicacoes = new ArrayList<>();

    public Diagnostico() {
    }

    public void addRegraAtivada(String regra, String explicacao) {
        this.regrasAtivadas.add(regra);
        this.explicacoes.add(explicacao);
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
        return "Diagnostico{" +
                "tipoAnomalia='" + tipoAnomalia + '\'' +
                ", problema='" + problema + '\'' +
                ", conclusao='" + conclusao + '\'' +
                ", regrasAtivadas=" + regrasAtivadas +
                ", explicacoes=" + explicacoes +
                '}';
    }
}
