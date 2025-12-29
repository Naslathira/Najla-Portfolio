import game.core.Asteroid;
import game.core.Bullet;
import game.core.Ship;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ObjectWithPositionTest {

    /**
     * Test that an Asteroid correctly returns its string representation.
     */


    @Test
    public void testAsteroidToString() {
        // Create an Asteroid at position (3, 7)
        Asteroid asteroid = new Asteroid(3, 7);

        // Expected string format
        String expected = "Asteroid(3, 7)";

        // Assert that toString() returns the expected format
        assertEquals(expected, asteroid.toString());
    }

    /**
     * Test that a Bullet correctly returns its string representation.
     */
    @Test
    public void testBulletToString() {
        // Create a Bullet at position (5, 10)
        Bullet bullet = new Bullet(5, 10);

        // Expected string format
        String expected = "Bullet(5, 10)";

        // Assert correct string output
        assertEquals(expected, bullet.toString());
    }

    /**
     * Test that a Ship correctly returns its string representation.
     */
    @Test
    public void testShipToString() {
        // Create a Ship at position (2, 4) with health 100
        Ship ship = new Ship(2, 4, 100);

        // Expected string format
        String expected = "Ship(2, 4)";

        // Verify string output
        assertEquals(expected, ship.toString());
    }
}
