package pt.isep.sbc.model;

/**
 * Representa o frame SistemaCombustao conforme definido na base de conhecimento.
 * Contém todos os parâmetros necessários para o diagnóstico de anomalias
 * no sistema de combustão do turbogerador (queimadores, gás, ignição, ar).
 */
public class SistemaCombustao {

    // Estado da chama
    private String chamaDetetada;                    // "Sim" | "Nao"
    private String chamaEstavel;                     // "Sim" | "Nao"

    // Fornecimento de gás
    private String gasDisponivel;                    // "Sim" | "Nao"
    private String pressaoGasSuficiente;             // "Sim" | "Nao"
    private String pressaoGasEstavel;                // "Sim" | "Nao"
    private String valvulasGasAbertas;               // "Sim" | "Nao"

    // Ignição e deteção
    private String sistemaIgnicaoAtivo;              // "Sim" | "Nao"
    private String detetorChamaFuncional;            // "Sim" | "Nao"

    // Qualidade da combustão
    private String relacaoArCombustivelCorreta;      // "Sim" | "Nao"
    private String fluxoArAdequado;                  // "Sim" | "Nao"
    private String queimadoresFuncionamCorretamente; // "Sim" | "Nao"
    private String temperaturaCombustao;             // "Baixa" | "Normal" | "Alta"
    private String caudalGas;                        // "Baixo" | "Normal" | "Alto"
    private String consumoCombustivel;               // "Baixo" | "Normal" | "Alto"

    // Flag de síntese — estado geral da combustão
    private String combustaoNormal;                  // "Sim" | "Nao"

    // Controlo
    private String sistemaControloCombustaoCorreto;  // "Sim" | "Nao"

    public SistemaCombustao() {
    }

    // ── Getters & Setters ───────────────────────────────────────────────────

    public String getChamaDetetada() { return chamaDetetada; }
    public void setChamaDetetada(String chamaDetetada) { this.chamaDetetada = chamaDetetada; }

    public String getChamaEstavel() { return chamaEstavel; }
    public void setChamaEstavel(String chamaEstavel) { this.chamaEstavel = chamaEstavel; }

    public String getGasDisponivel() { return gasDisponivel; }
    public void setGasDisponivel(String gasDisponivel) { this.gasDisponivel = gasDisponivel; }

    public String getPressaoGasSuficiente() { return pressaoGasSuficiente; }
    public void setPressaoGasSuficiente(String pressaoGasSuficiente) { this.pressaoGasSuficiente = pressaoGasSuficiente; }

    public String getPressaoGasEstavel() { return pressaoGasEstavel; }
    public void setPressaoGasEstavel(String pressaoGasEstavel) { this.pressaoGasEstavel = pressaoGasEstavel; }

    public String getValvulasGasAbertas() { return valvulasGasAbertas; }
    public void setValvulasGasAbertas(String valvulasGasAbertas) { this.valvulasGasAbertas = valvulasGasAbertas; }

    public String getSistemaIgnicaoAtivo() { return sistemaIgnicaoAtivo; }
    public void setSistemaIgnicaoAtivo(String sistemaIgnicaoAtivo) { this.sistemaIgnicaoAtivo = sistemaIgnicaoAtivo; }

    public String getDetetorChamaFuncional() { return detetorChamaFuncional; }
    public void setDetetorChamaFuncional(String detetorChamaFuncional) { this.detetorChamaFuncional = detetorChamaFuncional; }

    public String getRelacaoArCombustivelCorreta() { return relacaoArCombustivelCorreta; }
    public void setRelacaoArCombustivelCorreta(String relacaoArCombustivelCorreta) {
        this.relacaoArCombustivelCorreta = relacaoArCombustivelCorreta;
    }

    public String getFluxoArAdequado() { return fluxoArAdequado; }
    public void setFluxoArAdequado(String fluxoArAdequado) { this.fluxoArAdequado = fluxoArAdequado; }

    public String getQueimadoresFuncionamCorretamente() { return queimadoresFuncionamCorretamente; }
    public void setQueimadoresFuncionamCorretamente(String queimadoresFuncionamCorretamente) {
        this.queimadoresFuncionamCorretamente = queimadoresFuncionamCorretamente;
    }

    public String getTemperaturaCombustao() { return temperaturaCombustao; }
    public void setTemperaturaCombustao(String temperaturaCombustao) { this.temperaturaCombustao = temperaturaCombustao; }

    public String getCaudalGas() { return caudalGas; }
    public void setCaudalGas(String caudalGas) { this.caudalGas = caudalGas; }

    public String getConsumoCombustivel() { return consumoCombustivel; }
    public void setConsumoCombustivel(String consumoCombustivel) { this.consumoCombustivel = consumoCombustivel; }

    public String getCombustaoNormal() { return combustaoNormal; }
    public void setCombustaoNormal(String combustaoNormal) { this.combustaoNormal = combustaoNormal; }

    public String getSistemaControloCombustaoCorreto() { return sistemaControloCombustaoCorreto; }
    public void setSistemaControloCombustaoCorreto(String sistemaControloCombustaoCorreto) {
        this.sistemaControloCombustaoCorreto = sistemaControloCombustaoCorreto;
    }

    @Override
    public String toString() {
        return "SistemaCombustao{" +
                "chamaDetetada='" + chamaDetetada + '\'' +
                ", chamaEstavel='" + chamaEstavel + '\'' +
                ", gasDisponivel='" + gasDisponivel + '\'' +
                ", pressaoGasSuficiente='" + pressaoGasSuficiente + '\'' +
                ", pressaoGasEstavel='" + pressaoGasEstavel + '\'' +
                ", valvulasGasAbertas='" + valvulasGasAbertas + '\'' +
                ", sistemaIgnicaoAtivo='" + sistemaIgnicaoAtivo + '\'' +
                ", detetorChamaFuncional='" + detetorChamaFuncional + '\'' +
                ", relacaoArCombustivelCorreta='" + relacaoArCombustivelCorreta + '\'' +
                ", fluxoArAdequado='" + fluxoArAdequado + '\'' +
                ", queimadoresFuncionamCorretamente='" + queimadoresFuncionamCorretamente + '\'' +
                ", temperaturaCombustao='" + temperaturaCombustao + '\'' +
                ", caudalGas='" + caudalGas + '\'' +
                ", consumoCombustivel='" + consumoCombustivel + '\'' +
                ", combustaoNormal='" + combustaoNormal + '\'' +
                ", sistemaControloCombustaoCorreto='" + sistemaControloCombustaoCorreto + '\'' +
                '}';
    }
}
