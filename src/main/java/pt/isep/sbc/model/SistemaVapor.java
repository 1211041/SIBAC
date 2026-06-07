package pt.isep.sbc.model;

/**
 * Representa o frame SistemaVapor conforme definido na base de conhecimento.
 * Contém todos os parâmetros necessários para o diagnóstico de anomalias
 * na produção de vapor da caldeira de recuperação.
 */
public class SistemaVapor {

    // Parâmetros de processo primários
    private String pressao;                          // "Baixa" | "Normal" | "Alta"
    private String temperatura;                      // "Baixa" | "Normal" | "Alta"
    private String caudal;                           // "Baixo" | "Normal" | "Alto"

    // Subsistemas de apoio à produção
    private String combustaoNormal;                  // "Sim" | "Nao"
    private String turbinaForneceCalorSuficiente;    // "Sim" | "Nao"
    private String alimentacaoBFWCorreta;            // "Sim" | "Nao"
    private String nivelBarrileteDentroLimites;      // "Sim" | "Nao"

    // Válvulas e linha de vapor
    private String valvulasVaporTotalmenteAbertas;   // "Sim" | "Nao"
    private String valvulaAbertaIndevidamente;       // "Sim" | "Nao"
    private String restricaoLinhaVapor;              // "Sim" | "Nao"
    private String fugaLinhaVapor;                   // "Sim" | "Nao"

    // Consumo de vapor
    private String consumoVapor;                     // "Baixo" | "Normal" | "Alto" | "Aumentou" | "Diminuiu"

    // Sistema de arrefecimento
    private String dessobreaquecedorAtuaCorretamente;  // "Sim" | "Nao"
    private String dessobreaquecedorAbertoEmExcesso;   // "Sim" | "Nao"

    // Sistemas de controlo
    private String controloPressaoAtuaCorretamente;    // "Sim" | "Nao"
    private String sistemaControloAtuaCorretamente;    // "Sim" | "Nao"

    // Instrumentação
    private String sensorPressaoCorreto;             // "Sim" | "Nao"
    private String sensorTemperaturaCorreto;         // "Sim" | "Nao"
    private String medidorCaudalCorreto;             // "Sim" | "Nao"
    private String sensoresCoerentes;                // "Sim" | "Nao"
    private String mudancaOperacionalRecente;        // "Sim" | "Nao"

    public SistemaVapor() {
    }

    // ── Getters & Setters ───────────────────────────────────────────────────

    public String getPressao() { return pressao; }
    public void setPressao(String pressao) { this.pressao = pressao; }

    public String getTemperatura() { return temperatura; }
    public void setTemperatura(String temperatura) { this.temperatura = temperatura; }

    public String getCaudal() { return caudal; }
    public void setCaudal(String caudal) { this.caudal = caudal; }

    public String getCombustaoNormal() { return combustaoNormal; }
    public void setCombustaoNormal(String combustaoNormal) { this.combustaoNormal = combustaoNormal; }

    public String getTurbinaForneceCalorSuficiente() { return turbinaForneceCalorSuficiente; }
    public void setTurbinaForneceCalorSuficiente(String turbinaForneceCalorSuficiente) {
        this.turbinaForneceCalorSuficiente = turbinaForneceCalorSuficiente;
    }

    public String getAlimentacaoBFWCorreta() { return alimentacaoBFWCorreta; }
    public void setAlimentacaoBFWCorreta(String alimentacaoBFWCorreta) { this.alimentacaoBFWCorreta = alimentacaoBFWCorreta; }

    public String getNivelBarrileteDentroLimites() { return nivelBarrileteDentroLimites; }
    public void setNivelBarrileteDentroLimites(String nivelBarrileteDentroLimites) {
        this.nivelBarrileteDentroLimites = nivelBarrileteDentroLimites;
    }

    public String getValvulasVaporTotalmenteAbertas() { return valvulasVaporTotalmenteAbertas; }
    public void setValvulasVaporTotalmenteAbertas(String valvulasVaporTotalmenteAbertas) {
        this.valvulasVaporTotalmenteAbertas = valvulasVaporTotalmenteAbertas;
    }

    public String getValvulaAbertaIndevidamente() { return valvulaAbertaIndevidamente; }
    public void setValvulaAbertaIndevidamente(String valvulaAbertaIndevidamente) {
        this.valvulaAbertaIndevidamente = valvulaAbertaIndevidamente;
    }

    public String getRestricaoLinhaVapor() { return restricaoLinhaVapor; }
    public void setRestricaoLinhaVapor(String restricaoLinhaVapor) { this.restricaoLinhaVapor = restricaoLinhaVapor; }

    public String getFugaLinhaVapor() { return fugaLinhaVapor; }
    public void setFugaLinhaVapor(String fugaLinhaVapor) { this.fugaLinhaVapor = fugaLinhaVapor; }

    public String getConsumoVapor() { return consumoVapor; }
    public void setConsumoVapor(String consumoVapor) { this.consumoVapor = consumoVapor; }

    public String getDessobreaquecedorAtuaCorretamente() { return dessobreaquecedorAtuaCorretamente; }
    public void setDessobreaquecedorAtuaCorretamente(String dessobreaquecedorAtuaCorretamente) {
        this.dessobreaquecedorAtuaCorretamente = dessobreaquecedorAtuaCorretamente;
    }

    public String getDessobreaquecedorAbertoEmExcesso() { return dessobreaquecedorAbertoEmExcesso; }
    public void setDessobreaquecedorAbertoEmExcesso(String dessobreaquecedorAbertoEmExcesso) {
        this.dessobreaquecedorAbertoEmExcesso = dessobreaquecedorAbertoEmExcesso;
    }

    public String getControloPressaoAtuaCorretamente() { return controloPressaoAtuaCorretamente; }
    public void setControloPressaoAtuaCorretamente(String controloPressaoAtuaCorretamente) {
        this.controloPressaoAtuaCorretamente = controloPressaoAtuaCorretamente;
    }

    public String getSistemaControloAtuaCorretamente() { return sistemaControloAtuaCorretamente; }
    public void setSistemaControloAtuaCorretamente(String sistemaControloAtuaCorretamente) {
        this.sistemaControloAtuaCorretamente = sistemaControloAtuaCorretamente;
    }

    public String getSensorPressaoCorreto() { return sensorPressaoCorreto; }
    public void setSensorPressaoCorreto(String sensorPressaoCorreto) { this.sensorPressaoCorreto = sensorPressaoCorreto; }

    public String getSensorTemperaturaCorreto() { return sensorTemperaturaCorreto; }
    public void setSensorTemperaturaCorreto(String sensorTemperaturaCorreto) {
        this.sensorTemperaturaCorreto = sensorTemperaturaCorreto;
    }

    public String getMedidorCaudalCorreto() { return medidorCaudalCorreto; }
    public void setMedidorCaudalCorreto(String medidorCaudalCorreto) { this.medidorCaudalCorreto = medidorCaudalCorreto; }

    public String getSensoresCoerentes() { return sensoresCoerentes; }
    public void setSensoresCoerentes(String sensoresCoerentes) { this.sensoresCoerentes = sensoresCoerentes; }

    public String getMudancaOperacionalRecente() { return mudancaOperacionalRecente; }
    public void setMudancaOperacionalRecente(String mudancaOperacionalRecente) {
        this.mudancaOperacionalRecente = mudancaOperacionalRecente;
    }

    @Override
    public String toString() {
        return "SistemaVapor{" +
                "pressao='" + pressao + '\'' +
                ", temperatura='" + temperatura + '\'' +
                ", caudal='" + caudal + '\'' +
                ", combustaoNormal='" + combustaoNormal + '\'' +
                ", turbinaForneceCalorSuficiente='" + turbinaForneceCalorSuficiente + '\'' +
                ", alimentacaoBFWCorreta='" + alimentacaoBFWCorreta + '\'' +
                ", nivelBarrileteDentroLimites='" + nivelBarrileteDentroLimites + '\'' +
                ", valvulasVaporTotalmenteAbertas='" + valvulasVaporTotalmenteAbertas + '\'' +
                ", valvulaAbertaIndevidamente='" + valvulaAbertaIndevidamente + '\'' +
                ", restricaoLinhaVapor='" + restricaoLinhaVapor + '\'' +
                ", fugaLinhaVapor='" + fugaLinhaVapor + '\'' +
                ", consumoVapor='" + consumoVapor + '\'' +
                ", dessobreaquecedorAtuaCorretamente='" + dessobreaquecedorAtuaCorretamente + '\'' +
                ", dessobreaquecedorAbertoEmExcesso='" + dessobreaquecedorAbertoEmExcesso + '\'' +
                ", controloPressaoAtuaCorretamente='" + controloPressaoAtuaCorretamente + '\'' +
                ", sistemaControloAtuaCorretamente='" + sistemaControloAtuaCorretamente + '\'' +
                ", sensorPressaoCorreto='" + sensorPressaoCorreto + '\'' +
                ", sensorTemperaturaCorreto='" + sensorTemperaturaCorreto + '\'' +
                ", medidorCaudalCorreto='" + medidorCaudalCorreto + '\'' +
                ", sensoresCoerentes='" + sensoresCoerentes + '\'' +
                ", mudancaOperacionalRecente='" + mudancaOperacionalRecente + '\'' +
                '}';
    }
}
