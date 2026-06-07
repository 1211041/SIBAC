package pt.isep.sbc.config;

import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.KieModule;
import org.kie.api.runtime.KieContainer;
import org.kie.internal.io.ResourceFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DroolsConfig {

    @Bean
    public KieContainer kieContainer() {
        KieServices kieServices = KieServices.Factory.get();
        KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
        
        // Load the DRL files and the kmodule descriptor explicitly with UTF-8 encoding.
        // This ensures the Drools engine reads Portuguese characters correctly on Windows platforms.
        kieFileSystem.write("src/main/resources/rules/diagnostico-vapor.drl", 
                ResourceFactory.newClassPathResource("rules/diagnostico-vapor.drl", "UTF-8"));
        
        kieFileSystem.write("src/main/resources/rules/diagnostico-combustao.drl", 
                ResourceFactory.newClassPathResource("rules/diagnostico-combustao.drl", "UTF-8"));
        
        kieFileSystem.write("src/main/resources/META-INF/kmodule.xml", 
                ResourceFactory.newClassPathResource("META-INF/kmodule.xml", "UTF-8"));
        
        KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
        kieBuilder.buildAll();
        
        // Check for compilation errors in the rule files during build
        if (kieBuilder.getResults().hasMessages(org.kie.api.builder.Message.Level.ERROR)) {
            throw new IllegalStateException("Drools compilation failed: \n" + kieBuilder.getResults().toString());
        }
        
        KieModule kieModule = kieBuilder.getKieModule();
        return kieServices.newKieContainer(kieModule.getReleaseId());
    }
}

