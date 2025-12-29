import game.core.ShieldPowerUp;
import game.core.Ship;
import org.junit.Before;
import org.junit.After;
import org.junit.Test;
import static org.junit.Assert.*;

public class ShieldPowerUpTest {
    private ShieldPowerUp powerUp;
    private Ship ship;

    @Before
    public void setUp() {
        powerUp = new ShieldPowerUp(3, 3);
        ship = new Ship();
    }

    @After
    public void tearDown() {
        powerUp = null;
        ship = null;
    }

    @Test
    public void testApplyEffectIncreasesScore() {
        int initialScore = ship.getScore();

        powerUp.applyEffect(ship);

        assertEquals("Score should increase by 50", initialScore + 50, ship.getScore());
    }
}
