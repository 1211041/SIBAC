package pt.isep.sbc.model;

public class SistemaVapor {
    private String pressao; // e.g., "Baixa", "Normal", "Alta"
    private String temperatura; // e.g., "Baixa", "Normal", "Alta"
    private String caudal; // e.g., "Baixo", "Normal", "Alto"
    private String turbinaForneceCalorSuficiente; // e.g., "Sim", "Nao"

    public SistemaVapor() {
    }

    public SistemaVapor(String pressao, String temperatura, String caudal, String turbinaForneceCalorSuficiente) {
        this.pressao = pressao;
        this.temperatura = temperatura;
        this.caudal = caudal;
        this.turbinaForneceCalorSuficiente = turbinaForneceCalorSuficiente;
    }

    public String getPressao() {
        return pressao;
    }

    public void setPressao(String pressao) {
        this.pressao = pressao;
    }

    public String getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(String temperatura) {
        this.temperatura = temperatura;
    }

    public String getCaudal() {
        return caudal;
    }

    public void setCaudal(String caudal) {
        this.caudal = caudal;
    }

    public String getTurbinaForneceCalorSuficiente() {
        return turbinaForneceCalorSuficiente;
    }

    public void setTurbinaForneceCalorSuficiente(String turbinaForneceCalorSuficiente) {
        this.turbinaForneceCalorSuficiente = turbinaForneceCalorSuficiente;
    }

    @Override
    public String toString() {
        return "SistemaVapor{" +
                "pressao='" + pressao + '\'' +
                ", temperatura='" + temperatura + '\'' +
                ", caudal='" + caudal + '\'' +
                ", turbinaForneceCalorSuficiente='" + turbinaForneceCalorSuficiente + '\'' +
                '}';
    }
}
