import game.core.HealthPowerUp;
import game.core.Ship;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Unit tests for the {@link HealthPowerUp} class.
 *
 * These tests verify that applying a health power-up correctly restores health to the {@link Ship},
 * without exceeding the maximum allowed health.
 */
public class TestHealthPowerUp {

    private Ship ship;
    private HealthPowerUp healthPowerUp;

    /**
     * Set up a fresh Ship and HealthPowerUp instance before each test.
     * The ship starts with 100 health by default.
     */
    @Before
    public void setUp() {
        // Ship starts with default health (100)
        ship = new Ship();
        // HealthPowerUp placed at position (5, 5)
        healthPowerUp = new HealthPowerUp(5, 5);
    }

    /**
     * Test that applying a health power-up increases the ship's health by 20,
     * without exceeding 100.
     */
    @Test
    public void testApplyEffect() {
        // Reduce ship's health by 30 → 100 - 30 = 70
        ship.takeDamage(30);

        // Apply health power-up → 70 + 20 = 90
        healthPowerUp.applyEffect(ship);

        // Verify the health is increased properly
        assertEquals(90, ship.getHealth());
    }

    /**
     * Test that applying a health power-up when the ship is at full health
     * does not exceed the maximum health (should remain 100).
     */
    @Test
    public void testApplyEffectMaxHealth() {
        // Ship is already at full health (100)

        // Apply health power-up → should stay at 100
        healthPowerUp.applyEffect(ship);

        // Verify that health is capped at 100
        assertEquals(100, ship.getHealth());
    }
}
