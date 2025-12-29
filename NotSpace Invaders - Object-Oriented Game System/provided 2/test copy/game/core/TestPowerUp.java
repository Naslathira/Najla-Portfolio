import game.core.HealthPowerUp;
import game.core.ShieldPowerUp;
import org.junit.Test;
import static org.junit.Assert.assertEquals;

/**
 * Unit tests for the PowerUp classes (HealthPowerUp and ShieldPowerUp).
 *
 * These tests verify the behaviour of the tick() method, specifically:
 * - Power-ups move down one unit only when the tick count is a multiple of 10.
 * - Power-ups do not move on ticks that are not multiples of 10.
 */
public class TestPowerUp {

    /**
     * Test that the power-ups move downward (Y increases by 1)
     * when the tick count is a multiple of 10.
     */
    @Test
    public void testTickMovesDownOnMultipleOf10() {
        // Create power-ups at initial positions
        HealthPowerUp health = new HealthPowerUp(5, 5);
        ShieldPowerUp shield = new ShieldPowerUp(3, 3);

        // Simulate tick events with tick values that are multiples of 10
        health.tick(10);
        shield.tick(20);

        // Verify that Y has incremented by 1
        assertEquals(6, health.getY());  // y from 5 → 6
        assertEquals(4, shield.getY());  // y from 3 → 4
    }

    /**
     * Test that power-ups do not move if the tick count
     * is not a multiple of 10.
     */
    @Test
    public void testTickDoesNotMoveWhenNotMultipleOf10() {
        // Create power-ups at specific positions
        HealthPowerUp health = new HealthPowerUp(2, 2);
        ShieldPowerUp shield = new ShieldPowerUp(1, 1);

        // Simulate tick events with values not divisible by 10
        health.tick(7);      // not a multiple of 10
        shield.tick(15);     // multiple of 5, but not 10

        // Verify Y stays the same
        assertEquals(2, health.getY());
        assertEquals(1, shield.getY());
    }
}
