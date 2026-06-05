package pt.isep.sbc.model;

public class SistemaCombustao {
    private String combustaoNormal; // e.g., "Sim", "Nao"
    private String chamaDetetada; // e.g., "Sim", "Nao"
    private String gasDisponivel; // e.g., "Sim", "Nao"
    private String pressaoGasSuficiente; // e.g., "Sim", "Nao"

    public SistemaCombustao() {
    }

    public SistemaCombustao(String combustaoNormal, String chamaDetetada, String gasDisponivel, String pressaoGasSuficiente) {
        this.combustaoNormal = combustaoNormal;
        this.chamaDetetada = chamaDetetada;
        this.gasDisponivel = gasDisponivel;
        this.pressaoGasSuficiente = pressaoGasSuficiente;
    }

    public String getCombustaoNormal() {
        return combustaoNormal;
    }

    public void setCombustaoNormal(String combustaoNormal) {
        this.combustaoNormal = combustaoNormal;
    }

    public String getChamaDetetada() {
        return chamaDetetada;
    }

    public void setChamaDetetada(String chamaDetetada) {
        this.chamaDetetada = chamaDetetada;
    }

    public String getGasDisponivel() {
        return gasDisponivel;
    }

    public void setGasDisponivel(String gasDisponivel) {
        this.gasDisponivel = gasDisponivel;
    }

    public String getPressaoGasSuficiente() {
        return pressaoGasSuficiente;
    }

    public void setPressaoGasSuficiente(String pressaoGasSuficiente) {
        this.pressaoGasSuficiente = pressaoGasSuficiente;
    }

    @Override
    public String toString() {
        return "SistemaCombustao{" +
                "combustaoNormal='" + combustaoNormal + '\'' +
                ", chamaDetetada='" + chamaDetetada + '\'' +
                ", gasDisponivel='" + gasDisponivel + '\'' +
                ", pressaoGasSuficiente='" + pressaoGasSuficiente + '\'' +
                '}';
    }
}
