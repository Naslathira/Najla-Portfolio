import game.core.ShieldPowerUp;
import game.core.Ship;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Unit test for the ShieldPowerUp class.
 *
 * This test verifies that applying a shield power-up correctly
 * increases the ship's score by 50 points.
 */
public class TestShieldPowerUp {

    private ShieldPowerUp shieldPowerUp;
    private Ship ship;

    /**
     * Set up a fresh ShieldPowerUp and Ship instance before each test.
     * The ship starts with 100 health and 0 score.
     */
    @Before
    public void setUp() {
        // Create a ShieldPowerUp at position (0, 0)
        shieldPowerUp = new ShieldPowerUp(0, 0);

        // Create a Ship at position (5, 10) with 100 health
        ship = new Ship(5, 10, 100);
    }

    /**
     * Test that applying the shield power-up increases the ship's score by 50.
     */
    @Test
    public void testApplyEffect_increasesScoreBy50() {
        // Confirm initial score is 0
        assertEquals(0, ship.getScore());

        // Apply the shield power-up effect
        shieldPowerUp.applyEffect(ship);

        // Confirm that score increases by 50
        assertEquals(50, ship.getScore());
    }
}
