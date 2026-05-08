package com.hackathon.hcl.repository;

import com.hackathon.hcl.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {

    List<Restaurant> findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCase(String name, String cuisine);

    @Query("""
            select distinct r
            from Restaurant r
            left join r.menuItems m
            where lower(r.name) like lower(concat('%', :query, '%'))
               or lower(r.cuisine) like lower(concat('%', :query, '%'))
               or lower(m.name) like lower(concat('%', :query, '%'))
            """)
    List<Restaurant> searchByRestaurantCuisineOrMenuItem(@Param("query") String query);
}
