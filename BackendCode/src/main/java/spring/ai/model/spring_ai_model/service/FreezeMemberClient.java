package spring.ai.model.spring_ai_model.service;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import spring.ai.model.spring_ai_model.model.FreezeResponse;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class FreezeMemberClient {
    private final WebClient webClient;

    public FreezeMemberClient(WebClient.Builder builder) {
        this.webClient = builder.build();
    }

    public Mono<FreezeResponse> submitFreeze(Map<String, Object> payload) {
        return webClient.put()
                        .uri("https://rcm-billing-adapter.dev.abcfitness.net/subscription-freeze")
                        .bodyValue(payload)
                        .retrieve()
                        .bodyToMono(FreezeResponse.class);
    }

    public Mono<FreezeResponse> getPaymentSchedule(String clubNumber, String memberNumber) {
        String url = String.format(
           // "http://localhost:8010/payment-schedule-rqar?clubNumber=%s&memberNumber=%s&startDate=",
            "https://rcm-billing-adapter.dev.abcfitness.net/payment-schedule-rqar?clubNumber=%s&memberNumber=%s&startDate=",
            URLEncoder.encode(clubNumber, StandardCharsets.UTF_8),
            URLEncoder.encode(memberNumber, StandardCharsets.UTF_8)
        );

        return webClient.get()
                        .uri(url)
                        .retrieve()
                        .bodyToMono(FreezeResponse.class);
    }

}