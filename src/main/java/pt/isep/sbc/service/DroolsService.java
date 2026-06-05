package pt.isep.sbc.service;

import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.isep.sbc.model.Diagnostico;
import pt.isep.sbc.model.SistemaCombustao;
import pt.isep.sbc.model.SistemaVapor;

@Service
public class DroolsService {

    private final KieContainer kieContainer;

    @Autowired
    public DroolsService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    /**
     * Executes the diagnostic expert system rules.
     * Inserts the steam and combustion systems facts alongside a new Diagnostico instance,
     * fires all matches, and disposes the KieSession.
     *
     * @param sistemaVapor Steam production system state
     * @param sistemaCombustao Combustion system state
     * @return Diagnostico containing the final inference result
     */
    public Diagnostico executarDiagnostico(SistemaVapor sistemaVapor, SistemaCombustao sistemaCombustao) {
        // Create the stateful session defined in kmodule.xml
        KieSession kieSession = kieContainer.newKieSession("rulesKSession");
        
        Diagnostico diagnostico = new Diagnostico();

        try {
            // Insert facts into the working memory
            if (sistemaVapor != null) {
                kieSession.insert(sistemaVapor);
            }
            if (sistemaCombustao != null) {
                kieSession.insert(sistemaCombustao);
            }
            kieSession.insert(diagnostico);

            // Fire all rules
            kieSession.fireAllRules();
        } finally {
            // Clean up session resources to prevent memory leaks
            kieSession.dispose();
        }

        return diagnostico;
    }
}
