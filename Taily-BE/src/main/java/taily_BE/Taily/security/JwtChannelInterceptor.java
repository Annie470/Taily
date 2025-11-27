package taily_BE.Taily.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import taily_BE.Taily.entities.Logable;
import taily_BE.Taily.services.LogableService;

import java.util.UUID;
@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private JwtTools jwtTools;

    @Autowired
    private LogableService logableService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                try {
                    jwtTools.verifyToken(token);
                    UUID userId = jwtTools.extractIdFromToken(token);
                    Logable user = logableService.findById(userId);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

                    accessor.setUser(authentication);
                    accessor.getSessionAttributes().put("user", authentication);

                } catch (Exception e) {
                    throw new RuntimeException("Invalid JWT token: " + e.getMessage());
                }
            }
        }

        return message;
    }
}
