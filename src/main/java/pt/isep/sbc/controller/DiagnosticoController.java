package pt.isep.sbc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.isep.sbc.model.Diagnostico;
import pt.isep.sbc.model.RespostaDiagnostico;
import pt.isep.sbc.model.SistemaCombustao;
import pt.isep.sbc.model.SistemaVapor;
import pt.isep.sbc.service.DroolsService;

@RestController
@RequestMapping("/api")
public class DiagnosticoController {

    private final DroolsService droolsService;

    @Autowired
    public DiagnosticoController(DroolsService droolsService) {
        this.droolsService = droolsService;
    }

    /**
     * Executes industrial energy system diagnostic rules.
     * 
     * POST /api/diagnostico
     * Body: RequisicaoDiagnostico containing sistemaVapor and sistemaCombustao
     * Returns: RespostaDiagnostico
     */
    @PostMapping("/diagnostico")
    public ResponseEntity<RespostaDiagnostico> realizarDiagnostico(@RequestBody RequisicaoDiagnostico requisicao) {
        Diagnostico diagnosticoResult = droolsService.executarDiagnostico(
                requisicao.getSistemaVapor(),
                requisicao.getSistemaCombustao()
        );
        
        RespostaDiagnostico resposta = new RespostaDiagnostico(diagnosticoResult);
        return ResponseEntity.ok(resposta);
    }

    /**
     * Inner helper class mapping the JSON request payload.
     */
    public static class RequisicaoDiagnostico {
        private SistemaVapor sistemaVapor;
        private SistemaCombustao sistemaCombustao;

        public RequisicaoDiagnostico() {
        }

        public RequisicaoDiagnostico(SistemaVapor sistemaVapor, SistemaCombustao sistemaCombustao) {
            this.sistemaVapor = sistemaVapor;
            this.sistemaCombustao = sistemaCombustao;
        }

        public SistemaVapor getSistemaVapor() {
            return sistemaVapor;
        }

        public void setSistemaVapor(SistemaVapor sistemaVapor) {
            this.sistemaVapor = sistemaVapor;
        }

        public SistemaCombustao getSistemaCombustao() {
            return sistemaCombustao;
        }

        public void setSistemaCombustao(SistemaCombustao sistemaCombustao) {
            this.sistemaCombustao = sistemaCombustao;
        }
    }
}
