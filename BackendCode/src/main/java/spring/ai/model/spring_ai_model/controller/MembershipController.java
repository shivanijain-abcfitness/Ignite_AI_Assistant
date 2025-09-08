//package spring.ai.model.spring_ai_model.controller;
//
//import org.springframework.ai.chat.client.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/membership")
//public class MembershipController {
//
//    @PostMapping("/freeze")
//    public ResponseEntity<String> freezeMembership(@RequestBody FreezeRequest request) {
//        // Implement your freeze logic here
//        // For example, update DB to set membership as frozen
//        return ResponseEntity.ok("Membership frozen for user: " + request.getUserId());
//    }
//
//    public static class FreezeRequest {
//        private String userId;
//        // getters and setters
//    }
//}