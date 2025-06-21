package com.example.demo.security;

import java.security.Key;
import java.util.Date;
import io.jsonwebtoken.*;

import org.springframework.stereotype.Component;

import com.example.demo.models.Usuario;

import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // Clave secreta para firmar el token
    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Tiempo de validez del token: 24 horas
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    public String generarToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getNombreUsuario())
                .claim("id", usuario.getId())
                .claim("rol", usuario.getRol())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey)
                .compact();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extraerNombreUsuario(String token) {
        return Jwts.parserBuilder().setSigningKey(secretKey).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String extraerRol(String token) {
        return (String) Jwts.parserBuilder().setSigningKey(secretKey).build()
                .parseClaimsJws(token)
                .getBody()
                .get("rol");
    }
}