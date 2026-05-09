package com.hackathon.hcl.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseCompatibilityService implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        try {
            repairOrderTableRename();
            repairOrderItemsForeignKey();
        } catch (Exception ex) {
            log.warn("Database compatibility repair skipped: {}", ex.getMessage());
        }
    }

    private void repairOrderTableRename() {
        boolean hasOrders = tableExists("orders");
        boolean hasCustomerOrders = tableExists("customer_orders");

        if (!hasOrders && hasCustomerOrders) {
            jdbcTemplate.execute("RENAME TABLE customer_orders TO orders");
            log.info("Renamed legacy customer_orders table back to orders");
        }
    }

    private void repairOrderItemsForeignKey() {
        if (!tableExists("orders") || !tableExists("order_items")) {
            return;
        }

        List<String> wrongForeignKeys = jdbcTemplate.queryForList("""
                SELECT CONSTRAINT_NAME
                FROM information_schema.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'order_items'
                  AND COLUMN_NAME = 'order_id'
                  AND REFERENCED_TABLE_NAME IS NOT NULL
                  AND REFERENCED_TABLE_NAME <> 'orders'
                """, String.class);

        for (String foreignKey : wrongForeignKeys) {
            if (foreignKey.matches("[A-Za-z0-9_$]+")) {
                jdbcTemplate.execute("ALTER TABLE order_items DROP FOREIGN KEY `" + foreignKey + "`");
                log.info("Dropped stale order_items.order_id foreign key {}", foreignKey);
            }
        }

        Integer validForeignKeys = jdbcTemplate.queryForObject("""
                SELECT COUNT(*)
                FROM information_schema.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'order_items'
                  AND COLUMN_NAME = 'order_id'
                  AND REFERENCED_TABLE_NAME = 'orders'
                """, Integer.class);

        if (validForeignKeys == null || validForeignKeys == 0) {
            try {
                jdbcTemplate.execute("""
                        ALTER TABLE order_items
                        ADD CONSTRAINT fk_order_items_order
                        FOREIGN KEY (order_id) REFERENCES orders(id)
                        """);
                log.info("Added order_items.order_id foreign key to orders(id)");
            } catch (Exception ex) {
                log.warn("Could not add order_items.order_id foreign key to orders(id): {}", ex.getMessage());
            }
        }
    }

    private boolean tableExists(String tableName) {
        Integer count = jdbcTemplate.queryForObject("""
                SELECT COUNT(*)
                FROM information_schema.TABLES
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = ?
                """, Integer.class, tableName);
        return count != null && count > 0;
    }
}
