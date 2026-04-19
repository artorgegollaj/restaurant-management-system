package com.ubt.restaurant.repository;

import com.ubt.restaurant.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {}
