import game.core.HealthPowerUp;
import game.core.Ship;
import org.junit.Before;
import org.junit.After;
import org.junit.Test;
import static org.junit.Assert.*;

public class HealthPowerUpTest {
    private HealthPowerUp powerUp;
    private Ship ship;

    @Before
    public void setUp() {
        powerUp = new HealthPowerUp(5, 5);
        ship = new Ship();
    }

    @After
    public void tearDown() {
        powerUp = null;
        ship = null;
    }

    @Test
    public void testApplyEffectIncreasesHealth() {
        ship.takeDamage(50); // Reduce to 50
        assertEquals("Initial health should be 50", 50, ship.getHealth());

        powerUp.applyEffect(ship); // Should heal 20
        assertEquals("Health should be 70 after healing", 70, ship.getHealth());
    }

    @Test
    public void testApplyEffectDoesNotExceedMaxHealth() {
        powerUp.applyEffect(ship); // Full health = 100
        assertEquals("Health should remain at 100", 100, ship.getHealth());
    }
}
