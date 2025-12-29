import game.core.HealthPowerUp;
import game.core.PowerUp;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class PowerUpTest {
    private PowerUp powerUp;

    @Before
    public void setUp() {
        // Initial position (x, y) = (5, 0)
        powerUp = new HealthPowerUp(5, 0);

    }

    @After
    public void tearDown() {
        powerUp = null;
    }

    @Test
    public void testTickValidMove() {
        int initialY = powerUp.getY();
        powerUp.tick(10);  // 10 is divisible by 10
        assertEquals(initialY + 1, powerUp.getY());
    }

    @Test
    public void testTickNoMove() {
        int initialY = powerUp.getY();
        powerUp.tick(7);  // 7 is not divisible by 10
        assertEquals(initialY, powerUp.getY());
    }
}