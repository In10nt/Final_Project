package com.virtualtryonsaas.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

public class UserPrincipal implements UserDetails {
    private UUID id;
    private String email;
    private String password;
    private UUID tenantId;
    private String userType;
    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(UUID id, String email, String password, UUID tenantId, 
                        String userType, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.tenantId = tenantId;
        this.userType = userType;
        this.authorities = authorities;
    }

    public static UserPrincipal create(UUID id, String email, String password, UUID tenantId, String userType) {
        Collection<GrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + userType.toUpperCase())
        );
        return new UserPrincipal(id, email, password, tenantId, userType, authorities);
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public UUID getTenantId() {
        return tenantId;
    }

    public String getUserType() {
        return userType;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}